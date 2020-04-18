import React from 'react';


class Game extends React.Component {

    draw = () => {
        var boardCanvas = document.getElementById('board-canvas');
        var boardContext = boardCanvas.getContext('2d');
        boardContext.fillStyle = '#000000';

        var homeSize = 240;
        var pathSize = 40;
        var homeCircleSize = pathSize / 2;
        boardContext.lineWidth = 1;
        boardContext.strokeStyle = '#000000';
        var colors = ['red', 'yellow', 'green', 'blue'];
        var topLeftHomeCircleX =  2 * pathSize;
        var topLeftHomeCircleY = 2 * pathSize;

        boardContext.fillStyle = colors[0];
        boardContext.fillRect(0, 0, homeSize, homeSize);

        boardContext.fillRect(pathSize, homeSize, pathSize, pathSize);
        boardContext.fillRect(pathSize, homeSize + pathSize, 5 * pathSize, pathSize);


    }


    componentDidMount() {
        this.draw()
    }

    render() {
        return (
            <div>
                <canvas id="board-canvas" width="600" height="600">
                </canvas>

            </div>
        );
    }
}
export default Game;