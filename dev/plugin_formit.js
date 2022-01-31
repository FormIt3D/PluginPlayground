PluginPlayground = {};
PluginPlayground.PluginLocation = "PLUGINLOCATION";
PluginPlayground.ShowDialog = function(){
    var dialogParams = {
        "PluginName": "Plugin Playground Code Editor",
        "DialogBox": "PLUGINLOCATION/editor.html",
        "DialogBoxType": "Window",
        "Settings": {
            "EnableNewWindowLinks": true,
            "SizePositionRestored": true
        },
        "ID": "Plugin_Playground"
    };

    FormIt.CreateDialogBox(JSON.stringify(dialogParams));
}
//FormIt.Commands.RegisterJSCommand("PluginPlayground.ShowDialog");

PluginPlayground.ShowAuthorizeDialog = function(){
    var dialogParams = {
    "PluginName": "Plugin playground auth",
    "DialogBox": "https://github.com/login/oauth/authorize?client_id=697e57494c9b5227b28c",
    "DialogBoxType": "Modeless"};

    FormIt.CreateDialogBox(JSON.stringify(dialogParams));
}
//FormIt.Commands.RegisterJSCommand("PluginPlayground.ShowAuthorizeDialog");

PluginPlayground.StartJournaling = function(){
    //in future may want to enable specific journal types.
    //var journalTypes = ["WSM", "WSMReadOnly", "WSMUtils", "WSMInferenceEngine", "WSMJournalPick", "WSMTools", "WSMToolsPicking", "WSMToolsConcrete", "WSMToolsReadOnly", "WSMToolsTempRender", "FormIt", "FormItGroupEditing", "FormItCameraUpdated", "FormItInputEvents"];
    //var journalTypes = ["WSM", "FormIt"];
    WSM.APIEnableJournalingToString(FormIt.Model.GetHistoryID());
    //WSM.APIEnableJournalingTypes(journalTypes);
}

PluginPlayground.StopJournaling = function(){
    return WSM.APIDisableJournaling();
}
