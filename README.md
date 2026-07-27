# CareerMantra

CareerMantra is a career-guidance project containing career/personality assessment, recommendations, skills/resources, jobs, workshops, goals, portfolio tools, badges, and an AI career chatbot.

## Main technologies

- HTML, CSS, JavaScript
- Firebase Authentication / Firestore client integration
- Python and ML/data scripts
- Node.js + Express chatbot server
- Groq-compatible chat completions API

## Repository structure

- `*.html`, `chatbot.js`, `chatbot.css` — existing frontend pages and chatbot UI
- `chatbot-server/` — Node.js/Express AI chatbot backend
- `*.py` — Python application/model scripts
- `*.csv` — datasets used by the project
- `*.jpg`, `*.png` — project assets
- `requirements.txt` — Python dependencies
- `package.json` — Node.js dependencies
- `.env.example` — example environment configuration (contains no real secrets)

The original source layout is intentionally preserved because the HTML pages use relative file references.

## Security setup

The previously hardcoded Groq key has been removed from tracked source. Before running the chatbot server, set the `GROQ_API_KEY` environment variable in your terminal or deployment platform.

Example (PowerShell):

```powershell
$env:GROQ_API_KEY="your_actual_key"
node chatbot-server/server.js
```

For Render/Vercel or another host, add `GROQ_API_KEY` in the project's Environment Variables/Secrets settings instead of committing it to GitHub.

> Firebase web configuration remains in the frontend where it is required by the Firebase client SDK. Firebase web API keys are identifiers rather than server secrets; security should be enforced with Firebase Authentication, Firestore/Storage Security Rules, API restrictions, and authorized domains.

## Before uploading to GitHub

1. Revoke/rotate the old Groq key because it existed in the original project files and Git history.
2. Do not add `key.env`, `.env`, `node_modules`, or old `.git` data to the repository.
3. Initialize a fresh Git repository from this cleaned folder.

```bash
git init
git add .
git commit -m "Initial clean CareerMantra project"
```

## Chatbot security

The browser does not contain private AI provider tokens. `chatbot.js` sends AI requests to the backend at `http://localhost:3000/chat`, and `chatbot-server/server.js` reads `GROQ_API_KEY` from the server environment. Set that environment variable before starting the chatbot server. For deployment, replace the local chatbot URL with your deployed backend URL.

Any Hugging Face or Groq token that was previously committed or shared should be revoked/rotated before publishing this repository.
