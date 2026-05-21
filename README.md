# NeuroBrief AI - Smart Context-Aware Content Summarizer

**NeuroBrief AI** is a production-ready, futuristic AI SaaS platform that extracts deep semantic insights, visual concept mappings, study guides, and review quizzes from text or uploaded PDF publications. It utilizes a separate React.js + Vite client and a Node.js + Express serverless-ready backend, powered by Google Gemini and a custom local NLP processing core.

---

## 🚀 Key Differentiating Features

1. **AI Summary Studio**: Paste substantive text or drop PDF/Text documents (via Multer memory-buffers) to generate high-fidelity, dual-layered summaries: 150-word context synthesis and actionable executive briefings.
2. **AI Highlight Detector**: Automatically parses text to identify definitions, vocabulary terms, and critical bold claims, highlighting them in clean inline hover pills with tooltips.
3. **Smart Question Generator**: Dynamically generates multi-choice interactive flashcard quiz items. Features instant click grading (emerald/pink halos) and citations explaining the underlying AI logic.
4. **AI Knowledge Graph**: An interactive, custom concentric SVG relationship map displaying keywords and conceptual associations grouped visually with hover tooltips and dynamic ring nodes.
5. **Semantic Cosine Search**: A mathematically complete, local Bag-of-Words Cosine Similarity engine that scores query matches against historical summaries saved in your memory vaults.
6. **Analytics Board**: Sleek visual grid displaying reading minutes saved, processed word totals, sentiment ratio pie charts, and topic frequency histograms powered by Recharts.
7. **Memory Vault**: Caches document summaries securely in MongoDB, with single-click workspace loader integrations to restore any summary immediately.

---

## 🛠️ Technology Stack

### Frontend Client (`frontend/`)
- React.js (Vite Bundle)
- Tailwind CSS (Glowing Neon Glassmorphic Custom Theme)
- Recharts (Interactive Visualizations)
- Framer Motion (Smooth Page Transitions)
- Axios (Interceptors & API mapping)
- Lucide React (Cyber Icons Pack)
- React Hot Toast (Glassmorphism notifications)

### Backend Server (`backend/`)
- Node.js + Express.js (Vercel Serverless-compatible routing)
- MongoDB Compass + Mongoose (Local Database)
- PDF-Parse (In-Memory Buffer Extraction)
- JWT + Bcryptjs (Secure Authentication)
- Multer (Memory Storage)
- Google Generative AI (Gemini 1.5/2.0 API connection)
- Local NLP Fallback Engine (Advanced Heuristics Engine)

---

## 📂 Project Architecture

```
neuro ai/
├── frontend/             # Client React + Vite Code
│   ├── src/
│   │   ├── components/   # KnowledgeGraph and other UI elements
│   │   ├── context/      # AuthContext and SummaryContext
│   │   ├── layouts/      # Dashboard Sidebar Layout
│   │   ├── pages/        # Login, Studio Workspace, Vault, Search, Charts
│   │   ├── routes/       # JWT Protected Routes
│   │   ├── index.css     # Dark Glassmorphism Styling Tokens
│   │   └── App.jsx       # App bootstrap & Router maps
│   ├── package.json
│   ├── vite.config.js    # Local dev proxy map
│   └── vercel.json       # SPA rewrite rules
│
└── backend/              # Express API Serverless Functions
    ├── api/
    │   ├── config/       # db.js Mongoose connectors
    │   ├── controllers/  # Auth, Summary, Analytics, Note engines
    │   ├── middleware/   # Token checkers and PDF Multer buffers
    │   ├── models/       # User, Summary, UploadDoc, Analytics, Notes schemas
    │   ├── routes/       # API router linkages
    │   ├── services/     # Gemini AI wrappers, NLP engines, PDF parses
    │   ├── utils/        # JWT token handlers, Cosine Similarity math helpers
    │   └── index.js      # Main API Endpoint
    ├── package.json
    ├── vercel.json       # Serverless function compiler mapping
    └── .env.example
```

---

## 💻 Step-by-Step Local Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed and running locally
- [MongoDB Compass](https://www.mongodb.com/try/download/compass) for visual database management

### Step 1: Database Verification
1. Ensure your local MongoDB server is active. By default, it listens on:
   `mongodb://127.0.0.1:27017`
2. Open MongoDB Compass and connect to verify. Mongoose will automatically initialize the database `neurobriefai` upon starting the server.

### Step 2: Backend Setup
1. Navigate into the `backend/` directory.
2. Initialize environment configurations:
   - Make a copy of `.env.example` and name it `.env`
   - Prefilled Defaults:
     ```env
     PORT=5000
     MONGO_URI=mongodb://127.0.0.1:27017/neurobriefai
     JWT_SECRET=neurobrief_quantum_secret_key_987234
     GEMINI_API_KEY=your_gemini_api_key_here
     ```
     *(Note: If `GEMINI_API_KEY` is left blank, the app will seamlessly run the local NLP Fallback Engine!)*
3. Install dependencies:
   ```bash
   npm install
   ```
4. Launch the developer server:
   ```bash
   npm run dev
   ```
   *(The server will print: `[Database] MongoDB Connected: 127.0.0.1` and `[Server] NeuroBrief AI running on port 5000`)*

### Step 3: Frontend Setup
1. Navigate into the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the client server:
   ```bash
   npm run dev
   ```
4. Open your browser to: `http://localhost:3000`
5. Access immediately using the Demo Portal credentials shown on screen, or register a new profile!

---

## ☁️ Vercel Serverless Deployment Guide

NeuroBrief AI is structured from the ground up for seamless, free hosting on **Vercel**.

### Backend Deployment (`backend/`)
1. Ensure `vercel.json` exists in `backend/` pointing functions to `api/index.js`.
2. Connect your repository to Vercel.
3. Configure the **Build & Development Settings**:
   - Framework Preset: **Other** or **Node.js**
   - Output Directory: default
4. Add **Environment Variables** in Vercel settings:
   - `MONGO_URI`: Your MongoDB database connection string (if using MongoDB Atlas)
   - `JWT_SECRET`: A secure random secret string
   - `GEMINI_API_KEY`: Your Google Gemini API token
5. Trigger deploy!

### Frontend Deployment (`frontend/`)
1. Ensure `vercel.json` exists in `frontend/` redirecting rewrites to `index.html`.
2. Configure **Build & Development Settings**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy!
