PluginPlayground = {};
PluginPlayground.PluginLocation = "PLUGINLOCATION";
PluginPlayground.ShowDialog = function(){
    var dialogParams = {
    "PluginName": "Plugin Playground Code Editor",
    "DialogBox": "PLUGINLOCATION/editor.html",
    "DialogBoxType": "Modeless",
    "Settings": {
        "EnableNewWindowLinks": true
    }
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
    //var journalTypes = ["WSM", "WSMReadOnly", "WSMUtils", "WSMInferenceEngine", "WSMJournalPick", "WSMTools", "WSMToolsPicking", "WSMToolsConcrete", "WSMToolsReadOnly", "WSMToolsTempRender", "FormIt", "FormItGroupEditing", "FormItCameraUpdated", "FormItInputEvents"];
    var journalTypes = ["WSM", "FormIt"];
    var journalFileLoc = encodeURI("/tmp/journal.js");

    Module.ccall("FormItCore_DeleteFile", "int", ["string"], [journalFileLoc]);
    Module.FS_createDataFile("", journalFileLoc, "", true, true, true);
    WSM.APIEnableJournaling(FormIt.Model.GetHistoryID(), journalFileLoc);
    WSM.APIEnableJournalingTypes(journalTypes);
}

PluginPlayground.StopJournaling = function(){
    var journalFileLoc = encodeURI("/tmp/journal.js");

    WSM.APIDisableJournaling();
    const contents = FS.readFile(journalFileLoc, { encoding: 'utf8' });

    return contents;
}
