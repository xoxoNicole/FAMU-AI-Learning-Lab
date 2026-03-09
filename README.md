# FAMU AI Literacy Lab | Strategic Portal

This laboratory empowers Florida A&M University faculty with strategic AI literacy and administrative drafting capabilities.

## 🚀 Deployment Instructions

### 1. Push Code to GitHub
Ensure you have run the following commands in the IDX Terminal (`Command + J`):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/xoxoNicole/FAMU-AI-Learning-Lab.git
git push -u origin main
```

### 2. Firebase Console Configuration
In the Firebase Console "App Hosting" setup:
- **Live branch**: Type `main`
- **App root directory**: Type `/`
- **Backend ID**: Type `famu-ai-literacy-lab`

### 3. 🔐 Security & API Keys
Your Firebase configuration in `src/firebase/config.ts` is **public by design**. It is safe to keep in GitHub because security is enforced by **Firebase Security Rules**.

**CRITICAL**: Your AI API Keys (like Gemini) are **private**.
1. Once the deployment finishes, go to the **App Hosting** dashboard in the Firebase Console.
2. Go to **Settings** > **Environment variables**.
3. Add a new variable:
   - **Key**: `GOOGLE_GENAI_API_KEY`
   - **Value**: Your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
4. Select **Secret** as the type to ensure it is encrypted and not visible in logs.

## 🛠 Tech Stack
- **AI**: Genkit with Vertex AI (Gemini 1.5 Pro)
- **Framework**: Next.js 15 (App Router)
- **Database**: Firestore
- **Deployment**: Firebase App Hosting
