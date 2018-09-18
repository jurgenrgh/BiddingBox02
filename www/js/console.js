//// Director's Console Functions /////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//
// Director's Setup: Brings up a separate page with
// once-per-session settings that are inaccessible to the players
// Access will be secured by pin
//
function handleSetup() {
  var bb = document.getElementById("bb-page");
  bb.style.display = 'none';
  var su = document.getElementById("setup-page");
  su.style.display = 'block';
  //popupBox("General Setup. Will handle Table, Seat " + "and possibly board series assignment. Also " + "any other settings not under control of the player. " + "A protected director function. Not implemented", 10);
}

// Return to Main Bidding Box page
// Makes this page invisible and Main Page visible
//
function returnToBiddingBoxPage() {
  var bb = document.getElementById("bb-page");
  bb.style.display = 'flex';
  var su = document.getElementById("setup-page");
  su.style.display = 'none';
}
