//////////////////////////////////////////////
//Global Variables
var seatIx = 0; // Seat of this tablet
var tableIx = 0; // Table of this tablet

var boardIx = 0; // Board index
var dealerIx = 0; // Dealer; function of boardIx
var vulIx = 0; // Vulnerability; function of boardIx

var roundIx = 0; //current round of bidding
var bidderIx = 0; //current bidder

var roundArray = [];

var seatOrder = ["N", "E", "S", "W"];
var bidOrder = ["W", "N", "E", "S"];
var vulOrder = ["None", "NS", "EW", "All"];
var suitNameOrder = ["Clubs", "Diams", "Hearts", "Spades", "NT"];
var suitLetterOrder = ["C", "D", "H", "S", "NT"];

var vulColor = '#d50000';
var nvulColor = '#2e7d32';

//The following is copied from the HelloWorld example
//It waits for device ready and then does nothing but console.log
var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);

  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('deviceready');

    //The input event is handled by onSubmit not onInput.
    //var tableNbr = document.getElementById("input-table-nbr");
    //tableNbr.addEventListener("input", inputTableNumber, false);

    var auction = document.getElementById("auction");
    auction.addEventListener("touchstart", handleTouch, {passive: true});

    var xSpan = document.getElementById("xYourBid");
    xSpan.addEventListener("click", removeMsgYourBid, false);

    screen.orientation.lock("portrait-primary");
    drawCompass();
  },
  // Update DOM on a Received Event (this is for splash screen)
  receivedEvent: function(id) {
    //var parentElement = document.getElementById(id);
    //var listeningElement = parentElement.querySelector('.listening');
    //var receivedElement = parentElement.querySelector('.received');

    //listeningElement.setAttribute('style', 'display:none;');
    //receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  }
};

// Redraw the Compass svg using current values of
// the globals for board, table etc.
// A refresh callable at any time (maybe even periodically)
// Also sets input fields for seat, board, table consistently
//
function drawCompass() {
  var rectTableNbr = document.getElementById("svgRectTableNbr");
  var textTableNbr = document.getElementById("svgTextTableNbr");
  var rectBoardNbr = document.getElementById("svgRectBoardNbr");
  var textBoardNbr = document.getElementById("svgTextBoardNbr");

  var rectNorth = document.getElementById("svgRectNorth");
  var textNorth = document.getElementById("svgTextNorth");
  var rectEast = document.getElementById("svgRectEast");
  var textEast = document.getElementById("svgTextEast");
  var rectSouth = document.getElementById("svgRectSouth");
  var textSouth = document.getElementById("svgTextSouth");
  var rectWest = document.getElementById("svgRectWest");
  var textWest = document.getElementById("svgTextWest");

  var tnbr = textTableNbr.textContent;
  var bnbr = textBoardNbr.textContent;
  var snbr = seatOrder[seatIx];
  var north = textNorth.textContent;
  var east = textEast.textContent;
  var south = textSouth.textContent;
  var west = textWest.textContent;

  //console.log("drawCompass");
  //console.log("T: %s, B: %s, N: %s, E: %s, S: %s, W: %s", tnbr, bnbr, north, east, south, west);
  //console.log("Six: %d, Tix: %d, Bix: %d, Dix: %d, Vix: %d", seatIx, tableIx, boardIx, dealerIx, vulIx);
  //console.log("S: %s, V: %s ", seatOrder[seatIx], vulOrder[vulIx]);

  // Table Nbr and seat direction
  tnbr = tableIx + 1;
  textTableNbr.textContent = "Table " + tnbr + snbr;
  document.getElementById("input-table-nbr").value = tnbr;

  //Board number
  bnbr = boardIx + 1;
  textBoardNbr.textContent = bnbr;
  document.getElementById("input-board-nbr").value = bnbr;

  //dealer
  if (dealerIx == 0) {
    textNorth.textContent = "N*";
  } else {
    textNorth.textContent = "N";
  }
  if (dealerIx == 1) {
    textEast.textContent = "E*";
  } else {
    textEast.textContent = "E";
  }
  if (dealerIx == 2) {
    textSouth.textContent = "S*";
  } else {
    textSouth.textContent = "S";
  }
  if (dealerIx == 3) {
    textWest.textContent = "W*";
  } else {
    textWest.textContent = "W";
  }

  //vulnerability
  if (vulIx == 0) {
    rectNorth.style.fill = nvulColor;
    rectEast.style.fill = nvulColor;
    rectSouth.style.fill = nvulColor;
    rectWest.style.fill = nvulColor;
  }
  if (vulIx == 1) {
    rectNorth.style.fill = vulColor;
    rectEast.style.fill = nvulColor;
    rectSouth.style.fill = vulColor;
    rectWest.style.fill = nvulColor;
  }
  if (vulIx == 2) {
    rectNorth.style.fill = nvulColor;
    rectEast.style.fill = vulColor;
    rectSouth.style.fill = nvulColor;
    rectWest.style.fill = vulColor;
  }
  if (vulIx == 3) {
    rectNorth.style.fill = vulColor;
    rectEast.style.fill = vulColor;
    rectSouth.style.fill = vulColor;
    rectWest.style.fill = vulColor;
  }
}

