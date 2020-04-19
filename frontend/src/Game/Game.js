import React from 'react';


class Game extends React.Component {
    constructor(props){
        super(props);
        this.state= {
            number: 0
        }
    }

    draw (boardCanvas, boardCxt, diceCanvas, diceCxt) {
        var homeSize = 240;
        var pathSize = 40;
        var homeCircleSize = pathSize / 2;
        boardCxt.lineWidth = 1;
        boardCxt.strokeStyle = '#000000';
        var colors = ['red', 'green', 'blue', 'yellow'];
        var topLeftHCircleX =  2 * pathSize;
        var topLeftHCircleY = 2 * pathSize;

        boardCxt.fillStyle = '#FFFFFF';
        boardCxt.fillRect(0, 0, boardCanvas.width, boardCanvas.height);

        /*Red*/
        boardCxt.fillStyle = colors[0];
        boardCxt.fillRect(0, 0, homeSize, homeSize);

        boardCxt.fillRect(pathSize, homeSize, pathSize, pathSize);
        boardCxt.fillRect(pathSize, homeSize + pathSize, 5 * pathSize, pathSize);

        boardCxt.beginPath();
        boardCxt.moveTo(homeSize, homeSize);
        boardCxt.lineTo(boardCanvas.width / 2, boardCanvas.height / 2);
        boardCxt.lineTo(homeSize, homeSize + (3 * pathSize));
        boardCxt.closePath();
        boardCxt.fill();

        boardCxt.beginPath();
        boardCxt.moveTo(0, homeSize + pathSize);
        boardCxt.lineTo(pathSize, boardCanvas.height / 2);
        boardCxt.lineTo(0, homeSize + (2 * pathSize));
        boardCxt.closePath();
        boardCxt.fill();

        boardCxt.fillStyle = '#FFFFFF';
        boardCxt.fillRect(pathSize, pathSize, homeSize - (2 * pathSize), homeSize - (2 * pathSize));

        boardCxt.fillStyle = colors[0];
        topLeftHCircleX =  2 * pathSize;
        topLeftHCircleY = 2 * pathSize;
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                boardCxt.beginPath();
                boardCxt.arc(topLeftHCircleX + (i * 2 * pathSize), topLeftHCircleY + (j * 2 * pathSize), homeCircleSize, 0, 2 * Math.PI);
                boardCxt.fill();

                boardCxt.stroke();
            }
        }

        boardCxt.beginPath();
        boardCxt.moveTo(0, homeSize);
        boardCxt.lineTo(homeSize, homeSize);
        boardCxt.stroke();

        boardCxt.beginPath();
        boardCxt.moveTo(homeSize, 0);
        boardCxt.lineTo(homeSize, homeSize);
        boardCxt.stroke();

        /*Green*/
        boardCxt.fillStyle = colors[1];
        boardCxt.fillRect(boardCanvas.width - homeSize, 0, homeSize, homeSize);

        boardCxt.fillRect(boardCanvas.width - homeSize - pathSize, pathSize, pathSize, pathSize);
        boardCxt.fillRect(homeSize + pathSize, pathSize, pathSize, 5* pathSize);

        boardCxt.beginPath();
        boardCxt.moveTo(homeSize, homeSize);
        boardCxt.lineTo(boardCanvas.width / 2, boardCanvas.height / 2);
        boardCxt.lineTo(homeSize + (3 * pathSize), homeSize);
        boardCxt.closePath();
        boardCxt.fill();

        boardCxt.beginPath();
        boardCxt.moveTo(homeSize + pathSize, 0);
        boardCxt.lineTo(boardCanvas.width / 2, pathSize);
        boardCxt.lineTo(homeSize + (2 * pathSize), 0);
        boardCxt.closePath();
        boardCxt.fill();

        boardCxt.fillStyle = '#FFFFFF';
        boardCxt.fillRect(boardCanvas.width - homeSize + pathSize, pathSize, homeSize - (2 * pathSize), homeSize - (2 * pathSize));

        boardCxt.fillStyle = colors[1];
        topLeftHCircleX = boardCanvas.width - homeSize + 2 * pathSize;
        topLeftHCircleY = 2 * pathSize;
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                boardCxt.beginPath();
                boardCxt.arc(topLeftHCircleX + (i * 2 * pathSize), topLeftHCircleY + (j * 2 * pathSize), homeCircleSize, 0, 2 * Math.PI);
                boardCxt.fill();

                boardCxt.stroke();
            }
        }

        boardCxt.beginPath();
        boardCxt.moveTo(boardCanvas.width - homeSize, 0);
        boardCxt.lineTo(boardCanvas.width - homeSize, homeSize);
        boardCxt.stroke();

        boardCxt.beginPath();
        boardCxt.moveTo(boardCanvas.width - homeSize, homeSize);
        boardCxt.lineTo(boardCanvas.width, homeSize);
        boardCxt.stroke();

        /*Blue*/
        boardCxt.fillStyle = colors[2];
        boardCxt.fillRect(0, boardCanvas.height - homeSize, homeSize, homeSize);

        boardCxt.fillRect(homeSize, boardCanvas.height - (2 * pathSize), pathSize, pathSize);
        boardCxt.fillRect(homeSize + pathSize, boardCanvas.height - homeSize, pathSize, 5 * pathSize);

        boardCxt.beginPath();
        boardCxt.moveTo(homeSize,  boardCanvas.height - homeSize);
        boardCxt.lineTo(boardCanvas.width / 2, boardCanvas.height / 2);
        boardCxt.lineTo(homeSize + (3 * pathSize), boardCanvas.height - homeSize);
        boardCxt.closePath();
        boardCxt.fill();

        boardCxt.beginPath();
        boardCxt.moveTo(homeSize + pathSize, boardCanvas.height);
        boardCxt.lineTo(boardCanvas.width / 2, boardCanvas.height - pathSize);
        boardCxt.lineTo(homeSize + (2 * pathSize), boardCanvas.height);
        boardCxt.closePath();
        boardCxt.fill();

        boardCxt.fillStyle = '#FFFFFF';
        boardCxt.fillRect(pathSize, boardCanvas.height - homeSize + pathSize, homeSize - (2 * pathSize), homeSize - (2 * pathSize));

        boardCxt.fillStyle = colors[2];
        topLeftHCircleX =  2 * pathSize;
        topLeftHCircleY = boardCanvas.height - homeSize + 2 * pathSize;
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                boardCxt.beginPath();
                boardCxt.arc(topLeftHCircleX + (i * 2 * pathSize), topLeftHCircleY + (j * 2 * pathSize), homeCircleSize, 0, 2 * Math.PI);
                boardCxt.fill();

                boardCxt.stroke();
            }
        }

        boardCxt.beginPath();
        boardCxt.moveTo(0, boardCanvas.height - homeSize);
        boardCxt.lineTo(homeSize, boardCanvas.height - homeSize);
        boardCxt.stroke();

        boardCxt.beginPath();
        boardCxt.moveTo(homeSize, boardCanvas.height - homeSize);
        boardCxt.lineTo(homeSize, boardCanvas.height);
        boardCxt.stroke();

        /*Yellow*/
        boardCxt.fillStyle = colors[3];
        boardCxt.fillRect(boardCanvas.width - homeSize, boardCanvas.height - homeSize, homeSize, homeSize);

        boardCxt.fillRect(boardCanvas.width - (2 * pathSize), homeSize + (2 * pathSize), pathSize, pathSize);
        boardCxt.fillRect(boardCanvas.width - homeSize, homeSize + pathSize, 5 * pathSize, pathSize);

        boardCxt.beginPath();
        boardCxt.moveTo(homeSize + (3 * pathSize),  homeSize);
        boardCxt.lineTo(boardCanvas.width / 2, boardCanvas.height / 2);
        boardCxt.lineTo(homeSize + (3 * pathSize), boardCanvas.height - homeSize);
        boardCxt.closePath();
        boardCxt.fill();

        boardCxt.beginPath();
        boardCxt.moveTo(boardCanvas.width, homeSize + (2 * pathSize));
        boardCxt.lineTo(boardCanvas.width - pathSize, boardCanvas.height / 2);
        boardCxt.lineTo(boardCanvas.width, homeSize + pathSize);
        boardCxt.closePath();
        boardCxt.fill();

        boardCxt.fillStyle = '#FFFFFF';
        boardCxt.fillRect(boardCanvas.width-homeSize + pathSize, boardCanvas.height - homeSize + pathSize, homeSize - (2 * pathSize), homeSize - (2 * pathSize));

        boardCxt.fillStyle = colors[3];
        topLeftHCircleX = boardCanvas.width - homeSize + 2 * pathSize;
        topLeftHCircleY = boardCanvas.height - homeSize + 2 * pathSize;
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                boardCxt.beginPath();
                boardCxt.arc(topLeftHCircleX + (i * 2 * pathSize), topLeftHCircleY + (j * 2 * pathSize), homeCircleSize, 0, 2 * Math.PI);
                boardCxt.fill();

                boardCxt.stroke();
            }
        }

        boardCxt.beginPath();
        boardCxt.moveTo(boardCanvas.width - homeSize, boardCanvas.height - homeSize);
        boardCxt.lineTo(boardCanvas.width, boardCanvas.height - homeSize);
        boardCxt.stroke();

        boardCxt.beginPath();
        boardCxt.moveTo(boardCanvas.width - homeSize, boardCanvas.height - homeSize);
        boardCxt.lineTo(boardCanvas.width - homeSize, boardCanvas.height);
        boardCxt.stroke();

        /*Mid*/
        boardCxt.fillStyle = '#000000';
        boardCxt.rect(homeSize, homeSize, 3 * pathSize, 3 * pathSize);
        boardCxt.stroke();

        boardCxt.beginPath();
        boardCxt.moveTo(homeSize, homeSize);
        boardCxt.lineTo(boardCanvas.width-homeSize, boardCanvas.height - homeSize);
        boardCxt.stroke();

        boardCxt.beginPath();
        boardCxt.moveTo(boardCanvas.width-homeSize, homeSize);
        boardCxt.lineTo(homeSize, boardCanvas.height - homeSize);
        boardCxt.stroke();

        /*Paths*/
        for (let i = 1; i <= 2; i++) {
            boardCxt.beginPath();
            boardCxt.moveTo(0, homeSize + (i * pathSize));
            boardCxt.lineTo(homeSize, homeSize + (i * pathSize));
            boardCxt.stroke();
        }
        for (let i = 1; i <= 5; i++) {
            boardCxt.beginPath();
            boardCxt.moveTo(i * pathSize, homeSize);
            boardCxt.lineTo(i * pathSize, boardCanvas.height - homeSize);
            boardCxt.stroke();
        }
        /**/
        for (let i = 1; i <= 2; i++) {
            boardCxt.beginPath();
            boardCxt.moveTo(homeSize + (i * pathSize), 0);
            boardCxt.lineTo(homeSize + (i * pathSize), homeSize);
            boardCxt.stroke();
        }
        for (let i = 1; i <= 5; i++) {
            boardCxt.beginPath();
            boardCxt.moveTo(homeSize, i * pathSize);
            boardCxt.lineTo(boardCanvas.width - homeSize, i * pathSize);
            boardCxt.stroke();
        }
        /**/
        for (let i = 1; i <= 2; i++) {
            boardCxt.beginPath();
            boardCxt.moveTo(boardCanvas.width - homeSize, homeSize + (i * pathSize));
            boardCxt.lineTo(boardCanvas.width, homeSize + (i * pathSize));
            boardCxt.stroke();
        }
        for (let i = 1; i <= 5; i++) {
            boardCxt.beginPath();
            boardCxt.moveTo(boardCanvas.width - (i * pathSize), homeSize);
            boardCxt.lineTo(boardCanvas.width - (i * pathSize), boardCanvas.height - homeSize);
            boardCxt.stroke();
        }
        /**/
        for (let i = 0; i <= 2; i++) {
            boardCxt.beginPath();
            boardCxt.moveTo(homeSize + (i * pathSize), boardCanvas.height - homeSize);
            boardCxt.lineTo(homeSize + (i * pathSize), boardCanvas.height);
            boardCxt.stroke();
        }
        for (let i = 1; i <= 5; i++) {
            boardCxt.beginPath();
            boardCxt.moveTo(homeSize, boardCanvas.height - (i * pathSize));
            boardCxt.lineTo(boardCanvas.width - homeSize, boardCanvas.height - (i * pathSize));
            boardCxt.stroke();
        }

        /*Dice*/
        var image = new Image();
        image.src = 'images-dice/dice-neutral.png';
        image.onload = () => {
            diceCxt.drawImage(image,0,0);
        }
    }

    componentDidMount() {
        var boardCanvas = document.getElementById('boardCanvas');
        var boardCxt = boardCanvas.getContext('2d');

        var diceCanvas = document.getElementById('diceCanvas');
        var diceCxt = diceCanvas.getContext('2d');

        this.draw(boardCanvas, boardCxt, diceCanvas, diceCxt);

        diceCanvas.addEventListener('click', () => {
            var diceInterval = setInterval(() => {
                var num = 1 + Math.floor(Math.random() * 6);
                this.setState({
                    number: num
                });

                diceCxt.clearRect(0, 0,diceCanvas.width,diceCanvas.height);

                var image = new Image();
                image.src = 'images-dice/dice-' + num + '.jpg';
                image.onload = () => {
                    diceCxt.drawImage(image,0,0);
                }
            }, 50);

            setTimeout(() => {
                clearInterval(diceInterval);
            }, 1250);
        }, false);
    }

    render() {
        return (
            <div className='game'>
                <canvas id="boardCanvas" width="600" height="600" />
                <canvas id="diceCanvas" width="85" height="85" />
            </div>
        );
    }
}

export default Game;