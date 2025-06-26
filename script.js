const API_KEY = "a8d894342faf491514bcb65a";
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const convertBtn = document.getElementById("convert-btn");
const resultDiv = document.getElementById("result");
const statusDiv = document.getElementById("status");

let exchangeRates = {};

async function loadExchangeRates() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.result === "success") {
      exchangeRates = data.conversion_rates;
      statusDiv.textContent = "✅ Taxas atualizadas com sucesso!";
      statusDiv.className = "status success";
    } else {
      statusDiv.textContent =
        "❌ Erro ao carregar taxas: " + data["error-type"];
      statusDiv.className = "status error";
    }
  } catch (error) {
    statusDiv.textContent = "❌ Falha na conexão: " + error.message;
    statusDiv.className = "status error";
  }
}

function convertCurrency(amount, fromCurrency, toCurrency) {
  const amountInUSD = amount / exchangeRates[fromCurrency];

  return amountInUSD * exchangeRates[toCurrency];
}

function formatCurrency(value, currencyCode) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function updateResult() {
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    resultDiv.textContent = "Por favor, insira um valor válido";
    return;
  }

  const fromCurrency = fromSelect.value;
  const toCurrency = toSelect.value;

  if (Object.keys(exchangeRates).length === 0) {
    resultDiv.textContent = "Taxas de câmbio não carregadas. Tente novamente.";
    return;
  }

  const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency);

  const fromCurrencyName = fromSelect.options[fromSelect.selectedIndex].text;
  const toCurrencyName = toSelect.options[toSelect.selectedIndex].text;

  resultDiv.innerHTML = `
                <div>${formatCurrency(amount, fromCurrency)}</div>
                <div style="font-size: 24px; margin: 10px 0;">=</div>
                <div style="font-size: 28px; color: #e74c3c;">${formatCurrency(
                  convertedAmount,
                  toCurrency
                )}</div>
                <div style="margin-top: 15px; font-size: 14px; color: #7f8c8d;">
                    ${fromCurrencyName} → ${toCurrencyName}
                </div>
            `;
}

convertBtn.addEventListener("click", updateResult);

loadExchangeRates();
