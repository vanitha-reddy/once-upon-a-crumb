# Once Upon a Crumb

Pre-order website for Once Upon a Crumb, a small-batch home bakery.

- `index.html` – page structure
- `styles.css` – colors, fonts and layout
- `script.js` – menu data, filters, build-a-box, countdown, bag and checkout

To view it, double-click `index.html` (or run `open index.html` in this folder).
Edit the `MENU` list at the top of `script.js` to change treats and prices.

The logo is `images/logo-mark.svg` (the cookie on its own) and `images/logo.svg` (cookie with the name).

## Tests

Double-click `tests.html`. It opens the site in test mode and runs 30 checks on the menu, the box builder,
bag totals, pickup days (including 5 days' notice for cakes), the Thursday 8 pm countdown and OC- order codes.
A panel shows which passed. The tests use their own saved bag, so they never touch a real one.
The checks live in `tests.js`.
