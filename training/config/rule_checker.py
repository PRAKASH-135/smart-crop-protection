import yaml


with open("training/config/crop_rules.yaml", "r") as file:
    config = yaml.safe_load(file)


def check_object(crop, detected_object):

    crop_data = config["crops"].get(crop)

    if crop_data is None:
        return {
            "harmful": False,
            "status": "UNKNOWN_CROP"
        }

    if detected_object in crop_data["harmful"]:
        return {
            "harmful": True,
            "status": "HARMFUL"
        }

    if detected_object in crop_data["harmless"]:
        return {
            "harmful": False,
            "status": "HARMLESS"
        }

    return {
        "harmful": False,
        "status": "UNDEFINED"
    }


if __name__ == "__main__":

    tests = [
        ("wheat", "cow"),
        ("wheat", "dog"),
        ("corn", "bird"),
        ("rice", "monkey"),
        ("rice", "person")
    ]

    for crop, animal in tests:

        result = check_object(crop, animal)

        print(
            f"Crop: {crop:8} | "
            f"Object: {animal:8} | "
            f"Result: {result}"
        )