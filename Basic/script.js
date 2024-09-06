//world constants
deg = Math.PI/180;

function player(x,y,z,rx,ry){
	this.x = x;
	this.y = y;
	this.z = z;
	this.rx = rx;
	this.ry = ry;
}

var map = [
//	 x y z rx ry rz width height color
	[0,0,-1000,0,0,0,2000,200,"Patterns/wall.avif",1],
	[0,0,1000,0,0,0,2000,200,"Patterns/wall2.avif",1],
	[1000,0,0,0,90,0,2000,200,"#C0F0FF",0.5],
	[-1000,0,0,0,90,0,2000,200,"#C0F0FF",1],
	[0,100,0,90,0,0,2000,2000,"Patterns/ground2.avif",1]
]

var coins = [
	[500,30,-700,0,0,0,50,50,"#FFFF00"],
	[500,30,500,0,0,0,50,50,"#FFFF00"],
	[-100,30,-100,0,0,0,50,50,"#FFFF00"]
]

var keys = [
	[-500,30,-800,0,0,0,50,50,"#FF0000"],
	[-900,30,50,0,0,0,50,50,"#FF0000"],
	[300,30,100,0,0,0,50,50,"#FF0000"]
]

var coinSound = new Audio;
coinSound.src = "Sounds/coin.mp3"

var keySound = new Audio;
keySound.src = "Sounds/key.wav"



//variables for movement
var PressLeft = 0;
var PressRight = 0;
var PressForward = 0;
var PressBack = 0;
var PressUp = 0;
var MouseX = 0;
var MouseY = 0;

//variable for locked mouse
var lock = false;

//link variables
var container = document.getElementById("container");
var world = document.getElementById("world");

//locked mouse listener
document.addEventListener("pointerlockchange", (event) => {
	lock = !lock;
})

//if the mouse is pressed
container.onclick = function(){
	container.requestPointerLock();
}

//mouse movement listener
document.addEventListener("mousemove", (event) => {
	MouseX = event.movementX;
	MouseY = event.movementY;
})

//if the key is pressed
document.addEventListener("keydown", (event) => {
	if (event.key == "a"){
		PressLeft = 1;
	}
	if (event.key == "d"){
		PressRight = 1;
	}
	if (event.key == "w"){
		PressForward = 1;
	}
	if (event.key == "s"){
		PressBack = 1;
	}
	if (event.keyCode == 32){
		PressUp = 1;
	}
})

//if the key is released
document.addEventListener("keyup", (event) => {
	if (event.key == "a"){
		PressLeft = 0;
	}
	if (event.key == "d"){
		PressRight = 0;
	}
	if (event.key == "w"){
		PressForward = 0;
	}
	if (event.key == "s"){
		PressBack = 0;
	}
	if (event.keyCode == 32){
		PressUp = 0;
	}
})

var pawn = new player(0,0,0,0,0);

function update(){
	//count the movement
	//dx = PressRight - PressLeft;
	//dz = - (PressForward - PressBack);
	dx = Math.cos(pawn.ry * deg) * (PressRight - PressLeft) - Math.sin(pawn.ry * deg) * (PressForward - PressBack);
	dz = - Math.sin(pawn.ry * deg) * (PressRight - PressLeft) - Math.cos(pawn.ry * deg) * (PressForward - PressBack);
	
	dy = - PressUp;
	drx = MouseY;
	dry = - MouseX;
	
	MouseX = MouseY = 0;
	
	//add movement to the position of the player
	pawn.x = pawn.x + dx;
	pawn.y = pawn.y + dy;
	pawn.z = pawn.z + dz;
	if (lock) {
		pawn.rx = pawn.rx + drx;
		pawn.ry = pawn.ry + dry;
	}
	
	//move the world
	world.style.transform = 
		"translateZ(600px)" +
		"rotateX(" + (-pawn.rx) + "deg)" +
		"rotateY(" + (-pawn.ry) + "deg)" +
		"translate3d(" + (-pawn.x) + "px," + (-pawn.y) + "px," + (-pawn.z) + "px)";
}

//generation of the world
function CreateNewWorld(){
	CreateSquares(map,"map");
}


function CreateSquares(objects,string){
		for (let i = 0; i < objects.length; i++){
		
		//create squares and styles
		let newElement = document.createElement("div");
		newElement.className = string + " square";
		newElement.id = string + i;
		newElement.style.width = objects[i][6] + "px";
		newElement.style.height = objects[i][7] + "px";
		newElement.style.background = objects[i][8];
		newElement.style.backgroundImage = "url(" + objects[i][8] + ")";
		newElement.style.opacity = objects[i][9];
		newElement.style.transform = 
			"translate3d(" + (600 - objects[i][6]/2 + objects[i][0]) + "px," + 
				(400 - objects[i][7]/2 + objects[i][1]) + "px," + 
				objects[i][2] + "px)" +
			"rotateX(" + objects[i][3] + "deg)" +
			"rotateY(" + objects[i][4] + "deg)" +
			"rotateZ(" + objects[i][5] + "deg)";
		
		//insert the squares into the world
		world.append(newElement);
	}
}

function interact(objects,string,soundObject){
	for (i = 0; i < objects.length; i++){
		d = (objects[i][0] - pawn.x)**2 + (objects[i][1] - pawn.y)**2 + (objects[i][2] - pawn.z)**2;
		objsize = objects[i][6]**2;
		console.log(d,objsize);
		if(d < objsize){
			soundObject.play();
			document.getElementById(string+i).style.display = "none";
			objects[i][0] = 1000000;
			objects[i][1] = 1000000;
			objects[i][2] = 1000000;
		}
	}
}

function rotate(objects,string,step){
	for (i = 0; i < objects.length; i++){
		objects[i][4] = objects[i][4] + step;
		document.getElementById(string + i).style.transform = 
			"translate3d(" + (600 - objects[i][6]/2 + objects[i][0]) + "px," + 
				(400 - objects[i][7]/2 + objects[i][1]) + "px," + 
				objects[i][2] + "px)" +
			"rotateX(" + objects[i][3] + "deg)" +
			"rotateY(" + objects[i][4] + "deg)" +
			"rotateZ(" + objects[i][5] + "deg)";
	}
}

CreateNewWorld();
CreateSquares(coins,"coin");
CreateSquares(keys,"key");

function repeatFunction(){
	update();
	interact(coins,"coin",coinSound);
	interact(keys,"key",keySound);
	rotate(coins,"coin",0.5);
	rotate(keys,"key",0.5);
}

TimerGame = setInterval(repeatFunction,10);