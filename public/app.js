const form = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const button = document.getElementById("login-button");
const status = document.getElementById("status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = usernameInput.value.trim();
  const passwordLength = passwordInput.value.length;

  if (!username || passwordLength === 0) {
    status.textContent = "Enter a dummy username and a made-up password to complete the simulation.";
    return;
  }

  button.disabled = true;
  status.textContent = "Recording this training attempt…";

  try {
    // Intentionally do not read or transmit passwordInput.value.
    const response = await fetch("/api/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        passwordProvided: true,
        passwordLength
      })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to record attempt.");

    status.classList.add("success");
    status.textContent = "Simulation complete. The username and attempt metadata were recorded. Your password was not sent or saved. This is how a deceptive login page can put credentials at risk.";
    passwordInput.value = "";
  } catch (error) {
    status.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});