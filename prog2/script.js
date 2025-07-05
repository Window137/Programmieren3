class Empty { }

//Grass Klasse
class Grass {
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

// Grasseater klasse
class GrassEater {
  // Dein Code hier

  constructor() {
    this.stepCount = frameCount + 1;
    this.color = "yellow";
    this.energy = 5;
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
      let randomgrassfield = random(grassNeighbours); // Waehle Grasfeld
      updateCreaturePosition(this, randomgrassfield);  // Bewege zum Gras
      this.energy++; // Energie steigt +1
    } else { // falls Kein Gras gefunden
      let emptyNeighbours = findNeighbourPositions(this.row, this.col, 1, Empty); // Suche leere Felder
      if (emptyNeighbours.length > 0) { // Wenn leerer Platz da ist
        let newPos = random(emptyNeighbours); // Waehle leeres Feld
        updateCreaturePosition(this, newPos); // Bewege dich hin
      }
      this.energy -= 1; // Energie geht runter
    }
  }

  multiply() {
        // Wenn leere Nachbarfelder gibt wird zufaellige eines ausgewaehlt und dort neues GrassEazer erzeugt.
    let emptyPositions = findNeighbourPositions(this.row, this.col, 1, Empty);
    if (emptyPositions.length > 0) {
      let newPos = random(emptyPositions);
      let row = newPos[0];
      let col = newPos[1];
      matrix[row][col] = new GrassEater();
    }
  }
}

// Startenergie: Jeder Fleischfresser beginnt mit einer Energie von 100.
// Nahrungssuche: In jedem Zyklus sucht der Fleischfresser in seiner unmittelbaren Umgebung nach Nahrung.
//     Grasfresser gefunden:
//         Der Fleischfresser bewegt sich auf das Feld, auf dem sich der Grasfresser befindet.
//         Dadurch wird der Grasfresser "gefressen" und der Fleischfresser erhaelt 10 Energiepunkte dazu.
//     Kein Grasfresser gefunden:
//         Der Fleischfresser kann kein leeres Feld suchen, sondern verliert 1 Energiepunkt.
// Fortpflanzung: Erreicht der Fleischfresser eine Energie von 120 oder mehr, pflanzt er sich fort.
//     Er sucht nach einem leeren Feld in seiner Umgebung.
//     Wenn ein leeres Feld gefunden wird, wird dort ein neuer Fleischfresser erstellt.
//     Der urspruengliche Fleischfresser verliert 100 Energiepunkte durch die Fortpflanzung.
// Tod: Sinkt die Energie des Fleischfressers auf 0 oder weniger, stirbt er und das Feld, auf dem er sich befand, wird leer.
class MeatEater {
  constructor() {
    this.stepCount = frameCount + 1;
    this.color = "red";
    this.energy = 100;
  }

  step() {
 // Finde WasserNachbarn. wenn 7 oder mehr da sind, setze Zelle auf Wasser und stop
    let WasserNachbarn = findNeighbourPositions(this.row, this.col, 1, Water);
    if (WasserNachbarn.length >= 7) { // Wenn es 7 oder mehr Wasser-Nachbarn gibt
      matrix[this.row][this.col] = new Water();   // Dann wird diese Zelle zu Wasser.
      return
    }

    this.eat();

    if (this.energy >= 60) { // Wenn Energie 60 oder mehr ist
      this.multiply(); // multiplizieren
      this.energy -= 10; // energie wird runter gehen um 30
    }
    if (this.energy <= 0) { // Wenn Energie 0 ist
      matrix[this.row][this.col] = new Empty(); // wird leer
    }
  }

  eat() {
    // Tier sucht (Nachbar) GrassEater frisst sie und gewinnt Energie sonst verliert es Energie
    let grasseaterNeighbours = findNeighbourPositions(this.row, this.col, 1, GrassEater);

    if (grasseaterNeighbours.length > 0) {
      let randomgrasseaterfield = random(grasseaterNeighbours);
      updateCreaturePosition(this, randomgrasseaterfield);
      this.energy += 10;
    } else {
      this.energy -= 0.5;
    }
  }

  multiply() {
    let emptyPositions = findNeighbourPositions(this.row, this.col, 0, Empty);
    if (emptyPositions.length > 0) {
      let newPos = random(emptyPositions);
      let row = newPos[0];
      let col = newPos[1];
      matrix[row][col] = new MeatEater([0], [1]);
    }
  }
}

// Liste von Listen. Enthaelt alle Kreaturen.
let matrix = [];
// Groesse der Matrix, Anzahl der Zellen in Breite und Hoehe
let matrixSize = 50;
// Anzeigengroesse in Pixeln fuer jede Zelle
let blockSize = 15;

// Wahrscheinlichkeit, mit der jede Kreatur erstellt wird
let creatureProbabilities = [
  [Grass, 0.25], // Gras: 25% Wahrscheinlichkeit
  [GrassEater, 0.05], // Grasfresser: 5% Wahrscheinlichkeit
  [MeatEater, 0.02], // Fleischfresser: 2% Wahrscheinlichkeit
];

// Waehlt basierend auf den Wahrscheinlichkeiten zufaellig eine Kreatur aus
function getRandomCreature() {
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
function updateCreaturePosition(creature, newPos) {
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
function findNeighbourPositions(row, col, distance, Typ) {
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

function fillRandomMatrix() {
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
// Macht das Zeichenfenster fertig, fuellt die Matrix und stellt die wiederholung ein
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
// Wasser Klasse
class Water {
  constructor() {
    this.stepCount = frameCount + 1;
    this.color = "cyan";
    this.energy = 3;
  }

  step() {
    this.energy++; // energie wird mehr
    if (this.energy >= 7) { // Wenn Energie 7 ist
      this.multiply(); // Multiplizert
      this.energy = 1; // Energie wird zu 1
    }
    if (frameCount > 250) { // Wenn mehr als 250 Frames vergangen sind
      let zahl = random();   // Zufallszahl  wird erzeugt.
      if (zahl > 0.97) { // Wenn die Zahl groesser als 0.97 ist
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