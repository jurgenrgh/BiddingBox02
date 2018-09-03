cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-exit/www/exit.js",
        "id": "cordova-plugin-exit.exit",
        "pluginId": "cordova-plugin-exit",
        "clobbers": [
            "cordova.plugins.exit"
        ]
    },
    {
        "file": "plugins/cordova.custom.plugins.exitapp/www/ExitApp.js",
        "id": "cordova.custom.plugins.exitapp.exitApp",
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
}
// BOTTOM OF METADATA
});