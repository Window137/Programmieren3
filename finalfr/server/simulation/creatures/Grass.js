import {
    findNeighbourPositions,
    frameCount,
    matrix,
    random,
    int
} from "../../utils";

//Grass Klasse
export default class Grass {
    constructor() {
        this.stepCount = frameCount + 1;
        this.color = "green"; // farbe zu gruen
        this.energy = int(random(1));
    }

    step() {
        // Erhoeht die Energie des Gras um 1
        this.energy++; // erhoet den energie um 1
        if (this.energy >= 7) { // wenn die energie 7 ist
            this.multiply(); //multizipliern
            this.energy = 0; // dann energie auf 0 setzen
        }
    }

    multiply() {
        // Wenn leere Nachbarfelder gibt wird zufaellige eines ausgewaehlt und dort neues Gras erzeugt.
        let emptyFields = findNeighbourPositions(this.row, this.col, 1, Empty);

        if (emptyFields.length > 0) {
            let randomEmptyField = random(emptyFields);
            let row = randomEmptyField[0];
            let col = randomEmptyField[1];
            matrix[row][col] = new Grass();
        }
    }
}