import Grass from "./creatures/Grass";
import GrassEater from "./creatures/GrassEater";
import MeatEater from "./creatures/MeatEater";
import Empty from "./creatures/Empty";
import Water from "./creatures/Water";

// Liste von Listen. Enthaelt alle Kreaturen.
export let matrix = [];

export let frameCount = 0
// Groesse der Matrix, Anzahl der Zellen in Breite und Hoehe
export let matrixSize = 50;
// Anzeigengroesse in Pixeln fuer jede Zelle
export let blockSize = 15;

// Wahrscheinlichkeit, mit der jede Kreatur erstellt wird
export let creatureProbabilities = [
    [Grass, 0.25], // Gras: 25% Wahrscheinlichkeit
    [GrassEater, 0.05], // Grasfresser: 5% Wahrscheinlichkeit
    [MeatEater, 0.02], // Fleischfresser: 2% Wahrscheinlichkeit
];

export function incrementFrameCount() {
    frameCount++
}

// Waehlt basierend auf den Wahrscheinlichkeiten zufaellig eine Kreatur aus
export function getRandomCreature() {
    let rand = random(); // Zufallszahl zwischen 0 und 1
    let sum = 0;
    for (let i = 0; i < creatureProbabilities.length; i++) {
        let creatureClass = creatureProbabilities[i][0];
        let probability = creatureProbabilities[i][1];
        sum += probability; // Summiert die Wahrscheinlichkeiten
        if (rand < sum) {
            // Wenn die Zufallszahl kleiner ist, waehle diese Kreatur
            return new creatureClass();
        }
    }
    return new Empty(); // Wenn keine andere Bedingung zutrifft, wird ein leeres Feld zurueckgegeben
}

// Fuellt die Matrix zufaellig mit Kreaturen basierend auf den Wahrscheinlichkeiten

// Aktualisiert die Position einer Kreatur in der Matrix
// Erstellt ein neues leeres Objekt an der alten Position
export function updateCreaturePosition(creature, newPos) {
    if (matrix[creature.row][creature.col] !== creature) {
        let creatureType = creature.constructor.name;
        let message = `Ein ${creatureType}-Kreatur soll bewegt werden, aber befindet sich nicht mehr in der Matrix.\
Das liegt wahrscheinlich daran, dass sie zuvor "gestorben" ist und die Position bereits\
von einer anderen Kreatur eingenommen wurde. Nachdem eine Kreatur "stirbt", sollte sie\
sich nicht mehr bewegen. Wahrscheinlich hast du die Logik fuers sterben vor der logik fuers\
fressen/bewegen in der step() Methode. Versuche, die Logik fuers sterben ganz ans Ende der\
step() Methode zu verschieben oder verwende ein return, um die Methode nach dem Sterben zu beenden.`;
        throw new Error(message);
    }
    let newRow = newPos[0];
    let newCol = newPos[1];
    matrix[newRow][newCol] = creature;
    matrix[creature.row][creature.col] = new Empty();
    creature.row = newRow;
    creature.col = newCol;
}

// Fuer eine gegebene Position werden alle Nachbarpositionen gesucht,
// die einen bestimmten Kreaturentyp enthalten und innerhalb einer bestimmten Distanz liegen
// Gibt eine Liste von [row, col]-Positionen zurueck
// Beispiel: findNeighbourPositions(10, 10, 1, Empty) gibt alle leeren Zellen
// um die Position 10, 10 im Abstand von 1 zurueck.
// Wenn alle Zellen leer sind, wird [[9, 9], [9, 10], [9, 11], [10, 9], [10, 11], [11, 9], [11, 10], [11, 11]] zurueckgegeben
export function findNeighbourPositions(row, col, distance, Typ) {
    let positions = [];
    for (let i = row - distance; i <= row + distance; i++) {
        for (let j = col - distance; j <= col + distance; j++) {
            let inMatrix = i >= 0 && j >= 0 && i < matrixSize && j < matrixSize;

            if (
                inMatrix == true &&
                (row != i || col != j) &&
                matrix[i][j] instanceof Typ
            ) {
                positions.push([i, j]);
            }
        }
    }

    return positions;
}

export function fillRandomMatrix() {
    for (let row = 0; row < matrixSize; row++) {
        // durch jede Zeilen laufen
        let newRow = []; // eine neu leere Zeile erstellen
        for (let col = 0; col < matrixSize; col++) {
            // durch jede Spalte laufen
            // falls es die letzte Spalte ist, setze Wasser
            //  wenn es die letzte Spalte (ganz rechts) ist kommt das Wasser
            newRow.push(
                col == 0 || col === matrixSize - 1 ? new Water() : getRandomCreature() // das wasser kommt von von beide seiten (Rechts und Links)
            );
        }
        matrix.push(newRow); // die Zeile zur Matrix hinzufuegen

    }
}

export function random(...args) {
    if (args.length === 0) {
        return Math.random();
    } else if (args.length === 1 && Array.isArray(args[0])) {
        return args[0][Math.floor(Math.random() * args[0].length)];
    } else if (args.length === 1 && typeof args[0] === 'number') {
        return Math.floor(Math.random() * args[0]);
    } else if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
        return Math.floor(Math.random() * (args[1] - args[0] + 1) - args[0]);
    } else {
        console.log(args);
        throw new Error('Invalid arguments');
    }
}

export function int(value) {
    if (Array.isArray(value)) {
        return value.map(int);
    } else {
        return Math.floor(value);
    }
}