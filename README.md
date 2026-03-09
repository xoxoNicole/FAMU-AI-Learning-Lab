# FAMU AI Literacy Lab | Strategic Portal

This laboratory empowers Florida A&M University faculty with strategic AI literacy and administrative drafting capabilities.

## 🚀 Deployment Instructions

To launch this project, you must push your code from this environment to your GitHub account.

### 1. Switch to CODE VIEW
In the top right corner of this screen (near the blue **Publish** button), click the **`</>`** icon to switch from the preview to the code editor.

### 2. Open the CORRECT Terminal
Once you are in the code view, open the terminal at the bottom of the screen:
- **Shortcut (Mac)**: Press `Command` + `J`
- **Shortcut (Windows/Linux)**: Press `Control` + `J`
- **Manual**: Click the **Hamburger Menu (three lines)** in the top-left corner, then select **Terminal** > **New Terminal**.

### 3. Run these commands
Copy and paste each line into the terminal at the bottom of your screen and press **Enter** after each one. 

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/xoxoNicole/FAMU-AI-Learning-Lab.git
git push -u origin main
```

### 4. Return to the Firebase Console
Once the commands finish, return to the Firebase setup screen. Click "Refresh list" or simply type `main` again in the branch box. It should now be recognized and turn blue.

## 🛠 Tech Stack
- **AI**: Genkit with Vertex AI (Gemini 1.5 Pro)
- **Framework**: Next.js 15 (App Router)
- **Database**: Firestore
- **Deployment**: Firebase App Hosting
