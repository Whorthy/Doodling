function SceneManager(canvas) {
	canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    var width = canvas.width;
    var height = canvas.height;

    var clock = new THREE.Clock();
  
    // scene setup
    var scene = new THREE.Scene();
    scene.background = new THREE.Color("#000033");
    scene.fog = new THREE.Fog( "#990099", 1, 4000 )

    var light = buildLights(scene);

    var camera = buildCamera(width, height);
    var cubeCamera = new THREE.CubeCamera(0.5, 20000, 1024);   
    scene.add(cubeCamera);
    var renderer = buildRender(width, height);

    const terrainSubject = new Terrain(scene, cubeCamera);

    const collisionManager = new TerrainCollisionManager(terrainSubject.terrain);

    const cameraControls = new PointerLockManager(camera, scene, collisionManager);
    const player = cameraControls.getObject();
    
    var sceneSubjects = new Array();
    sceneSubjects.push(terrainSubject);
    sceneSubjects.push(new Skydome(scene, terrainSubject.size));
    sceneSubjects.push(new EntitiesSpawner(scene, player, collisionManager, terrainSubject.size));
    sceneSubjects.push(new MonolithsSpawner(scene, player, collisionManager, terrainSubject.size, cubeCamera));

    function buildLights(scene) {

        // var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        // scene.add( light );

        var light = new THREE.SpotLight("#2222ff", 1);
        light.castShadow = true;
        light.position.y = 700;
        light.position.z = 0;
        light.position.x = -1400;

        light.decacy = 2;
        light.penumbra = 1;

        light.shadow.camera.near = 10;
        light.shadow.camera.far = 1000;
        light.shadow.camera.fov = 30;

        scene.add(light);

  //       var spotLightHelper = new THREE.SpotLightHelper( light );
		// scene.add( spotLightHelper )

        return light;
    }

    function buildCamera(width, height) {
        var aspectRatio = width / height;
        var fieldOfView = 60;
        var nearPlane = 0.01;
        var farPlane = 10000; 
        var camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        return camera;
    }

    function buildRender(width, height) {
        var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); 
        var DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        renderer.gammaInput = true;
        renderer.gammaOutput = true; 

        return renderer;
    }

    this.update = function() {

        for(var i=0; i<sceneSubjects.length; i++)
        	sceneSubjects[i].update(clock.getElapsedTime()*1, player);

        cameraControls.update();
        collisionManager.update();

        cubeCamera.position.x = player.position.x;
        cubeCamera.position.z = player.position.z;
        cubeCamera.updateCubeMap(renderer, scene);

        renderer.render(scene, camera);
    };

    this.onWindowResize = function() {
        const canvas = document.getElementById("canvas");
        width = document.body.clientWidth;
        height = document.body.clientHeight;
        canvas.width = width;
        canvas.height = height;

        camera.aspect = width /height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    }

    this.onMouseMove = function(mouseX, mouseY) {
    }
}