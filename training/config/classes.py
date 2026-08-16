AI_CLASSES = {
    0: "person",
    1: "cow",
    2: "monkey",
    3: "elephant",
    4: "pig",
    5: "goat",
    6: "bird",
    7: "dog"
}

CLASS_NAMES = list(AI_CLASSES.values())

print("AI Classes:")
for class_id, class_name in AI_CLASSES.items():
    print(f"{class_id}: {class_name}")