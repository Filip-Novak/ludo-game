import React from 'react';
import io from "socket.io-client";
import UserStore from "./stores/UserStore";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import Game from "./Game";
import Menu from "./Menu";
import SubmitButton from "./SubmitButton";
import box from './images/box.png';
import checkedBox from './images/checkedBox.png';

let socket;

class Lobby extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            room: "",
            redirect: false,
            backBtnDisabled: false,
            r1RUBtnDisabled: true,
            r1JoinBtnDisabled: false,
            r1LeaveBtnDisabled: true,
            r2RUBtnDisabled: true,
            r2JoinBtnDisabled: false,
            r2LeaveBtnDisabled: true,
            r3RUBtnDisabled: true,
            r3JoinBtnDisabled: false,
            r3LeaveBtnDisabled: true
        }
    }

    initRooms(data){
        let r1 = document.getElementById("room1Players");
        let r2 = document.getElementById("room2Players");
        let r3 = document.getElementById("room3Players");

        let imgAlt = "ready/unready box";
        for(let i=0; i < data.room1.length; i++){

            if(data.room1[i].check){
                r1.innerHTML += "<p>" + data.room1[i].name + "<img src='"+ checkedBox +"' alt='"+imgAlt+"' width="+14+" height="+14+" ></p>";
            } else {
                r1.innerHTML += "<p>" + data.room1[i].name + "<img src='"+ box +"' alt='"+imgAlt+"' width="+14+" height="+14+" ></p>";
            }
        }
        for(let i=0; i < data.room2.length; i++){

            if(data.room2[i].check){
                r2.innerHTML += "<p>" + data.room2[i].name + "<img src='"+ checkedBox +"' alt='"+imgAlt+"' width="+14+" height="+14+" ></p>";
            } else {
                r2.innerHTML += "<p>" + data.room2[i].name + "<img src='"+ box +"' alt='"+imgAlt+"' width="+14+" height="+14+" ></p>";
            }
        }
        for(let i=0; i < data.room3.length; i++){

            if(data.room3[i].check){
                r3.innerHTML += "<p>" + data.room3[i].name + "<img src='"+ checkedBox +"' alt='"+imgAlt+"' width="+14+" height="+14+" ></p>";
            } else {
                r3.innerHTML += "<p>" + data.room3[i].name + "<img src='"+ box +"' alt='"+imgAlt+"' width="+14+" height="+14+" ></p>";
            }
        }
    }

    updateLobbyRoom(data) {
        if(data.lobby) {
            let element = document.getElementById("waitLobby");

            while (element.hasChildNodes()) {
                element.removeChild(element.firstChild);
            }
            for (let i = 0; i < data.players.length; i++) {
                element.innerHTML += "<p>" + data.players[i] + "</p>";
            }
        }
        if(data.finalRoom){
            let room = document.getElementById(data.finalRoom + "Players");

            while (room.hasChildNodes()) {
                room.removeChild(room.firstChild);
            }

            let roomPlayers = data.rPlayers;
            let imgAlt = "ready/unready box";
            for(let i=0; i < roomPlayers.length; i++){

                if(roomPlayers[i].check){
                    room.innerHTML += "<p>" + roomPlayers[i].name + "<img src='"+ checkedBox +"' alt='"+imgAlt+"' width="+14+" height="+14+" ></p>";
                } else {
                    room.innerHTML += "<p>" + roomPlayers[i].name + "<img src='"+ box +"' alt='"+imgAlt+"' width="+14+" height="+14+" ></p>";
                }
            }
        }
    }

    disconnectSocket(disc) {
        socket.emit("disconnectManually", {
            msg: "Disconnect with Back button or back button in browser.",
            disc: disc
        });
    }

    readyUnready(RUroom){
        if(RUroom.localeCompare(this.state.room) === 0){;
           let val = document.getElementById(RUroom+"RUbtn").textContent;
           if(val.localeCompare("Ready") === 0){
               document.getElementById(RUroom+"RUbtn").textContent = "Unready";
           } else if(val.localeCompare("Unready") === 0){
               document.getElementById(RUroom+"RUbtn").textContent = "Ready";
           }
           socket.emit("readyUnready", RUroom);
        } else {
            alert("You can not ready/unready in this " + RUroom + " !");
        }
    }

    joinRoom(wantedRoom){
        let inRoom= this.state.room;
        if(!inRoom) {
            socket.emit("joinRoom", wantedRoom);
        } else {
            alert("You must first leave the " + inRoom + " !");
        }
    }

    leaveRoom(exitRoom){
        if(exitRoom.localeCompare(this.state.room) === 0){
            socket.emit("leaveRoom", exitRoom);
        } else {
            alert("Bad room for leaving !");
        }
    }

    startingGame(data){
        console.log(data.msg);
        let room = data.finalRoom;

        socket.off("updateLobbyRoom");
        socket.off("successfulJoin");
        socket.off("successfulLeave");

        if(room.localeCompare("room1") === 0){
            this.setState({
                backBtnDisabled: true,
                r1RUBtnDisabled: true,
                r1LeaveBtnDisabled: true,
                redirect: true
            });
        } else if(room.localeCompare("room2") === 0){
            this.setState({
                backBtnDisabled: true,
                r2RUBtnDisabled: true,
                r2LeaveBtnDisabled: true,
                redirect: true
            });
        } else if(room.localeCompare("room3") === 0){
            this.setState({
                backBtnDisabled: true,
                r3RUBtnDisabled: true,
                r3LeaveBtnDisabled: true,
                redirect: true
            });
        } else {
            alert("Unsuccessful Game start in the " + room + " !");
        }
    }

    componentDidMount() {
        socket = io("/lobby");

        socket.on("getName", (res) => {
            console.log(res.msg);
            socket.emit("addLobbyPlayer", {
                name: UserStore.username
            });
        });

        socket.on("initRooms", (data) => {
            this.initRooms(data);
        });

        socket.on("updateLobbyRoom", (data) => {
            this.updateLobbyRoom(data);
        });

        socket.on("startingGame", (data) => {
            this.startingGame(data);
        });

        socket.on('err', (err) => {
            console.log(err);
            alert(err);
        });

        socket.on('successfulJoin', (res) => {
            let room = res.finalRoom;
            if(room.localeCompare("room1") === 0){
                this.setState({
                    room: room,
                    r1RUBtnDisabled: false,
                    r1JoinBtnDisabled: true,
                    r1LeaveBtnDisabled: false,
                    r2JoinBtnDisabled: true,
                    r3JoinBtnDisabled: true
                });
            } else if(room.localeCompare("room2") === 0){
                this.setState({
                    room: room,
                    r1JoinBtnDisabled: true,
                    r2RUBtnDisabled: false,
                    r2JoinBtnDisabled: true,
                    r2LeaveBtnDisabled: false,
                    r3JoinBtnDisabled: true
                });
            } else if(room.localeCompare("room3") === 0){
                this.setState({
                    room: room,
                    r1JoinBtnDisabled: true,
                    r2JoinBtnDisabled: true,
                    r3RUBtnDisabled: false,
                    r3JoinBtnDisabled: true,
                    r3LeaveBtnDisabled: false,
                });
            } else {
                alert("Unsuccessful join to " + room + " !");
            }
            console.log(res.msg);
        });

        socket.on('successfulLeave', (res) => {
            let room = res.finalRoom;
            if(room.localeCompare("room1") === 0){
                this.setState({
                    room: "",
                    r1RUBtnDisabled: true,
                    r1JoinBtnDisabled: false,
                    r1LeaveBtnDisabled: true,
                    r2JoinBtnDisabled: false,
                    r3JoinBtnDisabled: false,
                });
                document.getElementById(room+"RUbtn").textContent = "Ready";
            } else if(room.localeCompare("room2") === 0){
                this.setState({
                    room: "",
                    r1JoinBtnDisabled: false,
                    r2RUBtnDisabled: true,
                    r2JoinBtnDisabled: false,
                    r2LeaveBtnDisabled: true,
                    r3JoinBtnDisabled: false
                });
                document.getElementById(room+"RUbtn").textContent = "Ready";
            } else if(room.localeCompare("room3") === 0){
                this.setState({
                    room: "",
                    r1JoinBtnDisabled: false,
                    r2JoinBtnDisabled: false,
                    r3RUBtnDisabled: true,
                    r3JoinBtnDisabled: false,
                    r3LeaveBtnDisabled: true
                });
                document.getElementById(room+"RUbtn").textContent = "Ready";
            } else {
                alert("Unsuccessful leave from " + room + " !");
            }
            console.log(res.msg);
        });
    }

    componentWillUnmount() {
       this.disconnectSocket(true);
    }

    canRedirect(){
        if(this.state.redirect){
            return <Redirect from="/lobby" to="/game"/>
        }
    }

    render() {
        return (
            <Router>
                <Route path="/lobby" exact render={() => {
                    return (
                        <div className="lobby">
                            <div className="row-lobby">
                                <div className="row-waitWithLabel">
                                    <label>Lobby:</label>
                                </div>
                                <div id="waitLobby" className="waitingLobby">
                                </div>
                            </div>
                            <div className="row-button-room">
                                <div className="row-room1WithLabel">
                                    <label>Room 1:</label>
                                </div>
                                <div id="room1Players" className="room1">
                                </div>
                                <div className="room-buttons">
                                    <button id="room1RUbtn" className='RUbtn' disabled={this.state.r1RUBtnDisabled} onClick={() => this.readyUnready('room1')}>Ready</button>
                                    <div>
                                        <button className='joinBtn' disabled={this.state.r1JoinBtnDisabled} onClick={() => this.joinRoom('room1')}>Join</button>
                                        <button className='leaveBtn' disabled={this.state.r1LeaveBtnDisabled} onClick={() => this.leaveRoom('room1')}>Leave</button>
                                    </div>
                                </div>
                                <div className="backBtn">
                                    <Link to='/'>
                                        <SubmitButton
                                            text = {'Back'}
                                            disabled={this.state.backBtnDisabled}
                                            onClick={ () => this.disconnectSocket(true) }
                                        />
                                    </Link>
                                </div>
                            </div>
                            <div className="row-rooms">
                                <div className="row-room2WithLabel">
                                    <label>Room 2:</label>
                                </div>
                                <div id="room2Players" className="room2">
                                </div>
                                <div className="room-buttons">
                                    <button id="room2RUbtn" className='RUbtn' disabled={this.state.r2RUBtnDisabled} onClick={() => this.readyUnready('room2')}>Ready</button>
                                    <div>
                                        <button className='joinBtn' disabled={this.state.r2JoinBtnDisabled} onClick={() => this.joinRoom('room2')}>Join</button>
                                        <button className='leaveBtn' disabled={this.state.r2LeaveBtnDisabled} onClick={() => this.leaveRoom('room2')}>Leave</button>
                                    </div>
                                </div>
                                <div className="row-room3Layout">
                                    <div className="row-room3WithLabel">
                                        <label>Room 3:</label>
                                    </div>
                                    <div id="room3Players" className="room3">

                                    </div>
                                    <div className="room-buttons">
                                        <button id="room3RUbtn" className='RUbtn' disabled={this.state.r3RUBtnDisabled} onClick={() => this.readyUnready('room3')}>Ready</button>
                                        <div>
                                            <button className='joinBtn' disabled={this.state.r3JoinBtnDisabled} onClick={() => this.joinRoom('room3')}>Join</button>
                                            <button className='leaveBtn' disabled={this.state.r3LeaveBtnDisabled} onClick={() => this.leaveRoom('room3')}>Leave</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }}/>
                <Switch>
                    {this.canRedirect()}
                    <Route exact path="/game">
                        <Game room={this.state.room} socket={socket} />
                    </Route>
                    <Route exact path="/" component={Menu} />
                </Switch>
            </Router>
        );
    }
}

export default Lobby;