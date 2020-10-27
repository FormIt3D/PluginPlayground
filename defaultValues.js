const defaultRepoValues = {
    html: `
<!DOCTYPE html>
<html>
    <head>
    <title>My Plugin</title>
    <link href="plugin.css" rel="stylesheet">
    </head>
    <body>
    <label>Width</label>
    <input id="Width" type=number value =12 />
    </br>
    <label>Length</label>
    <input id="Length" type=number value =12 />
    </br>
    <label>Height</label>
    <input id="Height" type=number value =12 />
    </br>
    <input id="CreateBlockBtn" type=button value="Create Block" />
    <!--Do not remove below scripts unless you know what you're doing-->
    <script type="text/javascript" src="https://formit3d.github.io/FormItExamplePlugins/SharedPluginFiles/FormIt.js"></script>
    <script type="text/javascript" src="https://formit3d.github.io/FormItExamplePlugins/SharedPluginFiles/FormItInterface.js"></script>
    <script type="text/javascript" src="https://formit3d.github.io/FormItExamplePlugins/SharedPluginFiles/PluginUtils.js"></script>
    <script type="text/javascript" src="plugin.js"></script>
    <script type="text/javascript">
        FormItInterface.Initialize();
    </script>
    </body>
</html>`,
    script:`
const createBlock = async (w,l,h) => {
    const pt1 = await WSM.Geom.Point3d(0,0,0);
    const pt2 = await WSM.Geom.Point3d(w,l,h);
    const histID = await FormIt.GroupEdit.GetEditingHistoryID();
    console.log(histID, pt1, pt2)

    const test = await WSM.APICreateBlock(histID, pt1, pt2);
}

document.getElementById("CreateBlockBtn").addEventListener("click", () => {
    const w = Number(document.getElementById("Width").value);
    const h = Number(document.getElementById("Height").value);
    const l = Number(document.getElementById("Length").value);

    createBlock(w,l,h);
});`,
    css:`label {
    font-weight: bold;
}

input{
    width:100px;
}`,
    manifest:`{
    "PluginName": "Hello world",
    "PluginDescription": "Hello world",
    "PluginType": "Panel",
    "Panel": "PLUGINLOCATION/plugin.html",
    "PanelIcon": "PLUGINLOCATION/plugin.png"
}`
}

export default defaultRepoValues;
