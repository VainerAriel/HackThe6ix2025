from gemini_service import gemini_service

profile = {
    "role": "Junior Developer",
    "boss_personality": "Dismissive",
    "goal": "Pitch a new idea",
    "confidence": 2
}

scenario_result = gemini_service.generate_scenario(profile)
print("Scenario:", scenario_result['scenario'])

user_input = "Hey, I think we should maybe use React instead?"
feedback_result = gemini_service.critique_response(scenario_result['scenario'], user_input)
print("\nFeedback:\n", feedback_result['critique'])