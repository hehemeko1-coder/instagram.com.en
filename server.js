const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const LOG_DIR = path.join(__dirname, "logs");
const LOG_FILE = path.join(LOG_DIR, "login-attempts.txt");

app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "4kb" }));
app.use(express.static(path.join(__dirname, "public")));

const attemptLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many attempts. Please wait a minute." }
});

app.post("/api/attempt", attemptLimiter, (req, res) => {
  const { username, passwordProvided, passwordLength } = req.body || {};

  if (typeof username !== "string" || username.trim().length < 1 || username.length > 128) {
    return res.status(400).json({ error: "Enter a demo username." });
  }
  if (typeof passwordProvided !== "boolean" ||
      !Number.isInteger(passwordLength) ||
      passwordLength < 0 || passwordLength > 256) {
    return res.status(400).json({ error: "Invalid demo submission." });
  }

  // Metadata only: the server never accepts, reads, or stores a password value.
  const safeUsername = username.trim().replace(/[\r\n\t]/g, " ").replace(/[|]/g, "_");
  const line = [
    new Date().toISOString(),
    "username=" + safeUsername,
    "password_field_filled=" + passwordProvided,
    "password_length=" + passwordLength,
    "result=training_simulation"
  ].join(" | ") + "\n";

  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    fs.appendFileSync(LOG_FILE, line, { encoding: "utf8", mode: 0o600 });
    return res.json({ ok: true, message: "Attempt recorded. No password was sent or saved." });
  } catch (error) {
    console.error("Could not write training log:", error.message);
    return res.status(500).json({ error: "Could not record this training attempt." });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true, mode: "awareness-lab" }));

app.listen(PORT, () => console.log("Awareness lab listening on port " + PORT));
