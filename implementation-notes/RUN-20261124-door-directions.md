# Consolidated elevator directions

Joe approved removing the instruction below each door and replacing the door's
combined instruction with two distinct lines: vertical floors (↕), horizontal
rooms (→). The shared template applies this to all five doors. Touch screens
say swipe; desktop says scroll for floors and use the arrows for rooms.

Door text uses a bounded grid column and wraps long headings on narrow screens.
No routing, collection, or animation behavior changed. WebKit layout checks
cover all five doors at 320px, 390px and 1440px with saved challenges present.

Follow-up: Joe observed the final g of Understanding wrapping alone on mobile.
The mobile Understanding heading now uses a smaller responsive size and normal
word wrapping. WebKit text-range checks confirmed the entire word occupies one
line inside the door at 320, 375, 390, 430 and 620px after fonts loaded.
