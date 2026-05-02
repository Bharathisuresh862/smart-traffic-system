from ultralytics import YOLO
import cv2
import requests

CAMERA_ID = 3

model = YOLO("yolov8n.pt")
cap = cv2.VideoCapture("video3.mp4")

while True:
    ret, frame = cap.read()

    if not ret:
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        continue

    results = model(frame)

    vehicle_count = 0
    people_count = 0

    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])

            if cls in [2, 3, 5, 7]:
                vehicle_count += 1
            elif cls == 0:
                people_count += 1

    print(f"[Cam1] Vehicles: {vehicle_count}, People: {people_count}")

    try:
        requests.post("http://127.0.0.1:5000/data", json={
            "cameraId": CAMERA_ID,
            "vehicles": vehicle_count,
            "people": people_count
        })
    except:
        print("Backend error")

    frame = results[0].plot()
    cv2.imshow("Camera 1", frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()