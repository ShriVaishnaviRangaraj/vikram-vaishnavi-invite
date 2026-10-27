# Invite poster

From "Make the updated invite poster with a QR code to the site"
([#20](https://github.com/bontaramsonta/vikram-vaishnavi-invite/issues/20)).

The printed invite (`docs/reference/invite.webp`) rebuilt in HTML, with the
Nalangu added and a QR code to https://vikram-vaishnavi-invite.vercel.app.

| File | Use |
|---|---|
| `invite-poster.png` | The poster, 1080×1620. Share this one on WhatsApp. |
| `poster.html` | Source. All text lives here. |
| `qr.svg` | QR code, error correction M, 4-module quiet zone |
| `art/plate.png` | The printed invite with its text erased, 1024×1536 |
| `art/icon-*.png`, `art/sprig-*.png` | Cut from the printed invite and set on white. They are drawn with `mix-blend-mode: multiply`. |
| `make-plate.py` | Erases the text by inpainting (OpenCV) |
| `render.sh` | Renders `poster.html` with headless Chrome |

## Rebuild

```bash
pnpm poster:qr   # only if the URL changes
pnpm poster      # writes invite-poster.png
```

`render.sh <out.png> 2` renders at 2× (2160×3240) for print. The art plate is
only 1024 px wide, so the art softens when it is printed large. The text and
the QR stay sharp.

## Open points

- The Nalangu's spelling and venue are still being confirmed (#2). The spelling is
  set once, in `poster.html`.
