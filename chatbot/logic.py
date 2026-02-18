def generate_response(intent, language="en"):
    responses = {
        "greeting": {
            "en": "Hello! I can help you with agriculture schemes.",
            "hi": "नमस्ते! मैं कृषि योजनाओं में आपकी मदद कर सकता हूँ।",
            "ta": "வணக்கம்! விவசாய திட்டங்களில் நான் உதவுவேன்.",
            "te": "నమస్తే! వ్యవసాయ పథకాలపై సహాయం చేస్తాను."
        },

        "pm_kisan": {
            "en": "PM-KISAN gives ₹6000 per year to eligible farmers.",
            "hi": "पीएम-किसान योजना पात्र किसानों को ₹6000 देती है।",
            "ta": "பிஎம்-கிசான் திட்டம் விவசாயிகளுக்கு ₹6000 வழங்குகிறது.",
            "te": "పీఎం-కిసాన్ పథకం రైతులకు ₹6000 ఇస్తుంది."
        },

        "insurance": {
            "en": "Crop insurance protects farmers from crop loss.",
            "hi": "फसल बीमा नुकसान से सुरक्षा देता है।",
            "ta": "பயிர் காப்பீடு இழப்பில் இருந்து பாதுகாக்கிறது.",
            "te": "పంట బీమా నష్టాల నుంచి రక్షిస్తుంది."
        },

        "documents": {
            "en": "Aadhaar, land record, and bank passbook are required.",
            "hi": "आधार, भूमि रिकॉर्ड और बैंक पासबुक चाहिए।",
            "ta": "ஆதார், நில ஆவணம் மற்றும் வங்கி புத்தகம் தேவை.",
            "te": "ఆధార్, భూ రికార్డు, బ్యాంక్ పాస్‌బుక్ అవసరం."
        },

        "eligibility": {
            "en": "Eligibility depends on land, income, and state.",
            "hi": "पात्रता भूमि, आय और राज्य पर निर्भर है।",
            "ta": "தகுதி நிலம் மற்றும் வருமானத்தை சார்ந்தது.",
            "te": "అర్హత భూమి, ఆదాయంపై ఆధారపడి ఉంటుంది."
        },

        "compliance": {
            "en": "GST is required only if income exceeds the limit.",
            "hi": "सीमा से अधिक आय पर जीएसटी आवश्यक है।",
            "ta": "வருமானம் அதிகமாக இருந்தால் ஜிஎஸ்டி தேவை.",
            "te": "ఆదాయం ఎక్కువైతే జీఎస్టీ అవసరం."
        },

        "unknown": {
            "en": "Sorry, I could not understand.",
            "hi": "क्षमा करें, समझ नहीं पाया।",
            "ta": "மன்னிக்கவும், புரியவில்லை.",
            "te": "క్షమించండి, అర్థం కాలేదు."
        }
    }

    return responses.get(intent, responses["unknown"]).get(language, responses["unknown"]["en"])
