# Hive Parks — Ogden Website

This is the official website for **Hive Parks Ogden** — an indoor adventure park located at 145 N. Harrisville Rd., Ogden, Utah 84404.

---

## Key Points

- **Modern, mobile-first static HTML website** with no frameworks or dependencies beyond jQuery (used for interactive dropdowns).
- All pages use a shared CSS file (`hiveparks/css/main.css`) and a shared JS file (`hiveparks/js/main.js`).
- The color scheme is dark/black backgrounds with yellow (`#FFD600`) accent for a bold, on-brand look.
- Font: Montserrat (Google Fonts).

---

## Pages

| File | Description |
|------|-------------|
| `index.html` | Home page — hero, hours, stats, promo cards, attractions preview, careers callout, quick links |
| `tickets.html` | Ticket pricing — 90 Min Jump, All Day Pass, Membership |
| `membership.html` | Membership plans — Basic, Elite, Family; benefits; cancellation |
| `attractions.html` | All 12+ attractions with faded gradient card backgrounds |
| `safety.html` | Safety rules, age/weight guidelines, safety standards |
| `discounts.html` | Special needs, military, and first responder discounts |
| `employment.html` | Positions we offer; Google Form application link |
| `neon-nights.html` | Friday night Neon Nights event — UV lights, lasers, all ages |
| `group-buyouts.html` | Private park rental — groups of 20–300; Neon Nights buyout option |
| `parties.html` | Birthday/group party packages |
| `about.html` | About the park |

---

## Pricing (Current)

### Admission
| Pass | Ages 6+ | Ages 5 and Under |
|------|---------|------------------|
| 90 Minute Jump | $21.99 | $13.99 |
| All Day Pass | $29.99 | $19.99 |

### Memberships
| Plan | Ages 6+ | Ages 5 and Under | Notes |
|------|---------|------------------|-------|
| Basic | $21.99/mo | $13.99/mo | Jump 2 hrs Mon–Fri only |
| Elite | $25.99/mo | $16.99/mo | Jump all day Mon–Fri, 2 hrs weekends |
| Family | from $59.96/mo | — | 4 jumpers to start; $14.99/additional member; Online only |

All passes include full park access. Exception: Kiddy Karts have a separate fee. Soft play is for ages 7 and under.

---

## Changes from the Old Website

The old website ([hiveparks.com/ogden](https://www.hiveparks.com/ogden/)) had several limitations:

1. **Outdated pricing** — Ticket prices and membership tiers have been updated to reflect current rates and plans (Basic/Elite/Family replacing Silver/Gold/Platinum).
2. **Excessive emojis** — The attractions page and safety page were cluttered with large emojis on every item. These have been removed or reduced to create a sleeker, more professional look.
3. **Attractions page** — Instead of emoji icons, each attraction card now uses a unique gradient background color that gives a subtle "faded backdrop" effect, making the page feel more visual without needing actual photos.
4. **Misleading info** — The old Neon Nights description mentioned a DJ and listed an age restriction (8+). It has been corrected to mention energetic music, UV lights, lasers, no age limit, and full park access.
5. **Employment page** — Was framed as "We're Hiring / Open Positions." Now correctly states we are always accepting applications and lists "Positions We Offer." Apply link updated to the official Google Form (in-person/phone applications removed).
6. **Student discount removed** — The discounts page no longer shows a student discount that was not offered.
7. **Membership cancellation** — Previously allowed call/text/in-person cancellations. Now clearly states that cancellations must be submitted via the official Google Form at least 2 days before the next billing date.
8. **Hero buttons reordered** — On the home page, the primary action is now "Buy Tickets" (first), followed by "Book a Party," "Memberships," and "Sign Waiver" (last). Previously, "Sign Waiver" was first.
9. **Quick Links moved** — The Quick Links section was in the hours bar where button text was yellow-on-yellow (invisible). It has been moved to just above the footer as a proper grid of link cards, and the hours bar now uses a clean two-column layout with expanded contact and membership info.
10. **Membership as best deal** — Messaging throughout the site (home page, tickets page, discounts page) now highlights that memberships are the same price as a single-day admission but cover the entire month.
11. **Group buyouts + Neon Nights** — Groups booking a private buyout can now request a Neon Nights experience during their event.

---

## How to Make Changes

Since this is a plain HTML/CSS/JS static site, updating content is straightforward:

- **Prices** — Edit the relevant `<div class="pricing-price">` and `<p class="pricing-price-note">` in `tickets.html` or `membership.html`.
- **Hours** — Update the `<table class="hours-table">` in `index.html` and any other pages that display hours.
- **Images** — Place new image files in `hiveparks/images/` and reference them with relative paths.
- **Attraction card backgrounds** — The faded gradient backgrounds for attraction cards are controlled via `.attraction-card:nth-child(N)` rules in `main.css`. Replace with `background-image: url('../images/your-photo.jpg')` for real photos.
- **Styles** — All styling is in `hiveparks/css/main.css`. CSS variables at the top of the file control colors, fonts, and shadows globally.
- **Navigation** — The nav is repeated on every page. Update the `<nav class="navbar">` block consistently across all HTML files when adding/removing pages.
- **Footer** — Similarly repeated; update consistently.

---

## What Makes It Better for the Company

1. **Accurate information** — Correct prices, honest hiring messaging, proper cancellation process — reduces confusion and staff overhead from misdirected calls/texts.
2. **Membership promotion** — The "best deal" messaging is woven throughout the site to encourage higher-value recurring revenue from memberships.
3. **Cleaner visual design** — Removing emoji clutter from the attractions and safety pages creates a more professional look that better represents the brand.
4. **Better user flow** — The hero CTA buttons now guide visitors in the right priority order: buy tickets first, then parties and memberships, with waiver signing last.
5. **Self-service cancellations** — Directing cancellations exclusively to the Google Form reduces staff time spent on cancellation requests.
6. **Self-service applications** — Google Form applications reduce back-and-forth and allow the team to review at their own pace.
7. **Easy to maintain** — Plain HTML/CSS files require no server, no CMS, no build tools. Anyone comfortable with a text editor can update prices, hours, or copy.
