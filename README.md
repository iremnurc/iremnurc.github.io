# Profile01

A modern, minimalist GraphQL-powered profile dashboard for Zone01 platform users. Built with vanilla JavaScript, Tailwind CSS, and Go.

## Features

- **Clean Authentication**: Secure JWT-based login with Zone01 platform credentials
- **Real-time Statistics**: View your username, total XP, and audit ratio at a glance
- **Interactive Charts**: 
  - XP Progress Over Time: Track your XP growth with an animated line chart
  - Skills Overview: Visualize your skill distribution with a radar chart
- **Modern UI**: Sharp, minimalist design with neon yellow accents on dark background
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Go (v1.16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd graphql
```

2. Install dependencies:
```bash
npm install
```

3. Build the CSS:
```bash
npm run build:css
```

### Running the Application

Start both frontend and backend servers:

```bash
npm run dev
```

This will start:
- Frontend server on `http://localhost:3000`
- Backend API proxy on `http://localhost:8080`

**Important**: Visit `http://localhost:3000` in your browser. The backend server on port 8080 is an API proxy and should not be accessed directly.

### Development Commands

- `npm run build:css` - Build Tailwind CSS
- `npm run watch:css` - Watch and rebuild CSS on changes
- `npm run start:frontend` - Start frontend server only
- `npm run start:backend` - Start backend server only
- `npm run dev` - Start both servers concurrently
- `npm run build` - Build for production

## Project Structure

```
graphql/
├── index.html          # Main HTML file
├── css/
│   ├── input.css      # Tailwind source
│   └── output.css     # Compiled CSS (generated)
├── js/
│   ├── config.js      # API configuration
│   ├── auth.js        # Authentication logic
│   ├── api.js         # GraphQL API calls
│   ├── queries.js     # GraphQL query definitions
│   ├── router.js      # Client-side routing
│   ├── login.js       # Login page logic
│   ├── profile.js     # Profile page logic
│   └── charts.js      # SVG chart generation
└── server/
    ├── main.go        # Go server entry point
    ├── handlers/      # Request handlers
    └── middleware/    # CORS middleware
```

## Authentication

The application uses JWT tokens obtained from the Zone01 platform signin endpoint. You can log in with either:
- Username and password
- Email and password

The JWT token is stored locally and used for all GraphQL API requests.

## GraphQL Queries

The application queries the Zone01 GraphQL API for:
- User information (id, login)
- XP transactions (total XP calculation)
- Audit transactions (audit ratio calculation)
- Progress data (for XP progress chart)
- Skill transactions (for skills radar chart)

## Technologies

- **Frontend**: Vanilla JavaScript (ES6 modules), Tailwind CSS
- **Backend**: Go (Gin framework)
- **Charts**: Custom SVG generation
- **Authentication**: JWT (Bearer token)
- **API**: GraphQL

## Design

Profile01 features a minimalist design with:
- Sharp edges (no border radius)
- Color palette: Black (#171616), Light Gray (#F0EFEF), Neon Yellow (#DDFF30)
- Typography: Space Grotesk (sans-serif), JetBrains Mono (monospace)
- Interactive gradient blob animation on login page
- Custom scrollbar styling
- Neon yellow text selection

## License

This project is created by [iremnurc](https://github.com/iremnurc).
