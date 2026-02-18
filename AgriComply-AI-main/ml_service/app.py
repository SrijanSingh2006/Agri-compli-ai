from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.file_reader import load_image_for_gemini
from core.classifier import classify_document
from core.extractor import extract_data
from core.gemini_client import gemini
from utils.sanitizer import mask_pii
from prompts.scheme_prompts import get_scheme_discovery_prompt
import json
import os

app = Flask(__name__)
CORS(app) 

# --- 1. SMART TAG NORMALIZER ---
TAG_NORMALIZER = {
    # Identity
    "PASSPORTPHOTO": "PassportPhoto", "passport_photo": "PassportPhoto", "photo": "PassportPhoto",
    "12-1769192529470.jpg": "PassportPhoto",
    "AADHAAR": "Aadhaar", "aadhar": "Aadhaar", "uid": "Aadhaar",
    "PAN": "PAN", "pan_card": "PAN",

    # Income
    "BANKSTATEMENT": "BankStatement", "bank_statement": "BankStatement", "statement": "BankStatement",
    "ITR": "ITR", "itr_v": "ITR", "income_tax": "ITR",
    
    # Land / Farm
    "7_12": "LandRecord", "7/12": "LandRecord", "satbara": "LandRecord", 
    "LANDRECORD": "LandRecord", "land_record": "LandRecord", "ror": "LandRecord", "AGRI_COMPLIANCE_DATASET": "LandRecord",
    "KCC": "KCC", "kisan_credit_card": "KCC", "CropSowingCertificate": "CropSowingCertificate",
    
    # Business
    "AGRICULTURE_PROJECT_REPORT_SAMPLE": "ProjectReport", "PROJECT_REPORT": "ProjectReport", "project_report": "ProjectReport", "report": "ProjectReport",
    "FARM_MACHINERY_QUOTATION_SAMPLE": "Quotation", "QUOTATION": "Quotation", "quotation": "Quotation", "bill": "Quotation", "invoice": "Quotation",
    "UDYAM": "UdyamRegistration", "udyam": "UdyamRegistration",
}

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ML Service is Online", "model": "Gemini 2.5 Flash"})

# --- 2. DOCUMENT ANALYSIS (Upload & Classify) ---
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    file_path = data.get('filePath')

    if not file_path or not os.path.exists(file_path):
        return jsonify({"error": "Invalid file path"}), 400

    image_data = load_image_for_gemini(file_path)
    if not image_data:
        return jsonify({"error": "Could not process image file"}), 500

    classification_result = classify_document(image_data)
    doc_type = classification_result.get("type", "Unknown")

    extraction_result = {}
    if doc_type != "Unknown":
        extraction_result = extract_data(image_data, doc_type)
        extraction_result = mask_pii(extraction_result)

    return jsonify({
        "classification": classification_result,
        "extraction": extraction_result
    })

# --- Helper to Extract Text from Gemini Response ---
def get_gemini_text(response):
    """Handles both Object and String responses from Gemini adapter"""
    if isinstance(response, str):
        return response
    if hasattr(response, 'text'):
        return response.text
    return str(response)

