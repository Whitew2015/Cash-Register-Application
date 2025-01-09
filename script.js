let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];


const cash = document.getElementById("cash");
const changeDue = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");
const changeInDrawer = document.getElementById("change-in-drawer");

document.getElementById("price").innerHTML = `<b>Price:</b> ${price}`;

// calculate change and update drawer
const cashInDrawer = () => {

  // parse customer input and calculate change
  let cashInt = parseFloat(cash.value);
  let change = Number((cashInt - price).toFixed(2));
  let totalCid = Number(cid.reduce((total, sum) => 
  total + sum[1], 0).toFixed(2));

  // check for insufficient funds
  if (cashInt < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }
  
  // check for exact payment
  if (cashInt === price) {
    changeDue.innerText = "No change due - customer paid with exact cash";
    return;
  }

  // check if drawer has insufficient funds to give the required change
  if (change > totalCid) {
    changeDue.innerHTML = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  // define currency denominations and their corresponding names
  const denominations = [100, 20, 10, 5, 1, 0.25, 0.10, 0.05, 0.01];
  const denominationsNames = ["ONE HUNDRED", "TWENTY", "TEN", "FIVE", "ONE",
    "QUARTER", "DIME", "NICKEL", "PENNY"];
  let changeArr = []; // Array to store denominations used for change
  let cidCopy = [...cid]; // Create copy of cid Array

  // loop through each denomination, starting from largest
  for (let i = 0; i < denominations.length; i++) {
    let totalDenom = 0;

    // Deduct from the change and drawer while possible
    while (change >= denominations[i] && cidCopy[cidCopy.length - 1 -i][1] > 0) {
      cidCopy[cidCopy.length - 1 - i][1] = Number((cidCopy[cidCopy.length - 1 - i][1] - 
        denominations[i]).toFixed(2)); 
      change = Number((change - denominations[i]).toFixed(2));
      totalDenom += denominations[i]; // add to the denomination total
    }

    // if denomination was used, add it to change array
    if (totalDenom > 0) {
      changeArr.push([denominationsNames[i], totalDenom]);
    }
  }

  // if change is still remaining, the drawer does not have enough funds
  if (change > 0) {
    changeDue.innerText = "Status: INSUFFICIENT_FUNDS";
    return;
  }
  
  // check if drawer is now empty aftr giving change
  let remainingCid = cidCopy.reduce((total, sum) => total + sum[1], 0);
  if (remainingCid === 0) {
    // if empty, update status to CLOSED and reset drawer amounts to zero
    changeDue.innerHTML = "Status: CLOSED " + changeArr.map(cash =>
      `${cash[0]}: $${cash[1].toFixed(2)}`).join(" ");
      cid = cid.map(denom => [denom[0], 0]);
  } else {
    // if not empty, update status to OPEN and show change breakdown
    changeDue.innerHTML = "Status: <b>OPEN</b> <br><br>" + changeArr.map(
      cash => `<b>${cash[0]}</b>: $${cash[1].toFixed(2)} <br>`
    ).join(" ");
    cid = cidCopy; // update original drawer with modified copy
  }

  // update displayed cash in drawer 
  displayCashInDrawer();
}

// function to display current cash-in-drawer in the UI
const displayCashInDrawer = () => {
  changeInDrawer.innerHTML = "<h4>Cash in Drawer:</h4>" + cid.map(cash => 
    `${cash[0]}: $${cash[1].toFixed(2)} <br>`
  ).reverse().join(""); // reverse for largest denominations at the top
}

// initialize the displayed cash-in-drwaer when the page loads
window.onload = displayCashInDrawer;

purchaseBtn.addEventListener("click", cashInDrawer);
cash.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    cashInDrawer();
  }
})