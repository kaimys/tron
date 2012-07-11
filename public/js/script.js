var camera, scene, renderer, geometry, material, mesh;

var socket;

window.addEventListener('load', function() {
    $('#qrcode').qrcode(document.location.href + 'control.html');
    
    //////////////////////////////////////////////////////////////////////////////////////////
    // Three.js
    
    init();
    animate();

    function init() {

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 1000;
        scene.add( camera );

        geometry = new THREE.CubeGeometry( 400, 400, 400 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 );

        document.getElementById('main').appendChild( renderer.domElement );

    }

    function animate() {

        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame( animate );
        render();

    }

    function render() {

        renderer.render( scene, camera );

    }


    socket = io.connect('http://localhost:7777');
    socket.on('motion', function (data) {
      deviceMotionHandler(data);
    });
    socket.on('orientation', function (data) {
      deviceOrientationHandler(data.tiltLR, data.tiltFB, data.dir, data.motionUD);
    });
}, false);

//////////////////////////////////////////////////////////////////////////////////////////
// DeviceMotion

function deviceMotionHandler(eventData) {
  // Grab the acceleration including gravity from the results
  var acceleration = eventData.accelerationIncludingGravity;

  // Display the raw acceleration data
  var rawAcceleration = "[" +  Math.round(acceleration.x) + ", " + 
    Math.round(acceleration.y) + ", " + Math.round(acceleration.z) + "]";

  // Z is the acceleration in the Z axis, and if the device is facing up or down
  var facingUp = -1;
  if (acceleration.z > 0) {
    facingUp = +1;
  }
  
  // Convert the value from acceleration to degrees acceleration.x|y is the 
  // acceleration according to gravity, we'll assume we're on Earth and divide 
  // by 9.81 (earth gravity) to get a percentage value, and then multiply that 
  // by 90 to convert to degrees.                                
  var tiltLR = Math.round(((acceleration.x) / 9.81) * -90);
  var tiltFB = Math.round(((acceleration.y + 9.81) / 9.81) * 90 * facingUp);

  // Display the acceleration and calculated values
  document.getElementById("moAccel").innerHTML = rawAcceleration;
  document.getElementById("moCalcTiltLR").innerHTML = tiltLR;
  document.getElementById("moCalcTiltFB").innerHTML = tiltFB;
}

function deviceOrientationHandler(tiltLR, tiltFB, dir, motionUD) {
    
    mesh.rotation.x = tiltFB / 90;
    mesh.rotation.y = tiltLR / 90;
    
    document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
    document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
    document.getElementById("doDirection").innerHTML = Math.round(dir);
    document.getElementById("doMotionUD").innerHTML = motionUD;
}
