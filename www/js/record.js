///////////////////////////////////////////////////////////////////////////////
// Functions dealing with the table shown at the top of the screen
// and with the data it contains.
// Further, the bidding records of previous boards are maintained for
// this and the 3 other seats
///////////////////////////////////////////////////////////////////////////////
//
// function callObj(tricks, suit, alert)
// function drawBiddingRecordTable()
// function initBiddingRecord()
// function updateBiddingRecord()
// function makeBidRecordEntry()
// function setCurrentBiddingRecordCell(newCall)
// function getbStat()
//
//
///////////////////////////////////////////////////////////////////////////////
// Call Object: The content of a table cell
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
// Draw an empty table with header and 10 rows of 4 cells
//
function drawBiddingRecordTable(){
  var table = document.getElementById("auction");
  for (var i = 2; i <= 10; i++) {
    var row = table.insertRow(i);
    for (var j = 0; j < 4; j++) {
      var cell = row.insertCell(j);
      cell.innerHTML = "&nbsp;";
    }
  }
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

  //console.log("initBiddingRecord", seatIx, tableIx, boardIx, dealerIx, vulIx, roundIx, bidderIx);
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
    //console.log("prompt in init bidding record");
  }
}

///////////////////////////////////////////////////////////////////////////////
// Adds the most recent bid to the table
// Info comes from bStat; the table entry
// from the corresponding roundCalls and boardRounds
function updateBiddingRecord() {
  var newCall = makeBidRecordEntry();
  setCurrentBiddingRecordCell(newCall);
}

///////////////////////////////////////////////////////////////////////////////
// Construct the text to be shown in the table cell
// The info comes from the "new" part of bStat
// Returns a string
//
function makeBidRecordEntry() {
  var newSuit = bStat.newSuit;
  if (newSuit == "Clubs") {
    newSuit = "&clubs;";
  }
  if (newSuit == "Diams") {
    newSuit = "&diams;";
  }
  if (newSuit == "Hearts") {
    newSuit = "&hearts;";
  }
  if (newSuit == "Spades") {
    newSuit = "&spades;";
  }
  if (newSuit == "none") {
    newSuit = "";
  }

  var newCall = bStat.newCall;
  if (newCall == "none") {
    newCall = "";
  }

  if (bStat.newTricks == 0) {
    if (bStat.newAlert == true) {
      newCall = newCall + "!";
    }
  } else {
    newCall = bStat.newTricks + newSuit;
    if (bStat.newAlert == true) {
      newCall = newCall + "!";
    }
  }
  return (newCall);
}

///////////////////////////////////////////////////////////////////////////////
//  Finds cell coordinates and sets contents to newCall
//
function setCurrentBiddingRecordCell(newCall) {
  var colIx = bidderIx;
  var rowIx = boardRounds.length; //row 0 is header
  var table = document.getElementById("auction");
  var cell = table.rows[rowIx].cells[colIx];

  //cell.style.background = "yellow";
  table.rows[rowIx].cells[colIx].innerHTML = newCall;

  //console.log("Set Cell: ", newCall);
}

function hiliteCurrentBiddingRecordCell(){
  var colIx = bidderIx;
  var rowIx = boardRounds.length; //row 0 is header
  var table = document.getElementById("auction");
  var cell = table.rows[rowIx].cells[colIx];
  //cell.style.background = "#0288D1";
  cell.style.background = "#C5E1A5";
}
function unhiliteCurrentBiddingRecordCell(){
  var colIx = bidderIx;
  var rowIx = boardRounds.length; //row 0 is header
  var table = document.getElementById("auction");
  var cell = table.rows[rowIx].cells[colIx];
  cell.style.background = "#26a69a";

}

///////////////////////////////////////////////////////////////////////////////
// Called when player prompted to bid.
// The bidding status is a structure that contains all the information
// necessary to manage the bidding box. This initialization obtains the
// necessary info from the bidding record contents, which is contained
// in the roundCalls and boardRounds arrays.
//
// The state of the bidding: bStat
// lastBidder: "ME", "PA", "LH", "RH", "NO"
// tricks: #d the bid level
// suit: "C", "D", "H", "S", "NT", "none"
// dbl and rdble: true/false
// var bStat = {lastBidder: "NO", tricks: 0, suit: "none", dbl: false,
// rdbl: false, newTricks: 0, newSuit: "none", newCall: "none", newAlert: false};
//
// further, the bStat structure contains the current (unconfirmed)
// (tricks,suit,call) selections:
// newTricks: 0, newSuit: "none", newCall: "none", newAlert: false
//
function getbStat() {

  var lastBidder = "NO";
  var bidIx = -1;
  var tricks = 0;
  var suit = "none";
  var dbl = false;
  var rdbl = false;

  var nRounds = boardRounds.length;
  //console.log("getStatus rounds: ", nRounds, boardRounds);

  // Get the last bid(bidder,tricks,suit) bid by anyone
  for (var i = 0; i < nRounds; i++) {
    for (var j = 0; j < 4; j++) {
      if (boardRounds[i][j].tricks != 0) {
        bidIx = j;
        bidder = bidOrder[j];
        tricks = boardRounds[i][j].tricks;
        suit = boardRounds[i][j].suit;
      } else {
        if (boardRounds[i][j].suit == "X") {
          dbl = true;
          rdbl = false;
        }
        if (boardRounds[i][j].suit == "XX") {
          dbl = false;
          rdble = true;
        }
      }
    }
  }
  if (tricks == 0) { //there is no prior bid
    bStat.lastBidder = "NO";
    bStat.tricks = 0;
    bStat.suit = "none";
    bStat.dbl = false;
    bStat.rdbl = false;
  } else { // there is a prior bid
    if (((seatIx + 0) % 4) == bidIx) {
      bStat.lastBidder = "RH";
    }
    if (((seatIx + 1) % 4) == bidIx) {
      bStat.lastBidder = "ME";
    }
    if (((seatIx + 2) % 4) == bidIx) {
      bStat.lastBidder = "LH";
    }
    if (((seatIx + 3) % 4) == bidIx) {
      bStat.lastBidder = "PA";
    }

    bStat.tricks = tricks;
    bStat.suit = suit;

    bStat.dbl = dbl;
    bStat.rdbl = rdbl;
  }
  bStat.newTricks = 0;
  bStat.newSuit = "none";
  bStat.newCall = "none";
  bStat.newAlert = false;

  //console.log("Status ", nRounds, bStat);
}
