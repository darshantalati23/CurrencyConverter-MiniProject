const base_url =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";
const fromCurrency = document.querySelector("#from .to-select");
const toCurrency = document.querySelector("#to .to-select");
const fromImg = document.querySelector("#from img");
const toImg = document.querySelector("#to img");
const amtText = document.querySelector("#amt-text");
const convertLogo = document.querySelector("#convert-logo");
const submit = document.querySelector("#submit-btn");
const reset = document.querySelector("#reset-btn");
const resultBox = document.querySelector("#result-box");

function currencyDrDw() {
  for (let curCode in countryList) {
    // From
    let fromOpt = document.createElement("option");
    fromOpt.value = curCode;
    fromOpt.innerText = curCode;
    fromCurrency.appendChild(fromOpt);

    // To
    let toOpt = document.createElement("option");
    toOpt.value = curCode;
    toOpt.innerText = curCode;
    toCurrency.appendChild(toOpt);
  }

  fromCurrency.value = "USD";
  toCurrency.value = "INR";
  updateFlag(fromCurrency);
  updateFlag(toCurrency);
}

/**
 * Updates the flag image based on the selected currency
 * @param {HTMLSelectElement} selectElement - The currency select element
 */
function updateFlag(selectElement) {
  try {
    if (!selectElement || !selectElement.value) {
      console.error("Invalid select element or value");
      return;
    }

    const curCode = selectElement.value.toUpperCase(); // Get the currency code in uppercase for consistency
    const countryCode = countryList[curCode];
    if (!countryCode) {
      console.error(`No country code found for currency: ${curCode}`);
      return;
    }

    const flagUrl = `https://flagsapi.com/${countryCode}/flat/64.png`;

    const imgElement = selectElement.previousElementSibling;

    // Verify the image element exists and is an IMG tag
    if (!imgElement || imgElement.tagName !== "IMG") {
      console.error(
        "Flag image element not found/not img tag for:",
        selectElement
      );
      return;
    }

    // Update the flag image source and attributes
    console.log(`Updating flag for ${curCode} (${countryCode}): ${flagUrl}`);
    imgElement.src = flagUrl;
    imgElement.alt = `${curCode} Flag`; // For accessibility
    imgElement.style.visibility = "visible"; // Ensure the image is visible
  } catch (error) {
    // Log any unexpected errors during flag update
    console.error("Error updating flag:", error);
  }
}

async function getExchange() {
  try {
    const amount = parseFloat(amtText.value);
    if (isNaN(amount) || amount <= 0) {
      alert("Enter a valid positive amount");
      return;
    }

    // MISSED STEP: Convert to LowerCase for API compatibility
    const fromCur = fromCurrency.value.toLowerCase();
    const toCur = toCurrency.value.toLowerCase();

    // API Construction
    const url = `${base_url}${fromCur}.json`;

    const response = await fetch(url);
    const data = await response.json();

    // API error
    if (data.result === "error") {
      console.error("API Error:", data.error);
      resultBox.innerText = "API Error";
      return;
    }

    // The API response structure for fawazahmed0/currency-api is: { "date": "...", "fromCurrencyCode": { "toCurrencyCode": rate, ... } }
    const rates = data[fromCur]; // Access the nested object using the 'from' currency key
    const exchangeRate = rates[toCur];

    const convertedAmount = (amount * exchangeRate).toFixed(2);
    resultBox.innerText = `${convertedAmount} ${toCur.toUpperCase()}`;
  } catch (error) {
    console.error("Conversion Error:", error);
    resultBox.innerText = "Conversion Error";
  }
}

function initialize() {
  console.log("Initializing currency converter...");

  // Populate currency dropdowns
  currencyDrDw();

  // Set initial flags
  updateFlag(fromCurrency);
  updateFlag(toCurrency);

  // Add event listeners
  fromCurrency.addEventListener("change", () => updateFlag(fromCurrency));
  toCurrency.addEventListener("change", () => updateFlag(toCurrency));
  submit.addEventListener("click", getExchange);
  resultBox.innerText = "";
  amtText.value = "";

  console.log("Currency converter initialized");
}

// Start the application when DOM is fully loaded
document.addEventListener("DOMContentLoaded", initialize);
reset.addEventListener("click", initialize);
convertLogo.addEventListener("click", () => {
  let temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  updateFlag(fromCurrency);
  updateFlag(toCurrency);
});
