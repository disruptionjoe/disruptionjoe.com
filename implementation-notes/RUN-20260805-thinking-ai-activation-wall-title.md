# AI Activation wall-title edit

## Objective

Preserve the existing portrait architectural capability-path infographic while
changing only its large top title from `RAISE THE FLOOR` to `AI ACTIVATION`.

## Result

- Replaced `assets/thinking/raise-the-floor-capability-path.png` in place with
  the selected built-in image-generation edit.
- Normalized the returned raster through macOS image services to a standard
  PNG so browsers and local inspection decode the complete image consistently;
  this did not change its dimensions or composition.
- Preserved the existing `1024x1536` dimensions and portrait aspect ratio, so
  the Three.js texture path, wall placement, scale, frame, and light remain
  unchanged.
- The final title is the exact uppercase text `AI ACTIVATION`, centered in the
  original title area with the same condensed cream-and-gold architectural
  treatment.
- The original asset remains recoverable from website revision `29cf684`.

Asset hashes:

- original: `sha256:e7ccb32b00456bff3c2e8691a9c532c4c9aabf9822f74e19df5ec7fbe39834c1`
- final: `sha256:d1617888807caddf354c8bfa8bd050bcb5cf06861cf034071cadac58d5880045`

## Final prompt

Built-in image-generation edit mode was used with the live PNG as the edit
target:

> Use case: text-localization. Asset type: portrait website wall infographic.
> Change only the large headline at the very top from “RAISE THE FLOOR” to
> “AI ACTIVATION.” Match the existing headline's condensed uppercase type
> style, cream-gold color, subtle glow, height, baseline, and visual weight.
> Center “AI ACTIVATION” naturally in the same headline area. Pixel-lock every
> region below the horizontal divider beneath the headline and every border or
> line outside the old headline letters. Preserve the 1024x1536 dimensions,
> crop, architectural structure, floors, network, arrows, numbered labels, all
> small text, lighting, linework, texture, and black/gold palette. Do not redraw,
> simplify, reinterpret, add, remove, crop, or modify anything except the
> headline letters. No watermark.

## Preserved

All diagram content, offer labels, room placement, display framing, lighting,
interaction behavior, surrounding exhibits, desktop architecture, and mobile
experience remain unchanged.

## Validation

- PNG integrity and exact `1024x1536` dimensions.
- Visual inspection of the generated source and project-bound replacement.
- Repository test suite, YAML parse, and whitespace checks.
- Local desktop walkthrough of the existing wall position.
