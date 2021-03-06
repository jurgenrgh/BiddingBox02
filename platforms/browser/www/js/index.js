/////////////////////////////////////////////////////////////////////////////
///////// Routine Operations //////////////////
/////////////////////////////////////////////////////////////////////////////

function handleRestart() {
  popupBoxYesNo("Are you sure? This will clear all data.", "Yes", "Cancel", "restart", -1);
}

function confirmRestart() {
  boardIx = 0; // Board index
  dealerIx = 0; // Dealer; function of boardIx
  vulIx = 0; // Vulnerability; function of boardIx

  roundIx = 0; //current round of bidding
  bidderIx = 1; //current bidder (bid order ix)
  hidePopupBox();
  drawCompass();
  clearBidBox();
  initBiddingRecord(1);
  enableInput();
}

function cancelRestart() {
  hidePopupBox();
}

//////////////////////////////////////////////////////////////////////////////
//// Table, Board Number and Seat Input //////////
//////////////////////////////////////////////////////////////////////////////
function submitPin(event) {
  event.preventDefault(); // prevents the "submit form action"
  simulateClick(); // causes the keyboard to hide
  handlePin();
  return false;
}
function submitSectionId(event) {
  event.preventDefault(); // prevents the "submit form action"
  simulateClick(); // causes the keyboard to hide
  handleNewSectionId();
  return false;
}

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

function submitFirstBoardNumber(event) {
  event.preventDefault(); // prevents the "submit form action"
  simulateClick(); // causes the keyboard to hide
  handleFirstBoardNumber();
  return false;
}

function submitLastBoardNumber(event) {
  event.preventDefault(); // prevents the "submit form action"
  simulateClick(); // causes the keyboard to hide
  handleLastBoardNumber();
  return false;
}

function submitSendMessage(event) {
  event.preventDefault(); // prevents the "submit form action"
  simulateClick(); // causes the keyboard to hide
  var val = document.getElementById("input-message-id").value; //new message
  var buf = arrayBufferFromString(val);
  //console.log(val);
  var str = stringFromArrayBuffer(buf);
  //console.log(str);
}

var lhoConnected = false;
var rhoConnected = false;
var lhoSocketId;
var rhoSocketId;

function msgToRho() {
  var val = document.getElementById("input-message-id").value;
  var buf = arrayBufferFromString(val);

  if (rhoConnected) {
    networking.bluetooth.send(rhoSocketId, buf, function(bytes_sent) {
      console.log('Sent ' + bytes_sent + ' bytes ' + val + ' rhoSocket: ' + rhoSocketId);
    }, function(errorMessage) {
      console.log('Send failed: ' + errorMessage + ' msg: ' + val + ' rhoSocket: ' + rhoSocketId);
    });
  } else {
    console.log("RHO not connected, message not sent");
  }
}

function msgToLho() {
  var val = document.getElementById("input-message-id").value;
  var buf = arrayBufferFromString(val);

  if (lhoConnected) {
    networking.bluetooth.send(lhoSocketId, buf, function(bytes_sent) {
      console.log('Sent ' + bytes_sent + ' bytes ' + val + ' lhoSocket: ' + lhoSocketId);
    }, function(errorMessage) {
      console.log('Send failed: ' + errorMessage  + ' msg: ' + val + ' lhoSocket: ' + lhoSocketId);
    });
  } else {
    console.log("LHO not connected, message not sent");
  }
}

