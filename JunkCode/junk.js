/////////////////////////////////////// Discards //////////////
////////////////////////////////////////////////////////////////

function keydownTableNumber(event) {
  var svgElem = document.getElementById("svgTextTableNbr");
  var textBefore = svgElem.textContent;
  alert("keydownTableNumber key: " + event.key);

}
function keyupNewTableNumber(evt, val) {
  var svgElem = document.getElementById("svgTextTableNumber");
  var textBefore = svgElem.textContent;
  var keyCode = evt.keyCode;
  var keyName = evt.key;
  var value = val;

  alert("onkeyup handler: \n" + "keyCode property: " + evt.keyCode + "\n" + "which property: " + evt.which + "\n" + "key property: " + evt.key + "\n" + "input status: " + val + "\n");
}

function prepNewTableNumber(evt, val) {
  //alert("prep table number keydown" + " " + evt.keyCode);
  //setTimeout(handleNewTableNumber, 1000, val);
  var keyCode = evt.keyCode;
  var keyName = evt.key;
  var value = val;

  alert("onkeydown handler: \n" + "keyCode property: " + evt.keyCode + "\n" + "which property: " + evt.which + "\n" + "key property: " + evt.key + "\n" + "input status: " + val + "\n");

  if (keyName == "Enter") {
    alert("After Enter seen: \n" + "keyName: " + keyName + "\n" + "data: " + val + "\n");
    handleNewTableNumber(val);
    setTimeout(handleNewTableNumber, 1000, val);
  }
}
//Does nothing now. The action happens in onSubmit
function inputTableNumber(event) {
  var svgElem = document.getElementById("svgTextTableNbr");
  var oldText = svgElem.textContent;
  //console.log("inputTableNumber old: " + oldText + " new: " + event.data );
  //alert("inputTableNumber old: " + oldText + " new: " + event.data);
}

function setTableNumber(val) {
  var svgElem = document.getElementById("svgTextTableNumber");
  svgElem.textContent = "Table " + val;

  drawCompass();
  alert("Table Number Set: " + "Table " + val);
}

function handleNewSeat(val) {

  if (val == "north")
    console.log("North");
  if (val == "east")
    console.log("East");
  if (val == "south")
    console.log("South");
  if (val == "west")
    console.log("West");
  }

  /////////////////////////////////////////////
  // Called when the board number changes
  // bNbr = 1,2, ... ,36
  // This function sets boardIx, dealerIx, vulIx
  // and adjusts the Compass display accordingly.
  //
  // The bidding record is reset in a separate function
  //
  function handleNewBoard(bNbr) {
    console.log("Entry boardNbr: %s, boardIx: %d, dealerIx: %d, vulIx: %d", bNbr, boardIx, dealerIx, vulIx);
    console.log("Entry boardNbr: %s, seatIx: %d, tableIx: %d", bNbr, seatIx, tableIx);

    boardIx = parseInt(bNbr, 10) - 1;
    dealerIx = boardIx % 4;
    vulIx = (Math.floor(boardIx / 4) + dealerIx) % 4;

    var svgElem = document.getElementById("textBoardNumber");
    var x = document.getElementById("input-table-nbr").value;

    console.log("Exit  boardNbr: %s, boardIx: %d, dealerIx: %d, vulIx: %d", bNbr, boardIx, dealerIx, vulIx);
    console.log("Exit  boardNbr: %s, seatIx: %d, tableIx: %d", bNbr, seatIx, tableIx);
    //testBoardSettings();
  }

//aide memoire table entries
                <tr>
                  <td> 1<span class="clubs">&clubs;</span> </td>
                  <td>P</td>
                  <td> 1<span class="diams">&diams;</span> </td>
                  <td>P</td>
               </tr>
               <tr>
                  <td> 1<span class="hearts">&hearts;</span> </td>
                  <td>X</td>
                  <td> 1<span class="spades">&spades;</span> </td>
                  <td>P</td>
               </tr>

               function confirmCall() {
                 console.log("Confirm Call");
                 console.log(bStat);
                 hidePopupBox();
                 clearBidBox();
                 updateBiddingRecord();
               }

               function undoCall() {
                 console.log("Undo Call");
                 console.log(bStat);
                 hidePopupBox();
                 bStat.boxOpen = true;
                 bStat.newTricks = 0;
                 bStat.newSuit = "none";
                 bStat.newCall = "none";
                 bStat.newAlert = false;
                 prepBidBox();
               }

               function alertCall() {
                 console.log("Alert Call");
                 console.log(bStat);
                 bStat.newAlert = true;
                 hidePopupBox();
                 clearBidBox();
                 updateBiddingRecord();
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

               for( var b = 0; b < 5; b++ ){
                 for(var r = 0; r < 3; r++ ){
                   for(var s = 0; s < 4; s++ ){
                     bid = new callObj(s,r,b);
                     seat[s] = bid;
                   }
                   round[r] = seat;
                   seat = new Array(0)
                 }
                 board[b] = round;
                 round = new Array(0);
               }
               console.log(board);

               // Replaced by confirmSelectedBid
               // Called in response to submitting a bid
               // Argument is the number of consecutive passes including this bid
               function promptNextSeat(passCount){
                 var sd = bidOrder[(bidderIx + 1) % 4]; //next bidder

                 if(passCount == 4){ //Board passed out
                   popupBoxYesNo("Board passed out", "Confirm", "Cancel Pass", "passout", -1);
                 }

                 if((passCount == 3) && (bStat.tricks != 0)){// normal end of bidding

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
                   enableInput();
                   popupBoxYesNo("Contract: " + contract, "Confirm", "Cancel Pass", "contract", -1);
                 }

                 if( (passCount < 3) || ((bStat.tricks == 0) && (passCount == 3)) )// normal move to next bidder
                 {
                   popupBoxOK("Tablet moves to the next bidder (" + sd + ")", "OK", "nextseat", -1);
                 }
               }
