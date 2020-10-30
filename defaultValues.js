const defaultRepoValues = {
    html: `<!DOCTYPE html>
<html>
<head>
    <title>My Plugin</title>
    <link href="plugin.css" rel="stylesheet">
</head>
<body>
    <div>
        <label>Width</label>
        <input id="Width" type=number value =12 />
    </div>
    <div>
        <label>Length</label>
        <input id="Length" type=number value =12 />
    </div>
    <div>
        <label>Height</label>
        <input id="Height" type=number value =12 />
    </div>
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
}`,
    png:`iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACTwAAAk8B95E4kAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARmSURBVFiFrddrzJdzGAfwz/X0PCVFpSiU1IQcItWE5pQcZpo3zGGmjPWGee+8jDWHYTYzbKHhhY3NMJrTEJmzF+WwHEJHJTqp8PPi+j38Pf2fxz89v+3afd+/+7p/1+l7HW6lFLtKaMccvITVWIY7sc8un/U/hB+OT1GwFouxtT4vRvuunNduF1ZEDMOL2IIz0Ia9sA9OwizcgFtaPrNa1YrwvngF++IZjMBw9ME6/IpzcSCmlVIW97YC9+NqvI9+GFgJdtT7ARIfi0spJ7RybluLwvfDVbgHj2Al/kBf/IYvcDcOwns4PiJGtnJ2q8C7Sbp4SAu810pAXtMrWVCtXInbm7w7EB1d9vav3nm9txQ4p1p0SH3uwG1YUfd/l6A8rOGb1+r+sN5Q4A4sayhAb2I9PsaTWCTrwHpMrHzXVeVm9kYdOBUv1/trMR6zJfK3YbRMz9PxEKbITIEj8FxPh/eYBRExEMdJZMMFeEKGYTROxERZHb/G5IgYjw+qB478L+v+ywPjZKFZUZ8HY4wE2VAJuOFYJXFwmcyUpRGxXHpgtxQ4uF47FXgDE/A6vpVAWy4tnlwV+6bhm2Mjoq2U8md3AroNQUQEDu2iwH04WuLiA/woi89CPI35pZSVlXcV+uO6iBjXrYlNUD9dInwbNmBLl/fTquCPMBfPV8sfRJ8GvgckDhZiEz7D2B7TEKNkSi2QTedRNQW78LXLxjMLV2BcE56bqwJvyZDtwA84tKc0vA1Lsb1aNBXfNfHa73ihW7fmWlWvyyQuPpfp+zSO6WT6GwMRcSwuxfW4t7r3S9n5dloRMTsiPo2IxyJi7x4U2IKvqiLzMSEiztxJAZyHJTIMp1UagUFNhB8nXTwd++GSJgqsrtdfpFe/wKuykl7TydQYgqPwIcbKKWdvOek0y5RtsjseIjEzuAlPpwemYHOlbfgZk/7magDNEjlKHS0r2Piq0PYmAItqxTt4GP2a8PSXIJwni9konIxbZda0l1JyIoqI9mrJPPyEYRgiXTtEVrcNTazsdkVEWxW0ULp9oPTqGNlhh5VS1nWGYE8ZjsNlzg6ogveo7z+LiO0ylksaaGl1bVulfnJGOKgKUs8aWt8NqbSslLKOfzDQifTAGhmr7TIcbbLxHIOZOEvW/OF6bmZf1us3EnybsBEXa8BMVwU2ViUGSCD+hu9LBvWTSnMhIjpwQKURsjENkv8KS0spiyJis4z/2GrEhRhZjchVAdNHVr3VEjid9KdMo/k4H3u2NGalhRfVb39pOG8z5jTy7jSWR8QYmX4r5JRzdnXbKfXgRbIXrK20SWKlf/XcVNkv2vE4rsQJleeTUsqafwlswZp3q+COqsyNsrFslS15bbWsyBz/GM9KDM3YrZlQ7YxN9u/SMPVWDBRMath7Cgt2dyY8Tw4VOxriuUECbmtEXC6B21H5p0fEDDlJTcDoiIjSNc4Nq8dfs4joI2t9VxouJ6DOvB4sp6OHq5IbK31bSnm7Jwv/AjIZ2ZyKqgMbAAAAAElFTkSuQmCC` 
}

export default defaultRepoValues;
