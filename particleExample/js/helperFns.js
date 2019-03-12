const MAX = 1000;

function addADirectionalLight(clr,intensity,position,target,parentNode){
	let dl = new THREE.DirectionalLight(clr,intensity);
	dl.position.set(position.x,position.y,position.z);
	if(target!==null) {
		var targetObject = new THREE.Object3D();
		parentNode.add(targetObject);
		dl.target=targetObject;
		dl.target.position.set(target.x,target.y,target.z);
	}
	parentNode.add(dl);
	return dl;
}

function spawnParticles(){
	let particles = new THREE.Group();
    const geo = new THREE.SphereBufferGeometry(1);
    const mat = new THREE.MeshLambertMaterial({color: 0xffffff});
    for(let i=0; i<MAX; i++) {
        const particle = new THREE.Mesh(geo,mat)
        particle.update = function(smoothingFactor){
			particle.step +=(graphics.particleControls.spin?1:0)*particle.stepSpeed*smoothingFactor;
			particle.twist+=(graphics.particleControls.twist?1:0)*particle.twistSpeed* smoothingFactor;
			let pos = getParticlePos(particle.step,particle.twist);
			particle.position.set(pos.x,pos.y,pos.z);
		};
        particle.step = i;
		particle.stepSpeed =getRandSpeed();
		particle.twistSpeed= getRandSpeed();
		particle.twist = getRandTwist();
		particle.update(1);
		//console.log(particle.position);
        particles.add(particle);
    }
	return particles;
 }
 

function getRandSpeed(){
	return Math.random()*1+0.1;
}

function getRandTwist(){
	return Math.random()*1+0.1;
}

function getParticlePos(step,twist){
	//vertical ellipse
	let pos = new THREE.Vector3();
	pos.set(20+graphics.particleControls.travel+graphics.particleControls.travel*Math.cos(step*Math.PI/180),0,graphics.particleControls.rise+graphics.particleControls.rise*Math.sin(step*Math.PI/180));
	let quat = new THREE.Quaternion();
	quat.setFromAxisAngle( new THREE.Vector3( 0,0, 1 ),twist*Math.PI/180 );
	pos.applyQuaternion(quat);
	return {x:pos.x,y:pos.y,z:pos.z};
}

console.log("DBG: helperFns.js loaded");