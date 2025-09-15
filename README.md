# Express AI API

An Express.js API with AI capabilities using Google's Gemini model, designed for deployment on Vercel.

## Features

- 🤖 AI-powered chat endpoint using Gemini
- 💝 Special "What is love?" endpoint
- 🚀 Ready for Vercel deployment
- 📝 TypeScript support
- ✅ Input validation with Zod
- 🌐 CORS enabled

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with your Gemini API key:
   ```
   PORT=3000
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
   ```

3. Run locally:
   ```bash
   npm run dev
   ```

## API Endpoints

### GET /
Returns API information and available endpoints.

### POST /api/chat
Send a message to the AI model.

**Request body:**
```json
{
  "message": "Your question here"
}
```

**Response:**
```json
{
  "success": true,
  "response": "AI response here",
  "timestamp": "2025-09-14T12:00:00.000Z"
}
```

### GET /api/love
Get an AI response to "What is love?"

**Response:**
```json
{
  "success": true,
  "question": "What is love?",
  "response": "AI philosophical response about love",
  "timestamp": "2025-09-14T12:00:00.000Z"
}
```

### GET /health
Health check endpoint.

## Deployment

### Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variable in Vercel dashboard:
   - `GOOGLE_GENERATIVE_AI_API_KEY`: Your Gemini API key

## Environment Variables

- `PORT`: Server port (default: 3000)
- `GOOGLE_GENERATIVE_AI_API_KEY`: Your Google Gemini API key

## Scripts

- `npm run dev`: Start development server with auto-reload
- `npm run build`: Build TypeScript to JavaScript
- `npm start`: Start production server
- `npm run vercel-build`: Build for Vercel deployment