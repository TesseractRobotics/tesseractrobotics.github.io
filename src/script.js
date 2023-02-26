import * as THREE from 'three'
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Base
 */


// load a resource



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Object
// const geometry = new THREE.BoxGeometry(100, 100, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
// const mesh = new THREE.Mesh(geometry, material)
// mesh.position.z = -10
// scene.add(mesh)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height,0.1, 1000)

scene.add(camera)

const directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.2 );
const directionalLight2 = new THREE.DirectionalLight( 0xaabbff, 0.2);
const directionalLight3 = new THREE.DirectionalLight( 0xffffff, 0.1 );
const directionalLight4 = new THREE.DirectionalLight( 0xffffff, 0.1 );
console.log(directionalLight2)
directionalLight2.position.x = -5
directionalLight2.position.y = 0
directionalLight2.position.z = 0


directionalLight3.position.x = -5
directionalLight3.position.y = 5
directionalLight3.position.z = 0


directionalLight4.position.x = -5
directionalLight4.position.y = -5
directionalLight4.position.z = 5

scene.add( directionalLight1 );
scene.add( directionalLight2);
scene.add( directionalLight3 );
scene.add( directionalLight4);

const light = new THREE.AmbientLight( 0x888888 ); // soft white light
scene.add( light );


// 



// var myGradient = new THREE.Mesh(
//     new THREE.PlaneBufferGeometry(0.5,0.5,1,1),
//     new THREE.ShaderMaterial({
//       uniforms: {
//         uColorA: { value: new THREE.Color(0x000000) },
//         uColorB: { value: new THREE.Color(0xffffff) }
//       },
//       vertexShader: `
//       varying vec2 vUv;
//     void main(){
//     vUv = uv;
//     float depth = -1.; //or maybe 1. you can experiment
//     gl_Position = vec4(position.xy, depth, 1.);
//     }
//       `,
//       fragmentShader: `varying vec2 vUv;
//       uniform vec3 uColorA;
//       uniform vec3 uColorB;
//       void main(){
//         gl_FragColor = vec4(
//           mix( uColorA, uColorB, vec3(vUv.x)),
//           1.
//         );
//       }`
//     })
//   )
//   myGradient.material.depthWrite = false
// myGradient.renderOrder = -99999
//   myGradient.position.z=-200
// scene.add(myGradient)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enabled = false;
// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor( 0x000000, 0 ); // the default


const loader = new GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data

let chip
// Load a glTF resource
loader.load(
	// resource URL
	'./models/chipedit.gltf',
	// called when the resource is loaded
	function ( gltf ) {
        console.log('Here')
        chip = gltf.scene
		chip.scale.set( 1/10, 1/10, 1/10);			   
	    // gltf.scene.position.x -= 13;				    //Position (x = right+ left-) 
        // gltf.scene.position.y += 10;				    //Position (y = up+, down-)
	    // gltf.scene.position.z = 0;				    //Position (z = front +, back-)
        console.log(gltf.scene)
                
        // scene.add( chip );
        scene.add( gltf.scene );

        const box = new THREE.Box3().setFromObject(chip);
        const boxSize = box.getSize(new THREE.Vector3()).length();
        const boxCenter = box.getCenter(new THREE.Vector3());
        chip.position.x -= boxCenter.x
        chip.position.y -= boxCenter.y 
        chip.position.z -= boxCenter.z

       

        // console.log(boxSize)
        // console.log(boxCenter)
        directionalLight1.target = chip
        directionalLight2.target = chip  
        directionalLight3.target = chip
        directionalLight4.target = chip
        camera.position.x = chip.position.x
        camera.position.y = chip.position.y+100
        camera.position.z = chip.position.z


      
        renderer.render(scene, camera)

        console.log('rendered')

        // const quaternion = new THREE.Quaternion();
        // quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );
        // chip.rotation.x= Math.PI/6  

        // chip.rotation.y = Math.PI
        // chip.rotation.z = Math.PI
     //   camera.lookAt(gltf.scene)

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened!!!' );

	}
);


// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // Update controls
     controls.update()
    //
    if (chip){
        chip.rotation.z += 0.003
        // // chip.rotation.y -= 0.001
        //  chip.rotation.z += 0.001

    }
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()