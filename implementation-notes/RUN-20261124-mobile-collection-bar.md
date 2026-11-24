# Mobile collection next step

Joe confirmed the Safari lobby correction works on his affected phone, then
approved a persistent mobile collection bar and a minimal lobby instruction.

- On screens up to 620px, the first saved challenge reveals a bottom bar with
  the saved count and Review & Send. The ambiguous header plus is removed.
- The bar opens the existing collection review and sends nothing automatically.
  Removing the last challenge hides it. Desktop keeps View Collection.
- Lobby guidance names Review & Send on mobile and View Collection on desktop.
- Bottom spacing keeps the bar clear of elevator hints and challenge controls.
- All 62 repository tests passed. WebKit acceptance at 320px, 390px and 1440px
  verified save/count, review, contact URL carry-over, continue, removal and
  phone control clearance with no page errors. No contact message was sent.
