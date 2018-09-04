/////////////////////////////////////////////////////////////////////////////
///////// Routine Operations //////////////////////////
/////////////////////////////////////////////////////////////////////////////
function handleSetup() {
  alert("General Setup. Will handle Table, Seat " +
  "and possibly board series assignment. Also " +
  "any other settings not under control of the player. " +
  "A protected director function. Not implemented");
}

function handleLHO() {
  alert("Send a Message to LHO: Not implemented");
}

function handleRHO() {
  alert("Send a Message to RHO: Not implemented");
}

function handleRestart() {
  boardIx = 0; // Board index
  dealerIx = 0; // Dealer; function of boardIx
  vulIx = 0; // Vulnerability; function of boardIx

  roundIx = 0; //current round of bidding
  bidderIx = 1; //current bidder (bid order ix)

  console.log("restart");
  drawCompass();
  clearBidBox();
  initBiddingRecord(1);
}

//Rotate the direction where tablet is located
function handleNextSeat() {
  alert("next seat");
}

//////////////////////////////////////////////////////////////////////////////
//// Table, Board Number and Seat Input //////////////////
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
  initBiddingRecord(val);
  //alert("handleNewBoardNumber Before: " + textBefore + " After: " + textAfter);
}

//This is being called without <form> tag and without "submit"
//val is option value
function handleSeatDirection(val) {
  //alert("handleSeatDirection " + val);
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

  //if (dealerIx == seatIx) {
  if (bidderIx == ((seatIx + 1) % 4)) {
    promptBidder();

    //console.log("handleseat", val, seatIx, bidderIx, dealerIx, boardIx);
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

function promptBidder() {
  //console.log("prompt");
  getbStat();
  console.log("prompt status", bStat);
  prepBidBox();
  hiliteCurrentBiddingRecordCell();
  //console.log("missing popup");
  popupBox("Your turn: Please bid", 5);
}

function promptNextSeat(passCount){
  var sd = bidOrder[(bidderIx + 1) % 4];

  if(passCount == 4){
    //setPopupButtonValue("OK", "PassOut");
    popupBox("Passed out: Waiting for next Board", -1);
  }

  if((passCount == 3) && (bStat.tricks != 0)){
    //setPopupButtonValue("OK", "Contract");
    var tricks = bStat.tricks;
    var suit = bStat.suit;
    var dbl = bStat.dbl;
    var rdbl = bStat.rdbl;
    var x = "";
    if(dbl)  x = "X";
    if(rdbl) x = "XX";

    if(suit == "Spades") suit = "&spades;";
    if(suit == "Hearts") suit = "&hearts;";
    if(suit == "Diams") suit = "&diams;";
    if(suit == "Clubs") suit = "&clubs;";

    var contract = tricks.toString(10) + suit + x;
    popupBox("Contract: " + contract + "   Waiting for next Board", -1);
  }

  if( (passCount < 3) || ((bStat.tricks == 0) && (passCount == 3)) )
  {
    setPopupButtonValue("OK", "NextSeat");
    popupBoxOK("Tablet will move to the next seat (" + sd + ")", "OK", -1);
  }
}
