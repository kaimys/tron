var camera, scene, renderer, geometry, material, mesh, clock;

var socket;

var rad = 180 / Math.PI;

window.addEventListener('load', function() {
    var loc = document.location;
    $('#qrcode').qrcode({width: 128,height: 128, text: 'http://' + loc.host + '/control.html'});
    
    //////////////////////////////////////////////////////////////////////////////////////////
    // Three.js
    
    init();
    animate();

    function init() {
        
        clock = new THREE.Clock();
        clock.start();

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight / 0.75, 1, 10000 );
        camera.position.z = 1000;
        scene.add( camera );

        geometry = new THREE.CubeGeometry( 400, 400, 400 );
        //var qr = document.getElementById('qrcode').firstChild.toDataURL();
        material = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( '/img/qrcode.png' ) } );

        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );
        
        var light = new THREE.PointLight( 0xFFFFDD );
        light.position.set( 300, 1000, 500 );
        scene.add( light );
        scene.add( new THREE.AmbientLight( 0xFFDDDD ) );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight * 0.75 );

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


    socket = io.connect('http://' + loc.hostname);
    socket.on('motion', function (data) {
      deviceMotionHandler(data);
    });
    socket.on('orientation', function (data) {
      deviceOrientationHandler(data.tiltLR, data.tiltFB, data.dir, data.motionUD);
    });
}, false);

//////////////////////////////////////////////////////////////////////////////////////////
// DeviceMotion

var vx = 0.0, vy = 0.0, vz = 0.0;
var oldAccel;
var damp = 0.6, grav = 0.005;

function deviceMotionHandler(eventData) {
  
  //Calc position from acceleration
  var dt = clock.getDelta() * 100.0;
  if(oldAccel) {
      vx *= damp;
      vy *= damp;
      vz *= damp;
      vx -= (oldAccel.x + eventData.acceleration.x) / 2.0 * dt;
      vy -= (oldAccel.y + eventData.acceleration.y) / 2.0 * dt;
      vz -= (oldAccel.z + eventData.acceleration.z) / 2.0 * dt;
      vx -= mesh.position.x * grav;
      vy -= mesh.position.y * grav;
      vz -= mesh.position.z * grav;
      //console.log(vx,vy,vz);
      mesh.position.x += dt * vx;
      mesh.position.y += dt * vy;
      mesh.position.z += dt * vz;
  }
  oldAccel = eventData.acceleration;
  
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
    
    mesh.rotation.x = tiltFB / rad;
    mesh.rotation.y = tiltLR / rad;
    mesh.rotation.z = dir / rad;
    
    document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
    document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
    document.getElementById("doDirection").innerHTML = Math.round(dir);
    document.getElementById("doMotionUD").innerHTML = motionUD;
}
