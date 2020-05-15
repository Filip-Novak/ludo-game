const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const Routes = require('./Routes');
const server = require('http').Server(app);

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

//Databaza
const db = mysql.createConnection({
	host: 'localhost',
	port: 3308,
	user: 'filip', 
	password: 'filip',
	database: 'tia-hra'
});

db.connect(function(err) {
	if(err){
		console.log('DB error');
		throw err;
		return false;
	}
});

const sessionStore = new MySQLStore({
	expiration: (1825 * 86400 * 1000),		
	endConnectionOnClose: false
}, db);

app.use(session({
	key: 'asdf45aa56s4f6ad5sf',
	secret: 'mgfasd54fas59f5asd4sd',
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: (1825 * 86400 * 1000),		
		httpOnly: false
	}
}));

new Routes(app, db);

app.get('/*', function(req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

server.listen(3000);

//server
const io = require('socket.io')(server);

let gameRooms = {"room1": 0, "room2": 0, "room3": 0};
let lobbyPlayers = [];
let room1 = [];
let room2 = [];
let room3 = [];
let inGameRooms = [];

let room1Turns = [];
let room2Turns = [];
let room3Turns = [];

let index1 = 0;
let index2 = 0;
let index3 = 0;

let finishRoom1 = [];
let finishRoom2 = [];
let finishRoom3 = [];

let disconnectRoom1 = [];
let disconnectRoom2 = [];
let disconnectRoom3 = [];

io.of("/lobby").on('connection', (socket) => { 
//Lobby
	console.log("New player in lobby");
	
	socket.emit("getName", {
			msg:"Poziadavka o meno"
		});
	
	socket.on("addLobbyPlayer", (data) => {
		socket.name = data.name;
		socket.getOut = true;
		
		lobbyPlayers.push(data.name);
		console.log(lobbyPlayers.length);
		io.of("/lobby").emit("updateLobbyRoom", {
			lobby: true,
			players: lobbyPlayers,
			finalRoom: "",
			rPlayers: ""
		});
		
		socket.emit("initRooms", {
			room1: room1,
			room2: room2,
			room3: room3
		});
	});
	
	socket.on("readyUnready", (room) => {
		let roomPlayers;
		
		if(room.localeCompare("room1") === 0) {
			let i = room1.findIndex(x => x.name === socket.name);
			room1[i].check = !room1[i].check;
			roomPlayers = room1;
		} else if(room.localeCompare("room2") === 0) {
			let i = room2.findIndex(x => x.name === socket.name);
			room2[i].check = !room2[i].check;
			roomPlayers = room2;
		} else if(room.localeCompare("room3") === 0) {
			let i = room3.findIndex(x => x.name === socket.name);
			room3[i].check = !room3[i].check;
			roomPlayers = room3;
		} else {
			return socket.emit("err","Error, " + room + " where you want ready/unready does not exist !");
		}
		
		if(roomPlayers.length >= 2){
			for(let i=0; i < roomPlayers.length; i++){
				if(!roomPlayers[i].check){
					return io.of("/lobby").emit("updateLobbyRoom", {
								lobby: false,
								players: [],
								finalRoom: room,
								rPlayers: roomPlayers
							});
				}
			}
		} else {
			return io.of("/lobby").emit("updateLobbyRoom", {
						lobby: false,
						players: [],
						finalRoom: room,
						rPlayers: roomPlayers
					});
		}
		inGameRooms.push(room);
		
		io.of("/lobby").emit("updateLobbyRoom", {
			lobby: false,
			players: [],
			finalRoom: room,
			rPlayers: roomPlayers
		});
		
		return io.of("/lobby").in(room).emit("startingGame", {
					finalRoom: room,
					msg: "Game is starting in the " + room + " !"
				});
	});
	
	socket.on("joinRoom", (room) => {
		let inG = inGameRooms.indexOf(room);
		
		if(inG === -1){
			if(gameRooms[room]<4){
				gameRooms[room]++;
				let roomPlayers;
				
				if(room.localeCompare("room1") === 0) {
					room1.push({
						name: socket.name,
						check: false
					});
					roomPlayers = room1;
				} else if (room.localeCompare("room2") === 0){
					room2.push({
						name: socket.name,
						check: false
					});
					roomPlayers = room2;
				} else if (room.localeCompare("room3") === 0){
					room3.push({
						name: socket.name,
						check: false
					});
					roomPlayers = room3;
				} else {
					return socket.emit("err","Error, " + room + " does not exist !");
				}
				socket.join(room);
				
				let i = lobbyPlayers.indexOf(socket.name);
				lobbyPlayers.splice(i, 1);
				io.of("/lobby").emit("updateLobbyRoom", {
					lobby: true,
					players: lobbyPlayers,
					finalRoom: room,
					rPlayers: roomPlayers
				});
				
				return socket.emit("successfulJoin", {
							finalRoom: room,
							msg: "You have successfully joined " + room + " !"
						});
			} else {
				return socket.emit("err","Error, " + room + " is full !");
			}
		} else {
			return socket.emit("err","Error, players in the " + room + " are playing !");
		}
	});
	
	socket.on("leaveRoom", (room) => {
		let roomPlayers;
		
		if(room.localeCompare("room1") === 0) {
			let i = room1.findIndex(x => x.name === socket.name);
			room1.splice(i, 1);
			roomPlayers = room1;
		} else if(room.localeCompare("room2") === 0) {
			let i = room2.findIndex(x => x.name === socket.name);
			room2.splice(i, 1);
			roomPlayers = room2;
		} else if(room.localeCompare("room3") === 0) {
			let i = room3.findIndex(x => x.name === socket.name);
			room3.splice(i, 1);
			roomPlayers = room3;
		} else {
			return socket.emit("err","Error, " + room + " you are leaving does not exist !");
		}
		gameRooms[room]--;
		socket.leave(room);
		lobbyPlayers.push(socket.name);
		
		io.of("/lobby").emit("updateLobbyRoom", {
				lobby: true,
				players: lobbyPlayers,
				finalRoom: room,
				rPlayers: roomPlayers
			});
			
		return socket.emit("successfulLeave", {
						finalRoom: room,
						msg: "You have successfully left the " + room + " !"
				}); 
	});
	
//Game
	socket.on("getInitSettings", (room) => {
		
		if(room.localeCompare("room1") === 0) {
			socket.numOfPlayers = room1.length;
			for(let i = 0; i < room1.length; i++){
				room1Turns.push({
					name: room1[i].name,
					num: i
				});
			}
			
			socket.emit("initSettings", {
				players: room1,
				numOfPlayers: room1.length
			});
		} else if(room.localeCompare("room2") === 0) {
			socket.numOfPlayers = room2.length;
			for(let i = 0; i < room2.length; i++){
				room2Turns.push({
					name: room2[i].name,
					num: i
				});
			}
			
			socket.emit("initSettings", {
				players: room2,
				numOfPlayers: room2.length
			});
		} else if(room.localeCompare("room3") === 0) {
			socket.numOfPlayers = room3.length;
			for(let i = 0; i < room3.length; i++){
				room3Turns.push({
					name: room3[i].name,
					num: i
				});
			}
			
			socket.emit("initSettings", {
				players: room3,
				numOfPlayers: room3.length
			});
		} else {
			socket.emit("gameErr","Error, " + room + " does not exist !");
		}
	});
	
	socket.on("diceValue", (data) => {
		return io.of("/lobby").to(data.room).emit("diceNum", {
					isNum: data.isNum,
					num: data.num
		});
	});
	
	socket.on("changePlayer", (room) => {
		if(room.localeCompare("room1") === 0) {
			if(index1 < (room1Turns.length-1)){
				index1++;
			} else {
				index1=0;
			}
			return io.of("/lobby").in(room).emit("nextPlayer", room1Turns[index1].num);
			
		} else if(room.localeCompare("room2") === 0) {
			if(index2 < (room2Turns.length-1)){
				index2++;
			} else {
				index2=0;
			}
			return io.of("/lobby").in(room).emit("nextPlayer", room2Turns[index2].num);
			
		} else if(room.localeCompare("room3") === 0) {
			if(index3 < (room3Turns.length-1)){
				index3++;
			} else {
				index3=0;
			}
			return io.of("/lobby").in(room).emit("nextPlayer", room3Turns[index3].num);
		}
	});
	
	socket.on("movePawn", (data) => {
		return io.of("/lobby").to(data.room).emit("movedPawn", {
					pawn: data.pawn,
					cx: data.cx,
					cy: data.cy,
					visible: data.visible
		});
	});
	
	socket.on("returnPawn", (data) => {
		return io.of("/lobby").to(data.room).emit("returnedPawn", {
					pawn: data.pawn,
					col: data.col,
					cx: data.cx,
					cy: data.cy
		});
	});
	
	socket.on("updateCounter", (data) => {
		return io.of("/lobby").to(data.room).emit("updatedCounter", {
					counter: data.counter,
					numOut: data.numOut,
					makeVisible: data.makeVisible
		});
	});
	

//Disconnecting
	socket.on("disconnectManually", (data) => {
		console.log(data.msg);
		if(data.disc){
			socket.getOut = true;
		} else {
			socket.getOut = false;
		}
		socket.disconnect(true);
	});
	
	socket.on("disconnect", () => {
		console.log('Got disconnect!');
		
		let i = lobbyPlayers.indexOf(socket.name);
		let j = room1.findIndex(x => x.name === socket.name);
		let k = room2.findIndex(x => x.name === socket.name);
		let l = room3.findIndex(x => x.name === socket.name);
		
		if(i !== -1){
			lobbyPlayers.splice(i, 1);
			
			socket.broadcast.emit("updateLobbyRoom", {
				lobby: true,
				players: lobbyPlayers,
				finalRoom: "",
				rPlayers: ""
			});
		} else if (j !== -1) {
			if(inGameRooms.includes("room1")){
				
				if(socket.getOut){
					let o = room1Turns.findIndex(x => x.name === socket.name);
					if(o === index1){
						if(index1 === (room1Turns.length-1)){
							room1Turns.splice(index1, 1);
							index1=0;
						} else {
							room1Turns.splice(index1, 1);
						}
						io.of("/lobby").in("room1").emit("nextPlayer", room1Turns[index1].num);
					} else {
						if(o < index1){
							room1Turns.splice(o, 1);
							index1--;
						} else {
							room1Turns.splice(o, 1);
						}
					}
					disconnectRoom1.unshift(socket.name);
					
					io.of("/lobby").to("room1").emit("playerFinished", {
						name: socket.name, 
						ranking: 0
					});
				} else {				
					if(index1 === (room1Turns.length - 1)){
						room1Turns.splice(index1, 1);
						index1 = 0;
					} else {
						room1Turns.splice(index1, 1);
					}
					io.of("/lobby").in("room1").emit("nextPlayer", room1Turns[index1].num);
					
					finishRoom1.push(socket.name);
					
					io.of("/lobby").to("room1").emit("playerFinished", {
						name: socket.name, 
						ranking: 1
					});
				}
				let num = finishRoom1.length + disconnectRoom1.length;
				if(num === (socket.numOfPlayers-1)){
						
					for(let n = 0; n < room1.length; n++){
						if(socket.name.localeCompare(room1[n].name) !== 0){
							finishRoom1.push(room1[n].name);
						}
					}
					let m = inGameRooms.indexOf("room1");
					inGameRooms.splice(m, 1);
						
					room1.splice(j, 1);
					gameRooms["room1"]--;
					socket.leave("room1");
			
					socket.broadcast.emit("updateLobbyRoom", {
						lobby: false,
						players: [],
						finalRoom: "room1",
						rPlayers: room1
					});
						
					io.of("/lobby").to("room1").emit("endOfGame", "It is end of Game");
						
					updateStatistics(db, finishRoom1, disconnectRoom1);
					
					finishRoom1 = [];
					disconnectRoom1 = [];
					room1Turns = [];
					index1 = 0;	
				} else {
					room1.splice(j, 1);
					gameRooms["room1"]--;
					socket.leave("room1");
			
					socket.broadcast.emit("updateLobbyRoom", {
						lobby: false,
						players: [],
						finalRoom: "room1",
						rPlayers: room1
					});
				}			
			} else {
				room1.splice(j, 1);
				gameRooms["room1"]--;
				socket.leave("room1");
			
				socket.broadcast.emit("updateLobbyRoom", {
					lobby: false,
					players: [],
					finalRoom: "room1",
					rPlayers: room1
				});	
			}
		} else if (k !== -1) {
			if(inGameRooms.includes("room2")){
				
				if(socket.getOut){
					let o = room2Turns.findIndex(x => x.name === socket.name);
					if(o === index2){
						if(index2 === (room2Turns.length-1)){
							room2Turns.splice(index2, 1);
							index2=0;
						} else {
							room2Turns.splice(index2, 1);
						}
						io.of("/lobby").in("room2").emit("nextPlayer", room2Turns[index2].num);
					} else {
						if(o < index2){
							room2Turns.splice(o, 1);
							index2--;
						} else {
							room2Turns.splice(o, 1);
						}
					}
					disconnectRoom2.unshift(socket.name);
					
					io.of("/lobby").to("room2").emit("playerFinished", {
						name: socket.name, 
						ranking: 0
					});
				} else {
					if(index2 === (room2Turns.length - 1)){
						room2Turns.splice(index2, 1);
						index2 = 0;
					} else {
						room2Turns.splice(index2, 1);
					}
					io.of("/lobby").in("room2").emit("nextPlayer", room2Turns[index2].num);
					
					finishRoom2.push(socket.name);
					
					io.of("/lobby").to("room2").emit("playerFinished", {
						name: socket.name, 
						ranking: 1
					});
				}
				let num = finishRoom2.length + disconnectRoom2.length;
				if(num === (socket.numOfPlayers-1)){
						
					for(let n = 0; n < room2.length; n++){
						if(socket.name.localeCompare(room2[n].name) !== 0){
							finishRoom2.push(room2[n].name);
						}
					}
					let m = inGameRooms.indexOf("room2");
					inGameRooms.splice(m, 1);
						
					room2.splice(k, 1);
					gameRooms["room2"]--;
					socket.leave("room2");
			
					socket.broadcast.emit("updateLobbyRoom", {
						lobby: false,
						players: [],
						finalRoom: "room2",
						rPlayers: room2
					});
						
					io.of("/lobby").to("room2").emit("endOfGame", "It is end of Game");
						
					updateStatistics(db, finishRoom2, disconnectRoom2);
					
					finishRoom2 = [];
					disconnectRoom2 = [];
					room2Turns = [];
					index2 = 0;	
				} else {
					room2.splice(k, 1);
					gameRooms["room2"]--;
					socket.leave("room2");
			
					socket.broadcast.emit("updateLobbyRoom", {
						lobby: false,
						players: [],
						finalRoom: "room2",
						rPlayers: room2
					});
				}			
			} else {
				room2.splice(k, 1);
				gameRooms["room2"]--;
				socket.leave("room2");
			
				socket.broadcast.emit("updateLobbyRoom", {
					lobby: false,
					players: [],
					finalRoom: "room2",
					rPlayers: room2
				});
			}
		} else if (l !== -1) {
			if(inGameRooms.includes("room3")){
				
				if(socket.getOut){
					let o = room3Turns.findIndex(x => x.name === socket.name);
					if(o === index3){
						if(index3 === (room3Turns.length-1)){
							room3Turns.splice(index3, 1);
							index3=0;
						} else {
							room3Turns.splice(index3, 1);
						}
						io.of("/lobby").in("room3").emit("nextPlayer", room3Turns[index3].num);
					} else {
						if(o < index3){
							room3Turns.splice(o, 1);
							index3--;
						} else {
							room3Turns.splice(o, 1);
						}
					}
					disconnectRoom3.unshift(socket.name);
					
					io.of("/lobby").to("room3").emit("playerFinished", {
						name: socket.name, 
						ranking: 0
					});
				} else {
					if(index3 === (room3Turns.length - 1)){
						room3Turns.splice(index3, 1);
						index3 = 0;
					} else {
						room3Turns.splice(index3, 1);
					}
					io.of("/lobby").in("room3").emit("nextPlayer", room3Turns[index3].num);
					
					finishRoom3.push(socket.name);
					
					io.of("/lobby").to("room3").emit("playerFinished", {
						name: socket.name, 
						ranking: 1
					});
				}
				let num = finishRoom3.length + disconnectRoom3.length;
				if(num === (socket.numOfPlayers-1)){
						
					for(let n = 0; n < room3.length; n++){
						if(socket.name.localeCompare(room3[n].name) !== 0){
							finishRoom3.push(room3[n].name);
						}
					}
					let m = inGameRooms.indexOf("room3");
					inGameRooms.splice(m, 1);
						
					room3.splice(l, 1);
					gameRooms["room3"]--;
					socket.leave("room3");
			
					socket.broadcast.emit("updateLobbyRoom", {
						lobby: false,
						players: [],
						finalRoom: "room3",
						rPlayers: room3
					});	
						
					io.of("/lobby").to("room3").emit("endOfGame", "It is end of Game");
						
					updateStatistics(db, finishRoom3, disconnectRoom3);
					
					finishRoom3 = [];
					disconnectRoom3 = [];
					room3Turns = [];
					index3 = 0;	
				} else {
					room3.splice(l, 1);
					gameRooms["room3"]--;
					socket.leave("room3");
			
					socket.broadcast.emit("updateLobbyRoom", {
						lobby: false,
						players: [],
						finalRoom: "room3",
						rPlayers: room3
					});	
				}			
			} else {
				room3.splice(l, 1);
				gameRooms["room3"]--;
				socket.leave("room3");
			
				socket.broadcast.emit("updateLobbyRoom", {
					lobby: false,
					players: [],
					finalRoom: "room3",
					rPlayers: room3
				});	
			}
		}
	});
});

function updateStatistics(db, finishRoom, disconnectRoom){
	
	finishRoom.push.apply(finishRoom, disconnectRoom);
	let att;
	let att2;
	let newNum1 = 0;
	let newNum2 = 0;
	let position = 0;
	
	for(let i = 0; i < finishRoom.length; i++){
		att = [finishRoom[i]];
		db.query('SELECT statistiky.* FROM pouzivatelia, statistiky WHERE BINARY pouzivatelia.meno = ? AND pouzivatelia.id_pouzivatela = statistiky.id_hraca LIMIT 1', att, (err, data, fields) => {	
			
			if(err) {
				console.log('An error occurred, please try again');
				return;
			}
			if(data && data.length === 1) {
				position++;
				newNum2 = data[0].pocet_hier + 1;
				
				if(finishRoom.length === 2){
					if(position === 1){
						newNum1 = data[0].h2_1_ + 1;
						att2 = [newNum1, newNum2, data[0].id_hraca];
						db.query('UPDATE statistiky SET h2_1_ = ?, pocet_hier = ? WHERE id_hraca = ?', att2, (err, data, fields) => {
							
								if(err) {
									console.log('An error occurred, please try again');
									return;
								}
						});	
					} else {
						newNum1 = data[0].h2_2_ + 1;
						att2 = [newNum1, newNum2, data[0].id_hraca];
						db.query('UPDATE statistiky SET h2_2_ = ?, pocet_hier = ? WHERE id_hraca = ?', att2, (err, data, fields) => {
							
								if(err) {
									console.log('An error occurred, please try again');
									return;
								}
						});
					}
				} else if(finishRoom.length === 3){
					if(position === 1) {
						newNum1 = data[0].h3_1_ + 1;
						att2 = [newNum1, newNum2, data[0].id_hraca];
						db.query('UPDATE statistiky SET h3_1_ = ?, pocet_hier = ? WHERE id_hraca = ?', att2, (err, data, fields) => {
							
								if(err) {
									console.log('An error occurred, please try again');
									return;
								}
						});	
					} else if(position === 2) {
						newNum1 = data[0].h3_2_ + 1;
						att2 = [newNum1, newNum2, data[0].id_hraca];
						db.query('UPDATE statistiky SET h3_2_ = ?, pocet_hier = ? WHERE id_hraca = ?', att2, (err, data, fields) => {
							
								if(err) {
									console.log('An error occurred, please try again');
									return;
								}
						});
					} else {
						newNum1 = data[0].h3_3_ + 1;
						att2 = [newNum1, newNum2, data[0].id_hraca];
						db.query('UPDATE statistiky SET h3_3_ = ?, pocet_hier = ? WHERE id_hraca = ?', att2, (err, data, fields) => {
							
								if(err) {
									console.log('An error occurred, please try again');
									return;
								}
						});
					}
				} else if(finishRoom.length === 4) {
					if(position === 1) {
						newNum1 = data[0].h4_1_ + 1;
						att2 = [newNum1, newNum2, data[0].id_hraca];
						db.query('UPDATE statistiky SET h4_1_ = ?, pocet_hier = ? WHERE id_hraca = ?', att2, (err, data, fields) => {
							
								if(err) {
									console.log('An error occurred, please try again');
									return;
								}
						});	
					} else if(position === 2) {
						newNum1 = data[0].h4_2_ + 1;
						att2 = [newNum1, newNum2, data[0].id_hraca];
						db.query('UPDATE statistiky SET h4_2_ = ?, pocet_hier = ? WHERE id_hraca = ?', att2, (err, data, fields) => {
							
								if(err) {
									console.log('An error occurred, please try again');
									return;
								}
						});
					} else if(position === 3) {
						newNum1 = data[0].h4_3_ + 1;
						att2 = [newNum1, newNum2, data[0].id_hraca];
						db.query('UPDATE statistiky SET h4_3_ = ?, pocet_hier = ? WHERE id_hraca = ?', att2, (err, data, fields) => {
							
								if(err) {
									console.log('An error occurred, please try again');
									return;
								}
						});
					} else {
						newNum1 = data[0].h4_4_ + 1;
						att2 = [newNum1, newNum2, data[0].id_hraca];
						db.query('UPDATE statistiky SET h4_4_ = ?, pocet_hier = ? WHERE id_hraca = ?', att2, (err, data, fields) => {
							
								if(err) {
									console.log('An error occurred, please try again');
									return;
								}
						});
					}
				} else {
					console.log("Bad number of players");
					return;
				}
				
				if(data[0].pocet_hier >= 5){
					deleteGame = newNum2 - 5;
					att2 = [data[0].id_hraca, deleteGame];
					db.query('DELETE FROM inf_o_hrach WHERE id_hraca = ? AND cislo_hry = ?', att2, (err, data, fields) => {
						
							if(err) {
								console.log('An error occurred, please try again');
								return;
							}
					});	
				}
				
				if(finishRoom.length === 2){
					db.query('INSERT INTO inf_o_hrach SET ?', {id_hraca: data[0].id_hraca, pocet_hr: finishRoom.length, prve_m: finishRoom[0], druhe_m: finishRoom[1], tretie_m: "---", stvrte_m: "---", cislo_hry: newNum2}, (err, data, fields) => {
					
						if(err) {
							console.log('An error occurred, please try again');
							return;
						}
					});	
				} else if(finishRoom.length === 3){
					db.query('INSERT INTO inf_o_hrach SET ?', {id_hraca: data[0].id_hraca, pocet_hr: finishRoom.length, prve_m: finishRoom[0], druhe_m: finishRoom[1], tretie_m: finishRoom[2], stvrte_m: "---", cislo_hry: newNum2}, (err, data, fields) => {
					
						if(err) {
							console.log('An error occurred, please try again');
							return;
						}
					});
				} else if(finishRoom.length === 4){
					db.query('INSERT INTO inf_o_hrach SET ?', {id_hraca: data[0].id_hraca, pocet_hr: finishRoom.length, prve_m: finishRoom[0], druhe_m: finishRoom[1], tretie_m: finishRoom[2], stvrte_m: finishRoom[3], cislo_hry: newNum2}, (err, data, fields) => {
					
						if(err) {
							console.log('An error occurred, please try again');
							return;
						}
					});
				} else {
					console.log("Bad number of players");
					return;
				}
			} else {		
				console.log('Error with logged in user, please try again');
				return;
			}	
		});
	}
}

