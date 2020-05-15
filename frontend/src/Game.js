import React from 'react';
import update from 'immutability-helper';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Menu from "./Menu";
import UserStore from "./stores/UserStore";

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            room: this.props.room,
            ranking: 0,
            color: "",
            players: [],
            numOfPlayers: 0,
            number: 0,
            onBoard: 0,
            canRoll: false,
            canPlay: false,
            redPath: [
                      this.goR, this.goR, this.goR, this.goR, this.goRU, this.goU, this.goU, this.goU, this.goU, this.goU, this.goR, this.goR,
                      this.goD, this.goD, this.goD, this.goD, this.goD, this.goDR, this.goR, this.goR, this.goR, this.goR, this.goR, this.goD, this.goD,
                      this.goL, this.goL, this.goL, this.goL, this.goL, this.goLD, this.goD, this.goD, this.goD, this.goD, this.goD, this.goL, this.goL,
                      this.goU, this.goU, this.goU, this.goU, this.goU, this.goUL, this.goL, this.goL, this.goL, this.goL, this.goL, this.goU,
                      this.goR, this.goR, this.goR, this.goR, this.goR, this.goR,
                    ],
            greenPath: [
                        this.goD, this.goD, this.goD, this.goD, this.goDR, this.goR, this.goR, this.goR, this.goR, this.goR, this.goD, this.goD,
                        this.goL, this.goL, this.goL, this.goL, this.goL, this.goLD, this.goD, this.goD, this.goD, this.goD, this.goD, this.goL, this.goL,
                        this.goU, this.goU, this.goU, this.goU, this.goU, this.goUL, this.goL, this.goL, this.goL, this.goL, this.goL, this.goU, this.goU,
                        this.goR, this.goR, this.goR, this.goR, this.goR, this.goRU, this.goU, this.goU, this.goU, this.goU, this.goU, this.goR,
                        this.goD, this.goD, this.goD, this.goD, this.goD, this.goD
                       ],
            yellowPath: [
                         this.goL, this.goL, this.goL, this.goL, this.goLD, this.goD, this.goD, this.goD, this.goD, this.goD, this.goL, this.goL,
                         this.goU, this.goU, this.goU, this.goU, this.goU, this.goUL, this.goL, this.goL, this.goL, this.goL, this.goL, this.goU, this.goU,
                         this.goR, this.goR, this.goR, this.goR, this.goR, this.goRU, this.goU, this.goU, this.goU, this.goU, this.goU, this.goR, this.goR,
                         this.goD, this.goD, this.goD, this.goD, this.goD, this.goDR, this.goR, this.goR, this.goR, this.goR, this.goR, this.goD,
                         this.goL, this.goL, this.goL, this.goL, this.goL, this.goL
                        ],
            bluePath: [
                       this.goU, this.goU, this.goU, this.goU, this.goUL, this.goL, this.goL, this.goL, this.goL, this.goL, this.goU, this.goU,
                       this.goR, this.goR, this.goR, this.goR, this.goR, this.goRU, this.goU, this.goU, this.goU, this.goU, this.goU, this.goR, this.goR,
                       this.goD, this.goD, this.goD, this.goD, this.goD, this.goDR, this.goR, this.goR, this.goR, this.goR, this.goR, this.goD, this.goD,
                       this.goL, this.goL, this.goL, this.goL, this.goL, this.goLD, this.goD, this.goD, this.goD, this.goD, this.goD, this.goL,
                       this.goU, this.goU, this.goU, this.goU, this.goU, this.goU
                      ],
            pawnsOnBoard: {
                            redPawn1: 0, redPawn2: 0, redPawn3: 0, redPawn4: 0,
                            bluePawn1: 0, bluePawn2: 0, bluePawn3: 0, bluePawn4: 0,
                            greenPawn1: 0, greenPawn2: 0, greenPawn3: 0, greenPawn4: 0,
                            yellowPawn1: 0, yellowPawn2: 0, yellowPawn3: 0, yellowPawn4: 0
                          },
            positions: {
                        redPawn1: 0, redPawn2: 0, redPawn3: 0, redPawn4: 0,
                        bluePawn1: 0, bluePawn2: 0, bluePawn3: 0, bluePawn4: 0,
                        greenPawn1: 0, greenPawn2: 0, greenPawn3: 0, greenPawn4: 0,
                        yellowPawn1: 0, yellowPawn2: 0, yellowPawn3: 0, yellowPawn4: 0
                       },
            pawnOut: {red:0,blue:0,green:0,yellow:0},
            allColors: ["red", "green", "blue", "yellow"]
        };
    }

    roll() {
        if (this.state.canRoll) {
            this.setState({
                canRoll: false
            });
            let dice = document.getElementById("imgDice");
            let num = 1 + Math.floor(Math.random() * 6);

            dice.setAttribute("href", "images-dice/dice-" + num + ".jpg");
            this.props.socket.emit("diceValue", {
                        isNum: true,
                        num: num,
                        room: this.state.room
            });

                let onB = this.state.onBoard;

                if (num !== 6 && (onB === 0)) {
                    setTimeout(() => {
                        dice.setAttribute("href", "images-dice/dice-neutral.gif");
                        this.props.socket.emit("diceValue", {
                                    isNum: false,
                                    num: 0,
                                    room: this.state.room
                        });

                        /*zmen hraca*/
                        this.changePlayer();
                    }, 1000);
                } else if (num === 6 && (onB === 0)) {
                    this.setState({
                        number: num,
                        canPlay: true
                    });
                } else {
                    if(this.canMove(num)) {
                        this.setState({
                            number: num,
                            canPlay: true
                        });
                    } else if (num === 6){
                        setTimeout(() => {
                            dice.setAttribute("href", "images-dice/dice-neutral.gif");
                            this.props.socket.emit("diceValue", {
                                isNum: false,
                                num: 0,
                                room: this.state.room
                            });

                            this.setState({
                                canRoll: true
                            });
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            dice.setAttribute("href", "images-dice/dice-neutral.gif");
                            this.props.socket.emit("diceValue", {
                                isNum: false,
                                num: 0,
                                room: this.state.room
                            });

                            /*zmen hraca*/
                            this.changePlayer();
                        }, 1000);
                    }
                }
        }
    }

    canMove(num) {
        for (let i = 1; i <=4; i++) {
            if ((this.state.pawnsOnBoard[this.state.color + "Pawn" + i] === 1) && (this.state.positions[this.state.color + "Pawn" + i]+num <= 56)) {
                let stuck = 0;
                for (let j = 1; j < i; j++) {
                    if ((this.state.pawnsOnBoard[this.state.color + "Pawn" + j] === 1) && (this.state.positions[this.state.color + "Pawn" + i]+num === this.state.positions[this.state.color + "Pawn" + j])) {
                        stuck++;
                        break;
                    }
                }
                for (let j = i + 1; j <= 4; j++) {
                    if ((this.state.pawnsOnBoard[this.state.color + "Pawn" + j] === 1) && (this.state.positions[this.state.color + "Pawn" + i]+num === this.state.positions[this.state.color + "Pawn" + j])) {
                        stuck++;
                        break;
                    }
                }
                if (stuck === 0) {
                    return true;
                }
            }
        }
        if(num === 6){
            for (let i = 1; i <=4; i++) {
                if (this.state.pawnsOnBoard[this.state.color + "Pawn" + i] === 0){
                    return true;
                }
            }
        }
        return false;
    }

    goD(coor) {
        coor[1]=coor[1]+40;
        coor[2]=coor[2]+1;
        return coor;
    }
    goU(coor) {
        coor[1]=coor[1]-40;
        coor[2]=coor[2]+1;
        return coor;
    }
    goL(coor) {
        coor[0]=coor[0]-40;
        coor[2]=coor[2]+1;
        return coor;
    }
    goR(coor) {
        coor[0]=coor[0]+40;
        coor[2]=coor[2]+1;
        return coor;
    }
    goRU(coor){
        coor[0]=coor[0]+40;
        coor[1]=coor[1]-40;
        coor[2]=coor[2]+1;
        return coor;
    }
    goDR(coor){
        coor[0]=coor[0]+40;
        coor[1]=coor[1]+40;
        coor[2]=coor[2]+1;
        return coor;
    }
    goLD(coor){
        coor[0]=coor[0]-40;
        coor[1]=coor[1]+40;
        coor[2]=coor[2]+1;
        return coor;
    }
    goUL(coor){
        coor[0]=coor[0]-40;
        coor[1]=coor[1]-40;
        coor[2]=coor[2]+1;
        return coor;
    }

    occupied(x, y) {
        for (let i = 0; i < this.state.allColors.length; i++) {
            for (let j = 1; j <= 4; j++) {
                let victim = this.state.allColors[i] + "Pawn" + j;
                let otherPawn = document.getElementById(victim);
                let oPx = otherPawn.getBBox().x + 20;
                let oPy = otherPawn.getBBox().y + 20;
                if ((oPx === x) && (oPy === y)) {
                    if(this.state.color !== this.state.allColors[i]){
                        this.resetPawn(victim);
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    resetPawn(pawn) {
        let pawnGoHome = document.getElementById(pawn);
        switch (pawn) {
            case "redPawn1": pawnGoHome.setAttribute("cx", "80px"); pawnGoHome.setAttribute("cy", "80px");
                            this.returnPawn(pawn, "red", 80, 80); break;
            case "redPawn2": pawnGoHome.setAttribute("cx", "80px"); pawnGoHome.setAttribute("cy", "160px");
                            this.returnPawn(pawn, "red", 80, 160); break;
            case "redPawn3": pawnGoHome.setAttribute("cx", "160px"); pawnGoHome.setAttribute("cy", "80px");
                            this.returnPawn(pawn, "red", 160, 80); break;
            case "redPawn4": pawnGoHome.setAttribute("cx", "160px"); pawnGoHome.setAttribute("cy", "160px");
                            this.returnPawn(pawn, "red", 160, 160); break;
            case "bluePawn1": pawnGoHome.setAttribute("cx", "80px"); pawnGoHome.setAttribute("cy", "440px");
                            this.returnPawn(pawn, "blue", 80, 440); break;
            case "bluePawn2": pawnGoHome.setAttribute("cx", "80px"); pawnGoHome.setAttribute("cy", "520px");
                            this.returnPawn(pawn, "blue", 80, 520); break;
            case "bluePawn3": pawnGoHome.setAttribute("cx", "160px"); pawnGoHome.setAttribute("cy", "440px");
                            this.returnPawn(pawn, "blue", 160, 440); break;
            case "bluePawn4": pawnGoHome.setAttribute("cx", "160px"); pawnGoHome.setAttribute("cy", "520px");
                            this.returnPawn(pawn, "blue", 160, 520); break;
            case "greenPawn1": pawnGoHome.setAttribute("cx", "440px"); pawnGoHome.setAttribute("cy", "80px");
                            this.returnPawn(pawn, "green", 440, 80); break;
            case "greenPawn2": pawnGoHome.setAttribute("cx", "440px"); pawnGoHome.setAttribute("cy", "160px");
                            this.returnPawn(pawn, "green", 440, 160); break;
            case "greenPawn3": pawnGoHome.setAttribute("cx", "520px"); pawnGoHome.setAttribute("cy", "80px");
                            this.returnPawn(pawn, "green", 520, 80); break;
            case "greenPawn4": pawnGoHome.setAttribute("cx", "520px"); pawnGoHome.setAttribute("cy", "160px");
                            this.returnPawn(pawn, "green", 520, 160); break;
            case "yellowPawn1": pawnGoHome.setAttribute("cx", "440px"); pawnGoHome.setAttribute("cy", "440px");
                            this.returnPawn(pawn, "yellow", 440, 440); break;
            case "yellowPawn2": pawnGoHome.setAttribute("cx", "440px"); pawnGoHome.setAttribute("cy", "520px");
                            this.returnPawn(pawn, "yellow", 440, 520); break;
            case "yellowPawn3": pawnGoHome.setAttribute("cx", "520px"); pawnGoHome.setAttribute("cy", "440px");
                            this.returnPawn(pawn, "yellow", 520, 440); break;
            case "yellowPawn4": pawnGoHome.setAttribute("cx", "520px"); pawnGoHome.setAttribute("cy", "520px");
                            this.returnPawn(pawn, "yellow", 520, 520); break;
        }
    }

    checkForWin(numOut) {
        if (numOut === 4) {
            /*zmen hraca*/
            this.endGame();
        }
    }

    movement(color, pawn) {
        let currPawn = color + "Pawn" + pawn;
        let currPosition = this.state.positions[currPawn];

        if (this.state.canPlay) {
            if (this.state.color === color) {
                if (this.state.pawnsOnBoard[currPawn] === 1 || this.state.number === 6) {
                    if (this.state.pawnsOnBoard[currPawn] === 0) {
                        let p = document.getElementById(currPawn);
                        let isDraw = false;
                        switch (color) {
                            case "red":
                                if(!this.occupied(60, 260)){
                                    p.setAttribute("cx", "60px");
                                    p.setAttribute("cy", "260px");
                                    isDraw = true;

                                    this.movePawn(currPawn, 60, 260, true);
                                }
                                break;
                            case "green":
                                if(!this.occupied(340, 60)){
                                    p.setAttribute("cx", "340px");
                                    p.setAttribute("cy", "60px");
                                    isDraw = true;

                                    this.movePawn(currPawn, 340, 60, true);
                                }
                                break;
                            case "yellow":
                                if(!this.occupied(540, 340)){
                                    p.setAttribute("cx", "540px");
                                    p.setAttribute("cy", "340px");
                                    isDraw = true;

                                    this.movePawn(currPawn, 540, 340, true);
                                }
                                break;
                            case "blue":
                                if(!this.occupied(260, 540)){
                                    p.setAttribute("cx", "260px");
                                    p.setAttribute("cy", "540px");
                                    isDraw = true;

                                    this.movePawn(currPawn, 260, 540, true);
                                }
                                break;
                        }
                        if (isDraw) {
                            let dice = document.getElementById("imgDice");
                            dice.setAttribute("href", "images-dice/dice-neutral.gif");
                            this.props.socket.emit("diceValue", {
                                            isNum: false,
                                            num: 0,
                                            room: this.state.room
                            });

                            let pob = update(this.state.pawnsOnBoard, {
                                [currPawn]: {$set: 1}
                            });
                            this.setState({
                                number: 0,
                                canRoll: true,
                                canPlay: false,
                                onBoard: this.state.onBoard + 1,
                                pawnsOnBoard: pob
                            });
                        }
                    } else {
                        let newPos = currPosition + this.state.number;

                        if (newPos <= 56) {
                            let p = document.getElementById(currPawn);
                            let isDraw = false;
                            let currX = p.getBBox().x + 20;
                            let currY = p.getBBox().y + 20;

                            let coor = [currX, currY, currPosition];

                            switch (color) {
                                case "red":
                                    for (let i = currPosition; i < newPos; i++) {
                                        coor = this.state.redPath[i](coor);
                                    }
                                    if(!this.occupied(coor[0], coor[1])){
                                        isDraw = true;
                                    }
                                    break;
                                case "green":
                                    for (let i = currPosition; i < newPos; i++) {
                                        coor = this.state.greenPath[i](coor);
                                    }
                                    if(!this.occupied(coor[0], coor[1])){
                                        isDraw = true;
                                    }
                                    break;
                                case "yellow":
                                    for (let i = currPosition; i < newPos; i++) {
                                        coor = this.state.yellowPath[i](coor);
                                    }
                                    if(!this.occupied(coor[0], coor[1])){
                                        isDraw = true;
                                    }
                                    break;
                                case "blue":
                                    for (let i = currPosition; i < newPos; i++) {
                                        coor = this.state.bluePath[i](coor);
                                    }
                                    if(!this.occupied(coor[0], coor[1])){
                                        isDraw = true;
                                    }
                                    break;
                            }
                            if (isDraw) {
                                let dice = document.getElementById("imgDice");

                                if(coor[2] === 56){
                                    let numOut = this.state.pawnOut[color];
                                    let makeVisible = false;
                                    p.setAttribute("visibility", "hidden");
                                    p.setAttribute("cx", "300px");
                                    p.setAttribute("cy", "300px");
                                    this.movePawn(currPawn,300, 300, false);

                                    let counter = document.getElementById(color + "Counter");
                                    if(numOut === 0){
                                        counter.setAttribute("visibility", "visible");
                                        makeVisible = true;
                                    }
                                    numOut = numOut + 1;
                                    counter.textContent = numOut;
                                    this.updateCounter(color + "Counter", numOut, makeVisible);

                                    let pob = update(this.state.pawnsOnBoard, {
                                        [currPawn]: {$set: -1}
                                    });
                                    let pos = update(this.state.positions, {
                                        [currPawn]: {$set: 0}
                                    });
                                    let po = update(this.state.pawnOut, {
                                        [color]: {$set: numOut}
                                    });
                                    this.setState({
                                        number: 0,
                                        onBoard: this.state.onBoard - 1,
                                        canRoll: true,
                                        canPlay: false,
                                        pawnOut: po,
                                        pawnsOnBoard: pob,
                                        positions: pos,
                                    });

                                    dice.setAttribute("href", "images-dice/dice-neutral.gif");
                                    this.props.socket.emit("diceValue", {
                                                isNum: false,
                                                num: 0,
                                                room: this.state.room
                                    });

                                    this.checkForWin(numOut);
                                } else {
                                    p.setAttribute("cx", coor[0] + "px");
                                    p.setAttribute("cy", coor[1] + "px");
                                    this.movePawn(currPawn, coor[0], coor[1], true);

                                    let pos = update(this.state.positions, {
                                        [currPawn]: {$set: coor[2]}
                                    });
                                    this.setState({
                                        canPlay: false,
                                        positions: pos
                                    });

                                    if(this.state.number === 6){
                                        dice.setAttribute("href", "images-dice/dice-neutral.gif");
                                        this.props.socket.emit("diceValue", {
                                                    isNum: false,
                                                    num: 0,
                                                    room: this.state.room
                                        });

                                        this.setState({
                                            number: 0,
                                            canRoll: true
                                        });
                                    } else {
                                        dice.setAttribute("href", "images-dice/dice-neutral.gif");
                                        this.props.socket.emit("diceValue", {
                                                    isNum: false,
                                                    num: 0,
                                                    room: this.state.room
                                        });
                                        this.setState({
                                            number: 0
                                        });
                                        /*zmen hraca*/
                                        this.changePlayer();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    hideModal(){
        let modal = document.getElementById("myModal");
        modal.style.display = "none";
    }

    changePlayer(){
        this.props.socket.emit("changePlayer",  this.state.room);
    }

    movePawn(pawn, cx, cy, visible){
        this.props.socket.emit("movePawn", {
            room: this.state.room,
            pawn: pawn,
            cx: cx,
            cy: cy,
            visible: visible
        });
    }

    returnPawn(pawn, col, cx, cy){
        this.props.socket.emit("returnPawn", {
            room: this.state.room,
            pawn: pawn,
            col: col,
            cx: cx,
            cy: cy
        });
    }

    updateCounter(counter, numOut, makeVisible){
        this.props.socket.emit("updateCounter", {
            room: this.state.room,
            counter: counter,
            numOut: numOut,
            makeVisible: makeVisible
        });
    }

    endGame(){
        this.props.socket.emit("disconnectManually", {
            msg: "Disconnect with Back button or back button in browser.",
            disc: false
        });

        let modal = document.getElementById("myModal");
        modal.style.display = "block";
    }

    initGameSettings(data){
        let name = UserStore.username;
        let roll = false;
        let col = "";

        for(let i = 0; i < data.numOfPlayers; i++){
            document.getElementById(this.state.allColors[i]+"Player").style.visibility = "visible";
            document.getElementById(this.state.allColors[i]+"Player").textContent = data.players[i].name;

            if(name.localeCompare(data.players[i].name) === 0){
                col = this.state.allColors[i];
                if(i === 0){
                    roll = true;
                }
            }
        }
        document.getElementById("playerColorTurn").textContent = this.state.allColors[0];
        document.getElementById("playerColorTurn").style.color = this.state.allColors[0];

        this.setState({
            players: data.players,
            numOfPlayers: data.numOfPlayers,
            color: col,
            canRoll: roll
        });
    }

    componentDidMount() {
        this.props.socket.emit("getInitSettings", this.state.room);

        this.props.socket.on("initSettings", (data) => {
            this.initGameSettings(data);
        });

        this.props.socket.on("diceNum", (data) => {
            if(data.isNum){
                document.getElementById("imgDice").setAttribute("href", "images-dice/dice-" + data.num + ".jpg");
            } else {
                document.getElementById("imgDice").setAttribute("href", "images-dice/dice-neutral.gif");
            }
        });

        this.props.socket.on("nextPlayer", (nextP) => {
            document.getElementById("playerColorTurn").textContent = this.state.allColors[nextP];
            document.getElementById("playerColorTurn").style.color = this.state.allColors[nextP];

            if(this.state.color.localeCompare(this.state.allColors[nextP]) === 0){
                this.setState({
                    canRoll: true
                });
            }
        });

        this.props.socket.on("movedPawn", (data) => {
            let p = document.getElementById(data.pawn);

            if(data.visible){
                p.setAttribute("cx", data.cx+"px");
                p.setAttribute("cy", data.cy+"px");
            } else {
                p.setAttribute("visibility", "hidden");
                p.setAttribute("cx", data.cx+"px");
                p.setAttribute("cy", data.cy+"px");
            }
        });

        this.props.socket.on("returnedPawn", (data) => {
            if(this.state.color.localeCompare(data.col) === 0){
                let pob = update(this.state.pawnsOnBoard, {
                    [data.pawn]: {$set: 0}
                });
                let pos = update(this.state.positions, {
                    [data.pawn]: {$set: 0}
                });
                this.setState({
                    onBoard: this.state.onBoard - 1,
                    pawnsOnBoard: pob,
                    positions: pos
                });
            }

            let p = document.getElementById(data.pawn);
            p.setAttribute("cx", data.cx+"px");
            p.setAttribute("cy", data.cy+"px");
        });

        this.props.socket.on("updatedCounter", (data) => {
            let counter = document.getElementById(data.counter);

            if(data.makeVisible){
                counter.setAttribute("visibility", "visible");
            }
            counter.textContent = data.numOut;
        });

        this.props.socket.on("playerFinished", (data) => {
            let i = this.state.players.findIndex(x => x.name === data.name);

            document.getElementById(this.state.allColors[i]+"Player").style.visibility = "hidden";
            this.setState({
                ranking: this.state.ranking + data.ranking,
            });
        });

        this.props.socket.on("endOfGame", (msg) => {
            console.log(msg);
            this.endGame();
        });

        this.props.socket.on("gameErr", (err) => {
            console.log(err);
            alert(err);
        });
    }

    render() {
        return (
                <Router>
                    <Route path="/game" exact render={() => {
                        return (
                            <div className='game'>
                                <div className="left-inf">
                                    <div className="left-redPlayer">
                                        <span id='redPlayer'>   </span>
                                    </div>
                                    <div className="left-bluePlayer">
                                        <span id='bluePlayer'>---</span>
                                    </div>
                                    <div className="turn-Information">
                                        <label id='uselessText'>It’s <span id="playerColorTurn">   </span>s turn !</label>
                                    </div>
                                </div>
                                <div className="middle-board">
                                    <svg id="board" width="600px" height="600px" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="0px" y="0px" width="600px" height="600px" fill="white"/>


                                        <rect x="0px" y="0px" width="240px" height="240px" fill="red" />
                                        <rect x="40px" y="240px" width="40px" height="40px" fill="red" />
                                        <rect x="40px" y="280px" width="200px" height="40px" fill="red" />
                                        <polygon points="240,240 300,300 240,360" fill="red" />
                                        <polygon points="0,280 40,300 0,320" fill="red" />

                                        <rect x="40px" y="40px" width="160px" height="160px" fill="white" />
                                        <polyline points="0 240, 240 240, 240 0" stroke="black" strokeWidth="1px" fill="none" strokeLinejoin="miter" />


                                        <rect x="360px" y="0px" width="240px" height="240px" fill="green" />
                                        <rect x="320px" y="40px" width="40px" height="40px" fill="green" />
                                        <rect x="280px" y="40px" width="40px" height="200px" fill="green" />
                                        <polygon points="240,240 300,300 360,240" fill="green" />
                                        <polygon points="280,0 300,40 320,0" fill="green" />

                                        <rect x="400px" y="40px" width="160px" height="160px" fill="white" />
                                        <polyline points="360 0, 360 240, 600 240" stroke="black" strokeWidth="1px" fill="none" strokeLinejoin="miter" />


                                        <rect x="0px" y="360px" width="240px" height="240px" fill="#1989ff" />
                                        <rect x="240px" y="520px" width="40px" height="40px" fill="#1989ff" />
                                        <rect x="280px" y="360px" width="40px" height="200px" fill="#1989ff" />
                                        <polygon points="240,360 300,300 360,360" fill="#1989ff" />
                                        <polygon points="280,600 300,560 320,600" fill="#1989ff" />

                                        <rect x="40px" y="400px" width="160px" height="160px" fill="white" />
                                        <polyline points="0 360, 240 360, 240 600" stroke="black" strokeWidth="1px" fill="none" strokeLinejoin="miter" />


                                        <rect x="360px" y="360px" width="240px" height="240px" fill="yellow" />
                                        <rect x="520px" y="320px" width="40px" height="40px" fill="yellow" />
                                        <rect x="360px" y="280px" width="200px" height="40px" fill="yellow" />
                                        <polygon points="360,240 300,300 360,360" fill="yellow" />
                                        <polygon points="600,320 560,300 600,280" fill="yellow" />

                                        <rect x="400px" y="400px" width="160px" height="160px" fill="white" />
                                        <polyline points="360 600, 360 360, 600 360" stroke="black" strokeWidth="1px" fill="none" strokeLinejoin="miter" />


                                        <rect x="240px" y="240px" width="120px" height="120px" fill="none" strokeWidth="1px" stroke="black" />
                                        <line x1="240px" y1="240px" x2="360px" y2="360px" stroke="black" strokeWidth="1px" />
                                        <line x1="360px" y1="240px" x2="240px" y2="360px" stroke="black" strokeWidth="1px" />


                                        <line x1="0px" y1="280px" x2="240px" y2="280px" stroke="black" strokeWidth="1px" />
                                        <line x1="0px" y1="320px" x2="240px" y2="320px" stroke="black" strokeWidth="1px" />

                                        <line x1="40px" y1="240px" x2="40px" y2="360px" stroke="black" strokeWidth="1px" />
                                        <line x1="80px" y1="240px" x2="80px" y2="360px" stroke="black" strokeWidth="1px" />
                                        <line x1="120px" y1="240px" x2="120px" y2="360px" stroke="black" strokeWidth="1px" />
                                        <line x1="160px" y1="240px" x2="160px" y2="360px" stroke="black" strokeWidth="1px" />
                                        <line x1="200px" y1="240px" x2="200px" y2="360px" stroke="black" strokeWidth="1px" />


                                        <line x1="280px" y1="0px" x2="280px" y2="240px" stroke="black" strokeWidth="1px" />
                                        <line x1="320px" y1="0px" x2="320px" y2="240px" stroke="black" strokeWidth="1px" />

                                        <line x1="240px" y1="40px" x2="360px" y2="40px" stroke="black" strokeWidth="1px" />
                                        <line x1="240px" y1="80px" x2="360px" y2="80px" stroke="black" strokeWidth="1px" />
                                        <line x1="240px" y1="120px" x2="360px" y2="120px" stroke="black" strokeWidth="1px" />
                                        <line x1="240px" y1="160px" x2="360px" y2="160px" stroke="black" strokeWidth="1px" />
                                        <line x1="240px" y1="200px" x2="360px" y2="200px" stroke="black" strokeWidth="1px" />


                                        <line x1="360px" y1="280px" x2="600px" y2="280px" stroke="black" strokeWidth="1px" />
                                        <line x1="360px" y1="320px" x2="600px" y2="320px" stroke="black" strokeWidth="1px" />

                                        <line x1="560px" y1="240px" x2="560px" y2="360px" stroke="black" strokeWidth="1px" />
                                        <line x1="520px" y1="240px" x2="520px" y2="360px" stroke="black" strokeWidth="1px" />
                                        <line x1="480px" y1="240px" x2="480px" y2="360px" stroke="black" strokeWidth="1px" />
                                        <line x1="440px" y1="240px" x2="440px" y2="360px" stroke="black" strokeWidth="1px" />
                                        <line x1="400px" y1="240px" x2="400px" y2="360px" stroke="black" strokeWidth="1px" />


                                        <line x1="280px" y1="360px" x2="280px" y2="600px" stroke="black" strokeWidth="1px" />
                                        <line x1="320px" y1="360px" x2="320px" y2="600px" stroke="black" strokeWidth="1px" />

                                        <line x1="240px" y1="560px" x2="360px" y2="560px" stroke="black" strokeWidth="1px" />
                                        <line x1="240px" y1="520px" x2="360px" y2="520px" stroke="black" strokeWidth="1px" />
                                        <line x1="240px" y1="480px" x2="360px" y2="480px" stroke="black" strokeWidth="1px" />
                                        <line x1="240px" y1="440px" x2="360px" y2="440px" stroke="black" strokeWidth="1px" />
                                        <line x1="240px" y1="400px" x2="360px" y2="400px" stroke="black" strokeWidth="1px" />

                                        <polyline points="0 0, 0 600, 600 600, 600 0" stroke="black" strokeWidth="1px" fill="none" strokeLinejoin="miter" />


                                        <circle id="redPawn1" onClick={() => this.movement('red',1)} cx="80px" cy="80px" r="20px" strokeWidth="1px" stroke="black" fill="red" visibility="visible" />
                                        <circle id="redPawn2" onClick={() => this.movement('red',2)} cx="80px" cy="160px" r="20px" strokeWidth="1px" stroke="black" fill="red" visibility="visible" />
                                        <circle id="redPawn3" onClick={() => this.movement('red',3)} cx="160px" cy="80px" r="20px" strokeWidth="1px" stroke="black" fill="red" visibility="visible" />
                                        <circle id="redPawn4" onClick={() => this.movement('red',4)} cx="160px" cy="160px" r="20px" strokeWidth="1px" stroke="black" fill="red" visibility="visible" />

                                        <circle id="greenPawn1" onClick={() => this.movement('green',1)} cx="440px" cy="80px" r="20px" strokeWidth="1px" stroke="black" fill="green" visibility="visible" />
                                        <circle id="greenPawn2" onClick={() => this.movement('green',2)} cx="440px" cy="160px" r="20px" strokeWidth="1px" stroke="black" fill="green" visibility="visible" />
                                        <circle id="greenPawn3" onClick={() => this.movement('green',3)} cx="520px" cy="80px" r="20px" strokeWidth="1px" stroke="black" fill="green" visibility="visible" />
                                        <circle id="greenPawn4" onClick={() => this.movement('green',4)} cx="520px" cy="160px" r="20px" strokeWidth="1px" stroke="black" fill="green" visibility="visible" />

                                        <circle id="bluePawn1" onClick={() => this.movement('blue',1)} cx="80px" cy="440px" r="20px" strokeWidth="1px" stroke="black" fill="#1989ff" visibility="visible" />
                                        <circle id="bluePawn2" onClick={() => this.movement('blue',2)} cx="80px" cy="520px" r="20px" strokeWidth="1px" stroke="black" fill="#1989ff" visibility="visible" />
                                        <circle id="bluePawn3" onClick={() => this.movement('blue',3)} cx="160px" cy="440px" r="20px" strokeWidth="1px" stroke="black" fill="#1989ff" visibility="visible" />
                                        <circle id="bluePawn4" onClick={() => this.movement('blue',4)} cx="160px" cy="520px" r="20px" strokeWidth="1px" stroke="black" fill="#1989ff" visibility="visible" />

                                        <circle id="yellowPawn1" onClick={() => this.movement('yellow',1)} cx="440px" cy="440px" r="20px" strokeWidth="1px" stroke="black" fill="yellow" visibility="visible" />
                                        <circle id="yellowPawn2" onClick={() => this.movement('yellow',2)} cx="440px" cy="520px" r="20px" strokeWidth="1px" stroke="black" fill="yellow" visibility="visible" />
                                        <circle id="yellowPawn3" onClick={() => this.movement('yellow',3)} cx="520px" cy="440px" r="20px" strokeWidth="1px" stroke="black" fill="yellow" visibility="visible" />
                                        <circle id="yellowPawn4" onClick={() => this.movement('yellow',4)} cx="520px" cy="520px" r="20px" strokeWidth="1px" stroke="black" fill="yellow" visibility="visible" />


                                        <text id="redCounter" x="250px" y="313px" visibility="hidden">0</text>
                                        <text id="greenCounter" x="290px" y="278px" visibility="hidden">0</text>
                                        <text id="blueCounter" x="290px" y="350px" visibility="hidden">0</text>
                                        <text id="yellowCounter" x="330px" y="313px" visibility="hidden">0</text>
                                    </svg>
                                    <svg id="dice" width="85px" height="85px" viewBox="0 0 85 85" xmlns="http://www.w3.org/2000/svg" >
                                        <image id="imgDice" onClick={() => this.roll()} href="images-dice/dice-neutral.gif" x="0" y="0" height="85px" width="85px" />
                                    </svg>

                                    <div id="myModal" className="modal">
                                        <div className="modal-content">
                                            <p>You finished {this.state.ranking + 1}. !</p>
                                            <p id="inf">Statistics will be updated after the game is over !!!</p>
                                            <Link to='/'>
                                                <button className='backToMenu' onClick={() => this.hideModal()}>
                                                    Back to menu
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="right-inf">
                                    <div className="right-greenPlayer">
                                        <span id='greenPlayer'>   </span>
                                    </div>
                                    <div className="right-yellowPlayer">
                                        <span id='yellowPlayer'>   </span>
                                    </div>
                                </div>
                            </div>
                        );
                    }}/>
                    <Switch>
                        <Route exact path="/" component={Menu} />
                    </Switch>
                </Router>
        );
    }
}

export default Game;