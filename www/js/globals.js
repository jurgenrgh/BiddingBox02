//////////////////////////////////////////////
//Global Variables
//////////////////////////////////////////////
// Box Variables
//
var seatIx = 1; // Seat of this tablet
var tableIx = 0; // Table of this tablet
var sectionId = "A"; // an additional id for table/tournament/session

var boardIx = 0; // Board index
var dealerIx = 0; // Dealer; function of boardIx
var vulIx = 0; // Vulnerability; function of boardIx

var roundIx = 0; //current round of bidding
var bidderIx = 1; //current bidder (bid order ix: WNES)

var validPin = 1234;
var firstBoardNbr = 1; //can be set by the director as first of current series
var lastBoardNbr = 16; //dito

/////////////////////////////////////////////////////////////////////////
// Bluetooth Names and addresses
//
var thisTabletBtName = "void";
var thisTabletBtAddress = "void";

var pairedBtNames = [];
var pairedBtAddresses = [];

var rhoBtName = "void";
var lhoBtName = "void";
var rhoBtAddress = "void";
var lhoBtAddress = "void";

var uuid = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
var listeningForConnectionRequest = false;
var lhoConnected = false;
var rhoConnected = false;
var lhoSocketId = -1;
var rhoSocketId = -1;
var serverSocketId = -1;

/////////////////////////////////////////////////////////////
// The state of the bidding
//
// lastBidder: "ME", "PA", "LH", "RH", "NO"
// tricks: #d the level bids
// suit: "Clubs", "Diams", "Hearts", "Spades", "NT", "none"
// dbl and rdble: true/false
// boxOpen: true/false this seat is bidding
// newCall: "X", "XX", "Pass", "none"
//
var bStat = {
  lastBidder: "NO",
  tricks: 0,
  suit: "none",
  dbl: false,
  rdbl: false,
  passCount: 0,
  boxOpen: false,
  newTricks: 0,
  newSuit: "none",
  newCall: "none",
  newAlert: false
};

var boardsRec = []; // an array of roundsRec arrays
var roundsRec = []; // an array of seatsRec arrays
var seatsRec = []; // an array of 4 callObj objects

var seatOrder = ["N", "E", "S", "W"];
var bidOrder = ["W", "N", "E", "S"];
var vulOrder = ["None", "NS", "EW", "All"];
var suitNameOrder = ["Clubs", "Diams", "Hearts", "Spades", "NT"];
var suitLetterOrder = ["C", "D", "H", "S", "NT"];
var suitSymbols = {
  C: "&clubs;",
  D: "&diams;",
  H: "&hearts;",
  S: "&spades;",
  NT: "NT"
};

// Global colors are controlled from CSS
// The CSS values will override the colors listed here
var mainBgColor = '#26a69a';
var modalBgColor = '#bf360C';
var hiliteBidColor = '#1A237E';
var vulColor = '#d50000';
var nvulColor = '#2e7d32';

var popupTimeOutRunning;
/////// End of global variables /////////////////////////////////////////

// Some color variables are defined in the :root element in css
// This routine fetches them for use in js
//
function getCommonCssColors() {
  var root = document.querySelector(':root');
  var rootStyles = getComputedStyle(root);
  mainBgColor = rootStyles.getPropertyValue('--main-bg-color');
  modalBgColor = rootStyles.getPropertyValue('--modal-bg-color');
  hiliteBidColor = rootStyles.getPropertyValue('--hilite-bid-color');
}

