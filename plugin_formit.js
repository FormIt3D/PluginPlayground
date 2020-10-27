PluginPlayground = {};
PluginPlayground.PluginLocation = "PLUGINLOCATION";
PluginPlayground.ShowDialog = function()
{
    var dialogParams = {
    "PluginName": "Plugin Playground Code Editor",
    "DialogBox": "PLUGINLOCATION/editor.html",
    "DialogBoxType": "Modeless"};

    FormIt.CreateDialogBox(JSON.stringify(dialogParams));
}
FormIt.Commands.RegisterJSCommand("PluginPlayground.ShowDialog");

PluginPlayground.ShowAuthorizeDialog = function()
{
    var dialogParams = {
    "PluginName": "Plugin playground auth",
    "DialogBox": "https://github.com/login/oauth/authorize?client_id=697e57494c9b5227b28c",
    "DialogBoxType": "Modeless"};

    FormIt.CreateDialogBox(JSON.stringify(dialogParams));
}
FormIt.Commands.RegisterJSCommand("PluginPlayground.ShowAuthorizeDialog");
