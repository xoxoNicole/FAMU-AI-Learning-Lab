# FAMU AI Literacy Lab | Strategic Portal

This laboratory empowers Florida A&M University faculty with strategic AI literacy and administrative drafting capabilities.

## 🏁 Final Launch Checklist

Congratulations! You have successfully deployed the institutional portal. Below is your verification guide.

### 1. 🔐 AI "Secret" Key - REQUIRED
Your AI features (Nicole, Drafting, etc.) are powered by your private Gemini key. Because Firebase reserves certain names, we use a custom name.
- **Go to**: Firebase Console > App Hosting > `famu-ai-literacy-lab` > **Environment**.
- **Action**: Click "Add variable".
- **Key**: `GEMINI_API_KEY` (Important: Do not use GOOGLE_ prefix).
- **Value**: Paste your key from Google AI Studio.
- **Type**: Select **Secret**.

### 2. 🌐 DNS Configuration (GoDaddy) - VERIFIED
The domain `famu.theaiacademy.co` should be associated with the following records in GoDaddy:
- **A Record**: `famu` -> `35.219.200.0`
- **TXT Record**: `famu` -> `fah-claim=002...`
- **CNAME**: `_acme-challenge...` -> `5b0e...`

**IMPORTANT**: Ensure any old CNAME for `famu` (pointing to `studio-`) is **REMOVED** from GoDaddy to prevent routing conflicts.

### 3. 🚀 Post-Launch Verification
1. **Visit the Site**: Go to [https://famu.theaiacademy.co](https://famu.theaiacademy.co).
2. **Login/Register**: Create a faculty account to test the license provisioning system.
3. **Talk to Nicole**: Visit the "Talk to Nicole" tab. If she responds with strategic advice, your API Key is working perfectly.
4. **Draft a Memo**: Use the "AI Strategist Lab" to ensure the drafting engine is calibrated.

---
*Built for Florida A&M University by The AI Academy. Strategic Institutional Excellence, Delivered.*
