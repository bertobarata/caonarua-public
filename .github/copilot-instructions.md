# CNR Creche Canina Website - AI Development Guide

## Project Overview
Professional multi-page website for CNR Creche Canina, a Portuguese dog daycare service. Built with vanilla HTML/CSS/JavaScript focusing on performance, accessibility, and mobile-first design. Features 4-language support (PT/EN/ES/FR), partnerships carousel, WebP-optimized images, and PWA capabilities. **All default content in Portuguese (PT-PT)**.

## Architecture & Structure

### Page Structure Pattern
- **Header**: Fixed nav with logo (left) + hamburger menu (mobile) or horizontal nav (desktop)
- **Hero/Main**: Full-viewport background image with centered text overlay
- **Sections**: Content organized with semantic HTML (`<section id="..." class="section">`)
- **Footer**: Consistent 3-column layout (Horário, Contactos, Redes Sociais) across **all 8 pages**

### Key Files & Pages
- `index.html` - Homepage with services grid, team section, partnerships carousel, contact CTA
- `css/styles.css` - Main stylesheet (2200+ lines) with component styles, responsive breakpoints, mobile optimizations
- `css/lang-switcher.css` - Language selector dropdown styling
- `js/lang-switcher.js` - Multi-language translation system (PT/EN/ES/FR)
- Service pages: `creche.html`, `passeiosnanatureza.html`, `passeios individuais.html`, `estadias familiares.html`, `transportes.html`
- Utility pages: `faq.html`, `formulario.html`, `politica-privacidade.html`, `termos-condicoes.html`
- `service-worker.js` - PWA offline caching strategy

### Assets Organization (WebP-Optimized)
```
assets/
├── fotos/
│   ├── index/              # Homepage images (WebP + JPEG fallbacks)
│   ├── creche/             # 3 service images
│   ├── passeiosindividuais/  # 3 service images
│   ├── estadiasfamiliares/   # 4 service images
│   ├── passeiosnanatureza/   # 64 slideshow images (WebP optimized)
│   └── transportes/        # 1 map image
├── parcerias/              # Partnership logos (5 partners)
├── paises/                 # Language flag icons (hex + squared versions)
├── fonts/                  # Self-hosted (Nunito, Bubblegum_Sans, Sour_Gummy)
├── gifs/                   # Icons and animations
└── logos/                  # CNR branding + navigation assets (left.png, right.png)
```

## Design System (CSS Variables in :root)

### Color Palette
```css
--color1: rgb(227, 119, 52);  /* Orange - Primary brand */
--color2: rgb(46, 160, 56);   /* Green - Secondary */
--color3: #F5BFA2;            /* Beige - Text/UI */
--color4: #CBAE95;            /* Tan - Accents */
--muted: #F5EFD8;             /* Light beige for light backgrounds */
```

### Typography Scale (Perfect Fourth 1.333)
- **Headings**: `--font-headings` (Nunito) - font-weight: 800
- **Body**: `--font-body` (Nunito)
- **Sizes**: h1: 5.61rem (89.76px) down to h6: 1.33rem (21.33px)
- **Responsive**: Media queries override heading sizes at 900px, 720px, 480px breakpoints

### Responsive Breakpoints
```css
@media (max-width: 900px)  /* Tablets */
@media (max-width: 720px)  /* Mobile - hamburger menu appears */
@media (max-width: 480px)  /* Small mobile */
```

## Critical Patterns

### WebP Image Strategy (203 MB savings!)
**ALL images use `<picture>` tags with WebP + responsive srcset**:
```html
<picture>
  <source type="image/webp"
    srcset="assets/fotos/index/CRECHE-400w.webp 400w,
            assets/fotos/index/CRECHE-600w.webp 600w"
    sizes="(max-width: 600px) 400px, 600px" />
  <img src="assets/fotos/index/CRECHE.jpg" alt="Creche" loading="lazy" />
</picture>
```
- **18 images** use responsive srcset (service cards, team photos, content images)
- **Hero backgrounds** use CSS `@supports` feature detection for WebP
- **64 slideshow images** (passeiosnanatureza.html) converted to WebP
- Fallback to JPEG/PNG for older browsers
- Always keep `loading="lazy"` on below-fold images

