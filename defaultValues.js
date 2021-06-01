const defaultRepoValues = {
    html: `<!DOCTYPE html>
<html>
<head>
    <title>Hello World</title>
    <link href="plugin.css" rel="stylesheet">
</head>
<body>
    <div class="pluginContainer">
        <h1>Hello World</h1>
        <p>Create a cuboid of the specified size at the origin.</p>
        <div>
            <input id="Width" type=number value =12 />
            <label>Width</label>
        </div>
        <div>
            <input id="Length" type=number value =12 />
            <label>Length</label>
        </div>
        <div>
            <input id="Height" type=number value =12 />
            <label>Height</label>
        </div>
        <input id="CreateBlockBtn" type=button value="Create Cuboid" />
        <!--Do not remove below scripts unless you know what you're doing-->
        <script type="text/javascript" src="https://formit3d.github.io/FormItExamplePlugins/SharedPluginFiles/FormIt.js"></script>
        <script type="text/javascript" src="https://formit3d.github.io/FormItExamplePlugins/SharedPluginFiles/FormItInterface.js"></script>
        <script type="text/javascript" src="https://formit3d.github.io/FormItExamplePlugins/SharedPluginFiles/PluginUtils.js"></script>
        <script type="text/javascript" src="plugin.js"></script>
        <script type="text/javascript">
            FormItInterface.Initialize();
        </script>
    </div>
</body>
</html>`,
    script:`const createBlock = async (w,l,h) => {
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
    css:`.pluginContainer {
        font-family: Arial;
        padding: 10px;
    }
    
    h1 {
        font-size: 20px;
        font-weight: bold;
        color: grey;
        padding-bottom: 5px;
    }

    p {
        padding-top: 5px;
        padding-bottom: 5px;
    }
    
    input {
        border: 1px solid #4676a9;
        padding-left: 1px;
        padding-right: 1px;
        padding-top: 4px;
        padding-bottom: 4px;
        margin-top: 7px;
        margin-bottom: 7px;
        width: 75px;
    }
    
    input:hover {
        border: 2px solid #c3e8f4;
        padding-left: 0px;
        padding-right: 0px;
        padding-top: 3px;
        padding-bottom: 3px;
        margin-top: 7px;
        margin-bottom: 7px;
        outline: none;
    }
    
    input[type=button], input[type=submit] {
        color: white;
        background-color: #4676a9;
        border: 1px solid #4676a9;
        margin-top: 20px;
        padding: 7px;
        outline: none;
        width: auto;
    }
    
    input[type=button]:hover, input[type=submit]:hover {
        color: white;
        background-color: #4676a9;
        border: 2px solid #c3e8f4;
        margin-top: 20px;
        padding: 6px;
    }
    
    input[type=button]:focus, input[type=submit]:focus {
        color: white;
        background-color: #4676a9;
        border: 2px solid #c3e8f4;
        margin-top: 20px;
        padding: 6px;
        outline: none;
    }`,
    manifest:`{
    "PluginName": "Hello world",
    "PluginDescription": "Hello world",
    "PluginType": "Panel",
    "Panel": "PLUGINLOCATION/plugin.html",
    "PanelIcon": "PLUGINLOCATION/plugin.png"
}`,
    png:`iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACTwAAAk8B95E4kAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARmSURBVFiFrddrzJdzGAfwz/X0PCVFpSiU1IQcItWE5pQcZpo3zGGmjPWGee+8jDWHYTYzbKHhhY3NMJrTEJmzF+WwHEJHJTqp8PPi+j38Pf2fxz89v+3afd+/+7p/1+l7HW6lFLtKaMccvITVWIY7sc8un/U/hB+OT1GwFouxtT4vRvuunNduF1ZEDMOL2IIz0Ia9sA9OwizcgFtaPrNa1YrwvngF++IZjMBw9ME6/IpzcSCmlVIW97YC9+NqvI9+GFgJdtT7ARIfi0spJ7RybluLwvfDVbgHj2Al/kBf/IYvcDcOwns4PiJGtnJ2q8C7Sbp4SAu810pAXtMrWVCtXInbm7w7EB1d9vav3nm9txQ4p1p0SH3uwG1YUfd/l6A8rOGb1+r+sN5Q4A4sayhAb2I9PsaTWCTrwHpMrHzXVeVm9kYdOBUv1/trMR6zJfK3YbRMz9PxEKbITIEj8FxPh/eYBRExEMdJZMMFeEKGYTROxERZHb/G5IgYjw+qB478L+v+ywPjZKFZUZ8HY4wE2VAJuOFYJXFwmcyUpRGxXHpgtxQ4uF47FXgDE/A6vpVAWy4tnlwV+6bhm2Mjoq2U8md3AroNQUQEDu2iwH04WuLiA/woi89CPI35pZSVlXcV+uO6iBjXrYlNUD9dInwbNmBLl/fTquCPMBfPV8sfRJ8GvgckDhZiEz7D2B7TEKNkSi2QTedRNQW78LXLxjMLV2BcE56bqwJvyZDtwA84tKc0vA1Lsb1aNBXfNfHa73ihW7fmWlWvyyQuPpfp+zSO6WT6GwMRcSwuxfW4t7r3S9n5dloRMTsiPo2IxyJi7x4U2IKvqiLzMSEiztxJAZyHJTIMp1UagUFNhB8nXTwd++GSJgqsrtdfpFe/wKuykl7TydQYgqPwIcbKKWdvOek0y5RtsjseIjEzuAlPpwemYHOlbfgZk/7magDNEjlKHS0r2Piq0PYmAItqxTt4GP2a8PSXIJwni9konIxbZda0l1JyIoqI9mrJPPyEYRgiXTtEVrcNTazsdkVEWxW0ULp9oPTqGNlhh5VS1nWGYE8ZjsNlzg6ogveo7z+LiO0ylksaaGl1bVulfnJGOKgKUs8aWt8NqbSslLKOfzDQifTAGhmr7TIcbbLxHIOZOEvW/OF6bmZf1us3EnybsBEXa8BMVwU2ViUGSCD+hu9LBvWTSnMhIjpwQKURsjENkv8KS0spiyJis4z/2GrEhRhZjchVAdNHVr3VEjid9KdMo/k4H3u2NGalhRfVb39pOG8z5jTy7jSWR8QYmX4r5JRzdnXbKfXgRbIXrK20SWKlf/XcVNkv2vE4rsQJleeTUsqafwlswZp3q+COqsyNsrFslS15bbWsyBz/GM9KDM3YrZlQ7YxN9u/SMPVWDBRMath7Cgt2dyY8Tw4VOxriuUECbmtEXC6B21H5p0fEDDlJTcDoiIjSNc4Nq8dfs4joI2t9VxouJ6DOvB4sp6OHq5IbK31bSnm7Jwv/AjIZ2ZyKqgMbAAAAAElFTkSuQmCC` 
}

export default defaultRepoValues;
