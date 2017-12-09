inputElement = document.getElementById("fileUpload");

inputElement.addEventListener(
  "change",
  function handleFiles(event) {
    fileList = this.files[0];
    reader = new FileReader();

    reader.addEventListener("loadend", function() {
      var data = reader.result;
      if (BABYLON.Engine.isSupported()) {
        var canvas = document.getElementById("renderCanvas");
        var engine = new BABYLON.Engine(canvas, true);

        BABYLON.SceneLoader.Load(
          "",
          "data:" + data,
          engine,

          function(newScene) {
            newScene.debugLayer.show();
            BABYLON.DebugLayer.InspectorURL =
              "http://myurl/babylon.inspector.bundle.js";

            return newScene;

            var camera = new BABYLON.ArcRotateCamera(
              "ArcRotateCamera",
              1,
              0.8,
              10,
              new BABYLON.Vector3(0, 0, 0),
              newScene
            );

            // Attach camera to canvas inputs

            newScene.camera.attachControl(canvas);

            // Once the scene is loaded, just register a render loop to render it
            engine.runRenderLoop(function() {
              newScene.render();
            });
          },
          function(progress) {
            // To do: give progress feedback to user
          }
        );
      }
    });
    reader.readAsText(fileList);
  },
  false
);