///////////////////////////////////////////////////////////////////////////////
//The following was copied from the PhoneGap HelloWorld example
//It waits for device ready and then does nothing but console.log
//
// Possibly there should be a splash screen here while loading
// so the user can't initiate any action until the system is ready
//
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

    /////// Event Listeners /////////////////////////////////////////////////
    //
    var auction = document.getElementById("auction");
    auction.addEventListener("touchstart", handleTouch, {passive: true});

    var xSpan = document.getElementById("xModalBox");
    xSpan.addEventListener("click", hidePopupBox, false);
    xSpan = document.getElementById("xModalBoxOK");
    xSpan.addEventListener("click", hidePopupBox, false);
    xSpan = document.getElementById("xModalBoxYesNo");
    xSpan.addEventListener("click", hidePopupBox, false);

    // Receive Message from either LHO or RHO
    //
    networking.bluetooth.onReceive.addListener(onReceiveHandler);

    screen.orientation.lock("portrait");

    // Actual app Initialization ////////////////////////////////////////
    getCommonCssColors();
    drawCompass();
    drawBiddingRecordTable();
    //console.log("init before clearbox");
    clearBidBox();
    //console.log("init after clearbox");
    initBiddingRecord(1);
    getBtDevices();
    setConnectionState("rho", "disconnected");
    setConnectionState("lho", "disconnected");
    startBtListening();
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
  textTableNbr.textContent = "Table " + sectionId + tnbr + seat;
  document.getElementById("input-section-id").value = sectionId;
  document.getElementById("input-table-nbr").value = tnbr;
  document.getElementById("input-seat").value = seat;
  document.getElementById("first-board-nbr").value = firstBoardNbr;
  document.getElementById("last-board-nbr").value = lastBoardNbr;

  //Board number
  bnbr = boardIx + 1;
  textBoardNbr.textContent = bnbr;
  document.getElementById("input-board-nbr").value = bnbr;

  //dealer
  if (dealerIx == 0) {
    textNorth.textContent = "Dealer";
  } else {
    textNorth.textContent = "North";
  }
  if (dealerIx == 1) {
    textEast.textContent = "Dealer";
  } else {
    textEast.textContent = "East";
  }
  if (dealerIx == 2) {
    textSouth.textContent = "Dealer";
  } else {
    textSouth.textContent = "South";
  }
  if (dealerIx == 3) {
    textWest.textContent = "Dealer";
  } else {
    textWest.textContent = "West";
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

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  var msg = document.getElementById('msgBox');
  if (event.target == msg) {
    msg.style.display = "none";
  }
};

//Used to cause the keyboard to hide
function simulateClick() {
  var event = new MouseEvent('touchstart', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  var cb = document.getElementById('auction');
  cb.dispatchEvent(event);
}

//The point of handleTouch is to make the soft keyboard go away.
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
}

///////////////////////////////////////////////////////////////////////////////
//Disable and grey out the bids and calls individually /////
//////////////////////////////////////////////////////////////////////////////
function enableBidButton(idTricks) {
  var targetDiv = document.getElementById(idTricks);
  if (targetDiv != null) {
    targetDiv.classList.remove("disabled");
  }
}

//enable only suits higher ranking or same as argument
function enableHigherSuitBids(ixSuit) {
  for (var i = ixSuit; i < 5; i++) {
    var targetDiv = document.getElementById(suitNameOrder[i]);
    targetDiv.classList.remove("disabled");
  }
}

function disableBidButton(idTricks) {
  var targetDiv = document.getElementById(idTricks);
  if (targetDiv != null) {
    targetDiv.classList.add("disabled");
  }
}

///////////////////////////////////////////////////////////////////////////////
// Select means highlight the provisional choice
//
function selectBidButton(idTricks) {
  var targetDiv = document.getElementById(idTricks);
  if (targetDiv != null) {
    targetDiv.classList.add("hiliteBid");
  }
}

function unselectBidButton(idTricks) {
  var targetDiv = document.getElementById(idTricks);
  if (targetDiv != null) {
    targetDiv.classList.remove("hiliteBid");
  }
}

function unselectCallButtons() {
  unselectBidButton("XX");
  unselectBidButton("Pass");
  unselectBidButton("X");
  unselectBidButton("Alert");
}

function disableInput() {
  var sec = document.getElementById("input-section-id");
  sec.disabled = true;
  sec.style.color = 'grey';
  var secl = document.getElementById("input-section-id-label");
  secl.disabled = true;
  secl.style.color = 'grey';

  var t = document.getElementById("input-table-nbr");
  t.disabled = true;
  t.style.color = 'grey';
  var tl = document.getElementById("input-table-nbr-label");
  tl.disabled = true;
  tl.style.color = 'grey';

  var s = document.getElementById("input-seat");
  s.disabled = true;
  s.style.color = 'grey';
  var sl = document.getElementById("input-seat-label");
  sl.disabled = true;
  sl.style.color = 'grey';

  var b = document.getElementById("input-board-nbr");
  b.disabled = true;
  b.style.color = 'grey';
  var bl = document.getElementById("input-board-nbr-label");
  bl.disabled = true;
  bl.style.color = 'grey';

  var su = document.getElementById("setup");
  su.disabled = true;
  su.style.color = 'grey';
}

