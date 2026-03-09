# FAMU AI Literacy Lab | Strategic Portal

This laboratory empowers Florida A&M University faculty with strategic AI literacy and administrative drafting capabilities.

## 🚀 Deployment Checklist

### 1. Wait for the Build
After clicking "Finish" in the Firebase Console, the "App Hosting" dashboard will show a progress bar. It usually takes **5–10 minutes** to complete the first launch.

### 2. 🔐 Set your AI "Secret" Key
Your AI features won't work until you add your private Gemini key to the cloud. **Do not put this in GitHub.**
1. Go to the **App Hosting** dashboard in the Firebase Console.
2. Click on your backend (**famu-ai-literacy-lab**).
3. Go to **Settings** > **Environment variables**.
4. Click **Add variable**:
   - **Key**: `GOOGLE_GENAI_API_KEY`
   - **Value**: Paste your key from [Google AI Studio](https://aistudio.google.com/app/apikey).
   - **Type**: Select **Secret** (this is very important for security).
5. Click **Save**.

### 3. Connect the Domain
1. In the same **Settings** area, find the **Domains** section.
2. Add `famu.theaiacademy.co`.
3. Follow the instructions to add the **CNAME** record at your domain provider (e.g., GoDaddy).

## 🛠 Tech Stack
- **AI**: Genkit with Vertex AI (Gemini 1.5 Pro)
- **Framework**: Next.js 15 (App Router)
- **Database**: Firestore
- **Deployment**: Firebase App Hosting

---
*Built for Florida A&M University by The AI Academy.*
