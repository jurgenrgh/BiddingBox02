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

               <!-- Directors Console V1-->
               <!-- Visible only when Setup clicked -->
               <!------------------------------------->
               <div id="setup-page">
                  <h1>Director's Console</h1>
                  <h2>Login</h2>
                  <form onsubmit="submitPin(event)" action="javascript:void(0);">
                     <div class="btn-group">
                        <label for="input-pin" id="input-pin-label" class="large-indent">Pin</label>
                        <input type="number" id="input-pin" name="input-pin" min="1" max="9999">
                     </div>
                  </form>

                  <div>
                     <h2>Tablet Names</h2>
                     <div class="btn-group">
                        <label for="input-tablet-lho" id="input-tablet-lho-label" class="large-indent">LHO</label>
                        <select id="input-tablet-lho" name="input-tablet-lho" onchange="handleLhoTabletName(this.value, true)">
                          <option value="1">&nbsp; Tab1</option>
                          <option value="2">&nbsp; Tab2</option>
                          <option value="3">&nbsp; Tab3</option>
                          <option value="4">&nbsp; Tab4</option>
                        </select>
                     </div>
                     <div class="btn-group">
                        <label for="input-tablet-rho" id="input-tablet-rho-label" class="large-indent">RHO</label>
                        <select id="input-tablet-rho" name="input-tablet-rho" onchange="handleRhoTabletName(this.value, true)">
                          <option value="1">&nbsp; Tab1</option>
                          <option value="2">&nbsp; Tab2</option>
                          <option value="3">&nbsp; Tab3</option>
                          <option value="4">&nbsp; Tab4</option>
                        </select>

                     </div>
                  </div>
                  <div>
                     <h2>Placement</h2>
                     <!--<div style="display:flex; flex-direction: row; justify-content: left; align-items: left">-->
                     <form onsubmit="submitSectionId(event)" action="javascript:void(0);">
                        <div class="btn-group">
                           <div>
                              <label for="input-section-id" id="input-section-id-label" class="large-indent">Section</label>
                              <input type="text" id="input-section-id" name="input-section-id">
                           </div>
                           </div>
                     </form>

                     <form onsubmit="submitTableNumber(event)" action="javascript:void(0);">
                        <div class="btn-group">
                           <div>
                              <label for="input-table-nbr" id="input-table-nbr-label" class="large-indent">Table</label>
                              <input type="number" id="input-table-nbr" name="input-table-nbr" min="1" max="999">
                           </div>
                           </div>
                     </form>


                     <div class="btn-group">
                        <label for="input-seat" id="input-seat-label" class="large-indent">Seat</label>
                        <select id="input-seat" name="input-seat" onchange="handleSeatDirection(this.value, true)">
                          <option value="N">&nbsp; N</option>
                          <option value="E">&nbsp; E</option>
                          <option value="S" selected>&nbsp; S</option>
                          <option value="W">&nbsp; W</option>
                        </select>
                     </div>

                  </div>

                  <div>
                     <h2>Boards</h2>
                     <!--<div style="display:flex; flex-direction: row; justify-content: center; align-items: center">-->
                     <form onsubmit="submitFirstBoardNumber(event)" action="javascript:void(0);">
                        <div class="btn-group">
                           <label for="first-board-nbr" id="first-board-nbr-label" class="large-indent">First</label>
                           <input type="number" id="first-board-nbr" name="first-board-nbr" min="1" max="36">
                        </div>
                     </form>
                     <form onsubmit="submitLastBoardNumber(event)" action="javascript:void(0);">
                        <div class="btn-group">
                           <label for="last-board-nbr" id="last-board-nbr-label" class="large-indent">Last</label>
                           <input type="number" id="last-board-nbr" name="last-board-nbr" min="1" max="36">
                        </div>
                     </form>
                     <!--</div>-->
                  </div>

                  <h2>Connection Status</h2>
                  <table style="width:100%">
                     <tr>
                        <th class="td-status">Status</th>
                        <th>RHO</th>
                        <th>LHO</th>
                     </tr>
                     <tr>
                        <td class="td-status">Disconnected</td>
                        <td>
                           <div class="dot"></div>
                        </td>
                        <td>
                           <div class="dot"></div>
                        </td>
                     </tr>
                     <tr>
                        <td class="td-status">Waiting</td>
                        <td>
                           <div class="dot"></div>
                        </td>
                        <td>
                           <div class="dot"></div>
                        </td>
                     </tr>
                     <tr>
                        <td class="td-status">Connected</td>
                        <td>
                           <div class="dot"></div>
                        </td>
                        <td>
                           <div class="dot"></div>
                        </td>
                     </tr>
                  </table>

                  <h2>Exit</h2>
                  <div class="btn-group">
                     <label for="return-to-bb" id="return-to-bb-label"></label>
                     <button id="return-to-bb" onclick="returnToBiddingBoxPage(1)">Return</button>
                  </div>

                  <div class="item-button">
                     <button id="toggle-versions-1" onclick="toggleConsoles(1)">Toggle Consoles</button>
                  </div> <!-- End Directors Console V1-->
               </div>

               #return-to-bb {
                  font-size: 2rem;
                  font-weight: normal;
                  background-color: transparent;
                  color: black;
                  width: 100%;
               }

               #connect-button {
                  font-size: 2rem;
                  font-weight: normal;
                  background-color: transparent;
                  color: black;
                  width: 100%;
               }
