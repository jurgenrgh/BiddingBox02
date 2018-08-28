///////////////////////////////////////////////////////////////////////////////
//////// Functions dealing with the actual bidding box
///////////////////////////////////////////////////////////////////////////////

// Set up the bidding box according to biddingStatus
//
function prepBidBox() {
  //Enable and disable the trick buttons acc to last bid given by biddingStatus
  //Opens the Box
  var idSuit;
  var id;
  var n = biddingStatus.tricks;

  console.log("prepBidBox: ", biddingStatus);

  for(var i = 1; i <= 7; i++ )
  {
    id = i.toString();
    unselectTricksBid(id);
  }

  for (var i = 1; i < n; i++) {
    id = i.toString();
    disableTricksBid(id);
  }

  if (n > 0) {
    if (biddingStatus.suit == "NT") {
      id = n.toString();
      disableTricksBid(id);
    } else {
      id = n.toString();
      enableTricksBid(id);
    }
  }

  for (var i = (n + 1); i <= 7; i++) {
    id = i.toString();
    enableTricksBid(id);
  }

  // Enable and disable suit buttons acc to biddingStatus
  for (var i = 0; i < 5; i++) {
    idSuit = suitNameOrder[i];
    unselectSuitBid(idSuit);
    disableSuitBid(idSuit);
  }

  unselectCall("X");
  unselectCall("XX");
  unselectCall("Pass");
  unselectCall("Alert");

  if ((biddingStatus.tricks == 0) || (biddingStatus.lastBidder == "ME") || (biddingStatus.lastBidder == "PA") || (biddingStatus.lastBidder == "NO") || (biddingStatus.dbl == true) || (biddingStatus.rdbl == true)) {
    disableCall('X')
  }
  if ((biddingStatus.tricks == 0) || (biddingStatus.lastBidder == "LH") || (biddingStatus.lastBidder == "RH") || (biddingStatus.lastBidder == "NO") || (biddingStatus.dbl == false) || (biddingStatus.rdbl == true)) {
    disableCall('XX')
  }

  disableCall('Alert');
  biddingStatus.boxOpen = true;

  console.log("prepBidBox: ", biddingStatus);
}

// Reset the biddng status and the bidding box
function clearBidBox() {
  //Enable the trick buttons
  //
  var idSuit;
  var id;

  for (var i = 1; i <= 7; i++) {
    id = i.toString();
    unselectTricksBid(id);
    enableTricksBid(id);
  }

  // Enable suit buttons
  for (var i = 0; i < 5; i++) {
    idSuit = suitNameOrder[i];
    enableSuitBid(idSuit);
    unselectSuitBid(idSuit);
  }
  // enable the calls
  unselectCall("X");
  unselectCall("XX");
  unselectCall("Pass");
  unselectCall("Alert");
  enableCall("X");
  enableCall("XX");
  enableCall("Pass");
  enableCall("Alert");

  biddingStatus = {
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
}

// After a bidding level (tricks) has been selected,
// enable appropriate suit bid buttons
function prepSuitBids() {}

///////////////////////////////////////////////////////////////////////////////
// Called when player prompted to bid.
// The bidding status is a structure that contains all the information
// necessary to manage the bidding box. This initialization obtains the
// necessary info from the bidding record contents, which is contained
// in the roundCalls and boardRounds arrays.
//
// The state of the bidding: biddingStatus
// lastBidder: "ME", "PA", "LH", "RH", "NO"
// tricks: #d the bid level
// suit: "C", "D", "H", "S", "NT", "none"
// dbl and rdble: true/false
// var biddingStatus = {lastBidder: "NO", tricks: 0, suit: "none", dbl: false,
// rdbl: false, newTricks: 0, newSuit: "none", newCall: "none", newAlert: false};
//
// further, the biddingStatus structure contains the current (unconfirmed)
// (tricks,suit,call) selections:
// newTricks: 0, newSuit: "none", newCall: "none", newAlert: false
//
function getBiddingStatus() {

  var lastBidder = "NO";
  var bidIx = -1;
  var tricks = 0;
  var suit = "none";
  var dbl = false;
  var rdbl = false;

  var nRounds = boardRounds.length;
  console.log("getStatus rounds: ", nRounds, boardRounds);

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
    biddingStatus.lastBidder = "NO";
    biddingStatus.tricks = 0;
    biddingStatus.suit = "none";
    biddingStatus.dbl = false;
    biddingStatus.rdbl = false;
  } else { // there is a prior bid
    if (((seatIx + 0) % 4) == bidIx) {
      biddingStatus.lastBidder = "RH";
    }
    if (((seatIx + 1) % 4) == bidIx) {
      biddingStatus.lastBidder = "ME";
    }
    if (((seatIx + 2) % 4) == bidIx) {
      biddingStatus.lastBidder = "LH";
    }
    if (((seatIx + 3) % 4) == bidIx) {
      biddingStatus.lastBidder = "PA";
    }

    biddingStatus.tricks = tricks;
    biddingStatus.suit = suit;

    biddingStatus.dbl = dbl;
    biddingStatus.rdbl = rdbl;
  }
  biddingStatus.newTricks = 0;
  biddingStatus.newSuit = "none";
  biddingStatus.newCall = "none";
  biddingStatus.newAlert = false;

  console.log("Status ", nRounds, biddingStatus);
}

