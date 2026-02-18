def detect_intent(message):
    message = message.lower()

    if any(w in message for w in ["hi", "hello", "namaste", "नमस्ते", "வணக்கம்", "నమస్తే"]):
        return "greeting"

    if any(w in message for w in ["pm kisan", "pm-kisan", "पीएम किसान", "பிஎம்", "పీఎం కిసాన్"]):
        return "pm_kisan"

    if any(w in message for w in ["insurance", "बीमा", "காப்பீடு", "బీమా"]):
        return "insurance"

    if any(w in message for w in ["document", "दस्तावेज", "ஆவணம்", "పత్రాలు"]):
        return "documents"

    if any(w in message for w in ["eligible", "पात्र", "தகுதி", "అర్హత"]):
        return "eligibility"

    if any(w in message for w in ["gst", "tax", "जीएसटी", "வரி", "పన్ను"]):
        return "compliance"

    return "unknown"