# --- 3. SCHEME DISCOVERY (Guaranteed 5+ Items) ---
@app.route('/recommend', methods=['POST'])
def recommend_schemes():
    data = request.json
    user_profile = data.get('profile', {'role': 'Farmer', 'state': 'India'}) 

    # --- FALLBACK DATA (5 Schemes + 5 Loans) ---
    fallback_data = {
        "schemes": [
            {"name": "PM-KISAN (Central Govt)", "type": "Central Govt", "description": "₹6,000 annual income support for all landholding farmers.", "required_docs": ["Aadhaar", "LandRecord", "BankStatement"]},
            {"name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)", "type": "Insurance", "description": "Crop insurance scheme against loss due to natural calamities.", "required_docs": ["LandRecord", "SowingCertificate", "Aadhaar"]},
            {"name": "Soil Health Card Scheme", "type": "Central Govt", "description": "Analysis of soil composition to suggest fertilizers.", "required_docs": ["SoilSample", "Aadhaar", "MobileNumber"]},
            {"name": "PM Krishi Sinchai Yojana", "type": "Irrigation", "description": "Subsidy for drip and sprinkler irrigation systems.", "required_docs": ["LandRecord", "Aadhaar", "ProjectReport"]},
            {"name": "National Livestock Mission", "type": "Subsidy", "description": "Financial assistance for poultry, sheep, and goat farming.", "required_docs": ["ProjectReport", "BankStatement", "CasteCertificate"]}
        ],
        "loans": [
            {"name": "SBI Kisan Credit Card (KCC)", "bank": "State Bank of India", "interest_rate": "7% p.a.", "required_docs": ["LandRecord", "Aadhaar", "PAN"], "description": "Short term credit for crops."},
            {"name": "HDFC Tractor Loan", "bank": "HDFC Bank", "interest_rate": "12.5% p.a.", "required_docs": ["ITR", "BankStatement", "Quotation"], "description": "Financing for farm machinery."},
            {"name": "Agri Gold Loan", "bank": "Muthoot Finance", "interest_rate": "9% p.a.", "required_docs": ["Aadhaar", "GoldPledge"], "description": "Instant loan against gold ornaments."},
            {"name": "PMMY Mudra Loan (Shishu)", "bank": "Public Sector Banks", "interest_rate": "8.6% p.a.", "required_docs": ["UdyamRegistration", "ProjectReport"], "description": "Micro-loan up to ₹50,000 for small business."},
            {"name": "PNB Kisan Tatkal Scheme", "bank": "Punjab National Bank", "interest_rate": "9.5% p.a.", "required_docs": ["KCC", "LandRecord"], "description": "Immediate credit for emergency farming needs."}
        ]
    }

    try:
        prompt = get_scheme_discovery_prompt(user_profile)
        raw_response = gemini.generate_content([prompt])
        final_text = get_gemini_text(raw_response)
        
        if final_text:
            clean_json = final_text.replace("```json", "").replace("```", "").strip()
            parsed_data = json.loads(clean_json)
            
            ai_schemes = parsed_data.get("schemes", [])
            ai_loans = parsed_data.get("loans", [])
            
            # --- MERGE LOGIC: Ensure at least 5 items ---
            # If AI returns fewer than 5, fill the rest with unique fallback items
            if len(ai_schemes) < 5:
                existing_names = set(s['name'] for s in ai_schemes)
                for item in fallback_data['schemes']:
                    if item['name'] not in existing_names:
                        ai_schemes.append(item)
            
            if len(ai_loans) < 5:
                existing_names = set(l['name'] for l in ai_loans)
                for item in fallback_data['loans']:
                    if item['name'] not in existing_names:
                        ai_loans.append(item)

            return jsonify({
                "schemes": ai_schemes,
                "loans": ai_loans
            })
        else:
            return jsonify(fallback_data)
    except Exception as e:
        print(f"Scheme Recommender Error: {e}")
        return jsonify(fallback_data)

# --- 4. ADVANCED LOAN CHECK (Crash-Proof) ---
@app.route('/growth/advanced-check', methods=['POST'])
def advanced_check():
    data = request.json
    amount = data.get('amount')
    tenure = data.get('tenure')
    bank = data.get('bank') or "Any Bank or NBFC"
    
    raw_docs = data.get('user_docs', [])
    doc_tags = []
    for d in raw_docs:
        tag = d.get('tag', 'Unknown') if isinstance(d, dict) else str(d)
        if tag in TAG_NORMALIZER:
            tag = TAG_NORMALIZER[tag]
        doc_tags.append(tag)
    
    doc_summary = ", ".join(set(doc_tags))
    print(f"DEBUG: Checking Loan {amount}. Docs: {doc_summary}")

    prompt = f"""
    Act as an unbiased Financial Aggregator & Loan Expert in India.
    
    User Profile:
    - Loan Request: ₹{amount} for {tenure} Years
    - Preferred Lender: {bank}
    - Verified Documents: [{doc_summary}]
    
    Task:
    Evaluate eligibility across the ENTIRE Indian financial market.
    
    Output strictly valid JSON:
    {{
        "eligible": true/false,
        "confidence_score": 0-100,
        "reasoning": "Detailed market analysis.",
        "suggestion": "Specific actionable advice."
    }}
    """
    
    try:
        response = gemini.generate_content([prompt])
        
        # FIX: Use helper to avoid 'str' object has no attribute 'text' error
        final_text = get_gemini_text(response)

        if not final_text:
            raise ValueError("Empty Response from AI")

        clean_json = final_text.replace("```json", "").replace("```", "").strip()
        parsed = json.loads(clean_json)
        parsed["analyzed_docs_count"] = len(doc_tags)
        return jsonify(parsed)
        
    except Exception as e:
        print(f"AI Check Error: {e}")
        return jsonify({
            "eligible": False,
            "confidence_score": 0,
            "reasoning": "AI Service unavailable due to network or safety filters. Showing default market advice.",
            "suggestion": "Please ensure you have uploaded clear documents.",
            "analyzed_docs_count": len(doc_tags)
        })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"Starting ML Service on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=True)