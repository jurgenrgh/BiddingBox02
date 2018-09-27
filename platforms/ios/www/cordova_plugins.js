cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-exit.exit",
    "file": "plugins/cordova-plugin-exit/www/exit.js",
    "pluginId": "cordova-plugin-exit",
    "clobbers": [
      "cordova.plugins.exit"
    ]
  },
  {
    "id": "cordova.custom.plugins.exitapp.exitApp",
    "file": "plugins/cordova.custom.plugins.exitapp/www/ExitApp.js",
    "pluginId": "cordova.custom.plugins.exitapp",
    "merges": [
      "navigator.app"
    ]
  },
  {
    "id": "cordova-plugin-networking-bluetooth.CDVNetEvent",
    "file": "plugins/cordova-plugin-networking-bluetooth/www/CDVNetEvent.js",
    "pluginId": "cordova-plugin-networking-bluetooth"
  },
  {
    "id": "cordova-plugin-networking-bluetooth.NetworkingBluetooth",
    "file": "plugins/cordova-plugin-networking-bluetooth/www/NetworkingBluetooth.js",
    "pluginId": "cordova-plugin-networking-bluetooth",
    "clobbers": [
      "networking.bluetooth"
    ]
  },
  {
    "id": "cordova-plugin-screen-orientation.screenorientation",
    "file": "plugins/cordova-plugin-screen-orientation/www/screenorientation.js",
    "pluginId": "cordova-plugin-screen-orientation",
    "clobbers": [
      "cordova.plugins.screenorientation"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-exit": "1.0.2",
  "cordova.custom.plugins.exitapp": "1.0.0",
  "cordova-plugin-networking-bluetooth": "1.0.3",
  "cordova-plugin-screen-orientation": "3.0.1"
};
// BOTTOM OF METADATA
});