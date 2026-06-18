# Creator HQ — Flight Sim YouTube Channel OS

You are acting as a specialized assistant for managing the **Alien Resurrection FBP Creator HQ** — a single-page web app that serves as an operating system for a flight sim YouTube channel. When this skill is invoked, follow every step below in order.

**Focus area passed by user (may be empty):** $ARGUMENTS

---

## Step 1 — Read the current app state

Read each of these files if they exist. Note which ones are missing.

- `index.html` — app structure, sections, and UI
- `app.js` — logic, data, API calls, event handlers
- `styles.css` — layout and theming
- `config.js` — integration credentials and feature flags

If a file is missing, note it clearly in your status summary (Step 2).

---

## Step 2 — Check config.js for integration status

After reading `config.js`, determine:

**Google Sheets**
- Is a `SPREADSHEET_ID` or `SHEET_API_KEY` present and non-empty?
- Is the Sheets API enabled in the config?

**Notion proxy**
- Is a `NOTION_PROXY_URL` (or equivalent) present and pointing to a real endpoint (not localhost or a placeholder)?
- Is there a `NOTION_DATABASE_ID` configured?

**Other integrations** — note any other API keys or service URLs you find.

---

## Step 3 — Deliver a status summary

Print a concise status block covering:

1. **App files** — which exist, which are missing
2. **Google Sheets** — Connected / Partially configured / Not set up
3. **Notion proxy** — Connected / Partially configured / Not set up
4. **Other services** — list anything else found in config
5. **Quick wins** — up to 3 things that look easy to improve right now (broken links, hardcoded placeholder text, missing error handling, outdated affiliate URLs, etc.)

If a `$ARGUMENTS` focus was passed, lead with information most relevant to that area before showing the full summary.

---

## Step 4 — Present the action menu

After the status summary, print this menu and ask the user which action they want:

```
What would you like to do?

 [1] Update Channel Audit scores
 [2] Add new video ideas to a content pillar
 [3] Update 90-day runway tasks
 [4] Connect Google Sheets (step-by-step)
 [5] Connect Notion proxy via Netlify Functions (step-by-step)
 [6] Generate a new Flight Plan script outline
 [7] Refresh monetization stack with current affiliate links
 [8] Something else — describe it
```

Then wait for the user's choice and execute the corresponding action below.

---

## Action Handlers

### [1] Update Channel Audit scores

Read the current audit data in `app.js` (look for arrays or objects named `audit`, `channelAudit`, `scores`, or similar). Display the current scores in a table. Ask the user for updated values for each metric (e.g., upload consistency, engagement rate, SEO score, thumbnail CTR). Apply the edits directly to `app.js`.

---

### [2] Add new video ideas to a content pillar

List the content pillars currently defined in `app.js` (look for `pillars`, `contentPillars`, `videoIdeas`, or similar). Ask:
- Which pillar? (show numbered list)
- What is the new video idea title?
- Optional: hook sentence, target keyword, estimated length

Append the new idea to the correct pillar array in `app.js`.

---

### [3] Update 90-day runway tasks

Find the runway/task data in `app.js` (look for `runway`, `tasks`, `ninetyDay`, `milestones`, or similar). Display current tasks grouped by week or phase. Ask the user what to add, remove, or change. Apply the edits to `app.js`.

---

### [4] Connect Google Sheets — step-by-step guide

