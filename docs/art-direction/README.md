# Art direction

Locked in "Lock the art direction: couple key still, palette and type"
([#4](https://github.com/bontaramsonta/vikram-vaishnavi-invite/issues/4)).
Every generated asset matches this sheet.

## Couple key still

| File | Use |
|---|---|
| `docs/art-direction/couple-key.png` | Master, 1536×2720. The identity reference for every later Higgsfield job. |
| `public/assets/couple-key.webp` | Web copy, 1080×1913, ~230 KB. |
| `docs/art-direction/couple-ref-crop.png` | The couple cropped from `docs/reference/invite.webp` (540×1140 at +484+396). Input to the key still. |

- **Model:** Seedream 5.0 Pro (`seedream_v5_pro`)
- **Params:** `--aspect_ratio 9:16 --resolution 2k`
- **Seed:** 392523. The CLI exposes no seed flag, so a rerun will not reproduce it. Reuse the master instead.
- **Job:** `38fbbfa9-2117-4772-a0d9-64100cece148`
- **References, in order:** `couple-ref-crop.png`, then `docs/reference/invite.webp` (as PNG)

Prompt:

```text
Soft watercolour wedding illustration of the same South Indian couple shown in the reference images, keeping their faces, hair, build and outfits identical. Full-length portrait, both standing, turned toward each other in three-quarter view, gazing at each other with gentle smiles, holding hands at waist height. He: short wavy black hair, trimmed beard, cream long-sleeve shirt with sleeves rolled, cream veshti with a broad gold border. She: long wavy black hair in a loose side braid with a cluster of white jasmine flowers, gold jhumka earrings, gold necklace, gold waist belt, gold bangles, a rose-pink and gold Kanchipuram silk saree with woven gold motifs. Hand-painted storybook style matching the reference: delicate pencil linework, warm translucent washes, soft diffused light, subtle paper texture. Plain warm ivory background with a faint soft vignette, nothing else in the frame. No text, no flowers, no lanterns, no border, no frame.
```

Command:

```bash
higgsfield generate create seedream_v5_pro --prompt "$(cat prompt.txt)" \
  --image docs/art-direction/couple-ref-crop.png --image invite.png \
  --aspect_ratio 9:16 --resolution 2k --wait
```

### Matching it in later assets

- Pass `couple-key.png` as the **first** image reference whenever the couple appears.
- Reuse the style clause: *"Hand-painted storybook style: delicate pencil linework, warm translucent washes, soft diffused light, subtle paper texture."*
- Edges SHOULD bleed into ivory rather than end in a hard cut, as the key still does.
- Seedream 5.0 Pro was also tried against Nano Banana 2 and GPT Image 2.5 on the same prompt. It won on the loose, fading watercolour.

## Palette

| Token | Hex | Use |
|---|---|---|
| `--ivory` | `#FAF0DE` | Page base |
| `--cream` | `#F3E4C8` | Cards, surfaces |
| `--gold` | `#C69951` | Rules, borders, ornaments, buttons on maroon. Not for text on ivory. |
| `--gold-deep` | `#8A6328` | Serif caps and small gold text on ivory. 4.8:1 on ivory, 4.2:1 on cream. |
| `--rose-taupe` | `#8C5A5E` | Script names and headings |
| `--maroon` | `#5C1A26` | Reception section background |
| `--ink` | `#4A3A33` | Body text |

Sampled from the printed invite's ornaments, date and script text. The script colour is pulled toward the reel's rose-taupe.

Gold buttons MUST carry maroon text (5:1). Ivory on gold is only 2.3:1.

## Type

All Google Fonts.

| Role | Family |
|---|---|
| Script (names, headings) | Great Vibes |
| Serif caps (labels, dates) | Cinzel 400/500, letter-spacing ~0.2em |
| Italic serif (body) | Cormorant Garamond Italic, with 400/500 roman |

```html
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Great+Vibes&display=swap" rel="stylesheet">
```

## Gate door

From "Generate the gate door, split into swingable halves"
([#6](https://github.com/bontaramsonta/vikram-vaishnavi-invite/issues/6)).

| File | Use |
|---|---|
| `docs/art-direction/gate-door.png` | Master, 1536×2720 |
| `public/assets/gate-door.webp` | Web copy, 1080×1913, ~470 KB, preloaded |

- **Model:** Seedream 5.0 Pro (`seedream_v5_pro`), `--aspect_ratio 9:16 --resolution 2k`
- **Seed:** 776325
- **Job:** `e3cc3026-75fb-4131-8630-e1b3c802dd5d`
- **Reference:** `couple-key.png`, for style only

The door is one image. Each `.door` half draws the full image at twice its width (`.door::before`), so the seam is exact and no separate halves are exported. Behind the doors is an ivory mist, not a painted frame.

Prompt:

```text
Front view, perfectly symmetrical composition: a tall, ornately carved dark teak South Indian temple door, closed, its two door leaves meeting in a straight vertical seam exactly at the horizontal centre of the image. Each leaf has carved square panels with lotus motifs and rows of brass bosses. Above the doorway hangs a toran of fresh mango and banana leaves with strings of orange and yellow marigolds and white jasmine. Tall banana plants frame both sides of the doorway, with brass oil lamps on the floor. Two richly caparisoned temple elephants with gold nettipattam face plates and marigold garlands stand in front of the door, one on the left leaf and one on the right leaf, mirror images of each other, facing the centre with trunks curled up in greeting; neither elephant crosses the centre line, which stays clear. Hand-painted storybook style matching the reference image: delicate pencil linework, warm translucent watercolour washes, soft diffused light, subtle paper texture. Warm ivory, muted gold, rose and teak palette. The painting fills the frame edge to edge. No people, no text, no border, no frame.
```
