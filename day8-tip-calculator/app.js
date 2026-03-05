const billInput = document.getElementById("bill-input");
const tipButtons = document.querySelectorAll("[data-tip]");
const customTip = document.getElementById("custom-tip");
const peopleInput = document.getElementById("people-input");

const tipAmountPerPerson = document.getElementById("tip-amount-result");
const totalAmountPerPerson = document.getElementById("total-amount-result");
const resetBtn = document.getElementById("reset-btn");

let billAmount = 0;
let people = 0;
let tipPercentage = 0;

function updateResetButton() {
  if (billAmount > 0 || people > 0 || tipPercentage > 0) {
    resetBtn.disabled = false;
  } else {
    resetBtn.disabled = true;
  }
}

function formatNumber(num) {
  if (num >= 1e6) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(num);
  }
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function calculate() {
  updateResetButton();

  if (!billAmount || !people || people <= 0) {
    tipAmountPerPerson.textContent = "0.00";
    totalAmountPerPerson.textContent = "0.00";
    tipAmountPerPerson.parentElement.title = "$0.00";
    totalAmountPerPerson.parentElement.title = "$0.00";
    return;
  }

  const totalTip = billAmount * tipPercentage;
  const tipAmount = totalTip / people;
  const totalAmount = (billAmount + totalTip) / people;

  tipAmountPerPerson.textContent = formatNumber(tipAmount);
  totalAmountPerPerson.textContent = formatNumber(totalAmount);

  tipAmountPerPerson.parentElement.title =
    "$" + tipAmount.toLocaleString("en-US", { maximumFractionDigits: 2 });
  totalAmountPerPerson.parentElement.title =
    "$" + totalAmount.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

for (const tipButton of tipButtons) {
  tipButton.addEventListener("click", (e) => {
    tipButtons.forEach((btn) => {
      btn.classList.remove("bg-primary", "text-btn-active-text");
      btn.classList.add("bg-btn-reg", "text-btn-text");
    });
    e.target.classList.add("bg-primary", "text-btn-active-text");
    e.target.classList.remove("bg-btn-reg", "text-btn-text");

    tipPercentage = parseFloat(e.target.dataset.tip) / 100;
    customTip.value = "";
    calculate();
  });
}

billInput.addEventListener("input", () => {
  billAmount = parseFloat(billInput.value) || 0;
  calculate();
});

peopleInput.addEventListener("input", () => {
  people = parseInt(peopleInput.value) || 0;
  const parent = peopleInput.closest(".group");

  if (people === 0 && peopleInput.value !== "") {
    parent.classList.add("has-error");
    calculate(); // Call calculate to reset displays to 0.00
  } else {
    parent.classList.remove("has-error");
    calculate();
  }
});

customTip.addEventListener("input", () => {
  tipButtons.forEach((btn) => {
    btn.classList.remove("bg-primary", "text-btn-active-text");
    btn.classList.add("bg-btn-reg", "text-btn-text");
  });

  tipPercentage = (parseFloat(customTip.value) || 0) / 100;
  calculate();
});

function reset() {
  billAmount = 0;
  people = 0;
  tipPercentage = 0;

  billInput.value = "";
  peopleInput.value = "";
  customTip.value = "";

  tipButtons.forEach((btn) => {
    btn.classList.remove("bg-primary", "text-btn-active-text");
    btn.classList.add("bg-btn-reg", "text-btn-text");
  });

  const parent = peopleInput.closest(".group");
  parent.classList.remove("has-error");

  tipAmountPerPerson.textContent = "0.00";
  totalAmountPerPerson.textContent = "0.00";
  updateResetButton();
}

resetBtn.addEventListener("click", reset);
