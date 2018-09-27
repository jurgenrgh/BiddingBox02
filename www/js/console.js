//// Director's Console Functions /////////////////////
///////////////////////////////////////////////////////////////////////////////
//
// Director's Setup: Brings up a separate page with
// once-per-session settings that are inaccessible to the players
// Access will be secured by pin
//
function handleSetup() {
  var bb = document.getElementById("bb-page");
  bb.style.display = 'none';
  var su = document.getElementById("directors-console"); //version 2 of the console
  //var su = document.getElementById("setup-page"); version 1 of the console
  su.style.display = 'block';

  //getBtDevices();
}

// Return to Main Bidding Box page
// Makes this page invisible and Main Page visible
// version indicates which page needs to be hidden
//
function returnToBiddingBoxPage(version) {
  var bb = document.getElementById("bb-page");
  bb.style.display = 'flex';
  var su2 = document.getElementById("directors-console"); //version 2 of the console
  var su1 = document.getElementById("setup-page"); //version 1 of the console
  if (version == 1) {
    su1.style.display = 'none';
  }
  if (version == 2) {
    su2.style.display = 'none';
  }
  storeSettings();
  restoreSettings();
}

//Switches between old and new Console Version
function toggleConsoles(version) {
  var su2 = document.getElementById("directors-console"); //version 2 of the console
  var su1 = document.getElementById("setup-page"); //version 1 of the console
  if (version == 1) {
    su1.style.display = 'none';
    su2.style.display = 'block';
  }
  if (version == 2) {
    su1.style.display = 'block';
    su2.style.display = 'none';
  }
}

// opp is either "rho" or "lho"
// state is "disconnected", "waiting" or "connected"
// The function changes the class of the corresponding element
// in order to display the  red, yellow or green symbol
function setConnectionState(opp, state) {
  var elDis;
  var elWat;
  var elCon;
  console.log("setConnectionState", opp, state);
  if (opp == "rho") {
    elDis = document.getElementById("rho-disconnected");
    elWat = document.getElementById("rho-waiting");
    elCon = document.getElementById("rho-connected");
  }
  if (opp == "lho") {
    elDis = document.getElementById("lho-disconnected");
    elWat = document.getElementById("lho-waiting");
    elCon = document.getElementById("lho-connected");
  }
  console.log(elDis.classList, elWat.classList, elCon.classList);
  elDis.classList.remove("dot-red");
  elCon.classList.remove("dot-green");
  elWat.classList.remove("dot-yellow");
  elDis.classList.add("dot-transparent");
  elCon.classList.add("dot-transparent");
  elWat.classList.add("dot-transparent");
  console.log(elDis.classList, elWat.classList, elCon.classList);
  if (state == "disconnected") {
    elDis.classList.add("dot-red");
    elDis.classList.remove("dot-transparent");
  }
  if (state == "waiting") {
    elWat.classList.add("dot-yellow");
    elWat.classList.remove("dot-transparent");
  }
  if (state == "connected") {
    elCon.classList.add("dot-green");
    elCon.classList.remove("dot-transparent");
  }
  console.log(elDis.classList, elWat.classList, elCon.classList);
}

// Gets Adapter State and name and list of paired
// devices
// The names are then entered in the drop-down
// so that rho and lho can be selected
// Initially connection state set to "disconnected"
function getBtDevices() {

  networking.bluetooth.getAdapterState(function(adapterInfo) {
    // The adapterInfo object has the following properties:
    // address: String --> The address of the adapter, in the format 'XX:XX:XX:XX:XX:XX'.
    // name: String --> The human-readable name of the adapter.
    // enabled: Boolean --> Indicates whether or not the adapter is enabled.
    // discovering: Boolean --> Indicates whether or not the adapter is currently discovering.
    // discoverable: Boolean --> Indicates whether or not the adapter is currently discoverable.
    //console.log('Adapter ' + adapterInfo.address + ': ' + adapterInfo.name);
    var el = document.getElementById("this-tablet-name");
    el.innerHTML = adapterInfo.name;
    thisTabletBtName = adapterInfo.name; //Bluetooth name
    thisTabletBtAddress = adapterInfo.address;
  }, function(errorMessage) {
    console.error(errorMessage);
    popupBox("Bluetooth Error: " + errorMessage);
  });

  networking.bluetooth.getDevices(function(devices) {
    for (var i = 0; i < devices.length; i++) {
      // The deviceInfo object has the following properties:
      // address: String --> The address of the device, in the format 'XX:XX:XX:XX:XX:XX'.
      // name: String --> The human-readable name of the device.
      // paired: Boolean --> Indicates whether or not the device is paired with the system.
      // uuids: Array of String --> UUIDs of protocols, profiles and services advertised by the device.
      console.log(i, devices[i].name, devices[i].address);
      pairedBtNames[i] = devices[i].name;
      pairedBtAddresses[i] = devices[i].address;
      addDeviceSelection(i);
    }
  });
  //setConnectionState("rho", "disconnected");
  //setConnectionState("lho", "disconnected");
  //console.log("getBtDevices");
}

