# FAMU AI Literacy Lab | Strategic Portal

This laboratory empowers Florida A&M University faculty with strategic AI literacy and administrative drafting capabilities.

## 🚀 Final Launch Checklist

Follow these steps to ensure the client environment is fully operational.

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

### 2. 🌐 DNS Configuration (GoDaddy) - VERIFIED
You have already added the following records to GoDaddy:

| Type | Name (Host) | Value (Points to) |
| :--- | :--- | :--- |
| **A** | `famu` | `35.219.200.0` |
| **TXT** | `famu` | `fah-claim=002-02-285f156f-ee4e-4e9a-a36a-7d2c26a8a035` |
| **CNAME** | `_acme-challenge_rvlyuquknfzxvy4.famu` | `5b0e6eaf-d5a6-4c3f-a1d5-ecdcf5021ded.6.authorize.certificatemanager.goog.` |

**IMPORTANT**: Ensure the old CNAME for `famu` (pointing to `studio-`) is **REMOVED** from GoDaddy.

### 3. 🏁 Verify the Build
1. Go to the **Dashboard** in App Hosting.
2. Once the progress bar says "Success," your professional portal is live at `famu.theaiacademy.co`.
3. Test the "Talk to Nicole" feature once the AI Secret is added.

---
*Built for Florida A&M University by The AI Academy.*
