// State management object
const state = {
  bill: {
    value: 0,
    touched: false,
    valid: true,
  },
  people: {
    value: 0,
    touched: false,
    valid: true,
  },
  tip: {
    value: 0,
    touched: false,
    valid: true,
  },
};

// Validation rules
const validations = {
  bill: {
    check: (value) => value > 0,
    message: "Can't be zero",
  },
  people: {
    check: (value) => value > 0,
    message: "Can't be zero",
  },
  tip: {
    check: (value) => value >= 0,
    message: "Can't be negative",
  },
};

// DOM elements
const billInput = document.getElementById("bill");
const billError = document.getElementById("billError");
const peopleInput = document.getElementById("people");
const peopleError = document.getElementById("peopleError");
const customTipInput = document.getElementById("tip");
const customTipError = document.getElementById("tipError");
const radioButtons = document.querySelectorAll(".tip-input");
const form = document.getElementById("tipForm");

// Initialize event listeners
document.addEventListener("DOMContentLoaded", function () {
  billInput.addEventListener("input", onInputChange);
  billInput.addEventListener("blur", onInputBlur);
  peopleInput.addEventListener("input", onInputChange);
  peopleInput.addEventListener("blur", onInputBlur);
  customTipInput.addEventListener("input", onTipChange);
  customTipInput.addEventListener("blur", onInputBlur);

  radioButtons.forEach((radio) => {
    radio.addEventListener("change", onTipChange);
  });

  form.addEventListener("submit", onSubmit);

  // Perform initial validation
  validateAllFields();
});

// Event handlers
function onInputChange(e) {
  const { name, value } = e.target;
  state[name].value = parseFloat(value) || 0;
  validateField(name);
  submitForm();
}

function onTipChange(e) {
  state.tip.value = parseFloat(e.target.value) || 0;
  state.tip.touched = true;
  validateField("tip");
  if (e.target.type === "radio") {
    // Clear custom tip input
    customTipInput.value = "";
  } else {
    // Deselect radio buttons
    radioButtons.forEach((radio) => {
      radio.checked = false;
    });
  }
  submitForm();
}

function onInputBlur(e) {
  const { name } = e.target;
  state[name].touched = true;
  validateField(name);
}

function validateField(fieldName) {
  if (validations[fieldName]) {
    const isValid = validations[fieldName].check(state[fieldName].value);
    state[fieldName].valid = isValid;
    const errorElement = document.getElementById(`${fieldName}Error`);
    const inputElement = document.getElementById(fieldName);
    if (!isValid && state[fieldName].touched && errorElement) {
      errorElement.textContent = validations[fieldName].message;
      inputElement.classList.toggle("valid", state[fieldName].valid);
      inputElement.classList.toggle("invalid", !state[fieldName].valid);
    } else if (errorElement && state[fieldName].touched) {
      errorElement.textContent = "";
      inputElement.classList.toggle("valid", state[fieldName].valid);
      inputElement.classList.toggle("invalid", !state[fieldName].valid);
    }
  }
}

function validateAllFields() {
  // Validate all fields on initial load
  validateField("bill");
  validateField("people");
  validateField("tip");

  // Calculate totals if valid
  calculateTotals();
}

function onSubmit(event) {
  event.preventDefault();
  // Calculate and update the totals
  calculateTotals();
}

function submitForm() {
  const event = new Event("submit", { bubbles: true, cancelable: true });
  if (form.dispatchEvent(event)) {
    // If no handler called preventDefault(), simulate form submission logic
  }
}

function calculateTotals() {
  // Check if all required fields are valid
  const isBillValid = state.bill.valid;
  const isPeopleValid = state.people.valid;
  const isTipValid = state.tip.valid;

  if (isBillValid && isPeopleValid && isTipValid) {
    // Perform calculations
    const tipAmountElement = document.querySelector(".total__tip__result");
    const totalPerPersonElement = document.querySelector(
      ".total__split__result"
    );

    const bill = state.bill.value;
    const people = state.people.value;
    const tipPercent = state.tip.value;

    const tipAmount = (bill * (tipPercent / 100)) / people;
    const totalPerPerson = bill / people + tipAmount;

    tipAmountElement.textContent = "$" + tipAmount.toFixed(2);
    totalPerPersonElement.textContent = "$" + totalPerPerson.toFixed(2);
  } else {
    // Reset totals if validations fail
    document.querySelector(".total__tip__result").textContent = "$0.00";
    document.querySelector(".total__split__result").textContent = "$0.00";
  }
}

// Reset button handler
const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", resetForm);

function resetForm() {
  // Reset state
  state.bill = { value: 0, touched: false, valid: true };
  state.people = { value: 0, touched: false, valid: true };
  state.tip = { value: 0, touched: false, valid: true };

  // Reset inputs
  billInput.value = "";
  peopleInput.value = "";
  customTipInput.value = "";
  radioButtons.forEach((radio) => {
    radio.checked = false;
  });

  // Clear errors
  billError.textContent = "";
  peopleError.textContent = "";
  customTipError.textContent = "";

  // Reset totals
  document.querySelector(".total__tip__result").textContent = "$0.00";
  document.querySelector(".total__split__result").textContent = "$0.00";

  validateAllFields();
}
