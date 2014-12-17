var img;
var bodyData;
var imgWidth = 512;
var imgHeight = 424;

var depthMap;
var depthTexture;

var nearClipping = 500, farClipping = 12050;

function setup(){
	var p5Canvas = createCanvas(imgWidth, imgHeight); 
	$( p5Canvas.elt ).addClass( 'preview' );	

	img = createImage(imgWidth, imgHeight);
	main( img.canvas );	
}

function main( depthCanvas ) {
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );
	camera.position.set( 100, 100, 1000 );
	var renderer = new THREE.WebGLRenderer({
		precision: 'highp'
	});
	renderer.setSize( window.innerWidth, window.innerHeight );
	var controls = new THREE.OrbitControls( camera, renderer.domElement );

	function render() {
		controls.update();
		requestAnimationFrame( render );
		renderer.render( scene, camera );
	}
	render();

	$( renderer.domElement ).addClass( 'render' );
	document.body.appendChild( renderer.domElement );

	var result = createParticles( imgWidth * imgHeight, depthCanvas );
	scene.add( result );

	// scene.add( new THREE.Mesh( new THREE.BoxGeometry( 200, 200, 200 ), new THREE.MeshBasicMaterial() ) );
}

function createParticles( numParticles, depthCanvas ){
	depthTexture = new THREE.Texture( depthCanvas );

	var uniforms = {
		depthTexture: { type: 't', value: depthTexture },
		width: { type: "f", value: imgWidth },
		height: { type: "f", value: imgHeight },
		nearClipping: { type: "f", value: nearClipping },
		farClipping: { type: "f", value: farClipping }		
	}

	var shaderMaterial = new THREE.ShaderMaterial( {
		uniforms:       uniforms,		
		vertexShader:   document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,		
	});	

	var geometry = new THREE.Geometry();
	for ( var i = 0; i<numParticles; i ++ ) {

		var position = new THREE.Vector3();
		position.x = ( i % imgWidth );
		position.y = Math.floor( i / imgWidth );

		geometry.vertices.push( new THREE.Vector3( position.x, position.y, position.z ) );
	}

	var pointCloud = new THREE.PointCloud( geometry, shaderMaterial );
	pointCloud.frustumCulled = false;
	return pointCloud;
}

function updateDepth(imgArray) {
	img.loadPixels();

	for (var i = 0; i<imgWidth * imgHeight; i++){
		var idx = i * 4;
		var color = imgArray[ i ];
		img.pixels[ idx ] = imgArray[ i ];
		img.pixels[ idx + 1 ] = imgArray[ i ];
		img.pixels[ idx + 2 ] = 0;
		img.pixels[ idx + 3 ] = 255;
	}

	img.updatePixels();
	depthTexture.needsUpdate = true;
	// console.log( depthTexture );
}

function updateBodies(data) {
	bodyData = data;
}

function drawBodies() {
	// if (bodyData != undefined) {
	// 	noStroke();
	// 	fill(255,50);
	// 	ellipseMode(CENTER);

	// 	for (var b in bodyData.bodies) {
	// 		if (bodyData.bodyTrackingIds[b] != 0) {
	// 			for (var i in bodyData.bodies[b]) {
	// 			  ellipse(bodyData.bodies[b][i].x * canvas.width/2 + canvas.width/2.0,
	// 							(1.0-bodyData.bodies[b][i].y) * canvas.height/2,16,16);
	// 			}
	// 		}
	// 	}
	// }
}

function draw() {
  background(0);
  image(img, 0, 0, imgWidth, imgHeight);
}