/*global THREE, Coordinates, document, window*/

var camera, scene, renderer, windowResize;
var cameraControls, effectController;
var boardObj;
var lightBoard;
var clock = new THREE.Clock();

function fillScene() {
    scene = new THREE.Scene();

    // Lights
    var ambientLight = new THREE.AmbientLight(0x333333);
    var light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(200, 400, 500);
    var light2 = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light2.position.set(-500, 250, -200);

    scene.add(ambientLight);
    scene.add(light);
    scene.add(light2);

    boardObj = new THREE.Object3D();
    // Geometries
    var boardGeo = new THREE.BoxGeometry(56, 1.6, 56);
    var gpioGeo = new THREE.BoxGeometry(33.4, 8.0, 5);

    // Textures
    var boardTexture = new THREE.ImageUtils.loadTexture( "textures/board.png" );

    // Materials
    var boardMaterial = new THREE.MeshBasicMaterial({
        color: 0x5f6060,
        map : boardTexture
    });

    var gpioMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000
    });

    lightBoard = new LightBoard({
        width: 9,
        height: 14
    })

    drawLights(lightBoard);
    drawGpioPins();

    // Meshes
    var boardMesh = new THREE.Mesh(boardGeo, boardMaterial);
    var gpioMesh = new THREE.Mesh(gpioGeo, gpioMaterial);


    // Positioning
    boardMesh.translateX(0);
    boardMesh.translateY(0);
    boardMesh.translateZ(0);

    gpioMesh.translateX(-10);
    gpioMesh.translateY(-6 - .8);
    gpioMesh.translateZ(-23.625);

    // Add to scene
    boardObj.add(boardMesh);
    boardObj.add(gpioMesh);
    boardObj.rotateOnAxis(new THREE.Vector3(1, 0, 0), .225)
    scene.add(boardObj)
}

function drawLights(board) {
    var on7Material = new THREE.MeshPhongMaterial({
        color: 0xffffff
    });

    var on6Material = new THREE.MeshPhongMaterial({
        color: 0xdddddd
    });

    var on5Material = new THREE.MeshPhongMaterial({
        color: 0xbbbbbb
    });

    var on4Material = new THREE.MeshPhongMaterial({
        color: 0x999999
    });

    var on3Material = new THREE.MeshPhongMaterial({
        color: 0x777777
    });

    var on2Material = new THREE.MeshPhongMaterial({
        color: 0x555555
    });

    var on1Material = new THREE.MeshPhongMaterial({
        color: 0x333333
    });

    var offMaterial = new THREE.MeshPhongMaterial({
        color: 0x111111
    });


    var ledGeo = new THREE.BoxGeometry(4, 1, 1.5);
    var ledMaterial = offMaterial;
    for (var x = 0; x < 9; x++) {
        for (var y = 0; y < 14; y++) {
            switch (board.onOff[y][x]) {
                case 1 :
                    ledMaterial = on1Material;
                    break;
                case 2 :
                    ledMaterial = on2Material;
                    break;
                case 3 :
                    ledMaterial = on3Material;
                    break;
                case 4 :
                    ledMaterial = on4Material;
                    break;
                case 5 :
                    ledMaterial = on5Material;
                    break;
                case 6 :
                    ledMaterial = on6Material;
                    break;
                case 7 :
                    ledMaterial = on7Material;
                    break;
                case 8 :
                    ledMaterial = on8Material;
                    break;
                default :
                    ledMaterial = offMaterial;
                    break;
            }

            var dx = (x * 5.5) - 19.75;
            var dz = (y * 3.15) - 16.5;

            lightMesh = new THREE.Mesh(ledGeo, ledMaterial);

            lightMesh.translateX(dx);
            lightMesh.translateY(1);
            lightMesh.translateZ(dz);

            boardObj.add(lightMesh);

//            var point = new THREE.PointLight(0xfcffd5, 1, 3);
//            point.position.set(dx, 2, dz);
//            boardObj.add(point);
        }
    }
}

function drawGpioPins() {
    // Solder
    var solderGeo = new THREE.CylinderGeometry(0.35, 0.7, 2, 10);
    var solderMaterial = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        shininess: 100
    });

    // GPIO pin
    var gpioGeo = new THREE.BoxGeometry(.5, 5, .5);
    var gpioMaterial = new THREE.MeshPhongMaterial({
        color: 0xf7a421,
        shininess: 100
    });

    // GPIO housing
    var gpioHousingGeo = new THREE.CylinderGeometry(1.375, 1.375, 2, 5);
    var gpioHousingMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000
    });

    for (var x = 0; x < 16; x++) {
        for (var y = 0; y < 2; y++) {
            if (x < 13) {
                solderMesh = new THREE.Mesh(solderGeo, solderMaterial);

                solderMesh.translateX((x * 2.55) - 25.55);
                solderMesh.translateY(0.5+0.8);
                solderMesh.translateZ((2.55 * y) - 25.05);

                boardObj.add(solderMesh);



                gpioMesh = new THREE.Mesh(gpioGeo, gpioMaterial);

                gpioMesh.translateX((x * 2.55) - 25.55);
                gpioMesh.translateY(-2);
                gpioMesh.translateZ((2.55 * y) - 25.05);

                boardObj.add(solderMesh);
                boardObj.add(gpioMesh);


                gpioHousingMesh = new THREE.Mesh(gpioHousingGeo, gpioHousingMaterial);

                gpioHousingMesh.translateX((x * 2.55) - 25.55);
                gpioHousingMesh.translateY(-1 - 0.8);
                gpioHousingMesh.translateZ((2.55 * y) - 25.05);


                boardObj.add(solderMesh);
                boardObj.add(gpioHousingMesh);
                boardObj.add(gpioMesh);
            } else {

            }
        }
    }
}

function init() {
    // Renderer sizing
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    var canvasRatio = canvasWidth / canvasHeight;
    dpr = window.devicePixelRatio ? window.devicePixelRatio : 1;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setPixelRatio(dpr)
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(dpr)
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0xffffff, 1);

    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // Camera
    camera = new THREE.PerspectiveCamera(30, canvasRatio, 1, 10000);
    camera.position.set(-100, 100, 100);

    // Orbit and Pan controls
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 0, 0);

    var windowResize = THREEx.WindowResize(renderer, camera);
}

function addToDOM() {
    var container = document.getElementById('container');
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length > 0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild(renderer.domElement);
}

function animate() {
    window.requestAnimationFrame(animate);
    render();
}

function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);

    renderer.render(scene, camera);
}


window.onload = function () {
    init();
    fillScene();
    addToDOM();
    animate();
};