///////////////////////////////////////////////////////////////////////////////
///////// Bids and Calls
///////////////////////////////////////////////////////////////////////////////
//
// Called when the bidder selects a nbr of tricks. The selection is provisional
// until bidder confirms.
// Selecting a selected button will undo current choices
//
function handleTricksBid(idTricks) {
  var id = parseInt(idTricks);
  var oldTricks = biddingStatus.newTricks;

  if(biddingStatus.boxOpen == false){
    popupBox("It's not your turn", "", "", "", 5);
    return;
  }

  if (oldTricks != 0) {
    unselectTricksBid(oldTricks.toString());
  }

  if (id == oldTricks) {
    unselectTricksBid(oldTricks.toString());
    biddingStatus.newTricks = 0;
  } else {
    selectTricksBid(idTricks);
    biddingStatus.newTricks = id;
  }
  console.log("handleTricksBid ", biddingStatus);
}

function handleSuitBid(idSuit) {
  if(biddingStatus.boxOpen == false){
    popupBox("It's not your turn", "", "", "", 5);
    return;
  }
  var targetDiv = document.getElementById(idSuit);
  roundArray[bidderIx].suit = idSuit;
  targetDiv.style.backgroundColor = modalBGColor;

}

function handleCalls(idCall) {
  if(biddingStatus.boxOpen == false){
    popupBox("It's not your turn", "", "", "", 5);
    return;
  }
  //Same call hit twice
  if (biddingStatus.newCall == idCall) {
    getBiddingStatus();
    biddingStatus.boxOpen = true;
    biddingStatus.newTricks = 0;
    biddingStatus.newSuit = "none";
    biddingStatus.newCall = "none";
    biddingStatus.newAlert = false;

    prepBidBox();
    //All normal cases
  } else {
    selectCall(idCall);
    if (idCall == "Pass") {
      biddingStatus.newTricks = 0;
      biddingStatus.newSuit = "none";
      biddingStatus.newCall = "Pass";
      biddingStatus.newAlert = false;
      selectCall(idCall);

      setPopupValue("PassCall");
      popupBox("Your Call is: Pass", "Confirm", "Undo","Alert", -1);
    }
    if (idCall == "X") {
      biddingStatus.newTricks = 0;
      biddingStatus.newSuit = "none";
      biddingStatus.newCall = "X";
      biddingStatus.newAlert = false;
    }
    if (idCall == "XX") {
      biddingStatus.newTricks = 0;
      biddingStatus.newSuit = "none";
      biddingStatus.newCall = "XX";
      biddingStatus.newAlert = false;
    }
    if (idCall == "Alert") {
      biddingStatus.newAlert = true;
    }
  }
}

function confirmPassCall(){
  console.log("Confirm Pass");
  console.log(biddingStatus);
  hidePopupBox();
  clearBidBox();
  updateBiddingRecord();
}

function undoPassCall(){
  console.log("Undo Pass");
  console.log(biddingStatus);
  hidePopupBox();
  biddingStatus.boxOpen = true;
  biddingStatus.newTricks = 0;
  biddingStatus.newSuit = "none";
  biddingStatus.newCall = "none";
  biddingStatus.newAlert = false;
  prepBidBox

}

function alertPassCall(){
  console.log("Alert Pass");
  console.log(biddingStatus);
  biddingStatus.newAlert = true;
  hidePopupBox();
  clearBidBox();
}
