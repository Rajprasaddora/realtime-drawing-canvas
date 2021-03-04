var canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const user = document.getElementById("name").value;
const room = document.getElementById("room").value;
const roomEntered = document.getElementById("enter-room");
var isConnected = false;
var lastPoint = null;
var socket = io("http://localhost:4200", {
	transports: ["websocket", "polling", "flashsocket"],
});

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
// console.log(screenWidth, typeof screenWidth);
function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;
}
function move(e) {
	if (e.buttons) {
		if (!lastPoint) {
			lastPoint = { x: e.offsetX, y: e.offsetY };
			return;
		}
		if (isConnected) {
			socket.emit("draw", {
				lastX: lastPoint.x,
				lastY: lastPoint.y,
				curX: e.offsetX,
				curY: e.offsetY,
				user: user,
				room: room,
				width: screenWidth,
				height: screenHeight,
			});
		}

		drawLine(lastPoint.x, lastPoint.y, e.offsetX, e.offsetY);
	}
}
roomEntered.onclick = (e) => {
	isConnected = true;
	socket.emit("join", { user: user, room: room });
	socket.on(
		"draw",
		({ lastX, lastY, curX, curY, user, room, width, height }) => {
			// console.log("ondrawing ", curX, lastX, width, typeof curX);
			var forThisWindowX = (curX / width) * screenWidth;

			var forThisWindowY = (curY / height) * screenHeight;

			var forThisWindowLastX = (lastX / width) * screenWidth;
			var forThisWindowLastY = (lastY / height) * screenHeight;
			// console.log("clac", forThisWindowX, typeof forThisWindowX);
			drawLineRemote(
				forThisWindowLastX,
				forThisWindowLastY,
				forThisWindowX,
				forThisWindowY
			);
		}
	);
};
function drawLineRemote(lastX, lastY, curX, curY) {
	// console.log("drawing", curX, curY);
	// console.log(typeof curX);
	context.beginPath();
	context.moveTo(lastX, lastY);
	context.lineTo(curX, curY);
	context.strokeStyle = "red";
	context.lineWidth = 5;
	context.lineCap = "round";
	context.stroke();
	lastPoint = { x: curX, y: curY };
}
function drawLine(lastX, lastY, curX, curY) {
	// console.log("drawing", curX, curY);
	// console.log(typeof curX);
	context.beginPath();
	context.moveTo(lastX, lastY);
	context.lineTo(curX, curY);
	context.strokeStyle = "green";
	context.lineWidth = 5;
	context.lineCap = "round";
	context.stroke();
	lastPoint = { x: curX, y: curY };
}
function clearLast() {
	lastPoint = null;
}

window.onmousemove = move;
window.onresize = resize;
resize();
window.onmouseup = move;
window.onmousedown = clearLast;
