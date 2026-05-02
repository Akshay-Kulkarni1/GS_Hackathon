# ClearVest

ClearVest is a beginner-friendly investment planning web app built for the GS Hackathon.
It helps users complete a short onboarding flow, view a personalized dashboard, run "what-if" scenarios, and see a custom action plan.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Recharts
- lucide-react

## Project Structure

```text
GS_Hackathon-1/
|- clearvest/
|  |- src/
|  |  |- components/
|  |  |- context/
|  |  |- screens/
|  |  |- steps/
|  |  |- App.jsx
|  |  |- main.jsx
|  |- package.json
|  |- .env.example
|- README.md
```

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+

## Setup

1. Go to the app folder:

   ```bash
   cd clearvest
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your environment file:

   - Copy `.env.example` to `.env`
   - Add your Groq API key:

   ```env
   VITE_GROQ_API_KEY=your_real_groq_api_key
   ```

## Run Locally

From the `clearvest` folder:

```bash
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`).

## Build for Production

From the `clearvest` folder:

```bash
npm run build
npm run preview
```

## Core Features

- 2-second splash screen with brand intro
- 3-step onboarding wizard and result screen
- Dashboard with profile greeting and allocation chart
- What-If scenario engine with severity controls
- AI advisor explanation (Groq API)
- Personalized "My Plan" screen
- Bottom tab navigation across Dashboard, What-If, and My Plan

## Environment Notes

- The AI advisor uses `import.meta.env.VITE_GROQ_API_KEY`.
- If no API key is provided, the app shows a friendly in-app message and does not send the API request.

## Troubleshooting

- **`vite is not recognized`**
  - Run `npm install` inside `clearvest`.
- **AI advisor unavailable**
  - Check `.env` exists in `clearvest` and `VITE_GROQ_API_KEY` is set correctly.
- **Port already in use**
  - Stop the process using the port or run Vite with a different port:
    `npm run dev -- --port 5174`

## Hackathon Scope

This project is intended as a learning/demo application and not financial advice.