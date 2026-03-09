# FAMU AI Literacy Lab | Strategic Portal

This laboratory empowers Florida A&M University faculty with strategic AI literacy and administrative drafting capabilities.

## 🚀 Deployment Instructions

To launch this project, you must first push your code from IDX to GitHub.

1. **Create a new repository on GitHub** (e.g., `famu-ai-lab`). Do not initialize it with a README or License.
2. **Open the Terminal in IDX** (bottom panel) and run the following commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
3. **Return to the Firebase Console** and click "Next" or re-type `main`. The console will now recognize your code.

## 🛠 Tech Stack
- **AI**: Genkit with Vertex AI (Gemini 1.5 Pro)
- **Framework**: Next.js 15 (App Router)
- **Database**: Firestore
- **Deployment**: Firebase App Hosting
