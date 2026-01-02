```markdown
# Study Tracker

A simple React-based Study Tracker app with:
- Lecture checklist
- Daily study log (saved to localStorage)
- Weekly progress chart (Recharts)
- Optional Supabase Google OAuth sign-in

This repository provides a minimal, working structure using Create React App conventions:
- public/index.html
- src/App.js
- src/index.js
- src/index.css
- package.json

## Quick start

1. Install dependencies:
   npm install

2. Run development server:
   npm start

3. Build for production:
   npm run build

4. Deploy to GitHub Pages:
   npm run deploy

## Supabase (optional)

If you want to enable Google login via Supabase:

1. Create a Supabase project and enable Google auth in Authentication > Providers.
2. Add environment variables (recommended) in a `.env` file:
   REACT_APP_SUPABASE_URL=https://your-supabase-url.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key

If you do not supply environment variables, the app falls back to the values from the repository for testing purposes.

## Notes & suggestions

- The app currently uses the Tailwind CDN for styling (convenient for prototypes). For production, install Tailwind and configure a build step.
- Don't commit secret keys. Use environment variables in CI/CD or deployment platforms.
- You can extend the app to store data in Supabase tables, sync logs to the server, share progress, etc.

Enjoy!
