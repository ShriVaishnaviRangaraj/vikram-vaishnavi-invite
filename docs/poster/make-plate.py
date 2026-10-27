# Erase the printed text from the invite, leaving the art plate.
# uv run --with opencv-python-headless --with numpy python make-plate.py invite.png art/plate.png mask.png
import sys
import cv2
import numpy as np

src, out, maskout = sys.argv[1], sys.argv[2], sys.argv[3]
img = cv2.imread(src)
h, w = img.shape[:2]

# Region holding the printed text, hugging the couple and the floral corners.
region = np.zeros((h, w), np.uint8)
poly = np.array([
    (150, 160), (775, 160), (775, 215), (705, 215), (705, 330),
    (530, 330), (530, 560), (505, 560), (505, 1100), (552, 1150),
    (552, 1330), (720, 1330), (720, 1428), (190, 1428), (190, 1318),
    (160, 1318), (160, 1236), (74, 1236), (74, 1150), (40, 1150),
    (40, 330), (150, 330),
], np.int32)
cv2.fillPoly(region, [poly], 255)

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.int32)
bg = cv2.medianBlur(img, 61)
bglab = cv2.cvtColor(bg, cv2.COLOR_BGR2LAB).astype(np.int32)
diff = np.sqrt(((lab - bglab) ** 2).sum(axis=2))
ink = ((diff > 10) & (region > 0)).astype(np.uint8) * 255
ink = cv2.dilate(ink, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))

# "AUDITORIUM" runs onto the veshti; take its tail too.
ink[1195:1228, 540:566] = 255

cv2.imwrite(maskout, ink)
clean = cv2.inpaint(img, ink, 6, cv2.INPAINT_TELEA)
cv2.imwrite(out, clean)
