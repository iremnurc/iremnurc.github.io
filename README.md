# Zone01 GraphQL Profile

A modern profile page built with Vanilla JS, Tailwind CSS, and Go backend, displaying user data from the Zone01 GraphQL API.

## Quick Start

```bash
npm install
npm run build:css
npm run dev
```

Open: `http://localhost:3000`

Login with your Zone01 credentials (username or email + password).

## Features

- 🔐 **JWT Authentication** - Secure login with Zone01 credentials
- 👤 **User Profile** - Three key information sections (Username, Total XP, Audit Ratio)
- 📊 **XP Progress Chart** - Line chart showing cumulative XP over time (excluding piscine exercises)
- 🎯 **Skills Radar Chart** - Spider chart displaying 8 key technical skills
- 📈 **Audit Ratio** - Shows your audit performance (audits given/received)
- 💾 **Total XP** - Displayed in MB format (e.g., 1.27 MB)
- ✨ **Pure SVG Charts** - Custom-built interactive charts without external libraries

## Project Structure

```
index.html          # Single page (login + profile views)
input.css           # Tailwind source
css/output.css      # Built CSS (run build:css first)
js/
  config.js         # API endpoints configuration
  queries.js        # GraphQL query definitions
  router.js         # Hash routing (#login, #profile)
  auth.js           # JWT login/logout
  login.js          # Login form handling
  api.js            # API functions (uses queries.js)
  profile.js        # Profile logic
  charts.js         # SVG charts (line chart + radar chart)
server/
  main.go           # Go proxy (port 8080)
  handlers/proxy.go # Auth & GraphQL forwarding
  middleware/cors.go # CORS handling
```

## NPM Scripts

- `npm run dev` - Start everything (CSS watch + backend + frontend)
- `npm run build:css` - Build Tailwind CSS once
- `npm run watch:css` - Watch CSS changes
- `npm run start:frontend` - Frontend server (port 3000)
- `npm run start:backend` - Go backend (port 8080)
- `npm run build` - Production build (builds CSS)

## Technologies Used

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, Tailwind CSS
- **Backend**: Go (Golang) with net/http
- **API**: GraphQL
- **Charts**: Pure SVG (custom implementation)
- **Authentication**: JWT (JSON Web Tokens)
- **Routing**: Hash-based client-side routing

