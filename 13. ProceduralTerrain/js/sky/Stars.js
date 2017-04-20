function Stars(scene, terrainSize) {
	
	var starsGeometry = new THREE.IcosahedronGeometry(terrainSize, 4);
	
    // geometry deformation
    for (var i=0; i<starsGeometry.vertices.length; i+=1) {
    	var scalar = 1+ Math.random() + Math.random();
    	starsGeometry.vertices[i].multiplyScalar(scalar)
	}

	const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");
	const texture = textureLoader.load("textures/particle.png");

	const starMaterial = new THREE.PointsMaterial({ map: texture, color: "#fff", size: 10, blending: THREE.AdditiveBlending, transparent: false, opacity: 0.5, alphaTest: 0.25 });
	const stars = new THREE.Points(starsGeometry, starMaterial);
	scene.add(stars);

	this.update = function(time) {
		stars.rotation.y = time*0.003;
	}
}