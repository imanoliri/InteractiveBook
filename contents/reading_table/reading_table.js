function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    if (ev.target.classList.contains("delete-cell")) {
        ev.dataTransfer.setData("text", "");
    } else {
        ev.dataTransfer.setData("text", ev.target.innerHTML);
    }
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");

    if (data === "") {
        ev.target.innerHTML = "";
    } else if (ev.target.innerHTML === "") {
        ev.target.innerHTML = data;
    }
}

// Function to clear the content of a cell on double-click
function clearCell(ev) {
    if (ev.target.innerHTML !== "") {
        ev.target.innerHTML = "";
    }
}

// Add event listeners to all droppable cells
window.onload = function() {
    const droppableCells = document.querySelectorAll(".grid div:not(.letter)");
    droppableCells.forEach(cell => {
        cell.addEventListener("dragover", allowDrop);
        cell.addEventListener("drop", drop);
        cell.addEventListener("dblclick", clearCell);
    });

    // Make the first cell (1,1 coordinates) draggable and give it a class for styling
    const emptyCell = document.querySelector(".grid div:first-child");
    emptyCell.classList.add("delete-cell");
    emptyCell.setAttribute("draggable", "true");
    emptyCell.addEventListener("dragstart", drag);
};
