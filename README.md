"# 🛒 TakeCart — Ecommerce Solutions UI

A full-featured React + Redux Toolkit single-page ecommerce application with product listing, product detail views, shopping cart, multi-step checkout, and user authentication.

---

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Redux Toolkit | 2 | State management |
| React Redux | 9 | Redux ↔ React bindings |
| React Router DOM | 7 | Client-side routing |
| Create React App | — | Project scaffold & build tooling |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
npm install
npm start          # Development server at http://localhost:3000
```

### Build

```bash
CI=false npm run build   # Production bundle in /build
```

### Test

```bash
CI=true npm test         # Run Jest test suite
```

---

## Project Structure

```
src/
├── components/
│   ├── Common/          # Navbar, Footer, Breadcrumb, ProtectedRoute,
│   │                    #   ErrorBoundary, Notifications
│   └── Products/        # ImageGallery, ProductInfoPanel, VariantsSelector,
│                        #   AddToCartSection, ProductActionsBar, ProductCard,
│                        #   ProductDescription, ShippingInfo, ProductRating,
│                        #   ReviewsSection, RelatedProducts, QuickViewModal
├── data/
│   └── products.js      # Static product catalogue (50+ items)
├── pages/
│   ├── Products.js      # Home / product listing with search, filter, sort
│   ├── ProductDetail.js # Full product detail page
│   ├── Cart.js          # Shopping cart
│   ├── Checkout.js      # Multi-step checkout (Shipping → Payment → Review)
│   ├── OrderConfirmation.js
│   ├── Login.js
│   └── Register.js
├── redux/
│   ├── store.js
│   └── slices/
│       ├── authSlice.js      # User authentication state
│       ├── productSlice.js   # Product catalogue, filters, search, pagination
│       ├── cartSlice.js      # Shopping cart with variant-aware line items
│       ├── orderSlice.js     # Order history and current order
│       ├── checkoutSlice.js  # Multi-step checkout state
│       └── uiSlice.js        # Dark mode, sidebar, notifications
├── styles/               # Per-page / per-section CSS files
├── utils/
│   └── imageHelpers.js   # getImageUrl, getColorValue, getStarArray, formatPrice
├── App.js                # Root component, routing, theme binding
└── index.js
```

---

## Features

### Shopping
- **Product listing** — search, category filter, price range filter, rating filter, in-stock filter, sort, and pagination
- **Product detail** — image gallery with lightbox, variant selection (size/colour), quantity selector, add to cart, customer reviews with voting and write-a-review form, related products, quick-view modal
- **Shopping cart** — quantity controls, item removal, automatic shipping/tax calculation, free-shipping threshold indicator

### Checkout
- Multi-step checkout: **Shipping → Payment → Review → Confirmation**
- Form validation at each step
- Mock payment processing (demo mode)

### Authentication
- Login and Register pages with client-side form validation
- Protected routes (Checkout, Order Confirmation) redirect to Login if unauthenticated
- Auth token persisted in `localStorage` via Redux store `preloadedState`

### UI/UX
- **Dark mode** — toggled from the Navbar; CSS custom properties automatically restyle all components
- **Toast notifications** — non-blocking alerts for share errors, size-guide prompts, report actions
- **Responsive design** — mobile-first layouts, hamburger Navbar, adaptive grids

---

## Authentication (Demo Mode)

This project uses **mock authentication** — there is no backend. Any well-formed email address + password of 6+ characters will sign you in. A JWT-like token is stored in `localStorage`.

---

## Environment Variables

No environment variables are required to run the project. All data is sourced from the static `src/data/products.js` file.

---

## Known Limitations

- **No real backend** — all data is static; orders are stored only in Redux state and are lost on page refresh.
- **`@testing-library/user-event` v13** — kept at v13 due to CRA compatibility; upgrade to v14+ when migrating away from CRA.
- **`web-vitals` v2** — kept at v2 to avoid breaking the `getFID` import in `reportWebVitals.js` (removed in v3).
" 
