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
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-exit": "1.0.2",
  "cordova.custom.plugins.exitapp": "1.0.0"
};
// BOTTOM OF METADATA
});