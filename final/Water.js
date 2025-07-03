// Wasser Klasse
module.exports = class Water {
    constructor() {
        this.stepCount = frameCount + 1;
        this.color = "cyan";
        this.energy = 3;
        this.index = 4;
    }

    step() {
        this.energy++; // energie wird mehr
        if (this.energy >= 7) { // Wenn Energie 7 ist
            this.multiply(); // Multiplizert
            this.energy = 1; // Energie wird zu 1
        }
        if (frameCount > 250) { // Wenn mehr als 250 Frames vergangen sind
            let zahl = random();   // Zufallszahl  wird erzeugt.
            if (zahl > 0.97) { // Wenn die Zahl grÃ¶ÃŸer als 0.97 ist
                matrix[this.row][this.col] = new Grass(); // neues Grass
                return;
            }
        }
    }

    multiply() {
        let emptyPositions = findNeighbourPositions(this.row, this.col, 1, Empty);
        let waterPositions = findNeighbourPositions(this.row, this.col, 1, Water);

        // Wasser soll auf freie Felder gehen
        if (frameCount <= 150) {
            if (emptyPositions.length > 0) {
                let newPos = random(emptyPositions);
                let row = newPos[0];
                let col = newPos[1];
                matrix[row][col] = new Water();
            }
        }
        else {
            if (waterPositions.length > 0) {
                let newPos = random(waterPositions);
                let row = newPos[0];
                let col = newPos[1];
                let zahl = random();
                if (zahl > 0.95) {
                    matrix[row][col] = new Grass();
                    return;
                }
            }
        }
    }
}