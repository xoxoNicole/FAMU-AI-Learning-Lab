# FAMU AI Literacy Lab | Strategic Portal

This laboratory empowers Florida A&M University faculty with strategic AI literacy and administrative drafting capabilities.

## 🚀 Deployment Instructions

To launch this project, you must first push your code from this environment to your GitHub account.

### 1. Open the CORRECT Terminal
Do NOT use the terminal on your Mac computer. Use the one inside this browser window:
- **Shortcut (Mac)**: Press `Command` + `J`
- **Shortcut (Windows/Linux)**: Press `Control` + `J`
- **Manual**: Look at the menu at the very top of this window for **View > Terminal**.

### 2. Run these commands
Copy and paste each line into the terminal at the bottom of your screen and press **Enter** after each one. 

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/xoxoNicole/FAMU-AI-Learning-Lab.git
git push -u origin main
```

### 3. Return to the Firebase Console
Once the commands finish, return to the Firebase setup screen. Click "Refresh list" or simply type `main` again in the branch box. It should now be recognized and turn blue.

## 🛠 Tech Stack
- **AI**: Genkit with Vertex AI (Gemini 1.5 Pro)
- **Framework**: Next.js 15 (App Router)
- **Database**: Firestore
- **Deployment**: Firebase App Hosting