function enableInput() {
  var sec = document.getElementById("input-section-id");
  sec.disabled = false;
  sec.style.color = 'black';
  var secl = document.getElementById("input-section-id-label");
  secl.disabled = false;
  secl.style.color = 'black';

  var t = document.getElementById("input-table-nbr");
  t.disabled = false;
  t.style.color = 'black';
  var tl = document.getElementById("input-table-nbr-label");
  tl.disabled = false;
  tl.style.color = 'black';

  var s = document.getElementById("input-seat");
  s.disabled = false;
  s.style.color = 'black';
  var sl = document.getElementById("input-seat-label");
  sl.disabled = false;
  sl.style.color = 'black';

  var b = document.getElementById("input-board-nbr");
  b.disabled = false;
  b.style.color = 'black';
  var bl = document.getElementById("input-board-nbr-label");
  bl.disabled = false;
  bl.style.color = 'black';

  var su = document.getElementById("setup");
  su.disabled = false;
  su.style.color = 'black';
}

// Constructs string for display using bStat
function getContract() {
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

  return (contract);
}

function arrayBufferFromString(str) {
  var buf,
    bufView,
    i,
    j,
    ref,
    strLen;
  strLen = str.length;
  buf = new ArrayBuffer(strLen);
  bufView = new Uint8Array(buf);
  for (i = j = 0, ref = strLen; j < ref; i = j += 1) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

function stringFromArrayBuffer(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

// Store all local variables
// Uses the simplest possible local storage mechanism consisting
// of an unindexed list of {key,value} pairs
// The key is always the literal variable name
// The value is the actual value converted to a string
//
function storeSettings(){
  var storage = window.localStorage;

  //var seatIx = 1; // Seat of this tablet
  storage.setItem("seatIx", seatIx.toString());

  //var tableIx = 0; // Table of this tablet
  storage.setItem("tableIx", tableIx.toString());

  //var sectionId = "A"; // an additional id for table/tournament/session
  storage.setItem("sectionId", sectionId);

  //var boardIx = 0; // Board index
  storage.setItem("boardIx", boardIx.toString());

  //var dealerIx = 0; // Dealer; function of boardIx
  storage.setItem("dealerIx", dealerIx.toString());

  //var vulIx = 0; // Vulnerability; function of boardIx
  storage.setItem("vulIx", vulIx.toString());

  //var roundIx = 0; //current round of bidding
  storage.setItem("roundIx", roundIx.toString());

  //var bidderIx = 1; //current bidder (bid order ix: WNES)
  storage.setItem("bidderIx", bidderIx.toString());

  //var validPin = 1234;
  storage.setItem("validPin", validPin.toString());

  //var firstBoardNbr = 1; //can be set by the director as first of current series
  storage.setItem("firstBoardNbr", firstBoardNbr.toString());

  //var lastBoardNbr = 16; //dito
  storage.setItem("lastBoardNbr", lastBoardNbr.toString());

  // Bluetooth Names and addresses
  //var thisTabletBtName;
  storage.setItem("thisTabletBtName", thisTabletBtName);
  //var thisTabletBtAddress;
  storage.setItem("thisTabletBtAddress", thisTabletBtAddress);

  ////////////////////////////////////////////////////////////Action required !!!////////////
  //var pairedBtNames = [];
  //var pairedBtAddresses = [];

  //var rhoBtName;
  storage.setItem("rhoBtName", rhoBtName);
  //var lhoBtName;
  storage.setItem("lhoBtName", lhoBtName);
  //var rhoBtAddress;
  storage.setItem("rhoBtAddress", rhoBtAddress);
  //var lhoBtAddress;
  storage.setItem("lhoBtAddress", lhoBtAddress);

  //var uuid = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
  storage.setItem("uuid", uuid);
  //var listeningForConnectionRequest = false;
  storage.setItem("listeningForConnectionRequest", String(listeningForConnectionRequest));
  //var lhoConnected = false;
  storage.setItem("lhoConnected", String(lhoConnected));
  //var rhoConnected = false;
  storage.setItem("rhoConnected", String(rhoConnected));
  //var lhoSocketId;
  storage.setItem("lhoSocketId", lhoSocketId.toString());
  //var rhoSocketId;
  storage.setItem("rhoSocketId", rhoSocketId.toString());
  //var serverSocketId;
  storage.setItem("serverSocketId", serverSocketId.toString());

  /////////////////////////////////////////////////////////////////////////////
  // The bidding record has been skipped for the moment.
  // The current idea is an entry for each call;
  // the form could be:
  // key: 'xxyyzz', xx = board nbr, yy = round nbr, zz = seatIx
  // value: String(tricks) + suit + String(alert).
  // or
  // key: 'xxyyzz-tricks', value: String(tricks)
  // key: 'xxyyzz-suit', value: suit
  // key: 'xxyyzz-alert', value: String(alert)

  //var boardsRec = []; // an array of roundsRec arrays
  //var roundsRec = []; // an array of seatsRec arrays
  //var seatsRec = []; // an array of 4 callObj objects
}

// Restore all local variables
// Inverse of storeSettings()
//
function restoreSettings(){
  var storage = window.localStorage;

  //var seatIx = 1; // Seat of this tablet
  //storage.setItem("seatIx", seatIx.toString());
  console.log("seatIx: ", seatIx);
  seatIx = parseInt(storage.getItem("seatIx"));
  console.log("seatIx: ", seatIx);

  //var tableIx = 0; // Table of this tablet
  //storage.setItem("tableIx", tableIx.toString());
  console.log("tableIx: ", tableIx);
  tableIx = parseInt(storage.getItem("tableIx"));
  console.log("tableIx: ", tableIx);

  //var sectionId = "A"; // an additional id for table/tournament/session
  //storage.setItem("sectionId", sectionId);
  console.log("sectionId: ", sectionId);
  sectionId = storage.getItem("sectionId");
  console.log("sectionId: ", sectionId);

  //var boardIx = 0; // Board index
  //storage.setItem("boardIx", boardIx.toString());
  console.log("boardIx: ", boardIx);
  boardIx = parseInt(storage.getItem("boardIx"));
  console.log("boardIx: ", boardIx);

  //var dealerIx = 0; // Dealer; function of boardIx
  //storage.setItem("dealerIx", dealerIx.toString());
  dealerIx = parseInt(storage.getItem("dealerIx"));

  //var vulIx = 0; // Vulnerability; function of boardIx
  //storage.setItem("vulIx", vulIx.toString());
  console.log("vulIx: ", vulIx);
  vulIx = parseInt(storage.getItem("vulIx"));
  console.log("vulIx: ", vulIx);

  //var roundIx = 0; //current round of bidding
  //storage.setItem("roundIx", roundIx.toString());
  console.log("roundIx: ", roundIx);
  roundIx = parseInt(storage.getItem("roundIx"));
  console.log("roundIx: ", roundIx);

  //var bidderIx = 1; //current bidder (bid order ix: WNES)
  //storage.setItem("bidderIx", bidderIx.toString());
  console.log("bidderIx: ", bidderIx);
  bidderIx = parseInt(storage.getItem("bidderIx"));
  console.log("bidderIx: ", bidderIx);

  //var validPin = 1234;
  //storage.setItem("validPin", validPin.toString());
  console.log("validPin: ", validPin);
  validPin = parseInt(storage.getItem("validPin"));
  console.log("validPin: ", validPin);

  //var firstBoardNbr = 1; //can be set by the director as first of current series
  //storage.setItem("firstBoardNbr", firstBoardNbr.toString());
  console.log("firstBoardNbr: ", firstBoardNbr);
  firstBoardNbr = parseInt(storage.getItem("firstBoardNbr"));
  console.log("firstBoardNbr: ", firstBoardNbr);

  //var lastBoardNbr = 16; //dito
  //storage.setItem("lastBoardNbr", lastBoardNbr.toString());
  console.log("lastBoardNbr: ", lastBoardNbr);
  lastBoardNbr = parseInt(storage.getItem("lastBoardNbr"));
  console.log("lastBoardNbr: ", lastBoardNbr);

  // Bluetooth Names and addresses
  //var thisTabletBtName;
  //storage.setItem("thisTabletBtName", thisTabletBtName);
  console.log("thisTabletBtName: ", thisTabletBtName);
  thisTabletBtName = storage.getItem("thisTabletBtName");
  console.log("thisTabletBtName: ", thisTabletBtName);

  //var thisTabletBtAddress;
  //storage.setItem("thisTabletBtAddress", thisTabletBtAddress);
  console.log("thisTabletBtAddress: ", thisTabletBtAddress);
  thisTabletBtAddress = storage.getItem("thisTabletBtAddress");
  console.log("thisTabletBtAddress: ", thisTabletBtAddress);

  // What to do about these?///////////////////////////////////////////////////////////
  // Should always be searched again
  //var pairedBtNames = [];
  //var pairedBtAddresses = [];

  //var rhoBtName;
  //storage.setItem("rhoBtName", rhoBtName);
  console.log("rhoBtName: ", rhoBtName);
  rhoBtName = storage.getItem("rhoBtName");
  console.log("rhoBtName: ", rhoBtName);

  //var lhoBtName;
  //storage.setItem("lhoBtName", lhoBtName);
  console.log("lhoBtName: ", lhoBtName);
  lhoBtName = storage.getItem("lhoBtName");
  console.log("lhoBtName: ", lhoBtName);

  //var rhoBtAddress;
  //storage.setItem("rhoBtAddress", rhoBtAddress);
  console.log("rhoBtAddress: ", rhoBtAddress);
  rhoBtAddress = storage.getItem("rhoBtAddress");
  console.log("rhoBtAddress: ", rhoBtAddress);

  //var lhoBtAddress;
  //storage.setItem("lhoBtAddress", lhoBtAddress);
  console.log("lhoBtAddress: ", lhoBtAddress);
  lhoBtAddress = storage.getItem("lhoBtAddress");
  console.log("lhoBtAddress: ", lhoBtAddress);

  //var uuid = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
  //storage.setItem("uuid", uuid);
  console.log("uuid: ", uuid);
  uuid = storage.getItem("uuid");
  console.log("uuid: ", uuid);

  //var listeningForConnectionRequest = false;
  //storage.setItem("listeningForConnectionRequest", String(listeningForConnectionRequest));
  console.log("listeningForConnectionRequest: ", listeningForConnectionRequest);
  listeningForConnectionRequest = (storage.getItem("listeningForConnectionRequest") == "true");
  console.log("listeningForConnectionRequest: ", listeningForConnectionRequest);

  //var lhoConnected = false;
  //storage.setItem("lhoConnected", String(lhoConnected));
  console.log("lhoConnected: ", lhoConnected);
  lhoConnected = (storage.getItem("lhoConnected") == "true");
  console.log("lhoConnected: ", lhoConnected);

  //var rhoConnected = false;
  //storage.setItem("rhoConnected", String(lhoConnected));
  console.log("rhoConnected: ", rhoConnected);
  rhoConnected = (storage.getItem("rhoConnected") == "true");
  console.log("rhoConnected: ", rhoConnected);

  //var lhoSocketId;
  //storage.setItem("lhoSocketId", String(lhoSocketId));
  console.log("lhoSocketId: ", lhoSocketId);
  lhoSocketId = parseInt(storage.getItem("lhoSocketId"));
  console.log("lhoSocketId: ", lhoSocketId);

  //var rhoSocketId;
  //storage.setItem("rhoSocketId", String(rhoSocketId));
  console.log("rhoSocketId: ", rhoSocketId);
  rhoSocketId = parseInt(storage.getItem("rhoSocketId"));
  console.log("rhoSocketId: ", rhoSocketId);

  //var serverSocketId;
  //storage.setItem("serverSocketId", String(serverSocketId));
  console.log("serverSocketId: ", serverSocketId);
  serverSocketId = parseInt(storage.getItem("serverSocketId"));
  console.log("serverSocketId: ", serverSocketId);

  /////////////////////////////////////////////////////////////////////////////
  // The bidding record has been skipped for the moment.
  // Has to be handled seperately
  // The current idea is an entry for each call;
  // the form could be:
  // key: 'xxyyzz', xx = board nbr, yy = round nbr, zz = seatIx
  // value: String(tricks) + suit + String(alert).
  // or
  // key: 'xxyyzz-tricks', value: String(tricks)
  // key: 'xxyyzz-suit', value: suit
  // key: 'xxyyzz-alert', value: String(alert)

  //var boardsRec = []; // an array of roundsRec arrays
  //var roundsRec = []; // an array of seatsRec arrays
  //var seatsRec = []; // an array of 4 callObj objects
}