### Mobile Navigation (720px and below)
- `.nav-toggle` button displays (hamburger icon with CSS-only animation)
- `#main-menu` becomes absolute positioned dropdown with dark background `rgba(0,0,0,0.85)`
- Hamburger animates to X when `aria-expanded="true"` (no JS changes to icons, pure CSS transforms)

### Hero Section Mobile Adjustments
- Background image changes to `center top` positioning (shows faces at top of image)
- Hero text moves lower via `transform: translateY(45vh)` on 720px, `50vh` on 480px
- Prevents text from covering faces in background photo
- **WebP hero backgrounds**: CSS uses `@supports (background-image: url('test.webp'))` to conditionally load WebP variants

### Footer Pattern (Replicated across ALL pages)
```html
<footer class="site-footer">
  <div class="footer-columns">
    <div class="footer-col">Horário</div>
    <div class="footer-col">Informações (FAQ + Privacy + Terms)</div>
    <div class="footer-col">Redes Sociais e Contactos (WhatsApp + Email + Instagram + Facebook)</div>
  </div>
  <small>© <span id="year"></span> CNR Creche Canina</small>
</footer>
```
**Footer Design (CSS Grid)**:
- 3 equal columns on desktop (`grid-template-columns: repeat(3, 1fr)`)
- Collapses to 1 column on mobile (<900px)
- Compact spacing: 12px gap, 10px padding, max-width 950px
- Footer icons: 22px (WhatsApp, Instagram, Facebook), 20px (Email)
- Social media icons displayed horizontally next to text
- Soft gradient backgrounds on columns: `rgba(245, 191, 162, 0.05)`

### Partnerships Carousel (index.html)
**Auto-rotating carousel with manual navigation**:
```html
<section id="partnerships" class="partnerships-section">
  <div class="partnerships-carousel-wrapper">
    <button class="partnerships-nav partnerships-nav-prev">
      <img src="assets/logos/left.png" class="nav-arrow" />
    </button>
    <div class="partnerships-carousel">
      <div class="partnerships-track">
        <!-- 5 partnership cards -->
      </div>
    </div>
    <button class="partnerships-nav partnerships-nav-next">
      <img src="assets/logos/right.png" class="nav-arrow" />
    </button>
  </div>
</section>
```
- **Desktop**: 3 cards visible, horizontal layout
- **Mobile**: 1 card visible, navigation arrows remain horizontal (left/right)
- **Auto-play**: 1.5s interval, pauses on hover
- **Logos**: 5 partners (Mercedes-Benz.io, Get the Jog, Adaptel, The Agency, IZQC Abrigo Animal)
- **Carousel width**: 1200px desktop, 280px tablet, 240px mobile

### Image Galleries (passeiosnanatureza.html)
- Custom slideshow with prev/next buttons
- `.slideshow-container` wrapper, `.slideshow-slide` for each image
- Vanilla JS controls visibility (adds/removes `.active` class)

### Multi-Language System
**4 languages supported**: Portuguese (PT), English (EN), Spanish (ES), French (FR)
- `js/lang-switcher.js` - Translation engine with `window.translations` object
- `css/lang-switcher.css` - Dropdown styling with flag icons
- Language selector in navigation with flag icons (20px desktop, 18px mobile)
- Dropdown with scroll (max-height: 280px) to show all options on mobile
- Translations stored as key-value pairs: `translations.pt.nav.home`, `translations.en.nav.home`, etc.

## Development Workflow

### Local Preview
**Recommended**: Use VS Code "Five Server" extension (already in use per terminal context)
```bash
# Alternative: Python
python -m http.server 8000
```

