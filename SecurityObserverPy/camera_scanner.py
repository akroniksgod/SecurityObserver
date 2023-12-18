import cv2
import time
from gpiozero import LED


def start_camera_scanner():
    # захват потока с камеры
    cap = cv2.VideoCapture(0)

    while (True):
        # получаем изображение с камеры
        ret, img = cap.read()

        detector = cv2.QRCodeDetector()

        data, bbox, straight_qrcode = detector.detectAndDecode(img)

        print(data)

        # логика проверки валидности QR кода
        if (True):
            open_tourniquet()

        # отдыхаем одну секунду
        time.sleep(1)


def open_tourniquet():
    # для проверки зажжем лампочку на 5 секунд
    gpio_pin = 17

    led = LED(gpio_pin)

    led.on()
    time.sleep(5)
    led.off()

