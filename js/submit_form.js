const SUCCESS_MESSAGE = "Máme to. Dík!";
const ERROR_MESSAGE =
  "Sakryš. Ňáká chyba. Zkus to znova nebo nám napiš na veselka@tomes.lol.";

const button = document.getElementById("submit-button");
const input = document.getElementById("email-input");
const success_message = document.getElementById("success-message");

document.getElementById("email-form").onsubmit = async (event) => {
  event && event.preventDefault();
  button.disabled = true;
  success_message.style.visibility = "hidden";
  const value = button.value;
  button.value = "Posílám...";

  const email = input.value;
  console.log(email);

  try {
    const response = await fetch(
      "https://hook.eu2.make.com/1pxo3m8oqonmd3za1fpg83c29usyflrj",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      console.error("Response not ok:", response);
      throw new Error();
    }

    console.log("Response ok:", response);
    input.value = "";
    success_message.innerHTML = SUCCESS_MESSAGE;
    success_message.style.visibility = "visible";
  } catch (err) {
    console.error(err);
    success_message.style.visibility = "visible";
    success_message.innerHTML = ERROR_MESSAGE;
  }

  button.value = value;
  button.disabled = false;
};

async function wait_for(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve({ ok: true }), ms);
  });
}