// Puts pairedBtNames[ix] into LHO and RHO text
// device selection lists if not already present
// pairedBtAddresses[ix] into option.value
function addDeviceSelection(ix) {
  var elRho = document.getElementById("rho-name");
  var elLho = document.getElementById("lho-name");

  elRho.value = pairedBtAddresses[ix];
  if (!(elRho.selectedIndex >= 0)) { //a new entry
    var option = document.createElement("option");
    option.text = pairedBtNames[ix];
    option.value = pairedBtAddresses[ix];
    option.selected = true;
    elRho.add(option,elRho[0]);
    //elRho.selectedIndex = "0";
    rhoBtName = option.text;
    rhoBtAddress = option.value;
  }

  elLho.value = pairedBtAddresses[ix];
  if (!(elLho.selectedIndex >= 0)) { //a new entry
    var option = document.createElement("option");
    option.text = pairedBtNames[ix];
    option.value = pairedBtAddresses[ix];
    option.selected = true;
    elLho.add(option, elLho[0]);
    //elLho.selectedIndex = "0";
    lhoBtName = option.text;
    lhoBtAddress = option.value;
  }
}

// This is the 'server' side, of the socket connection
// The 'server' (listener) is the LHO of the 'client', who requests the connection
function startBtListening() {
  console.log("Enter Listening");
  if (!listeningForConnectionRequest) {
    networking.bluetooth.listenUsingRfcomm(uuid, function(socketId) {
      serverSocketId = socketId;
      listeningForConnectionRequest = true;
      console.log("startBluetoothListening " + socketId);
      setConnectionState("rho", "waiting");
      networking.bluetooth.onAccept.addListener(function(acceptInfo) {
        if (acceptInfo.socketId !== serverSocketId) {
          console.log('onAccept -- acceptInfo.socketId != serverSocketId');
          return;
        }
        rhoSocketId = acceptInfo.clientSocketId;
        rhoConnected = true;
        setConnectionState("rho", "connected");
        console.log("Accepted Connection: ", "Server Socket: " + serverSocketId, "Client Socket: " + rhoSocketId);
      });
    }, function(errorMessage) {
      console.error(errorMessage);
    });
  }
}

function connectClient() {
  console.log("connectClient", lhoBtAddress, rhoBtAddress, lhoBtName, rhoBtName);
  var deviceAddress;
  console.log("enter connecting");
  if (!lhoConnected) {
    //var elLho = document.getElementById("lho-name");
    //deviceAddress = elLho.value;
    deviceAddress = lhoBtAddress;
    setConnectionState("lho", "waiting");
    //console.log("connectClient waiting ", deviceAddress);
    networking.bluetooth.connect(deviceAddress, uuid, function(socketId) {
      lhoSocketId = socketId;
      lhoConnected = true;
      console.log("Client connected. LHO socket = ", socketId);
      setConnectionState("lho", "connected");
    }, function(errorMessage) {
      console.error(errorMessage);
    });
  }
}

// Called when selection of LHO Tablet changes
// val is the assigned value corresponding to the chosen list item
function handleLhoChange(e) {
  var ix = e.selectedIndex;
  lhoBtName = e.options[ix].text;
  lhoBtAddress = e.options[ix].value;
  //popupBox("LHO tablet selected: " + lhoBtName + " " + lhoBtAddress);
}

// Called when RHO tablet changes
// val is the assigned value corresponding to the chosen list item
function handleRhoChange(e) {
  var ix = e.selectedIndex;
  rhoBtName = e.options[ix].text;
  rhoBtAddress = e.options[ix].value;
  //popupBox("LHO tablet selected: " + rhoBtName + " " + rhoBtAddress);
}

function onReceiveHandler(receiveInfo) {
  var strReceived;

  var socketId = -1;
  var source = "";

  if (lhoConnected) {
    if (receiveInfo.socketId == lhoSocketId) {
      socketId = lhoSocketId;
      source = "LHO";
    }
  }
  if (rhoConnected) {
    if (receiveInfo.socketId == rhoSocketId) {
      socketId = rhoSocketId;
      source = "RHO";
    }
  }

  if(!rhoConnected && !lhoConnected ){
    console.log( "Error: Message Received but neither side Connected");
    return;
  }

  if(socketId == -1){
    console.log("Error: Message Received on socket ", receiveInfo.socketId);
    console.log("rhoSocketId = " + rhoSocketId, "lhoSocketId = " + lhoSocketId);
    return;
  }

  strReceived = stringFromArrayBuffer(receiveInfo.data);
  console.log("Data received: ", strReceived);

  //acknowledge receipt

  //networking.bluetooth.send(socketId, reply);

  document.getElementById("received-message-id").value = "Received from " + source + ": " + strReceived;
}
