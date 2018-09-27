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
    },
    {
        "file": "plugins/cordova-plugin-networking-bluetooth/www/CDVNetEvent.js",
        "id": "cordova-plugin-networking-bluetooth.CDVNetEvent",
        "pluginId": "cordova-plugin-networking-bluetooth"
    },
    {
        "file": "plugins/cordova-plugin-networking-bluetooth/www/NetworkingBluetooth.js",
        "id": "cordova-plugin-networking-bluetooth.NetworkingBluetooth",
        "pluginId": "cordova-plugin-networking-bluetooth",
        "clobbers": [
            "networking.bluetooth"
        ]
    },
    {
        "file": "plugins/cordova-plugin-screen-orientation/www/screenorientation.js",
        "id": "cordova-plugin-screen-orientation.screenorientation",
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
}
// BOTTOM OF METADATA
});