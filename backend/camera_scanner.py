import asyncio
import cv2
import time
from gpiozero import LED


async def start_camera_scanner():
    print("Запущен поток на распознавание QR кодов")

    # захват потока с камеры
    cap = cv2.VideoCapture(0)

    while True:
        # получаем изображение с камеры
        ret, img = cap.read()

        detector = cv2.QRCodeDetector()

        data, bbox, straight_qrcode = detector.detectAndDecode(img)

        print("Распознанная строка: " + data)

        # логика проверки валидности QR кода
        if len(data) > 0 and True:
            print("Открываем турникет!")
            open_tourniquet()

        # отдыхаем одну секунду
        await asyncio.sleep(1)


def open_tourniquet():
    # для проверки зажжем лампочку на 5 секунд
    gpio_pin = 17

    led = LED(gpio_pin)

    led.on()
    time.sleep(5)
    led.off()

