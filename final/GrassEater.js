// Grasseater klasse
module.exports = class GrassEater {
    // Dein Code hier

    constructor() {
        this.stepCount = frameCount + 1;
        this.color = "yellow";
        this.energy = 5;
        this.index = 2;
    }

    step() {
        this.eat(); // isst
        // Finde WasserNachbarn. wenn 7 oder mehr da sind, setze Zelle auf Wasser und stop
        let WasserNachbarn = findNeighbourPositions(this.row, this.col, 1, Water);   // // Wasser-Nachbarn suchen
        if (WasserNachbarn.length >= 7) {  // Wenn die abstand 7 ist
            matrix[this.row][this.col] = new Water(); // neue wasser
            return
        }

        if (this.energy >= 20) { // wenn energie 20 isr
            this.multiply(); // multiplizieren
            this.energy -= 5; // energie - 5
        } else if (this.energy <= 0) { // falls die Energie 0 ist
            matrix[this.row][this.col] = new Empty(); // es stirbt
        }
    }

    eat() {
        let grassNeighbours = findNeighbourPositions(this.row, this.col, 1, Grass);

        if (grassNeighbours.length > 0) { // Wenn Gras da ist
            let randomgrassfield = random(grassNeighbours); // WÃ¤hle Grasfeld
            updateCreaturePosition(this, randomgrassfield);  // Bewege zum Gras
            this.energy++; // Energie steigt +1
        } else { // falls Kein Gras gefunden
            let emptyNeighbours = findNeighbourPositions(this.row, this.col, 1, Empty); // Suche leere Felder
            if (emptyNeighbours.length > 0) { // Wenn leerer Platz da ist
                let newPos = random(emptyNeighbours); // WÃ¤hle leeres Feld
                updateCreaturePosition(this, newPos); // Bewege dich hin
            }
            this.energy -= 1; // Energie geht runter
        }
    }

    multiply() {
        // Wenn leere Nachbarfelder gibt wird zufÃ¤llige eines ausgewÃ¤hlt und dort neues GrassEazer erzeugt.
        let emptyPositions = findNeighbourPositions(this.row, this.col, 1, Empty);
        if (emptyPositions.length > 0) {
            let newPos = random(emptyPositions);
            let row = newPos[0];
            let col = newPos[1];
            matrix[row][col] = new GrassEater();
        }
    }
}