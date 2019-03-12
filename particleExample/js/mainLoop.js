//declare the object	
var graphics = {scene:null, renderer:null, camera:null, controls:null, 
					particleControls:{twist:true,spin:true,refreshStep:1,frameStep:0,rise:200,travel:100}};

//check if three.min.js loaded properly
if(THREE) console.log("DBG: THREE is available");

function controls(){
	document.getElementById("twist").addEventListener('change',function(){
		graphics.particleControls.twist = this.checked;
	});
	document.getElementById("twist").checked=true;
	document.getElementById("spin").addEventListener('change',function(){
		graphics.particleControls.spin = this.checked;
	});
	document.getElementById("spin").checked=true;
	document.getElementById("speed").addEventListener('input',function(){
		graphics.particleControls.refreshStep = this.max*1-this.value*1 + this.min*1;
		console.log(graphics.particleControls.refreshStep);
	});	
	document.getElementById("restart").addEventListener('click', function(){
		let i=0;
		graphics.particles.children.forEach(particle=>{
			//reset
			particle.step = i; i++;
			particle.stepSpeed =getRandSpeed();
			particle.twistSpeed= getRandSpeed();
			particle.twist = getRandTwist();
			particle.update(1/graphics.particleControls.refreshStep);
		})
		
	});
}

function init(){
	//graphics and renderer initialized
	graphics.scene = new THREE.Scene();
	graphics.renderer = new THREE.WebGLRenderer({antialias:true});

	//renderer hooks into the page
	let hnd = document.getElementById("threejs");
	graphics.renderer.setSize(hnd.clientWidth, hnd.clientHeight); 
	hnd.appendChild(graphics.renderer.domElement);
		
	//camera settings... tbd	
	//45 degree FOV, aspect ratio, near distance, far distance 
	graphics.camera = new THREE.PerspectiveCamera(75, hnd.clientWidth / hnd.clientHeight, 0.1, 20000); 
	//place the camera at these coordinates
	graphics.camera.position.set(graphics.particleControls.travel*2.5,graphics.particleControls.travel*2.5,graphics.particleControls.rise);
	graphics.camera.up = new THREE.Vector3(0,0,1);
	

	
	graphics.controls = new THREE.OrbitControls( graphics.camera,  document.getElementById("threejs") );
	graphics.camera.lookAt(new THREE.Vector3(0,0,graphics.particleControls.rise));
	graphics.controls.target = new THREE.Vector3(0,0,graphics.particleControls.rise);
	graphics.controls.update();
	
	graphics.scene.add(new THREE.AxesHelper(50));
	graphics.particles = spawnParticles();
	graphics.scene.add(graphics.particles);

    xDir = addADirectionalLight(0xff0000,1, {x:1000,y:0, z:0 },null,graphics.scene);
	yDir = addADirectionalLight(0x00ff00,1, {x:0, y:1000,z:0 },null,graphics.scene);
	zDir = addADirectionalLight(0x0000ff,1, {x:0, y:0, z:1000},null,graphics.scene);
	wDir1 = addADirectionalLight(0xFF00ff,1, {x:-1000, y:0, z:-1000},null,graphics.scene);
	wDir2 = addADirectionalLight(0xFFFF00,1, {x:0, y:-1000, z:-1000},null,graphics.scene);
	wDir3 = addADirectionalLight(0x00FFff,1, {x:-1000, y:-1000, z:0},null,graphics.scene);
	
	animate(); //trigger the render loop after init is complete
}

// Renders the scene and updates the render as needed.
function animate() {
	//next two lines provide refresh rate for the entire particle system
	graphics.particleControls.frameStep++; 
	update();
	
	requestAnimationFrame(animate);
    
	// Render the scene, using the camera specifications
	graphics.renderer.render(graphics.scene, graphics.camera);
}
function update(){
	graphics.controls.update();
	graphics.particles.children.forEach(p=>{p.update(1/graphics.particleControls.refreshStep);});
}

console.log("DBG: mainLoop.js loaded");

