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
// function recordNewBid()
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
function drawBiddingRecordTable() {
  var table = document.getElementById("auction");
  for (var i = 2; i <= 12; i++) {
    var row = table.insertRow(i);
    for (var j = 0; j < 4; j++) {
      var cell = row.insertCell(j);
      cell.innerHTML = "&nbsp;";
    }
  }
}
///////////////////////////////////////////////////////////////////////////////
// Reset the bidding record for a new board
// argument = Board Number
// Inserts &ndash; to left of bidder
// Set up 4 callObj's for the first round of bidding
// Set up roundCalls[0..4] with callObj's
// Set up boardRounds[0], array of rounds, with current round
// Set up seatBoards[0] with current boardArray
// Set up tableSeats[0] with this seatRecord
//
//
///////////////////////////////////////////////////////////////////////////////
function initBiddingRecord(boardNr) {
  var i;
  var j;
  var row;
  var col;

  roundIx = 0;
  bidderIx = (dealerIx + 1) % 4;
  boardIx = boardNr - 1;

  // All cells of the table are emptied
  var table = document.getElementById("auction");
  for (i = 1, row; row = table.rows[i]; i++) {
    for (j = 0, col; col = row.cells[j]; j++) {
      table.rows[i].cells[j].innerHTML = "&nbsp;";
      unhiliteBiddingRecordCell(i,j);
    }
  }

  //Init first round of bidding
  seatsRec = []; //array of 4 calls objects
  roundsRec = []; //array of rounds, each entry a seatsRec

  for (i = 0; i < 4; i++) {
    seatsRec[i] = new callObj(0, "&nbsp;", false); //space is code for none
  }

  if (dealerIx != 3) {
    if (dealerIx >= 0) {
      seatsRec[0].suit = "&ndash;"; //dash means no bidder this round
    }
    if (dealerIx >= 1) {
      seatsRec[1].suit = "&ndash;";
    }
    if (dealerIx >= 2) {
      seatsRec[2].suit = "&ndash;";
    }
  }
  roundsRec[0] = seatsRec;
  boardsRec[boardIx] = roundsRec;

  //First row - header is row 0. This marks dashes in row 1
  row = table.rows[1];
  for (j = 0, col; col = row.cells[j]; j++) {
    table.rows[1].cells[j].innerHTML = seatsRec[j].suit;
  }
  //if (dealerIx == seatIx) {
  if (bidderIx == ((seatIx + 1) % 4)) {
    promptBidder(true);
  }
}

///////////////////////////////////////////////////////////////////////////////
// Adds the most recent bid to the table
// Info comes from bStat; the table entry coordinates
// from the corresponding round and boardRounds
function updateBiddingRecord() {
  var newCall = makeBidRecordEntry();
  setCurrentBiddingRecordCell(newCall);
  //console.log("UpdateBiddingRec", newCall);
}

///////////////////////////////////////////////////////////////////////////////
// Construct the text to be shown in the table cell
// The info comes from the "new" part of bStat
// Returns a string
// The string consists of 3 <span> elements and goes into the innerHTML
// of the current cell
//
function makeBidRecordEntry() {
  var newSuit = bStat.newSuit;
  var newTricks = bStat.newTricks;
  var newCall = bStat.newCall;
  var newAlert = bStat.newAlert;
  var newEntry = "";

  if (newTricks > 0) {
    newEntry = '<span class="record-tricks">' + newTricks + '</span>';
  } else {
    newEntry = '<span>' + '' + '</span>';
  }

  if (newSuit == "Clubs") {
    newEntry = newEntry + '<span class="clubs">' + '&clubs;' + '</span>';
  }
  if (newSuit == "Diams") {
    newEntry = newEntry + '<span class="diams">' + '&diams;' + '</span>';
  }
  if (newSuit == "Hearts") {
    newEntry = newEntry + '<span class="hearts">' + '&hearts;' + '</span>';
  }
  if (newSuit == "Spades") {
    newEntry = newEntry + '<span class="spades">' + '&spades;' + '</span>';
  }
  if (newSuit == "NT") {
    newEntry = newEntry + '<span class="nt">' + 'NT' + '</span>';
  }
  if (newSuit == "none") {
    newEntry = newEntry + '<span>' + '' + '</span>';
  }

  if (newCall == "X") {
    newEntry = newEntry + '<span class="dbl">' + 'X' + '</span>';
  }
  if (newCall == "XX") {
    newEntry = newEntry + '<span class="rdbl">' + 'XX' + '</span>';
  }
  if (newCall == "Pass") {
    newEntry = newEntry + '<span class="pass">' + 'Pass' + '</span>';
  }
  if (newCall == "none") {
    newEntry = newEntry + '<span>' + '' + '</span>';
  }

  if (newAlert == true) {
    newEntry = newEntry + '<span class="record-alert">' + '!!' + '</span>';
    //newEntry = newEntry + '<span class="record-alert">' + '&#x26a0;' + '</span>';
  }

  return (newEntry);
}

