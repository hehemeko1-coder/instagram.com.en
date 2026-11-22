# Login Phishing-Awareness Lab

A local/controlled training simulation that demonstrates how deceptive login prompts can collect information.

## Safety behavior
- The page is visibly labeled **SECURITY AWARENESS LAB — SIMULATION**.
- It is not connected to Instagram and does not authenticate accounts.
- The username entered is appended to `logs/login-attempts.txt`.
- Only password-field metadata is recorded: whether it was filled and its character count.
- **The password value is never sent to the server, logged, or stored.**
- Use only with informed participants and dummy usernames. Do not expose this training endpoint as a public credential collection page.

## Run locally
1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Run `npm start`.
4. Open `http://localhost:3000`.

## Log format
Each line records an ISO timestamp, username, whether the password field was filled, password length, and the simulation result.

## Deployment
This app can be deployed to a Node.js host using `npm start`. The log file is written to `logs/login-attempts.txt`. Many hosts use ephemeral filesystems; configure a persistent disk if logs must survive restarts, or replace local file logging with an approved lab database. Restrict access to the logs and delete them after the exercise.