function handleSetup(){
  alert("Setup");
}
function handleMsgToLHO(){
  alert("Send a Message to LHO. (Not yet available)");
}
function handleMsgToRHO(){
  alert("Send a Message to RHO. (Not yet available)");
}
function handleRestore(){
  alert("Restore this Tablet to last known state?")
}
function handleClose(){
  alert("Close down? This will lose all data and settings" )
}

function handleTricks(idTricks) {
  roundArray[bidderIx].tricks = idTricks;
  alert(idTricks);
}

function handleSuits(idSuits) {
  roundArray[bidderIx].suit = idSuits;
  alert(idSuits);
}

function handleCalls(idCalls) {
  alert(idCalls);
}

//////////////////////////////////////////////////
// This is the event that handles input from the
// form element table number.
///////////////////////////////////////////////
function submitTableNumber(event) {
  event.preventDefault(); // prevents the "submit form action"
  simulateClick(); // causes the keyboard to hide
  handleNewTableNumber();
  return false;
}

function submitBoardNumber(event) {
  //alert("submit Board Number");
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
  //alert("handleNewTableNumber Before: " + textBefore + " After: " + textAfter);
}

/////////////////////////////////////////////////
// Board Number -> dealer & vulnerability:
/////////////////////////////////////////////////
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

//Used to cause the keyboard to hide
function simulateClick() {
  var event = new MouseEvent('touchstart', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  var cb = document.getElementById('auction');
  cb.dispatchEvent(event);
  //alert("simulate Click");
}

//The point of this is to make the soft keyboard go away.
//After input from a <form> the system wants to 'submit' the
//form. This is prevented by  calling preventDefault()
//in onSubmit(), which leaves the keyboad on screen.
//To make it go away a fake touch event is generated in the
//auction table element. When that fires the currently active
//input element is defocussed (blurred) and that causes the
//keyboard to shut down.
//
function handleTouch() {
  document.activeElement.blur();
  //alert("handle touchstart");
}

///////////////////////////////////////////////////////////////
////// Section dealing with the bids and calls ////
///////////////////////////////////////////////////////////////

//
// Call Object:
// tricks: 0,1,....,7
// suits: "C", "D", "H", "S", "NT" if 0 != tricks
// suits: "empty","blank", "Pass", "X", "XX" if tricks = 0
// alert: true/false except for "blank" and "empty"
// "blank" ("-") means diagram slot empty because dealer later in rotation
// "empty"(&nbsp;) means no bid yet
//
function callObj(tricks, suit, alert) {
  this.tricks = tricks;
  this.suit = suit;
  this.alert = alert;
}

// Resets the bidding record by clearing all cells
// Inserts &ndash; to left of bidOrder
//
function initBiddingRecord() {
  var i;
  var j;
  var row;
  var col;
  roundIx = 0;
  bidderIx = dealerIx;

  var table = document.getElementById("auction");
  for (i = 1, row; row = table.rows[i]; i++) {
    for (j = 0, col; col = row.cells[j]; j++) {
      table.rows[i].cells[j].innerHTML = "&nbsp;";
    }
  }

  //Init first round of bidding
  for (i = 0; i < 4; i++) {
    roundArray[i] = new callObj(0, "&nbsp;", false);
  }

  if (dealerIx > 0) {
    roundArray[0].suit = "&ndash;";
  }
  if (dealerIx > 1) {
    roundArray[1].suit = "&ndash;";
  }
  if (dealerIx > 2) {
    roundArray[2].suit = "&ndash;";
  }

  console.log(roundArray);

  row = table.rows[1];
  for (j = 0, col; col = row.cells[j]; j++) {
    table.rows[1].cells[j].innerHTML = roundArray[j].suit;
  }
  if (dealerIx == seatIx) {
    promptBidder();
  }
}

////// Modal MessageBox: Your Bid ////////////////////////////////////
//////////////////////////////////////////////////////////////////////
function promptBidder() {
  var msg = document.getElementById("msgYourBid");
  msg.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
function removeMsgYourBid(){
  var msg = document.getElementById('msgYourBid');
  msg.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  var msg = document.getElementById('msgYourBid');
  if (event.target == msg) {
    msg.style.display = "none";
  }
}
