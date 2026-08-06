# Thinking Museum share action and social preview

## Objective

Give museum visitors a way to send the experience to someone else, and make the
shared link unfurl as a real preview instead of bare text.

## Result

- The wall-button placard now carries a second action under `Contact Joe`:
  `Share this with a friend`. `Contact Joe` still routes to `/contact/`.
- Selecting the new action expands a share rack inside the same placard. It
  shows the address being shared, `https://disruptionjoe.com/thinking/`, and
  three destinations that accept a link from a browser: X, LinkedIn, and email.
- Instagram and TikTok publish no share intent a web page can call, so they are
  not fake buttons. Their marks sit on a labeled note below a hairline rule,
  next to the two actions that actually reach them: the device share sheet when
  `navigator.share` exists in a secure context, and copy-the-link always.
- Copying follows the existing clipboard pattern from `/enablement/`: the
  Clipboard API first, then `execCommand`, then select-for-manual-copy with the
  full address revealed. Each outcome reports through a polite status line.
- Mobile gets the same reach on the Floor 01 `Next Step` card. The card's
  primary action keeps its width and gains a compact `Share` control beside it,
  which opens the share rack as a bottom sheet in the same visual language as
  the exhibit sheet.
- `/thinking/` now has Open Graph and Twitter card metadata pointing at a
  purpose-built 1200 x 630 preview at `/assets/thinking-og.png`.

## Preview asset

`assets/thinking-og.png` is built from the site's own design language rather
than photography: near-black substrate, blueprint grid, tan and soft-gold
signal, Space Grotesk and Space Mono, and an architectural plan of the museum
showing Work With Joe, the Control Room, and Church of AI around the entrance
hall. It reuses the entry copy already on the page.

## Preserved

The physical button installation, its label, its interaction range, the contact
route, every exhibit and placard, the mobile floor order, and all other Thinking
Museum content are unchanged.

## Validation

- `npm test` passed the JavaScript syntax suite.
- `git diff --check` passed.
- Headless Chrome walked the desktop museum, opened the placard, expanded the
  share rack, confirmed the three destination URLs, exercised the copy fallback,
  and confirmed the rack hides again for exhibit placards.
- Emulated iPhone and 320-wide viewports confirmed the Floor 01 card keeps its
  layout with the new control and that the bottom sheet opens, reports status,
  and closes without leaving the scroll lock behind.
- Shared asset query strings on `/thinking/` and `/thinking/game/` were bumped
  so returning visitors receive the change.

## Outcome reason

`The museum can now be handed to someone else, and the handoff arrives with a
picture of the room instead of a naked URL.`
