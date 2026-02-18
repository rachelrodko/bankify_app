'use strict'; /////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP/////////////////////////////////////////////////
// Data// DIFFERENT DATA! Contains movement dates, currency and locale///
const movements = [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300];
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25_000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2025-04-16T23:36:17.929Z',
    '2025-04-21T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
  type: 'premium',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
  type: 'standard',
};

const account3 = {
  owner: 'mark hoffman',
  movements: [2, 65, 2, 77, 43, 635, 2, 6],
  type: 'basic',
};

const account4 = {
  owner: 'sarah parker',
  movements: [275, 358, 34],
  type: 'basic',
};
const accounts = [account1, account2, account3, account4]; /////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const containerApp = document.querySelector('.app');
const instructions = document.querySelector('.instructions');
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
const inputClosePin = document.querySelector('.form__input--pin'); /////////////////////////////////////////////////
// Functions// accounts.forEach(function (acc) {
//   acc.movementsDates.map(function (d) {
//     return console.log([d]);

//   })

// ;

//   // if money transferred earlier than today or yday, display date in dd/mm/yy format //

//calculate how many days have passed between transfer date and now//
const calcDaysPassed = function (then, now) {
  then = new Date(then);
  now = Date.now();
  const daysAgo = Math.round(
    Math.abs(then.getTime() - now) / (1000 * 60 * 60 * 24)
  );
  return daysAgo;
};

const datesFunction = function (x) {
  const daysAgo = calcDaysPassed(x);
  if (daysAgo <= 7 && daysAgo > 1) {
    return `${daysAgo} days ago`;
  } else if (daysAgo === 1) {
    return `yesterday`;
  } else if (daysAgo === 0) {
    return `today`;
  } else {
    const date = new Date(x);
    return new Intl.DateTimeFormat('en-GB').format(date);
    // const yr = date.getFullYear();
    // const m = `${date.getMonth() + 1}`.padStart(2, 0);
    // const d = `${date.getDate()}`.padStart(2, 0);
    // const h = `${date.getHours()}`.padStart(2, 0);
    // const min = `${date.getMinutes()}`.padStart(2, 0);
    // return `${d}/${m}/${yr}`;
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  //new object for movs and date//
  const combinedObj = acc.movements.map(function (x, i) {
    return {
      movs: x,
      date: acc.movementsDates[i],
    };
  });
  console.log(combinedObj);
  const displayInterface = function (x) {
    x.forEach(function ({ movs, date = combinedObj }, i) {
      const type = movs > 0 ? 'deposit' : 'withdrawal';
      const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
        i + 1
      } ${type}</div>
            <div class='movements__date'>${datesFunction(date)}</div>
        <div class="movements__value">${formatCur(
          movs,
          currentAccount.locale,
          currentAccount.currency
        )}</div>
      </div>
    `;

      containerMovements.insertAdjacentHTML('afterbegin', html);
      return;
    });
  };

  //sort function//
  if (sort) {
    const sortedArr = combinedObj.toSorted((a, b) => a.movs - b.movs);
    displayInterface(sortedArr);
  } else {
    displayInterface(combinedObj);
  }
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc); // Display balance
  calcDisplayBalance(acc); // Display summary
  calcDisplaySummary(acc);
}; ///////////////////////////////////////

// in each call print the remianing time to ui
// when time reaches 0 stop timer and log user out

// Event handlers
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100; //create current date and time
       instructions.innerHTML = '';
    console.log('jihihihih');
    const date = new Date();

    const options = {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    const locale = navigator.language;
    console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,

      options
    ).format(date);

    // const yr = date.getFullYear();
    // const m = `${date.getMonth() + 1}`.padStart(2, 0);
    // const d = `${date.getDate()}`.padStart(2, 0);
    // const h = `${date.getHours()}`.padStart(2, 0);
    // const min = `${date.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${d}/${m}/${yr} ${h}:${min}`; // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // Update UI
    updateUI(currentAccount);

    // set the time to 5 mins
    let time = 300;
    // call the timer every second
    const timer = setInterval(function () {
      const min = String(Math.trunc(time / 60)).padStart(2, 0);
      const sec = String(time % 60).padStart(2, 0);
      labelTimer.textContent = `${min}:${sec}`;
      time = time - 1;
      if (time === 0) {
        clearInterval(timer);
        containerApp.style.opacity = 0;
     instructions.innerHTML = `
      <p>*** Type the following to log in and unlock the UI:***</p>
      <p>Username: js</p>
      <p>Password: 1111</p>
      <br />
      <p>Username: jd</p>
      <p>Password: 2222</p>
      <br />
      <p>Username: stw</p>
      <p>Password: 3333</p>
      <br />
      <p>Username: ss</p>
      <p>Password: 4444</p>`;
        labelWelcome.textContent = `Login to get started`;
      }
    }, 1000);
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
    // datesFunction();
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currentAccount);
    }, 2000);
    // Add movement
  }
  inputLoanAmount.value = '';
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)    // Delete account
    accounts.splice(index, 1); // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
// FAKE ALWAYS LOGGED IN//
// currentAccount = account1;
// updateUI(account1);
// containerApp.style.opacity = 100; // labelDate.textContent = `${d}/${m}/${yr} ${h}:${min}`;
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

async function getTodos() {
  const res = await fetch('https://jsonplaceholder.typeicode.com/todos');
  const data = await res.json();
  console.log(data);
}

getTodos();



