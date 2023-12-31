// INSTRUCTIONS ---------------------------------------
// ### 2. Create the Grid:
// - Create a webpage with a grid of square divs. The size of the grid (e.g., 16x16) will be configurable by the user.
// - Use JavaScript to create the divs dynamically.
// - Use flexbox or grid CSS to arrange the divs in a grid format.
// - Each div represents a cell in Conway's Game of Life and can be in one of two states: alive (e.g., colored black) or dead (e.g., colored white).
// ### 3. Interact with Cells:
// - When a cell is clicked, toggle its state between alive and dead.
// - This allows the user to set the initial configuration of the grid
// ### 4. Implement Game Logic:
// - Each cell looks at its 8 neighbors and counts how many are alive.
// - If a cell is alive:
//   - It remains alive if it has 2 or 3 live neighbors; otherwise, it dies.
// - If a cell is dead:
//   - It becomes alive if it has exactly 3 live neighbors.
// - Implement a function that applies these rules to each cell to produce the next generation.
// ### 5. Control Iterations:
// - Add buttons to:
//   - Start/pause the game: This will continuously apply the game logic to produce new generations.
//   - Step forward: Apply the game logic once to produce the next generation.
//   - Step backward: This is trickier as you'll need to store previous states of the grid. Consider using an array or another data structure to keep track of past configurations.
//   - Reset: Clears the grid and allows the user to set a new initial configuration.
// ### 6. Configure Grid Size:
// - Add a button that prompts the user to specify the grid size (e.g., 20x20).
// - Once the size is entered, generate a new grid with the specified size. Ensure that the total space used remains constant, so the cells should adjust in size based on the grid dimensions.
// ### 7. (Optional) Enhancements:
// - Add a counter to display the current generation number.
// - Allow users to choose from predefined patterns or configurations (e.g., gliders, oscillators).
// - Implement a speed slider to control how fast new generations are produced.
// --------------------------------------------------
// PLANNING -----------------------------------------
// 1. Make all the cells for the grid
// 2. Place event listeners in each cell for clicks
// --------------------------------------------------

const gridContainer = document.querySelector(".grid-container");
const gridNodes = gridContainer.childNodes;
const range = document.querySelector(".range");
const forwardStep = document.querySelector('.step-forward-btn');
const startStop = document.querySelector('.start-stop-btn');
const reset = document.querySelector('.reset-btn');
const generation = document.querySelector('.generation-text');
const stateText = document.querySelector('.state-text');

let gameRunning = false;
let intervalId;
let aliveCells = [];
let generationNum = 0;

// FUNCTIONS

createGrid(range.value); //initializes grid to range value

function createGrid(size) {
    generationNum = 0;
    generation.textContent = "Generation: " + generationNum;
    // clear the grid for starter so it doesn't accumulate cells endlesly
    gridContainer.innerHTML = ""; //safe because isn't dynamic content

    // set styling for grid container with columns*rows size,
    // using container.style.gridTemplateRows/Columns, doesn't need ';'
    gridContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    // If game is running stop it
    if (gameRunning === true) {
        gameRunning = false;
        clearInterval(intervalId);
    }

    // Loop for creating all the cells for the grid
    for (let i = 0; i < size*size; i++) {
        const cell = document.createElement('div');
        gridContainer.appendChild(cell);
        cell.classList.add('cell', 'dead');
    }
    aliveCells = [];
}

function toggleCellState(event) {
    // changes cell background, which is meant to show state
    // alive = white; dead = black;
    // ternary operator `condition ? valueIfTrue : valueIfFalse`
    let currentCell = event.target;
    // currentCell.style.backgroundColor = 
    // currentCell.style.backgroundColor === 'black' ?
    // 'white' : 'black';
    if (currentCell.classList.contains('dead')) {
        currentCell.classList.remove('dead');
        currentCell.classList.add('alive');
        // keeping track of alive cells
        aliveCells.push(currentCell);
    } else if (currentCell.classList.contains('alive')) {
        currentCell.classList.remove('alive');
        currentCell.classList.add('dead');
        // keeping track of alive cells
        aliveCells.splice(aliveCells.indexOf(currentCell), 1);
    }
}

function gridTo2DArray(nodelist) {
    // 2D array with DOM nodes
    let gridArray = []; 
    // copy of gridArray with simple values (1=alive, 0=dead)
    let simpleGridArray = []; 
    for (let i = 0; i < range.value; i++) {
        let row = [];
        let simpleRow = [];
        for (let j = 0; j < range.value; j++) {
            let index = i * range.value + j;
            row.push(nodelist[index]); // index: row * size + column
            if (nodelist[index].classList.contains('alive')) {
                simpleRow.push(1);
            } else if (nodelist[index].classList.contains('dead')) {
                simpleRow.push(0);
            }
        }
        gridArray.push(row);
        simpleGridArray.push(simpleRow);
    }
    return [gridArray, simpleGridArray];
}

function elementIn2DArray(array2D, element) {
    let elementCoordinates = [];
    for (let i = 0; i < array2D.length; i++) {
        // iterate through rows
        for (let j= 0; j < array2D.length; j++) {
            // iterate within rows
            if (element === array2D[i][j]) {
                elementCoordinates.push(i, j);
            }
        }
    }
    return elementCoordinates; // index starting from 0
}

