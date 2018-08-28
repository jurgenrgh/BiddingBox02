//////////////////////////////////////////////
//Global Variables
var seatIx = 2; // Seat of this tablet
var tableIx = 0; // Table of this tablet

var boardIx = 0; // Board index
var dealerIx = 0; // Dealer; function of boardIx
var vulIx = 0; // Vulnerability; function of boardIx

var roundIx = 0; //current round of bidding
var bidderIx = 0; //current bidder (bid order ix)

// The state of the bidding
// lastBidder: "ME", "PA", "LH", "RH", "NO"
// tricks: #d the level bids
// suit: "C", "D", "H", "S", "NT", "none"
// dbl and rdble: true/false
// boxOpen: true/false this seat is bidding
var biddingStatus = {
  lastBidder: "NO",
  tricks: 0,
  suit: "none",
  dbl: false,
  rdbl: false,
  boxOpen: false,
  newTricks: 0,
  newSuit: "none",
  newCall: "none",
  newAlert: false
};

var roundCalls = []; // round of 4 call objects
var boardRounds = []; // board of any nbr of rounds
var seatBoards = []; // seat records, any number of boards
var nbrBoards = []; // board numbers (boards can be out of order)
var tableSeats = []; // table has 4 seats

var seatOrder = ["N", "E", "S", "W"];
var bidOrder = ["W", "N", "E", "S"];
var vulOrder = ["None", "NS", "EW", "All"];
var suitNameOrder = ["Clubs", "Diams", "Hearts", "Spades", "NT"];
var suitLetterOrder = ["C", "D", "H", "S", "NT"];

var modalBGColor = '#bf360C';
var vulColor = '#d50000';
var nvulColor = '#2e7d32';

//The following is copied from the PhoneGap HelloWorld example
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

    var xSpan = document.getElementById("xModalBox");
    xSpan.addEventListener("click", hidePopupBox, false);

    screen.orientation.lock("portrait-primary");
    drawCompass();
    //console.log("drawCompass done");
    initBiddingRecord();
    //console.log("initBidding done");
    clearBidBox();
    //console.log("clearBidBox done");
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
  var seat = seatOrder[seatIx];
  var north = textNorth.textContent;
  var east = textEast.textContent;
  var south = textSouth.textContent;
  var west = textWest.textContent;

  // Table Nbr and seat direction
  tnbr = tableIx + 1;
  textTableNbr.textContent = "Table " + tnbr + seat;
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

//////////////////////////////////////////////////////////////////////
////// Modal MessageBox: Your Bid ////////////////////
//////////////////////////////////////////////////////////////////////
function promptBidder() {
  getBiddingStatus();
  prepBidBox();
  popupBox("Your turn: Please bid", "", "", "", 5);
}

// When the user clicks on <span> (x), close the modal
function hidePopupBox() {
  var msg = document.getElementById('msgBox');
  msg.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  var msg = document.getElementById('msgBox');
  if (event.target == msg) {
    msg.style.display = "none";
  }
}

// The popup messageBox is called with a text
// and 2 buttons. The buttons appear only if
// the text argument is not blank
function popupBox(msgText, yesButtonText, noButtonText, doButtonText, timeout) {
  var msg = document.getElementById("msgBox");
  msg.style.display = "block"; //make it visible

  var txt = document.getElementById("modalMsgText");
  txt.innerHTML = msgText;

  var bYes = document.getElementById("yesButton");
  if (yesButtonText != "") {
    bYes.innerHTML = yesButtonText;
    bYes.style.visibility = "visible";
  } else {
    bYes.style.visibility = "hidden";
  }

  var bNo = document.getElementById("noButton");
  if (noButtonText != "") {
    bNo.innerHTML = noButtonText;
    bNo.style.visibility = "visible";
  } else {
    bNo.style.visibility = "hidden";
  }

  var bDo = document.getElementById("doButton");
  if (doButtonText != "") {
    bDo.innerHTML = doButtonText;
    bDo.style.visibility = "visible";
  } else {
    bDo.style.visibility = "hidden";
  }
  //timeout in ms
  if (timeout > 0) {
    timeout = timeout * 1000;
    setTimeout(hidePopupBox, timeout);
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

///////////////////////////////////////////////////////////////////////////////
//Disable and grey out the bids and calls individually ///////////
//////////////////////////////////////////////////////////////////////////////
function disableTricksBid(idTricks) {
  var targetDiv = document.getElementById(idTricks);
  if (targetDiv != null) {
    targetDiv.classList.add("disabled");
  }
}

function enableTricksBid(idTricks) {
  var targetDiv = document.getElementById(idTricks);
  if (targetDiv != null) {
    targetDiv.classList.remove("disabled");
  }
}

function disableSuitBid(idSuit) {
  var targetDiv = document.getElementById(idSuit);
  if (targetDiv != null) {

    targetDiv.classList.add("disabled");
  }
}

function enableSuitBid(idSuit) {
  var targetDiv = document.getElementById(idSuit);
  if (targetDiv != null) {
    targetDiv.classList.remove("disabled");
  }
}

function disableCall(idCall) {
  var targetDiv = document.getElementById(idCall);
  if (targetDiv != null) {
    targetDiv.classList.add("disabled");
  }
}

function enableCall(idCall) {
  var targetDiv = document.getElementById(idCall);
  if (targetDiv != null) {
    targetDiv.classList.remove("disabled");
  }
}

function selectTricksBid(idTricks) {
  var targetDiv = document.getElementById(idTricks);
  if (targetDiv != null) {
    targetDiv.classList.add("hiliteBid");
  }
}

function unselectTricksBid(idTricks) {
  var targetDiv = document.getElementById(idTricks);
  if (targetDiv != null) {
    targetDiv.classList.remove("hiliteBid");
  }
}
function selectSuitBid(idSuit) {
  var targetDiv = document.getElementById(idSuit);
  if (targetDiv != null) {
    targetDiv.classList.add("hiliteBid");
  }
}

function unselectSuitBid(idSuit) {
  var targetDiv = document.getElementById(idSuit);
  if (targetDiv != null) {
    targetDiv.classList.remove("hiliteBid");
  }
}
function selectCall(idCall) {
  var targetDiv = document.getElementById(idCall);
  if (targetDiv != null) {
    targetDiv.classList.add("hiliteBid");
  }
}

function unselectCall(idCall) {
  var targetDiv = document.getElementById(idCall);
  if (targetDiv != null) {
    targetDiv.classList.remove("hiliteBid");
  }
}

function setPopupValue(val) {
  var yb = document.getElementById("yesButton");
  yb.value = val;
  var nb = document.getElementById("noButton");
  nb.value = val;
  var db = document.getElementById("doButton");
  db.value = val;
}

//The button value is set when the popupbox is opened
//It identifies the required action
function yesButton() {
  var b = document.getElementById("yesButton");
  var t = b.innerHTML;
  var val = b.value;

  if (val == "PassCall") {
    confirmPassCall();
  }
}

function noButton() {
  var b = document.getElementById("noButton");
  var t = b.innerHTML;
  var val = b.value;

  if (val == "PassCall") {
    undoPassCall();
  }
}

function doButton() {
  var b = document.getElementById("doButton");
  var t = b.innerHTML;
  var val = b.value;

  if (val == "PassCall") {
    alertPassCall();
  }
}
