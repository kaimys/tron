var camera, scene, renderer, geometry, material, mesh;


window.addEventListener('load', function() {
    $('#qrcode').qrcode(document.location.href);
    
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

        renderer = new THREE.CanvasRenderer();
        renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 );

        document.getElementById('main').appendChild( renderer.domElement );

    }

    function animate() {

        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame( animate );
        render();

    }

    function render() {

        //mesh.rotation.x += 0.01;
        //mesh.rotation.y += 0.02;

        renderer.render( scene, camera );

    }

    //////////////////////////////////////////////////////////////////////////////////////////
    // DeviceMotion
    
    if (window.DeviceMotionEvent) {
        console.log("DeviceMotionEvent supported");
        window.addEventListener('devicemotion', deviceMotionHandler, false);
    } else {
        document.getElementById("dmEvent").innerHTML = "devicemotion not supported on your device."
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    // DeviceOrientation

    if (window.DeviceOrientationEvent) {
        document.getElementById("doEvent").innerHTML = "DeviceOrientation";
        // Listen for the deviceorientation event and handle the raw data
        window.addEventListener('deviceorientation', function(eventData) {
            // gamma is the left-to-right tilt in degrees, where right is positive
            var tiltLR = eventData.gamma;

            // beta is the front-to-back tilt in degrees, where front is positive
            var tiltFB = eventData.beta;

            // alpha is the compass direction the device is facing in degrees
            var dir = eventData.alpha

            // deviceorientation does not provide this data
            var motUD = null;

            // call our orientation event handler
            deviceOrientationHandler(tiltLR, tiltFB, dir, motUD);
        }, false);
    } else if (window.OrientationEvent) {
        document.getElementById("doEvent").innerHTML = "MozOrientation";
        window.addEventListener('MozOrientation', function(eventData) {
            // x is the left-to-right tilt from -1 to +1, so we need to convert to degrees
            var tiltLR = eventData.x * 90;

            // y is the front-to-back tilt from -1 to +1, so we need to convert to degrees
            // We also need to invert the value so tilting the device towards us (forward) 
            // results in a positive value. 
            var tiltFB = eventData.y * -90;

            // MozOrientation does not provide this data
            var dir = null;

            // z is the vertical acceleration of the device
            var motUD = eventData.z;

            // call our orientation event handler
            deviceOrientationHandler(tiltLR, tiltFB, dir, motUD);
        }, false);
    } else {
        document.getElementById("doEvent").innerHTML = "Not supported on your device or browser."
    }

//    var socket = io.connect('http://localhost');
//    socket.on('news', function (data) {
//      console.log(data);
//      socket.emit('my other event', { my: 'data' });
//    });
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

  // Apply the 2D rotation and 3D rotation to the image
  var rotation = "rotate(" + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB) + "deg)";
  document.getElementById("imgLogo").style.webkitTransform = rotation;        
}

function deviceOrientationHandler(tiltLR, tiltFB, dir, motionUD) {
    
    
    mesh.rotation.x = tiltFB / 90;
    mesh.rotation.y = tiltLR / 90;
    
    document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
    document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
    document.getElementById("doDirection").innerHTML = Math.round(dir);
    document.getElementById("doMotionUD").innerHTML = motionUD;
}
