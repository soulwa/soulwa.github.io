// algorithm for smb:
// n = -2 (so, 0 index for array of pn, qn)
// p = 0, q = 1
// n = -1 (so, 1 index for array of pn, qn)
// p = 1, 1 = 0
// n = 0 (so, 0 index for An and Cn) -> A = 0, C = 1
// then, algorithm on loop:
// a[n] = Math.floor((A[n] + a0) / C[n])
// p[n + 2] = a[n] (term just computed) * p[n + 1] + p[n]
// q[n + 2] = a[n] (term just computed) * q[n + 1] + q[n]
// A[n + 1] = a[n] * C[n] - A[n]
// C[n + 1] = (D - A[n]^2) / C[n]

let smbTable = {
  table: document.getElementById("smb"),
  n: document.getElementById("smb-n"),
  A: document.getElementById("smb-An"),
  C: document.getElementById("smb-Cn"),
  a: document.getElementById("smb-an"),
  p: document.getElementById("smb-pn"),
  q: document.getElementById("smb-qn"),
  pell: document.getElementById("smb-pell"),
};

let fundDvalues = document.getElementsByClassName("smb-fund-D-value");
let fundAvalue = document.getElementById("smb-fund-a-value");
let fundBvalue = document.getElementById("smb-fund-b-value");
let fundNormValue = document.getElementById("smb-fund-norm-value");

let factpValue = document.getElementById("smb-fact-p-value");
let factCValue = document.getElementById("smb-fact-C-value");
let factdvalues = document.getElementsByClassName("smb-fact-d-value");
let factOtherValue = document.getElementById("smb-fact-other-value");

let gcd = function (x, y) {
  let a = Math.max(x, y);
  let b = Math.min(x, y);
  while (b != 0) {
    let temp = a;
    a = b;
    b = temp % b;
  }
  return a;
};

let smb = function (D, maxIteration = 1000) {
  let p = [0, 1];
  let q = [1, 0];
  let A = [0];
  let C = [1];
  let a = [Math.floor(Math.sqrt(D))];
  let pell = [];

  let n = 0;
  let found = false;
  while (!found) {
    p[n + 2] = a[n] * p[n + 1] + p[n];
    q[n + 2] = a[n] * q[n + 1] + q[n];
    pell[n] = p[n + 2] * p[n + 2] - D * q[n + 2] * q[n + 2];
    A[n + 1] = a[n] * C[n] - A[n];
    C[n + 1] = (D - A[n + 1] * A[n + 1]) / C[n];
    a[n + 1] = Math.floor((A[n + 1] + a[0]) / C[n + 1]);
    found = n > 0 && C[n] === 1;
    n++;
    if (n > maxIteration) {
      break;
    }
    console.log(C[n]);
  }

  // finish off the row that we ended on
  if (found) {
    p[n + 2] = a[n] * p[n + 1] + p[n];
    q[n + 2] = a[n] * q[n + 1] + q[n];
    pell[n] = p[n + 2] * p[n + 2] - D * q[n + 2] * q[n + 2];
  }

  return {
    n: n,
    p: p,
    q: q,
    A: A,
    C: C,
    a: a,
    pell: pell,
  };
};

let clearTable = function () {
  let rows = smbTable.table.rows;
  for (let i = 0; i < rows.length; i++) {
    let cellCount = rows[i].cells.length;
    for (let j = 1; j < cellCount; j++) {
      rows[i].deleteCell(1);
    }
  }
};

let populate = function (D) {
  // clear all rows except for the first, which describe the equation
  clearTable();
  if (D === " " || Math.sqrt(D) % 1 === 0 || D <= 0) {
    console.log("D must be a positive, squarefree integer.");
    return;
  }

  let superMagicBox = smb(D);

  for (let n = -2; n < 0; n++) {
    let nCol = smbTable.n.insertCell();
    nCol.innerHTML = n;
    let ACol = smbTable.A.insertCell();
    ACol.innerHTML = "";
    let CCol = smbTable.C.insertCell();
    CCol.innerHTML = "";
    let aCol = smbTable.a.insertCell();
    aCol.innerHTML = "";
    let pCol = smbTable.p.insertCell();
    pCol.innerHTML = superMagicBox.p[n + 2];
    let qCol = smbTable.q.insertCell();
    qCol.innerHTML = superMagicBox.q[n + 2];
    let pellCol = smbTable.pell.insertCell();
    pellCol.innerHTML = "";
  }

  // then we can just insert everything based on a proper index
  for (let n = 0; n < superMagicBox.n; n++) {
    let nCol = smbTable.n.insertCell();
    nCol.innerHTML = n;
    let ACol = smbTable.A.insertCell();
    ACol.innerHTML = superMagicBox.A[n];
    let CCol = smbTable.C.insertCell();
    CCol.innerHTML = superMagicBox.C[n];
    let aCol = smbTable.a.insertCell();
    aCol.innerHTML = superMagicBox.a[n];
    let pCol = smbTable.p.insertCell();
    pCol.innerHTML = superMagicBox.p[n + 2];
    let qCol = smbTable.q.insertCell();
    qCol.innerHTML = superMagicBox.q[n + 2];
    let pellCol = smbTable.pell.insertCell();
    pellCol.innerHTML = superMagicBox.pell[n];
  }

  // List what the fundamental value is.
  for (let i = 0; i < fundDvalues.length; i++) {
    fundDvalues[i].innerHTML = D;
  }
  let a = superMagicBox.p[superMagicBox.n];
  let b = superMagicBox.q[superMagicBox.n];
  fundAvalue.innerHTML = superMagicBox.p[superMagicBox.n];
  fundBvalue.innerHTML = superMagicBox.q[superMagicBox.n];
  fundNormValue.innerHTML = a * a - D * b * b;

  let factorizationFound = false;
  for (let n = 1; n < superMagicBox.C.length; n++) {
    let candidate = superMagicBox.C[n];
    if (
      Math.sqrt(candidate) % 1 === 0 &&
      (n - 1) % 2 === 1 &&
      !factorizationFound
    ) {
      factorizationFound = true;
      let p = superMagicBox.p[n + 1];
      let candidateRoot = Math.sqrt(candidate);
      let d = gcd(p + candidateRoot, D);
      let otherFactor = D / d;
      factpValue.innerHTML = p;
      factCValue.innerHTML = candidateRoot;
      for (let i = 0; i < factdvalues.length; i++) {
        factdvalues[i].innerHTML = d;
      }
      factOtherValue.innerHTML = "<mi>" + otherFactor + "</mi>";
      break;
    }
  }
  // TODO: maybe do somthing here if we don't find a factor. not sure if necessary
};

let dForm = document.getElementById("input-D");
if (window.addEventListener) {
  dForm.addEventListener("keyup", () => populate(dForm.value), false);
} else if (window.attachEvent) {
  dForm.attachEvent("onkeyup", () => populate(dForm.value));
}
