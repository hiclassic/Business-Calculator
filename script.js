const calculatorDisplay = document.getElementById('display');
const inputButtons = document.querySelectorAll('button');
const clearBtn = document.getElementById('clear-btn');
const historyList = document.getElementById('history-list');
const themeSwitch = document.getElementById('theme-switch');

const calculate = {
  '/': (firstNumber, secondNumber) => firstNumber / secondNumber,
  '*': (firstNumber, secondNumber) => firstNumber * secondNumber,
  '+': (firstNumber, secondNumber) => firstNumber + secondNumber,
  '-': (firstNumber, secondNumber) => firstNumber - secondNumber,
  '=': (firstNumber, secondNumber) => secondNumber,
};

let firstValue = 0;
let operatorValue = '';
let awaitingNextValue = false;

function sendNumberValue(number) {
  if (awaitingNextValue) {
    calculatorDisplay.textContent = number;
    awaitingNextValue = false;
  } else {
    const displayValue = calculatorDisplay.textContent;
    calculatorDisplay.textContent =
      displayValue === '0' ? number : displayValue + number;
  }
}

function addDecimal() {
  if (awaitingNextValue) return;
  if (!calculatorDisplay.textContent.includes('.')) {
    calculatorDisplay.textContent = `${calculatorDisplay.textContent}.`;
  }
}

function useOperator(operator) {
  const currentValue = Number(calculatorDisplay.textContent);
  if (operatorValue && awaitingNextValue) {
    operatorValue = operator;
    return;
  }
  if (!firstValue) {
    firstValue = currentValue;
  } else {
    const calculation = calculate[operatorValue](firstValue, currentValue);
    calculatorDisplay.textContent = calculation;
    updateHistory(`${firstValue} ${operatorValue} ${currentValue}`, calculation);
    firstValue = calculation;
  }
  awaitingNextValue = true;
  operatorValue = operator;
}

function resetAll() {
  firstValue = 0;
  operatorValue = '';
  awaitingNextValue = false;
  calculatorDisplay.textContent = '0';
}

clearBtn.addEventListener('click', resetAll);

inputButtons.forEach((btn) => {
  if (btn.classList.contains('operator')) {
    btn.addEventListener('click', () => useOperator(btn.value));
  } else if (btn.classList.contains('decimal')) {
    btn.addEventListener('click', addDecimal);
  } else if (!btn.classList.contains('clear')) {
    btn.addEventListener('click', () => sendNumberValue(btn.value));
  }
});

// History Log
function updateHistory(expression, result) {
  const li = document.createElement('li');
  li.textContent = `${expression} = ${result}`;
  historyList.prepend(li);
  let oldHistory = JSON.parse(localStorage.getItem('calcHistory')) || [];
  oldHistory.unshift(`${expression} = ${result}`);
  localStorage.setItem('calcHistory', JSON.stringify(oldHistory));
}

window.addEventListener('load', () => {
  const savedHistory = JSON.parse(localStorage.getItem('calcHistory')) || [];
  savedHistory.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    historyList.appendChild(li);
  });

  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.classList.add(savedTheme);
  themeSwitch.checked = savedTheme === 'dark';
});

// Keyboard
document.addEventListener('keydown', (e) => {
  if (!isNaN(e.key)) {
    sendNumberValue(e.key);
  } else if (['+', '-', '*', '/'].includes(e.key)) {
    useOperator(e.key);
  } else if (e.key === '.') {
    addDecimal();
  } else if (e.key === 'Enter') {
    useOperator('=');
  } else if (e.key === 'Escape') {
    resetAll();
  }
});

themeSwitch.addEventListener('change', () => {
  if (themeSwitch.checked) {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
});
