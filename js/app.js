/*global THREE, Coordinates, document, window*/

var camera, scene, renderer, windowResize;
var cameraControls, effectController;
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

    // Geometries
    var cubeGeo = new THREE.BoxGeometry(100, 100, 100);

    // Materials
    var cubeMaterial = new THREE.MeshPhongMaterial({
        color: 0x555555,
        side: THREE.Doubleside
    });

    // Meshes
    var cubeMesh = new THREE.Mesh(cubeGeo, cubeMaterial);

    // Positioning
    cubeMesh.translateX(0);
    cubeMesh.translateY(0);
    cubeMesh.translateZ(0);

    // Add to scene
    scene.add(cubeMesh);
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
    camera.position.set(400, 150, 200);

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
