import { defineUnitTypes, handleMove, handleSwap, handleCombat } from './units.js';
import { definenetworkConfigs, drawNetworkConnections, updateDrawNetwork } from './networks.js';

async function fetchBattlesToChoose() {
    try {
        const response_battles = await fetch('battles.json');
        battles = await response_battles.json();
        console.log("Battles fetched:", battles)
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}

async function fetchBattleData() {
    try {

        const response_nodes = await fetch(`${selectedBattleDir}/auto_data/nodes.json`);
        const response_units = await fetch(`${selectedBattleDir}/auto_data/units.json`);
        const response_meleeNetwork = await fetch(`${selectedBattleDir}/auto_data/melee_interactions.json`);
        const response_archerNetwork = await fetch(`${selectedBattleDir}/auto_data/archer_interactions.json`);
        const response_flierNetwork = await fetch(`${selectedBattleDir}/auto_data/flier_interactions.json`);
        const response_siegeNetwork = await fetch(`${selectedBattleDir}/auto_data/siege_interactions.json`);
        const response_cavalryNetwork = await fetch(`${selectedBattleDir}/auto_data/cavalry_interactions.json`);


        nodes = await response_nodes.json();
        console.log("Nodes fetched:", nodes);
        units = await response_units.json();
        console.log("Units fetched:", units);

        meleeNetwork = await response_meleeNetwork.json();
        console.log("meleeNetwork fetched:", meleeNetwork);
        archerNetwork = await response_archerNetwork.json();
        console.log("archerNetwork fetched:", archerNetwork);
        flierNetwork = await response_flierNetwork.json();
        console.log("flierNetwork fetched:", flierNetwork);
        siegeNetwork = await response_siegeNetwork.json();
        console.log("siegeNetwork fetched:", siegeNetwork);
        cavalryNetwork = await response_cavalryNetwork.json();
        console.log("cavalryNetwork fetched:", cavalryNetwork);

    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}

let battles
let selectedBattle
let selectedBattleDir
let battle_metadata

let deploymentLevel
let nodes
let units

let meleeNetwork
let archerNetwork
let flierNetwork
let siegeNetwork
let cavalryNetwork

let svg
let unitTypes
let networkConfigs

// battle_metadata
let battleName
let nodeSize
let nodeXOffset
let nodeYOffset
let nodeXScale
let nodeYScale
let battleMapFile
let battleMapInfoHTML


// Get HTML elements
const battlefield = document.getElementById('battlefield')
const dropdown = document.getElementById('battleDropdown');
const slider = document.getElementById("difficultySlider");
const sliderValue = document.getElementById("sliderValue");
const setDifficultyButton = document.getElementById("setDifficultyButton");
const logTextbox = document.getElementById("logTextbox");
logTextbox.value = ""
const checkboxMeleeNetwork = document.getElementById('meleeNetwork');
const checkboxArcherNetwork = document.getElementById('archerNetwork');
const checkboxFlierNetwork = document.getElementById('flierNetwork');
const checkboxSiegeNetwork = document.getElementById('siegeNetwork');
const checkboxCavalryNetwork = document.getElementById('cavalryNetwork');


const teamColors = {
    1: "green",
    2: "orange",
    3: "blueviolet",
    4: "lightseagreen",
    5: "lightgreen",
    6: "maroon"
};


document.addEventListener('DOMContentLoaded', () => {
    fetchBattlesToChoose().then(defineHtmlElementsCallbacks);
});

function createBattle() {

    getMetadata()

    // Nodes & units
    deploymentLevel = parseInt(slider.value, 10);
    nodes = createNodes(nodes);
    units = deployUnits(units, deploymentLevel);

    // Set CSS variables
    setCSSVariables()

    // Define unit types and networks
    unitTypes = defineUnitTypes(meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork);
    networkConfigs = definenetworkConfigs(svg, nodes, nodeSize, nodeXOffset, nodeYOffset, checkboxMeleeNetwork, checkboxArcherNetwork, checkboxFlierNetwork, checkboxCavalryNetwork, checkboxSiegeNetwork, meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork)

    drawAll()
}

function getMetadata() {
    battleName = battle_metadata["battle_name"]
    nodeSize = configNodeSizeToPx(battle_metadata["nodeSize"]);
    nodeXOffset = configNodeSizeToPx(battle_metadata["nodeXOffset"]);
    nodeYOffset = configNodeSizeToPx(battle_metadata["nodeYOffset"]);
    nodeXScale = battle_metadata["nodeXScale"];
    nodeYScale = battle_metadata["nodeYScale"];
    battleMapFile = `${selectedBattle}/${battle_metadata["battle_map_file"]}`;
    battleMapInfoHTML = `${selectedBattle}/${battle_metadata["battle_map_info_html"]}`;

    // Update HTML elements
    document.title = battleName;
    document.querySelector("h1").textContent = battleName;
    document.documentElement.style.setProperty('--battle-map-file', `url(${battleMapFile})`);
}


function defineHtmlElementsCallbacks() {
    dropdown.addEventListener('change', handleBattleChange);
    dropdown.addEventListener('change', () => {
        fetchBattleData().then(createBattle);
    });
    battles.forEach(battle => {
        const option = document.createElement('option');
        option.value = battle;
        option.textContent = battle;
        dropdown.appendChild(option);
    });



    sliderValue.textContent = parseInt(slider.value, 10);
    slider.addEventListener("input", function () {
        sliderValue.textContent = slider.value;
    });
    setDifficultyButton.addEventListener("click", () => { fetchBattleData().then(createBattle); });
    checkboxMeleeNetwork.addEventListener('change', toggleNetwork);
    checkboxArcherNetwork.addEventListener('change', toggleNetwork);
    checkboxFlierNetwork.addEventListener('change', toggleNetwork);
    checkboxSiegeNetwork.addEventListener('change', toggleNetwork);
    checkboxCavalryNetwork.addEventListener('change', toggleNetwork);
}

async function handleBattleChange(event) {
    selectedBattle = event.target.value;
    selectedBattleDir = `${selectedBattle}`

    if (!selectedBattle) {
        detailsDiv.textContent = 'Select a battle to view details.';
        return;
    }

    try {
        const response = await fetch(`${selectedBattleDir}/battle_metadata.json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch metadata for ${selectedBattle}`);
        }
        battle_metadata = await response.json();
        console.log("Battle metadata fetched:", battle_metadata);
    } catch (error) {
        console.error(`Error loading metadata for ${selectedBattle}:`, error);
    }
}

function toggleNetwork(e) {
    const network = e.target.id
    updateDrawNetwork(network, networkConfigs[network])
}


// CREATE functions
function createNodes(nodes) {
    return nodes
}


function deployUnits(units, deploymentLevel) {
    units = units.filter(unit => (unit.min_deployment <= deploymentLevel) & (deploymentLevel <= unit.max_deployment));
    return units
}

// HELPER functions
function writeToLog(message) {
    logTextbox.value = `${logTextbox.value}\n${message}`;
    logTextbox.scrollTop = logTextbox.scrollHeight;
}

function configNodeSizeToPx(vh) {
    return (vh / 100 / 1000) * window.innerHeight;
}


function setCSSVariables() {
    document.documentElement.style.setProperty('--node-size', `${nodeSize}px`);
    document.documentElement.style.setProperty('--unit-size', `${nodeSize}px`);
    document.documentElement.style.setProperty('--node-size-highlight', `${nodeSize * 1.2}px`);
    document.documentElement.style.setProperty('--unit-size-highlight', `${nodeSize * 1.2}px`);
}



// DRAW functions
function drawAll() {
    drawNodes()
    drawMobileElements()
    drawNetworkConnections(networkConfigs)
}

function drawMobileElements() {
    units = units.filter(u => u.health > 0);
    drawUnits(nodes, units, nodeSize, meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork);
    drawUnitsTable(units);
    updateHealthBar(units);

}

function drawNodes() {
    const existingNodes = document.querySelectorAll(".node");
    existingNodes.forEach(node => node.remove());
    nodes.forEach(node => {
        const div = document.createElement("div");
        div.classList.add("node");
        div.style.left = `${nodeXOffset + node.x * nodeSize * nodeXScale}px`;
        div.style.top = `${nodeYOffset + node.y * nodeSize * nodeYScale}px`;
        div.dataset.nodeId = node.id; // Assign the node ID as a data attribute

        // Create a tooltip to show unit details on hover
        const tooltip = document.createElement("div");
        tooltip.classList.add("node-tooltip");
        tooltip.innerHTML = `
            <strong>Node:</strong> ${node.id}<br>
            <strong>Coords:</strong> (${node.x},${node.y},${node.z})<br>
            <strong>Location:</strong> ${node.group_1 ?? ""} ${node.group_2 ?? ""} ${node.group_3 ?? ""}
        `;
        div.appendChild(tooltip);

        // Drag and drop callbacks
        div.addEventListener("dragover", handleDragOver);
        div.addEventListener("drop", (event) => { handleDrop(event, nodes, units, meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork, nodeSize); });
        div.addEventListener('mouseenter', (event) => { handleNodeHoverHighlightAccessibleUnitsNodes(event, units, meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork); });
        div.addEventListener('mouseleave', handleNodeLeaveHighlight);

        // Click and click callbacks
        div.addEventListener('click', (event) => { handleClick(event, nodes, units, meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork, nodeSize); });

        battlefield.appendChild(div);
    });
}

function drawUnits(nodes, units, nodeSize, meleeNetwork, archerNetwork, flierNetwork) {
    const existingUnits = document.querySelectorAll(".unit-circle");
    existingUnits.forEach(unit => unit.remove());
    units.forEach(unit => {
        const node = nodes.find(n => n.id === unit.node);
        if (!node) return; // Skip if the node is not found

        // Create the circular div for the unit
        const circle = document.createElement("div");
        circle.classList.add("unit-circle", `team-${unit.team}`, `type-${unit.type}`);
        circle.textContent = unit.id;
        circle.setAttribute("draggable", "true"); // Make the unit circle draggable
        const teamNumber = parseInt(unit.team);
        if (teamColors[teamNumber]) {
            circle.style.backgroundColor = teamColors[teamNumber];
        }

        // Position the circle at the node's coordinates
        circle.style.left = `${nodeXOffset + node.x * nodeSize * nodeXScale}px`;
        circle.style.top = `${nodeYOffset + node.y * nodeSize * nodeYScale}px`;

        // Set unit ID as a data attribute for reference
        circle.dataset.unitId = unit.id;
        circle.dataset.nodeId = unit.node;
        circle.dataset.type = unit.type;

        // Create a tooltip to show unit details on hover
        const tooltip = document.createElement("div");
        tooltip.classList.add("unit-tooltip");
        tooltip.innerHTML = `
            <strong>ID:</strong> ${unit.id}<br>
            <strong>Team:</strong> ${unit.team}<br>
            <strong>Name:</strong> ${unit.name}<br>
            <strong>Type:</strong> ${unit.type}<br>
            <strong>Attack Melee:</strong> ${unit.attack_melee}<br>
            <strong>Attack Range:</strong> ${unit.attack_range}<br>
            <strong>Defense:</strong> ${unit.defense}<br>
            <strong>Health:</strong> ${unit.health}<br>
            <strong>Node:</strong> ${node.id}<br>
            <strong>Coords:</strong> (${node.x}, ${node.y}, ${node.z})<br>
            <strong>Location:</strong> ${node.group_1 ?? ""} ${node.group_2 ?? ""} ${node.group_3 ?? ""}
        `;
        circle.appendChild(tooltip);
        battlefield.appendChild(circle); // Append the unit circle to the battlefield

        // Drag and drop callbacks
        circle.addEventListener('mouseenter', (event) => { handleNodeHoverHighlightAccessibleUnitsNodes(event, units, meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork); });
        circle.addEventListener('mouseleave', handleNodeLeaveHighlight);
        circle.addEventListener("dragstart", handleDragStart);
        circle.addEventListener("dragover", handleDragOver);
        circle.addEventListener("drop", (event) => { handleDrop(event, nodes, units, meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork, nodeSize); });


        // Click and click callback
        circle.addEventListener("click", (event) => { handleClick(event, nodes, units, meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork, nodeSize); });

    });
}

function drawUnitsTable(units) {
    const tableBody = document.querySelector("#unitTable tbody");
    tableBody.innerHTML = ""; // Clear any existing table rows

    units.forEach(unit => {
        const row = document.createElement("tr");

        // Create non-editable cells for each property
        for (let key in unit) {
            const cell = document.createElement("td");
            cell.textContent = unit[key]; // Set the cell content

            if (key === 'team') { // Set team cell color
                const teamNumber = parseInt(cell?.textContent.trim());
                if (teamColors[teamNumber]) {
                    cell.style.backgroundColor = teamColors[teamNumber];
                }
            }

            row.appendChild(cell); // Append the cell to the row
        }

        tableBody.appendChild(row); // Append the row to the table body
    });
}

// BATTLE STATUS callbacks
function updateHealthBar(units) {
    const healthBar = document.getElementById("healthBar");
    healthBar.innerHTML = ""; // Clear previous content

    // Aggregate health points by team
    const teamHealth = {};
    let totalHealth = 0;

    units.forEach(unit => {
        if (unit.health > 0) {
            if (!teamHealth[unit.team]) {
                teamHealth[unit.team] = 0;
            }
            teamHealth[unit.team] += unit.health;
            totalHealth += unit.health;
        }
    });

    // Create a section for each team
    Object.keys(teamHealth).forEach(team => {
        const healthPercentage = (teamHealth[team] / totalHealth) * 100;
        const teamSection = document.createElement("div");
        teamSection.classList.add("team-section");
        teamSection.style.width = `${healthPercentage}%`;

        // Set a color for each team
        if (teamColors[team]) {
            teamSection.style.backgroundColor = teamColors[team];
        }

        healthBar.appendChild(teamSection);
    });
}


// HOVER callbacks
function handleNodeHoverHighlightAccessibleUnitsNodes(event, units, meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork) {
    let nodeId;
    let networksToUse = [];

    // Check if the hovered element is a node
    if (event.target.classList.contains('node')) {
        nodeId = parseInt(event.target.dataset.nodeId); // Get the ID of the hovered node
        networksToUse = [meleeNetwork]; // Use only the melee network for nodes
    } else {
        // If the hovered element is a unit, get the unit details
        const unitType = event.target.dataset.type; // Get the type of the hovered unit
        nodeId = parseInt(event.target.dataset.nodeId); // Get the ID of its node

        // Determine which networks to use based on unit type
        const moveNetworks = unitTypes[unitType]["movementNetworks"]
        const attackNetworks = unitTypes[unitType]["attackNetworks"]
        networksToUse = [...moveNetworks === null ? [] : moveNetworks, ...attackNetworks === null ? [] : attackNetworks]
    }

    // Find and highlight all reachable nodes for each network
    networksToUse.forEach(network => {
        const accessibleNodes = network
            .filter(pair => pair[0] === nodeId)
            .map(pair => (pair[0] === nodeId ? pair[1] : pair[0]));

        accessibleNodes.forEach(id => {
            // Check if there is a unit on the current node
            const unitOnNode = units.find(unit => unit.node === id);

            if (unitOnNode) {
                // If a unit is found, highlight the unit circle
                const unitCircleElement = document.querySelector(`[data-unit-id='${unitOnNode.id}']`);
                if (unitCircleElement) {
                    unitCircleElement.classList.add('highlight'); // Add highlight class to the unit circle
                }
            } else {
                // If no unit is found, highlight the node
                const nodeElement = document.querySelector(`[data-node-id='${id}']`);
                if (nodeElement) {
                    nodeElement.classList.add('highlight'); // Add highlight class to the node
                }
            }
        });
    });
}

function handleNodeLeaveHighlight() {
    // Remove highlight from all nodes
    document.querySelectorAll('.highlight').forEach(node => {
        node.classList.remove('highlight');
    });
}


// DRAG AND DROP callbacks
let draggedUnitId = null; // Variable to store the ID of the dragged unit --> THIS IS SHARED BETWEEN handleDragStart() and handleDrop()

function handleDragStart(event) {
    draggedUnitId = parseInt(event.target.dataset.unitId); // Store the ID of the dragged unit
    event.dataTransfer.effectAllowed = "move";

    // Hide the hover text (tooltip)
    const tooltip = event.target.querySelector('.unit-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none'; // Hide the tooltip
    }
}

function handleDragOver(event) {
    event.preventDefault(); // Allow dropping by preventing the default behavior
}

function handleDrop(event, nodes, units, meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork, nodeSize) {
    event.preventDefault();
    handleUnitAction(draggedUnitId, parseInt(event.target.dataset.nodeId), meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork, nodeSize)
}

// CLICK AND CLICK callbacks
let selectedUnitId = null; // Variable to store the ID of the selected unit

// Function to handle click on a unit
function handleClick(event, nodes, units, meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork, nodeSize) {
    // If a unit is already selected, the clicked unit is the target unit
    if (selectedUnitId) {
        handleUnitAction(selectedUnitId, parseInt(event.target.dataset.nodeId), meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork, nodeSize)
        selectedUnitId = null; // Reset the selected unit after using it
    } else {
        // If no unit is selected, select the clicked unit
        selectedUnitId = parseInt(event.target.dataset.unitId);
        writeToLog(`\nSelected unit: ${selectedUnitId}`);
    }
}


function handleUnitAction(actionUnitId, targetNodeId, meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork, nodeSize) {

    units = units.filter(u => u.health > 0);
    const actionUnit = units.find(unit => unit.id === actionUnitId);

    // get target unit from target Node
    const targetUnit = units.find(unit => unit.node === targetNodeId);

    // If there's a target unit, handle combat or swapping
    if (targetUnit) {
        if (actionUnit.team === targetUnit.team) {
            // Swap the units
            handleSwap(actionUnit, targetUnit, unitTypes)
        } else {
            // Enemy unit: initiate combat
            units = handleCombat(actionUnit, targetUnit, actionUnit.node, targetUnit.node, units, unitTypes);
        }
    } else if (targetNodeId) {
        // If there is a target node, and no target unit on it, move unit
        handleMove(actionUnit, actionUnit.node, targetNodeId, unitTypes);
    }

    drawMobileElements(nodes, units, meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork, nodeSize);

}





// Instructions Modal
document.getElementById("instructionsButton").addEventListener("click", function () {
    const modal = document.getElementById("instructionsModal");
    const instructionsText = document.getElementById("instructionsText");

    // Fetch the HTML file and insert its content into the modal
    fetch('battle_instructions.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            instructionsText.innerHTML = html; // Set the modal content
            modal.style.display = "flex";     // Show the modal
        })
        .catch(error => {
            console.error('Error loading', error);
            mapInfoText.innerHTML = `<p>Failed to load.</p>`;
            modal.style.display = "flex";
        });
});

document.getElementById("closeInstructionsModal").addEventListener("click", function () {
    document.getElementById("instructionsModal").style.display = "none";
});

// Map Info Modal
document.getElementById("mapInfoButton").addEventListener("click", function () {
    const modal = document.getElementById("mapInfoModal");
    const mapInfoText = document.getElementById("mapInfoText");

    // Fetch the HTML file and insert its content into the modal
    fetch(battleMapInfoHTML)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            mapInfoText.innerHTML = html; // Set the modal content
            modal.style.display = "flex";     // Show the modal
        })
        .catch(error => {
            console.error('Error loading', error);
            mapInfoText.innerHTML = `<p>Failed to load.</p>`;
            modal.style.display = "flex";
        });
});

document.getElementById("closeMapInfoModal").addEventListener("click", function () {
    document.getElementById("mapInfoModal").style.display = "none";
});


