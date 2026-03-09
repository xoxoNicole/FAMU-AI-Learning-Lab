# FAMU AI Literacy Lab | Strategic Portal

This laboratory empowers Florida A&M University faculty with strategic AI literacy and administrative drafting capabilities.

## 🚀 Final Launch Checklist

Follow these steps while your first build is in progress to ensure everything is ready for the client.

### 1. 🔐 Set your AI "Secret" Key
Your AI features (Nicole, Drafting, etc.) will not work until you add your private Gemini key to the cloud.
1. Go to the **App Hosting** dashboard in the Firebase Console.
2. Click on your backend (**famu-ai-literacy-lab**).
3. Go to **Settings** > **Environment variables**.
4. Click **Add variable**:
   - **Key**: `GOOGLE_GENAI_API_KEY`
   - **Value**: Paste your key from [Google AI Studio](https://aistudio.google.com/app/apikey).
   - **Type**: Select **Secret** (this keeps your key encrypted and safe).
5. Click **Save**.

### 2. 🌐 Connect the Subdomain
1. In the same **Settings** area, find the **Domains** section.
2. Click **Connect Domain** and enter `famu.theaiacademy.co`.
3. Firebase will provide a CNAME value (e.g., `ghs.googlehosted.com`).
4. Go to your domain provider (GoDaddy, etc.) and add a **CNAME** record:
   - **Name**: `famu`
   - **Value**: Paste the code from Firebase.
5. Save the DNS record. It may take 30–60 minutes for the internet to update.

### 3. 🏁 Verify the Build
1. Go to the **Dashboard** in App Hosting.
2. Once the blue progress bar reaches the end and says "Success," click the link.
3. Your professional portal is now live at `famu.theaiacademy.co`.

---
*Built for Florida A&M University by The AI Academy.*