///////////////////////////////////////////////////////////////////////////////
//  Finds cell coordinates and sets contents to newCall
//
function setCurrentBiddingRecordCell(newCall) {
  var colIx = bidderIx;
  var rowIx = roundsRec.length; //row 0 is header
  var table = document.getElementById("auction");
  var cell = table.rows[rowIx].cells[colIx];

  //cell.style.background = "yellow";
  //cell.style.color = red;
  table.rows[rowIx].cells[colIx].innerHTML = newCall;

  //console.log("Set Cell: ", newCall);
}

///////////////////////////////////////////////////////////////////////////////
// If both row and col >= 0 then that cell is hilited
// If either arguent < 0 then the current cell is hilited
//
function hiliteBiddingRecordCell(row,col) {
  var colIx = bidderIx;
  var rowIx = roundsRec.length; //row 0 is header

  if((row >= 0) && (col >= 0)){
    colIx = col;
    rowIx = row;
  }

  var table = document.getElementById("auction");
  var cell = table.rows[rowIx].cells[colIx];
  cell.style.background = modalBgColor;
}

///////////////////////////////////////////////////////////////////////////////
// If both row and col >= 0 then that cell is unhilited
// If either arguent < 0 then the current cell is unhilited
//
function unhiliteBiddingRecordCell(row,col) {
  var colIx = bidderIx;
  var rowIx = roundsRec.length; //row 0 is header

  if((row >= 0) && (col >= 0)){
    colIx = col;
    rowIx = row;
  }

  var table = document.getElementById("auction");
  var cell = table.rows[rowIx].cells[colIx];
  cell.style.background = mainBgColor;
}

///////////////////////////////////////////////////////////////////////////////
// Called when player prompted to bid.
// The bidding status is a structure that contains all the information
// necessary to manage the bidding box. This initialization obtains the
// necessary info from the bidding record contents, which is contained
// in the roundsRec and seatsRec arrays.
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
  var passCount = 0;

  var nRounds = roundsRec.length;
  //console.log("getStatus rounds: ", nRounds, boardRounds);

  // Get the last bid(bidder,tricks,suit) bid by anyone
  for (var i = 0; i < nRounds; i++) {
    for (var j = 0; j < 4; j++) {
      if (roundsRec[i][j].tricks != 0) {
        bidIx = j;
        bidder = bidOrder[j];
        tricks = roundsRec[i][j].tricks;
        suit = roundsRec[i][j].suit;
        dbl = false;
        rdbl = false;
        passCount = 0;
      } else {
        if (roundsRec[i][j].suit == "X") {
          dbl = true;
          passCount = 0;
        }
        if (roundsRec[i][j].suit == "XX") {
          rdbl = true;
          passCount = 0;
        }
        if (roundsRec[i][j].suit == "Pass") {
          passCount += 1;
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
  bStat.passCount = passCount;
  bStat.newTricks = 0;
  bStat.newSuit = "none";
  bStat.newCall = "none";
  bStat.newAlert = false;

  //console.log("Status ", nRounds, bStat);
}

///////////////////////////////////////////////////////////////////////////////
// Called when bid submitted.
// Update the tables for bid, round, board, seat
// Generate new bStat taking the new bid into account
//
function recordNewBid() {

  var bA = bStat.newAlert;
  var nT = bStat.newTricks;
  var nS = bStat.newSuit;
  var nC = bStat.newCall;
  if (nT == 0) {
    nS = nC;
  }
  var cObj = new callObj(nT, nS, bA);
  seatsRec[bidderIx] = cObj;

  if (bidderIx == 3) { // append new round
    seatsRec = [];
    var len = roundsRec.length;
    roundsRec[len] = seatsRec;
    for (var i = 0; i < 4; i++) {
      seatsRec[i] = new callObj(0, "&nbsp;", false); //space is code for none
    }
  }
  //console.log("recordNewBid RoundsRec: ", roundsRec );

  //console.log("record bid", bStat, cObj);
  //console.log(boardsRec, roundsRec, seatsRec, cObj);
}
