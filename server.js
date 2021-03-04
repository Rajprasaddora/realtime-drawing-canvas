var express = require("express");
var app = express();
var PORT = process.env.PORT || 4200;
var server = require("http").createServer(app);
var io = require("socket.io")(server);
io.on("connection", newConnection);
function newConnection(client) {}

app.get("/", function (req, res) {
	res.send("this is home page");
});
io.on("connection", newConnection);
function newConnection(socket) {
	socket.on("join", ({ room }) => {
		socket.join(room);
	});
	socket.on(
		"draw",
		({ lastX, lastY, curX, curY, user, room, width, height }) => {
			// console.log(width, curY);
			socket.broadcast.to(room).emit("draw", {
				lastX,
				lastY,
				curX,
				curY,
				user,
				room,
				width,
				height,
			});
		}
	);
	socket.on("disconnect", () => {
		socket.emit("disconnected");
	});
}

server.listen(PORT, () => {
	console.log("listening to port :: ", PORT);
});
