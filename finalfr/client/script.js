function setup() {
    createCanvas(matrixSize * blockSize, matrixSize * blockSize);
    fillRandomMatrix();
    noStroke();
    frameRate(30);
}

function draw() {
    background(200);
    for (let row = 0; row < matrixSize; row++) {
        for (let col = 0; col < matrixSize; col++) {
            let obj = matrix[row][col];

            if (obj instanceof Empty) continue;

            obj.row = row;
            obj.col = col;

            if (obj.stepCount === frameCount) {
                obj.step();
                obj.stepCount++;
                console.log(frameCount)
            }

            fill(obj.color);
            rect(blockSize * obj.col, blockSize * obj.row, blockSize, blockSize);
        }
    }
}