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
