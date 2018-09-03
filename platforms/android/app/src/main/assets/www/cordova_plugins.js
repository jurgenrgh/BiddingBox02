cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova.custom.plugins.exitapp.exitApp",
    "file": "plugins/cordova.custom.plugins.exitapp/www/ExitApp.js",
    "pluginId": "cordova.custom.plugins.exitapp",
    "merges": [
      "navigator.app"
    ]
  },
  {
    "id": "cordova-plugin-exit.exit",
    "file": "plugins/cordova-plugin-exit/www/exit.js",
    "pluginId": "cordova-plugin-exit",
    "clobbers": [
      "cordova.plugins.exit"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova.custom.plugins.exitapp": "1.0.0",
  "cordova-plugin-exit": "1.0.2"
};
// BOTTOM OF METADATA
});