### Making Global Changes
1. **Footer updates**: Must edit ALL HTML files (8 pages total)
2. **Style changes**: Single `css/styles.css` file - use CSS variables when possible
3. **Navigation changes**: Update `<nav class="top-nav">` in ALL HTML files

### Git Workflow (Active repository)
```bash
git add <files>
git commit -m "Clear, actionable message in English"
git push origin main
```
Repository: `bertobarata/https---github.com-bertobarata-CNRWebSite`

### Mobile Optimization Checklist
When making layout changes, always verify:
- [ ] Overflow-x is prevented (`overflow-x: hidden` on html/body)
- [ ] Box-sizing is set to border-box on containers
- [ ] Content is centered with `margin: 0 auto` and `max-width`
- [ ] Navigation arrows/buttons remain visible and accessible
- [ ] Language selector dropdown is scrollable and shows all options
- [ ] Footer collapses to single column below 900px
- [ ] Hero background position is `center top` on mobile
- [ ] Typography scales appropriately at breakpoints

## Common Tasks

### Adding a New Service Page
1. Copy existing service page HTML structure (e.g., `creche.html`)
2. Update hero background image path in inline or CSS
3. Update page title, meta tags, and content sections
4. Add link to navigation dropdown in ALL pages (`<ul class="dropdown">`)
5. Verify footer is identical to other pages

### Modifying Mobile Menu
- Hamburger icon: `.nav-toggle` with `::before`/`::after` pseudo-elements
- Menu container: `#main-menu` styling in `@media (max-width:720px)` block
- Links: `.top-nav ul#main-menu > li > a` for main items
- Submenus: `.top-nav .dropdown a` for nested items

### Adding a New Partnership
1. Add logo to `assets/parcerias/` (prefer PNG with transparent background or WebP)
2. Add partnership card to `index.html` in `.partnerships-track`
3. Use `.partnership-logo-inverted` class if logo needs color inversion (white logos)
4. Update carousel JavaScript if changing number of visible cards

### Adding a New Language
1. Add flag icon to `assets/paises/` (both hex and squared versions)
2. Update `js/lang-switcher.js` with new translation object (e.g., `translations.de`)
3. Add language option to dropdown in all HTML pages
4. Test dropdown scroll behavior with additional language

### Responsive Typography Adjustments
Typography scales down at breakpoints via CSS variable overrides:
```css
@media (max-width: 720px) {
  :root {
    --font-size-h1: 2.5rem;  /* Down from 5.61rem */
    --font-size-h2: 2rem;    /* Down from 4.21rem */
    /* etc. */
  }
}
```

### Changing Hero Background
- Desktop: Update `background-image: url('../assets/fotos/...')` in `.hero` class
- Mobile: Ensure `background-position: center top` is set in mobile media query
- Current image: `background 2 - cópia 2.jpeg`

## Project-Specific Conventions

### File Naming
- HTML files: lowercase with spaces (e.g., `passeios individuais.html`)
- Image files: mix of Portuguese names with spaces and English (e.g., `background 2 - cópia 2.jpeg`)
- CSS/Asset references: Use exact names including spaces and special characters

### Language & Content
- **All user-facing text in Portuguese** (PT-PT)
- Contact info: WhatsApp +351 934 527 652, email: caoderuageral@gmail.com
- Social media: Instagram @cao_na_rua, Facebook /caoderualisboa/
- Location: Maceira, Sintra

### Code Style
- CSS: Minimal spacing, properties on single lines where possible (minified style)
- HTML: Semantic tags (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`)
- Accessibility: `aria-label`, `aria-expanded`, `aria-controls` on interactive elements
- No build process: Direct file editing, no preprocessors

## Things to Avoid
- Don't add build tools or frameworks - this is intentionally vanilla HTML/CSS/JS
- Don't break footer consistency - it must be identical across all pages
- Don't forget mobile testing - hero section and navigation have critical mobile-specific behavior
- Don't modify font files or add external font CDNs - fonts are self-hosted in `assets/fonts/`
