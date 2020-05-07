import React from 'react';
import update from 'immutability-helper';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Menu from "./Menu";

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            color: "red",
            numOfPlayers: 0,
            number: 0,
            onBoard: 0,
            canRoll: true,
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
            allColors: ["red", "blue", "green", "yellow"]
        };
    }

    roll() {
        if (this.state.canRoll) {
            this.setState({
                canRoll: false
            });
            let dice = document.getElementById("imgDice");
            let num;
            let diceInterval = setInterval(() => {
               num = 1 + Math.floor(Math.random() * 6);

               dice.setAttribute("href", "images-dice/dice-" + num + ".jpg");
            }, 50);

            setTimeout(() => {
                clearInterval(diceInterval);
                let onB = this.state.onBoard;

                if (num !== 6 && (onB === 0)) {
                    /*var bad = document.getElementById('badtext');
                    bad.innerText = "Unfortunatlly you stuck";
                    */
                    setTimeout(() => {
                        dice.setAttribute("href", "images-dice/dice-neutral.png");
                        /*zmen hraca*/
                    }, 1000);
                    /////////////////////
                    this.setState({
                        canRoll: true
                    });
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
                            dice.setAttribute("href", "images-dice/dice-neutral.png");
                            this.setState({
                                canRoll: true
                            });
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            dice.setAttribute("href", "images-dice/dice-neutral.png");
                            /*zmen hraca*/
                        }, 1000);
                        ////////////////////////////////////////////////////////////////////////////////
                        this.setState({
                            canRoll: true
                        });
                    }
                }
            }, 1250);
        }
    }

    canMove(num) {
        /*var text = document.getElementById('player');*/
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
        /*nebude asi potreben lebo to su ine farby*/
        let pob = update(this.state.pawnsOnBoard, {
            [pawn]: {$set: 0}
        });
        let pos = update(this.state.positions, {
            [pawn]: {$set: 0}
        });
        this.setState({
            pawnsOnBoard: pob,
            positions: pos
        });
        let pawnGoHome = document.getElementById(pawn);
        switch (pawn) {
            case "redPawn1": pawnGoHome.setAttribute("cx", "80px"); pawnGoHome.setAttribute("cy", "80px"); break;
            case "redPawn2": pawnGoHome.setAttribute("cx", "80px"); pawnGoHome.setAttribute("cy", "160px"); break;
            case "redPawn3": pawnGoHome.setAttribute("cx", "160px"); pawnGoHome.setAttribute("cy", "80px"); break;
            case "redPawn4": pawnGoHome.setAttribute("cx", "160px"); pawnGoHome.setAttribute("cy", "160px"); break;
            case "bluePawn1": pawnGoHome.setAttribute("cx", "80px"); pawnGoHome.setAttribute("cy", "440px"); break;
            case "bluePawn2": pawnGoHome.setAttribute("cx", "80px"); pawnGoHome.setAttribute("cy", "520px"); break;
            case "bluePawn3": pawnGoHome.setAttribute("cx", "160px"); pawnGoHome.setAttribute("cy", "440px"); break;
            case "bluePawn4": pawnGoHome.setAttribute("cx", "160px"); pawnGoHome.setAttribute("cy", "520px"); break;
            case "greenPawn1": pawnGoHome.setAttribute("cx", "440px"); pawnGoHome.setAttribute("cy", "80px"); break;
            case "greenPawn2": pawnGoHome.setAttribute("cx", "440px"); pawnGoHome.setAttribute("cy", "160px"); break;
            case "greenPawn3": pawnGoHome.setAttribute("cx", "520px"); pawnGoHome.setAttribute("cy", "80px"); break;
            case "greenPawn4": pawnGoHome.setAttribute("cx", "520px"); pawnGoHome.setAttribute("cy", "160px"); break;
            case "yellowPawn1": pawnGoHome.setAttribute("cx", "440px"); pawnGoHome.setAttribute("cy", "440px"); break;
            case "yellowPawn2": pawnGoHome.setAttribute("cx", "440px"); pawnGoHome.setAttribute("cy", "520px"); break;
            case "yellowPawn3": pawnGoHome.setAttribute("cx", "520px"); pawnGoHome.setAttribute("cy", "440px"); break;
            case "yellowPawn4": pawnGoHome.setAttribute("cx", "520px"); pawnGoHome.setAttribute("cy", "520px"); break;
        }
    }

    checkForWin(numOut) {
        if (numOut === 4) {
            /*zmen hraca*/

            let modal = document.getElementById("myModal");
            modal.style.display = "block";
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
                                }
                                break;
                            case "green":
                                if(!this.occupied(340, 60)){
                                    p.setAttribute("cx", "340px");
                                    p.setAttribute("cy", "60px");
                                    isDraw = true;
                                }
                                break;
                            case "yellow":
                                if(!this.occupied(540, 340)){
                                    p.setAttribute("cx", "540px");
                                    p.setAttribute("cy", "340px");
                                    isDraw = true;
                                }
                                break;
                            case "blue":
                                if(!this.occupied(260, 540)){
                                    p.setAttribute("cx", "260px");
                                    p.setAttribute("cy", "540px");
                                    isDraw = true;
                                }
                                break;
                        }
                        if (isDraw) {
                            let dice = document.getElementById("imgDice");
                            dice.setAttribute("href", "images-dice/dice-neutral.png");
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
                        /**/
                        this.setState({
                            canRoll: true
                        })
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
                                    p.setAttribute("visibility", "hidden");
                                    p.setAttribute("cx", "300px");
                                    p.setAttribute("cy", "300px");

                                    let counter = document.getElementById(color + "Counter");
                                    if(numOut === 0){
                                        counter.setAttribute("visibility", "visible");
                                    }
                                    numOut = numOut + 1;
                                    counter.textContent = numOut;

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
                                        onBoard: this.state.onBoard - 1,
                                        canPlay: false,
                                        pawnOut: po,
                                        pawnsOnBoard: pob,
                                        positions: pos,
                                    });

                                    this.checkForWin(numOut);////////////////////
                                } else {
                                    p.setAttribute("cx", coor[0] + "px");
                                    p.setAttribute("cy", coor[1] + "px");

                                    let pos = update(this.state.positions, {
                                        [currPawn]: {$set: coor[2]}
                                    });
                                    this.setState({
                                        canPlay: false,
                                        positions: pos
                                    });
                                }
                                if(this.state.number === 6){
                                    dice.setAttribute("href", "images-dice/dice-neutral.png");

                                    this.setState({
                                        number: 0,
                                        canRoll: true
                                    });
                                } else {
                                    dice.setAttribute("href", "images-dice/dice-neutral.png");
                                    /*zmen hraca a poymen nizsi state aby tam nebolo canroll*/
                                    this.setState({
                                        number: 0,
                                        canRoll: true
                                    });
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

    render() {
        return (
                <Router>
                    <Route path="/play" exact render={() => {
                        return (
                            <div className='game'>
                                <div className="left-inf">
                                    <div className="left-redPlayer">
                                        <span id='redPlayer'>aaaaaaa</span>
                                    </div>
                                    <div className="left-bluePlayer">
                                        <span id='bluePlayer'>ahoj</span>
                                    </div>
                                    <div className="turn-Information">
                                        <label id='uselessText'>It’s <span id="playerColorTurn">red</span>s turn !</label>
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
                                        <polyline points="0 240, 240 240, 240 0" stroke="black" strokeWidth="1px "fill="none" strokeLinejoin="miter" />


                                        <rect x="360px" y="0px" width="240px" height="240px" fill="green" />
                                        <rect x="320px" y="40px" width="40px" height="40px" fill="green" />
                                        <rect x="280px" y="40px" width="40px" height="200px" fill="green" />
                                        <polygon points="240,240 300,300 360,240" fill="green" />
                                        <polygon points="280,0 300,40 320,0" fill="green" />

                                        <rect x="400px" y="40px" width="160px" height="160px" fill="white" />
                                        <polyline points="360 0, 360 240, 600 240" stroke="black" strokeWidth="1px "fill="none" strokeLinejoin="miter" />


                                        <rect x="0px" y="360px" width="240px" height="240px" fill="#1989ff" />
                                        <rect x="240px" y="520px" width="40px" height="40px" fill="#1989ff" />
                                        <rect x="280px" y="360px" width="40px" height="200px" fill="#1989ff" />
                                        <polygon points="240,360 300,300 360,360" fill="#1989ff" />
                                        <polygon points="280,600 300,560 320,600" fill="#1989ff" />

                                        <rect x="40px" y="400px" width="160px" height="160px" fill="white" />
                                        <polyline points="0 360, 240 360, 240 600" stroke="black" strokeWidth="1px "fill="none" strokeLinejoin="miter" />


                                        <rect x="360px" y="360px" width="240px" height="240px" fill="yellow" />
                                        <rect x="520px" y="320px" width="40px" height="40px" fill="yellow" />
                                        <rect x="360px" y="280px" width="200px" height="40px" fill="yellow" />
                                        <polygon points="360,240 300,300 360,360" fill="yellow" />
                                        <polygon points="600,320 560,300 600,280" fill="yellow" />

                                        <rect x="400px" y="400px" width="160px" height="160px" fill="white" />
                                        <polyline points="360 600, 360 360, 600 360" stroke="black" strokeWidth="1px "fill="none" strokeLinejoin="miter" />


                                        <rect x="240px" y="240px" width="120px" height="120px" fill="none" strokeWidth="1px" stroke="black" />
                                        <line x1="240px" y1="240px" x2="360px" y2="360px"stroke="black" strokeWidth="1px" />
                                        <line x1="360px" y1="240px" x2="240px" y2="360px"stroke="black" strokeWidth="1px" />


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

                                        <polyline points="0 0, 0 600, 600 600, 600 0" stroke="black" strokeWidth="1px " fill="none" strokeLinejoin="miter" />


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
                                        <image id="imgDice" onClick={() => this.roll()} href="images-dice/dice-neutral.png" x="0" y="0" height="85px" width="85px" />
                                    </svg>

                                    <div id="myModal" className="modal">
                                        <div className="modal-content">
                                            <p>You finished {this.state.color} !</p>
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
                                        <span id='greenPlayer'>aaaaaaaaaaaaaaa</span>
                                    </div>
                                    <div className="right-yellowPlayer">
                                        <span id='yellowPlayer'>ahoj</span>
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