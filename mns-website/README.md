# MNS Holdings & Investments website

Static site: plain HTML, CSS and JavaScript. No build step.

## Run locally (VS Code)
1. Open this folder in VS Code.
2. Install the "Live Server" extension, right-click `index.html`, choose "Open with Live Server".

## Structure
- `index.html` page content and SEO tags
- `css/styles.css` design system (colours are variables at the top)
- `js/main.js` menu, enquiry pop-up, active-link highlighting
- `js/light-pillar.js` animated WebGL LightPillar background effect in the footer
- `assets/logo.png` logo; `assets/team/photo-1..4.jpg` director photos
- `assets/coverage/` city photos; `assets/services/` service photos
- `robots.txt`, `sitemap.xml` for search engines

## To do before launch
- `assets/hero-3d.svg` is the 3D hero illustration (editable SVG). `js/scene.js` is an optional live Three.js city, not loaded by default. Photos: 1 Malibongwe, 2 Banele, 3 Sbonga, 4 Sikhona.
- Replace the WhatsApp number (search `27738732707` in `index.html`) with a business number.
- Add office addresses and a map.
- Add privacy policy, terms and POPIA notice after legal review.
- Enquiry submissions use FormSubmit to email only `operationsit@mnsinvestmentsholdings.co.za`. Before launch, submit a test enquiry and activate this recipient using the verification email sent to that address. FormSubmit receives submitted contact details to deliver the email.
- The city photos are from Wikimedia Commons: Durban (CC0), Pretoria (R4vi, CC BY-SA 2.0), and Johannesburg (Frankbel, CC BY-SA 4.0); their credits and source links are shown with the images. Service photos are local copies of Unsplash images, used under the Unsplash License.
- Update the compliance list as SARS, CSD and B-BBEE registrations are issued.

## Deploy
Upload the folder contents to any static host (your hosting cPanel `public_html`, Netlify, Cloudflare Pages) and point mnsinvestmentsholdings.co.za at it. Then submit `sitemap.xml` in Google Search Console.
