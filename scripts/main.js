/*jshint esversion: 6 */

var canvas, engine, createScene, scene, light, camera, sphere, box, selectedMesh;

canvas = document.getElementById('renderCanvas');
engine = new BABYLON.Engine(canvas, true, {
	stencil: true
});

createScene = function() {
	scene = new BABYLON.Scene(engine);

	scene.clearColor = new BABYLON.Color3(0.85, 0.85, 0.85);

	scene.ambientColor = new BABYLON.Color3(0.75, 0.75, 0.75);
	camera = new BABYLON.ArcRotateCamera('ArcRotateCamera', 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);

	camera.setPosition(new BABYLON.Vector3(0, 400, -300));

	scene.activeCamera.alpha += 0.01;

	//camera.setTarget(BABYLON.Vector3.Zero(0, 5000, 0));

	camera.panningSensibility = 5;

	camera.wheelPrecision = 1;

	camera.attachControl(canvas, false, true);

	light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
	light.intensity = 0.7;

	//import a test object
	var meshVar = BABYLON.SceneLoader.ImportMesh(
		'',
		'scenes/31375_ElliotFabricMicrofiber2PieceSectionalSofa_Graphite/test/',
		'ElliotMicrofiber2PieceSectionalSofa.babylon',
		scene,
		function(newMeshes) {
			//create the default textures
			var graphite1 = new BABYLON.StandardMaterial('Graphite Fabric 1', scene);
			graphite1.diffuseTexture = new BABYLON.Texture(
				'scenes/31375_ElliotFabricMicrofiber2PieceSectionalSofa_Graphite/test/fabric.dif.jpg',
				scene
			);

			var darkBrownWood1 = new BABYLON.StandardMaterial('Dark Brown Wood 1', scene);
			darkBrownWood1.diffuseTexture = new BABYLON.Texture(
				'scenes/31375_ElliotFabricMicrofiber2PieceSectionalSofa_Graphite/test/wood.dif.jpg',
				scene
			);

			//create the materials
			const beigeFabricDif = new BABYLON.StandardMaterial('Beige Fabric', scene);
			beigeFabricDif.diffuseTexture = new BABYLON.Texture('scenes/textures/beigeFabric.dif.jpg', scene);

			beigeFabricDif.diffuseTexture.uScale = 10;
			beigeFabricDif.diffuseTexture.vScale = 10;

			const navyFabricDif = new BABYLON.StandardMaterial('Navy Fabric', scene);
			navyFabricDif.diffuseTexture = new BABYLON.Texture('scenes/textures/navyFabric.dif.jpg', scene);

			navyFabricDif.diffuseTexture.uScale = 10;
			navyFabricDif.diffuseTexture.vScale = 10;

			const forestGreenFabricDif = new BABYLON.StandardMaterial('Forest Green Fabric', scene);
			forestGreenFabricDif.diffuseTexture = new BABYLON.Texture(
				'scenes/textures/forestGreenFabric.dif.jpg',
				scene
			);
			forestGreenFabricDif.diffuseTexture.uScale = 10;
			forestGreenFabricDif.diffuseTexture.vScale = 10;

			const greyFabricDif = new BABYLON.StandardMaterial('Grey Fabric', scene);
			greyFabricDif.diffuseTexture = new BABYLON.Texture('scenes/textures/greyFabric.dif.jpg', scene);
			greyFabricDif.diffuseTexture.uScale = 10;
			greyFabricDif.diffuseTexture.vScale = 10;

			const redFabricDif = new BABYLON.StandardMaterial('Red Fabric', scene);
			redFabricDif.diffuseTexture = new BABYLON.Texture('scenes/textures/redFabric.dif.jpg', scene);
			redFabricDif.diffuseTexture.uScale = 10;
			redFabricDif.diffuseTexture.vScale = 10;

			//EXPERIMENTING WITH PBR MATERIALS
			var pbr = new BABYLON.PBRMetallicRoughnessMaterial('pbr', scene);

			pbr.baseTexture = new BABYLON.Texture('scenes/textures/beigeFabric.dif.jpg', scene);
			pbr.metallic = 0;
			pbr.roughness = 0.65;
			pbr.baseTexture.uScale = 10;
			pbr.baseTexture.vScale = 10;

			newMeshes[1].material = graphite1;
			newMeshes[2].material = pbr;

			//newMeshes[0].scaling.x = .1;
			newMeshes[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
			newMeshes[0].position.y = 0;

			//newMeshes[0].positiion = new BABYLON.Vector3(0,0,0);
			camera.setTarget = newMeshes[0];

			//CREATE AN OBJECT THAT WILL HOLD ALL OF THE FABRICS.
			const obj = {
				redId: redFabricDif,
				beigeId: beigeFabricDif,
				forestGreenId: forestGreenFabricDif,
				greyId: greyFabricDif,
				navyId: navyFabricDif
			};	
	
			//CREATE THE HIGHLIGHT LAYER
			let h1 = new BABYLON.HighlightLayer('hl', scene);
			//SET THE INITIAL STATE OF THE lastClickedMesh var
			let lastClickedMesh = null;
			let mesh = null;

			//ADD A POINTERDOWN OBSERVABLE 
			scene.onPointerObservable.add(evt => {
				
				if (evt.pickInfo.hit && evt.pickInfo.pickedMesh !== undefined) {
					//STORES THE MESH INTO A VARIABLE
					 mesh = evt.pickInfo.pickedMesh;
					let fabrics = document.querySelectorAll('.fabrics');
					let currentFabric;
					fabrics.forEach(function(fabric) {
						fabric.addEventListener('click', evt => {
							console.log(obj[evt.target.id]);
							currentFabric = obj[evt.target.id];
							if(mesh && currentFabric){
								mesh.material = currentFabric;
								//console.log(evt.pickInfo.pickedMeshmesh);
							}else {
								mesh.removeMesh(mesh);
							}
						});
					});
					//HIGHLIGHTS THE CURRENT SELECTION
					if (newMeshes) {
						if (lastClickedMesh !== null) {
							
							h1.removeMesh(lastClickedMesh);
						}
						lastClickedMesh = mesh;
						h1.addMesh(lastClickedMesh, BABYLON.Color3.FromHexString('#4c90ef'));
					}
				} else {
					h1.removeMesh(lastClickedMesh);
				}

				
			}, BABYLON.PointerEventTypes.POINTERDOWN);
		}
	);

	/* //This is the debug layer.  Disable it upon completion.
	scene.debugLayer.show();
	BABYLON.DebugLayer.InspectorURL = 'http://myurl/babylon.inspector.bundle.js'; */

	return scene;
};

var scene = createScene();

engine.runRenderLoop(function() {
	scene.render();
});

window.addEventListener('resize', function() {
	engine.resize();
});
