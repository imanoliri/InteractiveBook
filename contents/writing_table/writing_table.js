// Fetch word counts asynchronously and only then create Grid
async function fetchCreateGrid() {
    try {
        const response = await fetch('./../../interactive_book_word_count.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const wordCount = await response.json();
        console.log("Word counts fetched:", wordCount);

        // Initialize the grid and text boxes with the processed words
        createGrid(wordCount);

    } catch (error) {
        console.error("Error fetching word counts:", error);
    }
}


const charsToIgnore = [" ", ",", "-", "—", ";", ".", "'", "`", "´"];
let numberOfColumns
let words
let speakLettersWhenDropped = true;
let speakWhenCorrectSolution = true;
let currentElement
let selectedLetter = null;

fetchCreateGrid()


function createGrid(wordCount) {


    
document.getElementById("checkSpeakLettersWhenDropped").checked = speakLettersWhenDropped;
document.getElementById("checkSpeakWordsWhenCorrect").checked = speakWhenCorrectSolution;


numberOfColumns = 7
words = getWordsForGrid(Object.keys(wordCount).map(cleanWord), numberOfColumns);
document.documentElement.style.setProperty('--number-of-columns', numberOfColumns);


// Add event listeners for drag-and-drop interactions
window.onload = function() {

    // DRAG AND DROP
    const allCells = document.querySelectorAll(".grid div");
    allCells.forEach(cell => {
        cell.addEventListener("dragover", allowDrop);
        cell.addEventListener("drop", drop);
        cell.addEventListener("dblclick", handleDoubleClick);
    });

    // CLICK AND CLICK
    const letterElements = document.querySelectorAll(".letter");
    letterElements.forEach(letter => {
        letter.addEventListener("click", handleClickLetter); // Add click event to letters
    });

    const droppableCells = document.querySelectorAll(".grid div:not(.letter):not(.delete-cell)");
    droppableCells.forEach(cell => {
        cell.addEventListener("click", handleClickCell); // Add click event to droppable cells
        cell.addEventListener("dblclick", handleDoubleClick); // Double-click to clear
    });

    // Make the first cell (trash bin) draggable
    const emptyCell = document.querySelector(".delete-cell");
    emptyCell.setAttribute("draggable", "true");
    emptyCell.addEventListener("dragstart", drag);
    fillTextBoxes();
};

}


function refreshChecboxes() {
    speakLettersWhenDropped = document.getElementById("checkSpeakLettersWhenDropped").checked;
    speakWhenCorrectSolution = document.getElementById("checkSpeakWordsWhenCorrect").checked;
}


function getWordsForGrid(words, numberOfColumns) {
    return words.filter(word => word.length <= numberOfColumns - 2);
}

function cleanWord(word) {
    return charsToIgnore.reduce((cleanedWord, sep) => {
        return cleanedWord.replace(new RegExp(`\\${sep}`, 'g'), '');
    }, word).toLowerCase();
}


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    if (ev.target.classList.contains("delete-cell")) {
        ev.dataTransfer.setData("text", ""); // Transfer an empty string for deletion
    } else {
        ev.dataTransfer.setData("text", ev.target.innerHTML);
    }
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    if (speakLettersWhenDropped) {
        speak(data)
    }

    if (data === "") {
        ev.target.innerHTML = ""; // Clear the content
    } else if (ev.target.innerHTML === "") {
        ev.target.innerHTML = data; // Place content if the target is empty
    }

    // Find the input box in the same row and call checkMatch
    let currentElement = ev.target;
    while (currentElement && !currentElement.classList.contains("word-input")) {
        currentElement = currentElement.nextElementSibling;
    }
    if (currentElement && currentElement.classList.contains("word-input")) {
        checkMatch(currentElement); // Call checkMatch on the found input box
    }
}


function handleClickLetter(ev) {
    // Check if a letter is already selected
    if (selectedLetter) {
        selectedLetter.classList.remove("selected"); // Remove selection highlight
    }

    // Set the clicked letter as the selected letter
    selectedLetter = ev.target;
    selectedLetter.classList.add("selected"); // Highlight the selected letter
}

function handleClickCell(ev) {
    if (selectedLetter && ev.target.innerHTML === "") { // Only proceed if a letter is selected and the cell is empty
        ev.target.innerHTML = selectedLetter.innerHTML; // Place the selected letter in the cell
        selectedLetter.classList.remove("selected"); // Remove selection highlight
        selectedLetter = null; // Reset the selected letter

        // Find the input box in the same row and call checkMatch
        let currentElement = ev.target;
        while (currentElement && !currentElement.classList.contains("word-input")) {
            currentElement = currentElement.nextElementSibling;
        }
        if (currentElement && currentElement.classList.contains("word-input")) {
            checkMatch(currentElement); // Call checkMatch on the found input box
        }
    }
}


// Function to clear the content of a cell on double-click
function handleDoubleClick(ev) {
    ev.target.innerHTML = ""; // Clear content on double-click

    // Find the input box in the same row and call checkMatch
    let currentElement = ev.target;
    while (currentElement && !currentElement.classList.contains("word-input")) {
        currentElement = currentElement.nextElementSibling;
    }
    if (currentElement && currentElement.classList.contains("word-input")) {
        checkMatch(currentElement); // Call checkMatch on the found input box
    }
}

// Function to clear all droppable cells
function clearAllCells() {
    const droppableCells = document.querySelectorAll(".grid div:not(.letter):not(.delete-cell)");
    droppableCells.forEach(cell => {
        cell.innerHTML = ""; // Clear the content of each droppable cell
    });
}

// Function to check for matches and convert to uppercase
function checkMatch(input) {
    input.value = input.value.toUpperCase(); // Convert input to uppercase

    // Get all the cells in the same row by traversing backwards from the input
    currentElement = input.previousElementSibling;
    const rowCells = [];

    // Traverse backwards until we reach the consonant letter at the start of the row
    while (currentElement && !currentElement.classList.contains("letter")) {
        if (!currentElement.classList.contains("delete-cell")) {
            rowCells.unshift(currentElement.textContent); // Collect cell content
        }
        currentElement = currentElement.previousElementSibling;
    }

    // Construct the word from the row cells
    const constructedWord = rowCells.join("");

    // Check if the constructed word matches the input value
    if (constructedWord === input.value) {
        input.style.backgroundColor = "lightgreen"; // Light up the input if it matches
        if (speakWhenCorrectSolution) {
            speak(constructedWord)
        }

    } else {
        input.style.backgroundColor = ""; // Remove background color if it doesn't match
    }
}

// Function to fill text boxes with random words from the words array
function fillTextBoxes() {
    // Get all word-input elements
    const textInputs = document.querySelectorAll(".word-input");
    const numberOfWords = Math.min(words.length, textInputs.length);
    
    // Shuffle the words array and take the first numberOfWords items
    const shuffledWords = words.sort(() => 0.5 - Math.random()).slice(0, numberOfWords);

    // Fill the text boxes with the selected words
    shuffledWords.forEach((word, index) => {
        textInputs[index].value = word.toUpperCase();
    });
}

function speak(text, lang = 'english') {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}
