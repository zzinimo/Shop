markdown

# Project: [App name]

MERN stack app: React frontend (/client), Express + Node API (/server), MongoDB via Mongoose.

## Commands

- Install: `npm install` in /client and /server
- Dev: `npm run dev` (server on :5000, client on :3000)
- Tests: `npm test`

## Conventions

- Use async/await, not .then() chains
- Functional React components with hooks only
- API routes go in /server/routes, logic in /server/controllers
- Never commit .env; secrets are loaded via dotenv

## Notes for Claude

- Ask before adding new npm packages
- Explain changes briefly. I'm preparing for junior dev interviews, so I want to understand the "why"
- Dont just give me the code. Explain what I should do with clues and why.
