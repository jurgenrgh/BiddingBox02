/////////////////////////////////////////////////////////////////////////////
///////// Routine Operations //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
function handleSetup() {
  alert("Setup");
}
function handleMsgToLHO() {
  alert("Send a Message to LHO. (Not yet available)");
}
function handleMsgToRHO() {
  alert("Send a Message to RHO. (Not yet available)");
}
function handleRestart() {
  boardIx = 0; // Board index
  dealerIx = 0; // Dealer; function of boardIx
  vulIx = 0; // Vulnerability; function of boardIx

  roundIx = 0; //current round of bidding
  bidderIx = 1; //current bidder (bid order ix)

  drawCompass();
  initBiddingRecord();
  clearBidBox();
  //alert("Restart this Tablet with last known state?")
}
function handleClose() {
  alert("Close down? This will lose all data and settings")
}

//////////////////////////////////////////////////////////////////////////////
//// Table, Board Number and Seat Input //////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function submitTableNumber(event) {
  event.preventDefault(); // prevents the "submit form action"
  simulateClick(); // causes the keyboard to hide
  handleNewTableNumber();
  return false;
}

function submitBoardNumber(event) {
  event.preventDefault(); // prevents the "submit form action"
  simulateClick(); // causes the keyboard to hide
  handleNewBoardNumber();
  return false;
}

function handleNewTableNumber() {
  var svgElem = document.getElementById("svgTextTableNbr");
  var textBefore = svgElem.textContent; //old nbr
  var val = document.getElementById("input-table-nbr").value; //new nbr
  svgElem.textContent = "Table " + val;
  tableIx = val - 1;
  var textAfter = svgElem.textContent;
  drawCompass();
}

///////////////////////////////////////////////////////////////////////////////
// Board Number -> dealer & vulnerability:
///////////////////////////////////////////////////////////////////////////////
// B = 1,2,...,16,17,18,...,32,...,36: Board Nbr
// b = B - 1 (mod 16): Board index
// {"N","E","S","W"} = {0,1,2,3}: Compass (Seat) index
// b = 4q + r
// d = b (mod 4): Dealer index
// v = q + r (mod 4): vulnerability
//
// {None,NS,EW,All} = {0,1,2,3}: vul index
//////////////////////////////////////////////////
//
//  b   B   q   r   v   d
//  0   1   0   0   0   0
//  1   2   0   1   1   1
//  2   3   0   2   2   2
//  3   4   0   3   3   3
//  4   5   1   0   1   0
//  5   6   1   1   2   1
//  6   7   1   2   3   2
//  7   8   1   3   0   3
//  8   9   2   0   2   0
//  9  10   2   1   3   1
// 10  11   2   2   0   2
// 11  12   2   3   1   3
// 12  13   3   0   3   0
// 13  14   3   1   0   1
// 14  15   3   2   1   2
// 15  16   3   3   2   3
//
/////////////////////////////////////////////

/////////////////////////////////////////////
// Called when the board number changes
// bNbr = 1,2, ... ,36
// This function sets boardIx, dealerIx, vulIx
// and adjusts the Compass display accordingly.
//
// The bidding record is reset in a separate function
//
function handleNewBoardNumber() {
  var svgElem = document.getElementById("svgTextBoardNbr");
  var textBefore = svgElem.textContent; //old nbr
  var val = document.getElementById("input-board-nbr").value; //new nbr
  svgElem.textContent = val;
  boardIx = val - 1;
  dealerIx = boardIx % 4;
  vulIx = (Math.floor(boardIx / 4) + dealerIx) % 4;
  var textAfter = svgElem.textContent;
  drawCompass();
  initBiddingRecord();
  //alert("handleNewBoardNumber Before: " + textBefore + " After: " + textAfter);
}

//This is being called without <form> tag and without "submit"
//val is option value
function handleSeatDirection(val) {
  //alert("handleSeatDirection");
  if (val == "north") {
    seatIx = 0;
  }
  if (val == "east") {
    seatIx = 1;
  }
  if (val == "south") {
    seatIx = 2;
  }
  if (val == "west") {
    seatIx = 3;
  }
  drawCompass();

  if (dealerIx == seatIx) {
    promptBidder();
  }
}

function testBoardSettings() {
  var i;
  var bix = 0;
  var dix = 0;
  var vix = 0;
  var dealer = "N";
  var boardNbr = 1;
  var vul = "None";

  for (i = 0; i < 36; i++) {
    bix = i;
    dix = i % 4;
    vix = (Math.floor(bix / 4) + dix) % 4;

    dealer = seatOrder[dix];
    vul = vulOrder[vix];
    console.log(bix + 1, dix, vix, dealer, vul);
  }
}

///////////////////////////////////////////////////////////////////////////////
////// Bids and Calls /////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//
// Call Object:
// tricks: 0,1,....,7
// suit: "C", "D", "H", "S", "NT" if 0 != tricks
// suit: "empty" ("&nbsp;"),"blank" ("&ndash;") , "Pass", "X", "XX" if tricks = 0
// alert: true/false except for "blank" and "empty"
// "blank" ("&ndash;")means diagram slot empty because dealer later in rotation
// "empty"(&nbsp;) means no bid yet
//
function callObj(tricks, suit, alert) {
  this.tricks = tricks;
  this.suit = suit;
  this.alert = alert;
}

///////////////////////////////////////////////////////////////////////////////
// Reset the bidding record by clearing all cells
// Inserts &ndash; to left of bidder
// Set up 4 callObj's for the first round of bidding
// Set up roundCalls[0..4] with callObj's
// Set up boardRounds[0], array of rounds, with current round
// Set up seatBoards[0] with current boardArray
// Set up tableSeats[0] with this seatRecord
///////////////////////////////////////////////////////////////////////////////
function initBiddingRecord() {
  var i;
  var j;
  var row;
  var col;
  roundIx = 0;
  bidderIx = (dealerIx + 1) % 4;

  var table = document.getElementById("auction");
  for (i = 1, row; row = table.rows[i]; i++) {
    for (j = 0, col; col = row.cells[j]; j++) {
      table.rows[i].cells[j].innerHTML = "&nbsp;";
    }
  }

  //Init first round of bidding
  roundCalls = [];
  boardRounds = [];

  for (i = 0; i < 4; i++) {
    roundCalls[i] = new callObj(0, "&nbsp;", false);
  }

  if (dealerIx != 3) {
    if (dealerIx >= 0) {
      roundCalls[0].suit = "&ndash;";
    }
    if (dealerIx >= 1) {
      roundCalls[1].suit = "&ndash;";
    }
    if (dealerIx >= 2) {
      roundCalls[2].suit = "&ndash;";
    }
  }

  boardRounds[0] = roundCalls; // board of any nbr of rounds
  seatBoards[0] = boardRounds; // seat records, any number of boards
  nbrBoards[0] = boardIx + 1; // board numbers (boards can be out of order)
  tableSeats[seatIx] = seatBoards; // table has 4 seats

  //First row - header is row 0. This marks dashes
  row = table.rows[1];
  for (j = 0, col; col = row.cells[j]; j++) {
    table.rows[1].cells[j].innerHTML = roundCalls[j].suit;
  }
  if (dealerIx == seatIx) {
    promptBidder();
  }
}

// Adds the most recent bid to the table
// Info comes from biddingStatus; the table entry
// from the corresponding roundCalls and boardRounds
function updateBiddingRecord(){
  var nCalls = roundCalls.length;
  var nRounds = boardRounds.length;
  var nBoards = seatBoards.length;

  
}