function getNeighbors(nodelist) {
    let [gridOfNodes2D, gridSimpleValues] = gridTo2DArray(nodelist);
    let neighbors = [];
    let neighborDirections = [
        // this will help change indexes of alive cells
        // within gridArray to get neighbors
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1], //gap simbolize cell location
        [1, -1], [1, 0], [1, 1]
    ];

    for (let i = 0; i < nodelist.length; i++) {
        let [currentX, currentY] = elementIn2DArray(gridOfNodes2D, nodelist[i]);
        let currentNeighbors = [];
        for (const [dirX, dirY] of neighborDirections) {
            let neighborX = currentX + dirX;
            let neighborY = currentY + dirY;

            // checks if cell is inside grid
            if (neighborX >= 0 && neighborX < range.value &&
                neighborY >= 0 && neighborY < range.value) {
                    currentNeighbors.push(gridOfNodes2D[neighborX][neighborY])
                }
        }
        neighbors.push(currentNeighbors);
    }
    // returns array of arrays, each contains the neighbors of a
    // corresponding cell from every cell in nodelist (gridOfNodes2D) 
    return neighbors; 
}

function updateGrid(nodelist) {
    // updates the state of the grid
    // Each cell looks at its 8 neighbors and counts how many are alive:
    // If (cell === alive)
    // - if (aliveNeighbors === 2||3) {cell = alive} else {cell = dead}
    // If (cell === dead)
    // - if (aliveNeighbors === 3) {cell = alive}
    let [gridOfNodes2D, gridSimpleValues] = gridTo2DArray(nodelist);
    let everyCellNeighbors = getNeighbors(nodelist); //array with neighbors for each cell (length = total num of cells)
    generationNum++;
    generation.textContent = "Generation: " + generationNum; 

    for (let i = 0; i < gridNodes.length; i++) {
        // iterates over every node in the grid 
        // (nodelist.length === everyCellNeighbors.length)
        let aliveNeighborsCount = 0;
        let [currentCellX, currentCellY] = elementIn2DArray(gridOfNodes2D, nodelist[i]); // coorinates
        for (let j = 0; j < everyCellNeighbors[i].length; j++) {
            // iterates over every cell within each array of neighbors
            if (everyCellNeighbors[i][j].classList.contains('alive')) {
                aliveNeighborsCount++;
            }
        }

        if (gridSimpleValues[currentCellX][currentCellY] === 1) { // cell alive
            if (!(aliveNeighborsCount === 2 || aliveNeighborsCount === 3)) {
                // cell hasn't 2 or 3 alive neighbors,
                // has to be updated to dead
                gridSimpleValues[currentCellX][currentCellY] = 0; // upated to dead in copy grid
                aliveCells.splice(aliveCells.indexOf(nodelist[i]), 1); // updates aliveCells
            } // else cell stays alive

        } else if (gridSimpleValues[currentCellX][currentCellY] === 0) { // cell dead
            if (aliveNeighborsCount === 3) {
            // cell turns alive

            // SIMULTANEOUS UPDATE USING COPY OF GRID gridSimpleValues TO CHECK STATES
            gridSimpleValues[currentCellX][currentCellY] = 1;
            aliveCells.push(nodelist[i]);
            }
        }
    }
    // Change values in original grid (gridOfNodes2D)
    for (let i = 0; i < gridOfNodes2D.length; i++) { 
        // iterates over each row (gridOfNodes2D.length === range.value)
        for (let j = 0; j < gridOfNodes2D.length; j++) {
            // iterates within each row (gridOfNodes2D.length === range.value)
            if (gridSimpleValues[i][j] === 1 && gridOfNodes2D[i][j].classList.contains('dead')) {
                // checks if gridOfNodes2D[i][j] need to be updated to alive
                gridOfNodes2D[i][j].classList.remove('dead');
                gridOfNodes2D[i][j].classList.add('alive');
                aliveCells.push(gridOfNodes2D[i][j]);
            } else if (gridSimpleValues[i][j] === 0 && gridOfNodes2D[i][j].classList.contains('alive')) {
                // checks if gridOfNodes2D[i][j] need to be updated to dead
                gridOfNodes2D[i][j].classList.remove('alive');
                gridOfNodes2D[i][j].classList.add('dead');
                aliveCells.splice(aliveCells.indexOf(gridOfNodes2D[i][j]), 1);
            }
        }
    }
}

// EVENT LISTENERS

range.addEventListener('input', function () {
    // This gets the value dinamically, updates on every change
    createGrid(range.value);
})

gridContainer.addEventListener('click', function (event) {
    // handle cells clicked through event delegation, events propagate
    // upwards, they bubble, and event delegation takes advantage of this
    toggleCellState(event);
})

forwardStep.addEventListener('click', function () {
    // having ...('click', updateGrid(gridNodes)) would have
    // executed updateGrid inmediately, while using anon func
    // calls it only when the event is triggered
    updateGrid(gridNodes);
});

startStop.addEventListener('click', function () {
    if (gameRunning === true) {
        gameRunning = false;
        clearInterval(intervalId);
    } else if (gameRunning === false) {
        gameRunning = true;
        intervalId = setInterval(updateGrid, 250, gridNodes);
    }
});

reset.addEventListener('click', function () {
    createGrid(range.value);
    if (gameRunning === true) {
        gameRunning = false;
        clearInterval(intervalId);
    }
    generationNum = 0;
    generation.textContent = "Generation: " + generationNum;
});
