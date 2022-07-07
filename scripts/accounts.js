'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  // movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 3333,
  movements: [
    { movement: 200, date: '2019-11-18T21:31:17.178Z' },
    { movement: 455.23, date: '2019-12-23T07:42:02.383Z' },
    { movement: -306.5, date: '2020-01-28T09:15:04.904Z' },
    { movement: 25000, date: '2020-04-01T10:17:24.185Z' },
    { movement: -642.21, date: '2020-05-08T14:11:59.604Z' },
    { movement: -133.9, date: '2020-05-27T17:01:17.194Z' },
    { movement: 79.97, date: '2020-07-11T23:36:17.929Z' },
    { movement: 1300, date: '2022-06-28T10:51:36.790Z' },
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  interestRate: 1.5,
  pin: 2222,
  movements: [
    { movement: 5000, date: '2019-11-01T13:15:33.035Z' },
    { movement: 3400, date: '2019-11-30T09:48:16.867Z' },
    { movement: -150, date: '2019-12-25T06:04:23.907Z' },
    { movement: -790, date: '2020-01-25T14:18:46.235Z' },
    { movement: -3210, date: '2020-02-05T16:33:06.386Z' },
    { movement: -100, date: '2020-04-10T14:43:26.374Z' },
    { movement: 8500, date: '2020-06-25T18:49:59.371Z' },
    { movement: -30, date: '2020-07-26T12:01:20.894Z' },
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
  owner: 'Hamed Osama',
  pin: 1111,
  movements: [
    { movement: 5000, date: '2019-11-01T13:15:33.035Z' },
    { movement: 3400, date: '2019-11-30T09:48:16.867Z' },
    { movement: -150, date: '2019-12-25T06:04:23.907Z' },
    { movement: -790, date: '2020-01-25T14:18:46.235Z' },
    { movement: -3210, date: '2020-02-05T16:33:06.386Z' },
    { movement: -100, date: '2020-04-10T14:43:26.374Z' },
    { movement: 8500, date: '2020-06-25T18:49:59.371Z' },
    { movement: -30, date: '2020-07-26T12:01:20.894Z' },
  ],
  interestRate: 1.7,
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3];
// current time
const now = new Date();
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
// Current User
let currentUser, timer, formatMoney;
// Set Date
const setDate = date => {
  const newDate = new Date(date);
  const days = calcDaysPassed(new Date(), newDate);
  if (days < 1) return 'Today';
  else if (days < 2) return 'Yesterday';
  else if (days <= 7) return `${days} days ago`;
  return new Intl.DateTimeFormat(currentUser.locale).format(now);
};
const calcDaysPassed = (date1, date2) =>
  Math.abs(Math.round((date2 - date1) / (1000 * 60 * 60 * 24)));
// check date
const checkDate = date => (+date < 10 ? '0' + date : date);
// Get current time
const getCurrentTime = () => {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    year: 'numeric',
    day: 'numeric',
    month: 'numeric',
    weekday: 'long',
  };
  const time = new Intl.DateTimeFormat(currentUser.locale, options).format(now);
  labelDate.innerHTML = time;
};
// start Logout Timer
const startLogoutTimer = () => {
  if (timer) clearInterval(timer);
  // set time to 5 minutes
  let time = 600;
  // call timer every sec
  const updateTime = () => {
    const min = Math.trunc(time / 60);
    const sec = time % 60;
    // in each call, update time UI
    labelTimer.innerHTML = `${min < 10 ? '0' + min : min}:${
      sec < 10 ? '0' + sec : sec
    }`;
    // when Time = 0 -> logout
    if (time === 0) {
      containerApp.style.opacity = 0;
      labelWelcome.innerHTML = 'Log in to get started';
      clearInterval(updateTime);
    }
    time--;
  };
  updateTime();
  timer = setInterval(updateTime, 1000);
};
// format function
const format = () => {
  formatMoney = new Intl.NumberFormat(currentUser.locale, {
    style: 'currency',
    currency: currentUser.currency,
  });
};
// Display Movements
const displayMovements = function (data, sort = false) {
  containerMovements.innerHTML = '';
  const movements = sort
    ? data.slice().sort((a, b) => a.movement - b.movement)
    : data;

  movements.forEach((e, i) => {
    const method = e.movement > 0 ? 'deposit' : 'withdrawal';
    const formatted = formatMoney.format(e.movement);
    const row = `
    <div class="movements__row">
    <div class="movements__type movements__type--${method}">${
      i + 1
    } ${method}</div>
    <div class="movements__date">${setDate(e.date)}</div>
    <div class="movements__value">${formatted}</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', row);
  });
};
// create usernames
const createUsernames = acc =>
  acc.forEach(a => {
    a.username = a.owner
      .toLowerCase()
      .split(' ')
      .map(e => e[0])
      .join('');
  });
createUsernames(accounts);
// Get total balance
const totalBalance = function (trans) {
  const total = trans.reduce((acc, cur) => acc + cur.movement, 0).toFixed(2);
  const formatted = formatMoney.format(total);
  labelBalance.innerHTML = formatted;
  return total;
};
// display all
const eurToUsd = 1.1;

const displayIn = function (trans) {
  const total = trans
    .filter(mov => mov.movement > 0)
    .reduce((acc, cur) => acc + cur.movement, 0);
  const formatted = formatMoney.format(total);
  labelSumIn.innerHTML = formatted;
};
const displayOut = function (trans) {
  const total = trans
    .filter(mov => mov.movement < 0)
    .reduce((acc, cur) => acc + cur.movement, 0);
  const formatted = formatMoney.format(total);
  labelSumOut.innerHTML = formatted;
};
const displayInterest = function (account) {
  const total = account.movements
    .filter(mov => mov.movement > 0)
    .map(mov => (mov.movement * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  const formatted = formatMoney.format(total);
  labelSumInterest.innerHTML = formatted;
};

// login function
const login = () => {
  const user = (currentUser = accounts.find(
    acc =>
      acc.username == inputLoginUsername.value.toLowerCase() &&
      acc.pin == inputLoginPin.value
  ));
  if (user) {
    getCurrentTime();
    format();
    displayAccountData(user);
    startLogoutTimer();
  }
};
const displayAccountData = user => {
  const movements = user.movements;
  // Display welcome message and ui
  labelWelcome.innerHTML = `Welcome back, ${user.owner.split(' ')[0]}`;
  containerApp.style.opacity = 1;
  // CLear input fields;
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
  inputLoginUsername.blur();
  // Display movements
  displayMovements(movements);
  // Display balance
  totalBalance(movements);
  //display summary
  displayIn(movements);
  displayOut(movements);
  displayInterest(user);
};
// login
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  login();
});
// Transfer money
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  //Get the amount
  const money = +inputTransferAmount.value;
  if (money > totalBalance(currentUser.movements))
    return alert("You don't have enough money to transfer");
  if (money < 1) return alert('Amount must be more than 0');
  //Get the account
  const receiveAcc = accounts.find(
    acc =>
      acc.username === inputTransferTo.value &&
      currentUser.username !== inputTransferTo.value
  );
  if (!receiveAcc) return alert('Wrong account');
  // Transfer Money
  // Add transfer date
  currentUser.movements.push({
    movement: -money,
    date: new Date().toISOString(),
  });
  receiveAcc.movements.push({
    movement: money,
    date: new Date().toISOString(),
  });
  // Update UI
  displayAccountData(currentUser);
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();
  // Reset time
  startLogoutTimer();
});
// request loan
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  const loaned = currentUser.movements.some(
    acc => acc.movement >= amount * 0.1
  );
  if (amount > 0 && loaned) {
    // Add loan
    currentUser.movements.push({
      movement: amount,
      date: new Date().toISOString(),
    });
  }
  // Update UI
  displayAccountData(currentUser);
  inputLoanAmount.value = '';
  // Reset time
  startLogoutTimer();
});
// Sort Movements
let sorted = false;
btnSort.addEventListener('click', () => {
  displayMovements(currentUser.movements, !sorted);
  sorted = !sorted;
});
//CLose Account
btnClose.addEventListener('click', e => {
  e.preventDefault();
  // Get index of the user
  const accountIndex = accounts.findIndex(
    acc =>
      acc.username == inputCloseUsername.value && acc.pin == inputClosePin.value
  );
  // Validate User
  if (accountIndex == -1 || currentUser.username !== inputCloseUsername.value)
    return alert('Wrong Data!');
  // Delete Account
  accounts.splice(accountIndex, 1);
  // Update UI
  inputCloseUsername.value = inputClosePin.value = '';
  containerApp.style.opacity = 0;
  labelWelcome.innerHTML = 'Log in to get started';
});
