//////////////////////////////////////////////////////////////////////////////
// Functions dealing with the actual Bidding Box; i.e. with the
// bottom set of buttons for tricks, suit and call
//////////////////////////////////////////////////////////////////////////////
// function clearBidBox()
// function prepBidBox()
// function prepSuitBids()
// function handleTricksBid(idTricks)
// function handleSuitBid(idSuit)
// function handleCalls(idCall)
// function handleSubmitCall()
// function checkEnableSubmit()
// function cancelCurrentBid()
//
///////////////////////////////////////////////////////////////////////////////
// Reset the bidding status (bStat) and the bidding box
//
function clearBidBox() {
  //Enable the trick buttons
  var idSuit;
  var id;
  var i;
  //console.log("clearBidBox Enter", bStat);

  for (i = 1; i <= 7; i++) {
    id = i.toString();
    unselectBidButton(id);
    enableBidButton(id);
  }

  // Enable suit buttons
  for (i = 0; i < 5; i++) {
    idSuit = suitNameOrder[i];
    unselectBidButton(idSuit);
    enableBidButton(idSuit);

  }
  // enable the calls
  unselectBidButton("X");
  unselectBidButton("XX");
  unselectBidButton("Pass");
  unselectBidButton("Alert");
  unselectBidButton("Submit");
  enableBidButton("X");
  enableBidButton("XX");
  enableBidButton("Pass");
  enableBidButton("Alert");
  enableBidButton("Submit");

  bStat = {
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

  //console.log("clearBidBox Exit", bStat);
}

///////////////////////////////////////////////////////////////////////////////
// Set up the bidding box according to bStat
//
function prepBidBox() {
  //console.log("prepBidBox: Enter", bStat);
  //Enable and disable the trick buttons acc to last bid given by bStat
  //Opens the Box
  var idSuit;
  var id;
  var n = bStat.tricks;

  for (var i = 1; i <= 7; i++) {
    id = i.toString();
    unselectBidButton(id);
  }

  for (var i = 1; i < n; i++) { //disable lower levels
    id = i.toString();
    disableBidButton(id);
  }

  if (n > 0) {
    if (bStat.suit == "NT") { //disable current level if NT bid
      id = n.toString();
      disableBidButton(id);
    } else {
      id = n.toString();
      enableBidButton(id);
    }
  }

  for (var i = (n + 1); i <= 7; i++) {
    id = i.toString();
    enableBidButton(id);
  }

  // Enable and disable suit buttons acc to bStat
  for (var i = 0; i < 5; i++) {
    idSuit = suitNameOrder[i];
    unselectBidButton(idSuit);
    disableBidButton(idSuit);
  }

  unselectBidButton("X");
  unselectBidButton("XX");
  unselectBidButton("Pass");
  unselectBidButton("Alert");

  if ((bStat.tricks == 0) || (bStat.lastBidder == "ME") || (bStat.lastBidder == "PA") || (bStat.lastBidder == "NO") || (bStat.dbl == true) || (bStat.rdbl == true)) {
    disableBidButton('X')
  }
  if ((bStat.tricks == 0) || (bStat.lastBidder == "LH") || (bStat.lastBidder == "RH") || (bStat.lastBidder == "NO") || (bStat.dbl == false) || (bStat.rdbl == true)) {
    disableBidButton('XX')
  }

  enableBidButton('Pass');
  disableBidButton('Alert');
  disableBidButton('Submit');
  bStat.boxOpen = true;

  setCurrentBiddingRecordCell("");

  //console.log("prepBidBox: Exit", bStat);
}

//////////////////////////////////////////////////////////////////////////////
// After a bidding level (tricks) has been selected,
// enable appropriate suit bid buttons
//
function prepSuitBids() {
  var ixSuit = 0;
  //console.log("prepSuits", bStat);
  if (bStat.newTricks == bStat.tricks) {
    ixSuit = suitNameOrder.indexOf(bStat.suit) + 1;
  }
  enableHigherSuitBids(ixSuit);

  //disable X,XX,Pass; allow alert
  disableBidButton("X");
  disableBidButton("XX");
  disableBidButton("Pass");
  enableBidButton("Alert");
}

///////////////////////////////////////////////////////////////////////////////
// Called when the bidder selects a nbr of tricks. The selection is provisional
// until bidder confirms.
// Selecting a selected button will undo all current choices
//
function handleTricksBid(idTricks) {
  var id = parseInt(idTricks);
  var oldTricks = bStat.newTricks;

  if (bStat.boxOpen == false) {
    popupBox("It's not your turn", 5);
    return;
  }

  if (oldTricks != 0) {
    unselectBidButton(oldTricks.toString());
  }

  if (id == oldTricks) {
    unselectBidButton(oldTricks.toString());
    bStat.newTricks = 0;
    bStat.newSuit = "none";
    bStat.newCall = "none";
    bStat.newAlert = false;
    updateBiddingRecord();
    prepBidBox();
  } else {
    selectBidButton(idTricks);
    bStat.newTricks = id;
    updateBiddingRecord();
    prepSuitBids();
  }
  checkEnableSubmit();
}

///////////////////////////////////////////////////////////////////////////////
// Suit selection becomes available after level (tricks) is selected
//
function handleSuitBid(idSuit) {
  var id = suitNameOrder.indexOf(idSuit);
  var oldSuit = bStat.newSuit;

  if (bStat.boxOpen == false) {
    popupBox("It's not your turn", 5);
    return;
  }

  if (oldSuit != "none") { //if a suit was selected - unselect
    unselectBidButton(oldSuit);
  }

  if (idSuit == oldSuit) { //if same suit selected twice - restart
    unselectBidButton(oldSuit);
    bStat.newSuit = "none";
  } else {
    selectBidButton(idSuit);
    bStat.newSuit = idSuit;
  }
  updateBiddingRecord();
  checkEnableSubmit();
}

///////////////////////////////////////////////////////////////////////////////
// A call is anything on the 3rd row of buttons, namely X, XX, Pass, Alert but
// not Submit (the check symbol), which is handles separately
//
function handleCalls(idCall) {
  if (bStat.boxOpen == false) {
    popupBox("It's not your turn", 5);
    return;
  }

  if (idCall == "Alert") {
    if (bStat.newAlert) {
      bStat.newAlert = false;
      unselectBidButton("Alert");
    } else {
      bStat.newAlert = true;
      selectBidButton("Alert");
    }
    updateBiddingRecord();
  } else {
    if (bStat.newCall == idCall) { //Same call hit twice = undo
      unselectBidButton(idCall);
      getbStat();
      bStat.boxOpen = true;
      bStat.newTricks = 0;
      bStat.newSuit = "none";
      bStat.newCall = "none";
      bStat.newAlert = false;
      prepBidBox();
      updateBiddingRecord();
    } else { //All normal cases follow
      unselectCallButtons();
      selectBidButton(idCall);
      if (idCall == "Pass") {
        bStat.newTricks = 0;
        bStat.newSuit = "none";
        bStat.newCall = "Pass";
        bStat.newAlert = false;

        enableBidButton("Submit");
        enableBidButton("Alert");
        updateBiddingRecord();
      }
      if (idCall == "X") {
        bStat.newTricks = 0;
        bStat.newSuit = "none";
        bStat.newCall = "X";
        bStat.newAlert = false;
        enableBidButton("Submit");
        enableBidButton("Alert");
        updateBiddingRecord();
      }
      if (idCall == "XX") {
        bStat.newTricks = 0;
        bStat.newSuit = "none";
        bStat.newCall = "XX";
        bStat.newAlert = false;
        enableBidButton("Submit");
        enableBidButton("Alert");
        updateBiddingRecord();
      }
    }
  }
}

///////////////////////////////////////////////////////////////////////////////
// Confirms that selected bid is made
// Check-symbol lrh button
//
function handleSubmitCall() {
  if (bStat.boxOpen == false) {
    popupBox("It's not your turn", 5);
    return;
  }

  confirmSelectedBid();

  //unhiliteBiddingRecordCell();
  //var t = makeBidRecordEntry();
  //recordNewBid();
  //clearBidBox();

  //getbStat();

  //promptNextSeat(bStat.passCount);

  //console.log("submit", t);
}

///////////////////////////////////////////////////////////////////////////////
// Enables the submit button in the bidding box if
// a valid bid is pending. Can be called anytime
//
function checkEnableSubmit() {
  var bCheck = false;
  if ((bStat.newTricks > 0) && (bStat.newSuit != "none")) {
    bCheck = true;
  }
  if ((bStat.newCall == "X") || (bStat.newCall == "XX") || (bStat.newCall == "PASS")) {
    bCheck = true;
  }
  if (bCheck) {
    enableBidButton("Submit");
  } else {
    disableBidButton("Submit");
  }
}

//////////////////////////////////////////////////////////////////////////////
// The current bid is what is recorded in the new** elements
// of bStat. Retracting this bid this requires
//  - resetting the bidbox accto bStat old info
//  - clearing the bidding record cell
//  - reinitializing bStat
//
function cancelCurrentBid(){
  getbStat();
  bStat.newTricks = 0;
  bStat.newSuit = "none";
  bStat.newCall = "none";
  bStat.newAlert = false;
  updateBiddingRecord();
  prepBidBox();
}
