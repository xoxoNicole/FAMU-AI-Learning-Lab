# FAMU AI Literacy Lab | Antigravity Edition

This is the strategic administrative laboratory for Florida A&M University, powered by Vertex AI and Nicole's Digital Twin.

## 🚀 Antigravity Deployment & GitHub Integration

To push this project to your GitHub and begin the Antigravity maintenance loop:

1. **Initialize Git & Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initialize AI Literacy Lab with Vertex AI Digital Twin"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Configure Vertex AI Grounding**:
   - Create a Google Cloud Storage bucket named `nicole-ip-memory`.
   - Upload your proprietary PDFs/transcripts.
   - Connect the bucket to **Vertex AI Search and Conversation** in the Google Cloud Console.

3. **Maintenance Loop**:
   - Use the **Digital Twin Lab** in the dashboard to test Nicole's responses.
   - Use the "Antigravity Maintenance" button in the UI to view logs and refinement metrics.

## 🛠 Tech Stack
- **AI**: Genkit with Vertex AI (Gemini 1.5 Pro)
- **Framework**: Next.js 15 (App Router)
- **Database**: Firestore (Grounded RAG)
- **Styling**: Tailwind CSS & ShadCN UI