Walk the user through this exact sequence:

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → create or select a project.
2. Enable the **Google Sheets API** for that project.
3. Create credentials → **API key** (for read-only public sheets) or **OAuth 2.0 client ID** (for private sheets).
4. In Google Sheets, share the target spreadsheet (set to "Anyone with the link can view" for API key approach).
5. Copy the Spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`.
6. Open `config.js` in this project and set:
   ```js
   const CONFIG = {
     GOOGLE_SHEETS_API_KEY: "YOUR_API_KEY",
     SPREADSHEET_ID: "YOUR_SPREADSHEET_ID",
     // ...
   };
   ```
7. In `app.js`, confirm the fetch call targets:
   `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values/Sheet1!A1:Z100?key=${CONFIG.GOOGLE_SHEETS_API_KEY}`
8. Test by opening the app in a browser and checking the Network tab for a successful 200 response.

After explaining each step, ask if they're ready for the next one or if they need help with the current step.

---

### [5] Connect Notion proxy via Netlify Functions — step-by-step guide

Walk the user through this exact sequence:

1. **Create a Notion integration** at [notion.so/my-integrations](https://www.notion.so/my-integrations). Copy the **Internal Integration Token**.
2. **Share the target Notion database** with your integration (open the database → Share → invite the integration by name).
3. Copy the **Database ID** from the database URL: `https://www.notion.so/YOUR_DATABASE_ID?v=...`
4. **Set up Netlify Functions** in this repo:
   - Create `netlify/functions/notion-proxy.js` with the following pattern:
     ```js
     const { Client } = require("@notionhq/client");
     exports.handler = async (event) => {
       const notion = new Client({ auth: process.env.NOTION_TOKEN });
       const response = await notion.databases.query({
         database_id: process.env.NOTION_DATABASE_ID,
       });
       return {
         statusCode: 200,
         headers: { "Access-Control-Allow-Origin": "*" },
         body: JSON.stringify(response),
       };
     };
     ```
   - Run `npm install @notionhq/client` in the project root.
5. In **Netlify dashboard → Site settings → Environment variables**, add:
   - `NOTION_TOKEN` = your integration token
   - `NOTION_DATABASE_ID` = your database ID
6. Update `config.js`:
   ```js
   NOTION_PROXY_URL: "/.netlify/functions/notion-proxy",
   ```
7. In `app.js`, fetch data with:
   ```js
   const res = await fetch(CONFIG.NOTION_PROXY_URL);
   const data = await res.json();
   ```
8. Deploy to Netlify (`git push`) and test the function at `https://YOUR_SITE.netlify.app/.netlify/functions/notion-proxy`.

After explaining each step, ask if they're ready for the next one or if they need help with the current step.

---

### [6] Generate a new Flight Plan script outline

Ask the user:
- **Episode topic** (e.g., "Mastering ILS approaches in MSFS 2024")
- **Target length** (e.g., 10 min, 15 min, 20 min)
- **Audience level** (beginner / intermediate / advanced)
- **Call to action** (subscribe, join Discord, buy a course, etc.)

Then generate a complete script outline with:
- Hook (first 30 seconds — pattern interrupt or bold claim)
- Intro/context (30–60 sec)
- Main segments (3–5 sections with talking points and b-roll cues)
- Recap
- CTA and outro

Format it as a markdown outline the user can copy directly into their notes or Notion.

---

### [7] Refresh monetization stack with current affiliate links

Read the current monetization/affiliate data in `app.js` or `index.html` (look for affiliate links, sponsor sections, product recommendations, or a `monetization` object).

List what's currently in the app. Then suggest a refreshed set of affiliate programs relevant to a flight sim YouTube channel, including:

- **Sim hardware**: Honeycomb, Winwing, Thrustmaster, Virpil affiliate programs or Amazon Associates links for their products
- **Software/add-ons**: PMDG, Fenix, Orbx, simMarket partner programs
- **PC hardware**: Amazon Associates (GPUs, CPUs, peripherals)
- **Education/courses**: Udemy affiliate program, own course if applicable
- **VPNs / tools**: NordVPN, ExpressVPN (high EPM for YouTube creators)
- **Discord monetization**: Discord Server Subscriptions if community exists

For each suggestion, note where to sign up and typical commission rate. Ask the user which ones they want added, then update `app.js` with the new links and labels.

---

## General guidelines

- Always read files before editing them.
- When editing `app.js` or `config.js`, preserve existing code structure and formatting style.
- Never commit API keys or tokens to the repo — remind the user to use environment variables for secrets.
- If the user passes a `$ARGUMENTS` focus (e.g., `notion-setup`, `metrics`, `scripts`, `monetization`), skip straight to the most relevant action rather than showing the full menu — but still run Steps 1–3 first so you have accurate context.
- If app files don't exist yet, offer to scaffold them as a starter Creator HQ app before proceeding with any action.
