//Grass Klasse
module.exports = class Grass {
    constructor() {
        this.stepCount = frameCount + 1;
        this.color = "green"; // farbe zu grÃ¼n
        this.energy = int(random(1));
        this.index = 1;
    }

    step() {
        // ErhÃ¶ht die Energie des Gras um 1
        this.energy++; // erhÃ¶t den energie um 1
        if (this.energy >= 7) { // wenn die energie 7 ist
            this.multiply(); //multizipliern
            this.energy = 0; // dann energie auf 0 setzen
        }
    }

    multiply() {
        // Wenn leere Nachbarfelder gibt wird zufÃ¤llige eines ausgewÃ¤hlt und dort neues Gras erzeugt.
        let emptyFields = findNeighbourPositions(this.row, this.col, 1, Empty);

        if (emptyFields.length > 0) {
            let randomEmptyField = random(emptyFields);
            let row = randomEmptyField[0];
            let col = randomEmptyField[1];
            matrix[row][col] = new Grass();
        }
    }
}