function handleNewSectionId() {
  var svgElem = document.getElementById("svgTextTableNbr");
  var textBefore = svgElem.textContent; //old nbr
  var val = document.getElementById("input-section-id").value; //new section
  var tnbr = tableIx + 1;
  var seat = seatOrder[seatIx];
  svgElem.textContent = "Table " + val + tnbr + seat;
  sectionId = val;
  var textAfter = svgElem.textContent;
  console.log("New Section", textAfter);
  drawCompass();
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

function handlePin() {
  var val = document.getElementById("input-pin").value; //pin value
  if (val == validPin) {
    //todo: enable all the buttons on console
  } else {
    popupBox("The valid Pin is 1234", 3);
  }
}

function handleFirstBoardNumber() {
  var val = document.getElementById("first-board-nbr").value; //new nbr
  firstBoardNbr = val;
  popupBox("First & Last Board Numbers = " + firstBoardNbr + ", " + lastBoardNbr, 5);
}

function handleLastBoardNumber() {
  var val = document.getElementById("last-board-nbr").value; //new nbr
  lastBoardNbr = val;
  popupBox("First & Last Board Numbers = " + firstBoardNbr + ", " + lastBoardNbr, 5);
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
  initBiddingRecord(val);
  //alert("handleNewBoardNumber Before: " + textBefore + " After: " + textAfter);
}

///////////////////////////////////////////////////////////////////////////////
//This is being called without <form> tag and without "submit"
//val is option value
// prompt = true makes "promptbidder" popup show
//
function handleSeatDirection(val, popup) {
  //console.log("handleseat", val, seatIx, bidderIx, dealerIx, boardIx);
  if (val == "N") {
    seatIx = 0;
  }
  if (val == "E") {
    seatIx = 1;
  }
  if (val == "S") {
    seatIx = 2;
  }
  if (val == "W") {
    seatIx = 3;
  }
  drawCompass();

  if (bidderIx == ((seatIx + 1) % 4)) {
    promptBidder(popup);
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

function promptBidder(popup) {
  //console.log("prompt");
  getbStat();
  //console.log("prompt status", bStat);
  prepBidBox();
  hiliteBiddingRecordCell();
  if (popup == true) {
    popupBox("Your turn: Please bid", 4);
  }
  disableInput();
}

///////////////////////////////////////////////////////////////////////////////
// The bidder has pressed the submit button (check symbol in BB)
// Now he is asked "are you sure" in different ways depending
// upon the bidding phase; namely, passout, final contract, or
// continuing.
// This function is called after the submit button is clicked but
// before any other action
//
function confirmSelectedBid() {
  var passCount = bStat.passCount;
  if (bStat.newCall == "Pass") {
    passCount += 1;
  }
  //console.log("Nbr of passes", passCount);
  // Board being passed out
  if (passCount == 4) {
    popupBoxYesNo("Board passed out", "Confirm", "Cancel Pass", "confirmPassout", -1);
  }

  // Contract being set - end of bidding
  if ((passCount == 3) && (bStat.tricks != 0)) {
    var tricks = bStat.tricks;
    var suit = bStat.suit;
    var dbl = bStat.dbl;
    var rdbl = bStat.rdbl;
    var x = "";
    if (dbl)
      x = "X";
    if (rdbl)
      x = "XX";

    if (suit == "Spades")
      suit = "&spades;";
    if (suit == "Hearts")
      suit = "&hearts;";
    if (suit == "Diams")
      suit = "&diams;";
    if (suit == "Clubs")
      suit = "&clubs;";

    var contract = tricks.toString(10) + suit + x;
    popupBoxYesNo("Contract: " + contract, "Confirm", "Cancel Pass", "confirmContract", -1);
  }

  // Bidding not finished: normal move to next bidder
  if ((passCount < 3) || ((bStat.tricks == 0) && (passCount == 3))) {
    var bid = makeBidRecordEntry();
    popupBoxYesNo("Your bid is " + bid, "Confirm", "Cancel Bid", "confirmBid", -1);
  }
}

// The bidder has passed and agrees that the hand is to be passed out
function confirmPassout() {
  enableInput();
  //console.log("confirmPassout");
}

function cancelPassout() {
  //console.log("cancelPassout");
  cancelCurrentBid();
}

function confirmContract() {
  enableInput();
  unhiliteBiddingRecordCell();
  var t = makeBidRecordEntry();
  recordNewBid();
  clearBidBox();
  getbStat();
  var contract = getContract();
  popupBoxYesNo("Final Contract: " + contract + "<br/>Bid next board?", "Yes", "No", "finalContract", -1);
}

function cancelContract() {
  cancelCurrentBid();
  //console.log("cancelContract");
}

function confirmBid() {
  //console.log("confirmBid entry", bStat.passCount, bStat);
  unhiliteBiddingRecordCell();
  var t = makeBidRecordEntry();
  recordNewBid();
  clearBidBox();

  getbStat();
  //console.log("confirmBid exit", bStat.passCount, bStat);

  //var sd = bidOrder[(bidderIx + 1) % 4]; next bidder
  //popupBoxOK("Tablet moves to the next bidder (" + sd + ")", "OK", "nextseat", -1);

  var seat = seatOrder[(seatIx + 1) % 4];
  bidderIx = (bidderIx + 1) % 4;
  handleSeatDirection(seat, false);

}

function cancelBid() {
  //console.log("cancelBid");
  cancelCurrentBid();
}

function bidNextBoard() {
  boardIx += 1;
  var bnbr = boardIx + 1;
  document.getElementById("input-board-nbr").value = bnbr;
  handleNewBoardNumber();
}
