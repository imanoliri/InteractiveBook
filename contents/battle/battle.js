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
    unitTypes = defineUnitTypes();
    networkConfigs = definenetworkConfigs(meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork)

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
    network = e.target.id
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

function createPairs(element, list) {
    // Initialize an empty array to store the pairs
    let pairs = [];

    // Loop through each item in the list and create a pair
    list.forEach(item => {
        pairs.push([element, item]);
    });

    return pairs; // Return the array of pairs
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


function defineUnitTypes() {
    return {
        M: { name: 'melee', color: 'red', movementNetworks: [meleeNetwork], attackNetworks: [meleeNetwork], combatHandler: handleMeleeCombat },
        A: { name: 'archer', color: 'green', movementNetworks: [meleeNetwork], attackNetworks: [meleeNetwork, archerNetwork], combatHandler: handleArcherCombat },
        S: { name: 'siege', color: 'white', movementNetworks: [meleeNetwork], attackNetworks: [meleeNetwork, archerNetwork, siegeNetwork], combatHandler: handleSiegeCombat },
        R: { name: 'monster', color: 'plum', movementNetworks: [meleeNetwork], attackNetworks: [meleeNetwork], combatHandler: handleMonsterCombat },
        V: { name: 'cavalry', color: 'yellow', movementNetworks: [meleeNetwork, cavalryNetwork], attackNetworks: [meleeNetwork, cavalryNetwork], combatHandler: handleCavalryCombat },
        F: { name: 'flier', color: 'blue', movementNetworks: [meleeNetwork, flierNetwork], attackNetworks: [meleeNetwork, flierNetwork], combatHandler: handleMeleeCombat }
    }
}


function definenetworkConfigs(meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork) {
    // Create SVG element for lines
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    battlefield.appendChild(svg);

    // Set the focal point to the center of the page
    let maxNodesX = Math.max(...nodes.map(node => node.x)) * nodeSize;
    let maxNodesY = Math.max(...nodes.map(node => node.y)) * nodeSize;
    const focalPointX = maxNodesX / 2;
    const focalPointY = maxNodesY / 2;


    networkConfigs = {
        meleeNetwork: {
            checkbox: checkboxMeleeNetwork,
            svgConfig: {
                networkType: "meleeNetwork",
                network: meleeNetwork,
                color: "red",
                width: nodeSize / 10,
                dashArray: "",
                curvedLine: false
            }
        },
        archerNetwork: {
            checkbox: checkboxArcherNetwork,
            svgConfig: {
                networkType: "archerNetwork",
                network: archerNetwork,
                color: "green",
                width: nodeSize / 10,
                dashArray: "10,10",
                curvedLine: false
            }
        },
        flierNetwork: {
            checkbox: checkboxFlierNetwork,
            svgConfig: {
                networkType: "flierNetwork",
                network: flierNetwork,
                color: "blue",
                width: nodeSize / 300,
                dashArray: "",
                curvedLine: true,
                focalPointX: focalPointX,
                focalPointY: focalPointY,
                curvatureStrength: 150
            }
        },
        cavalryNetwork: {
            checkbox: checkboxCavalryNetwork,
            svgConfig: {
                networkType: "cavalryNetwork",
                network: cavalryNetwork,
                color: "yellow",
                width: nodeSize / 30,
                dashArray: "",
                curvedLine: true,
                focalPointX: focalPointX,
                focalPointY: focalPointY,
                curvatureStrength: 150
            }
        },
        siegeNetwork: {
            checkbox: checkboxSiegeNetwork,
            svgConfig: {
                networkType: "siegeNetwork",
                network: siegeNetwork,
                color: "white",
                width: nodeSize / 10,
                dashArray: "10,25",
                curvedLine: false
            }
        }
    };
    return networkConfigs
}


// DRAW functions
function drawAll() {
    drawNodes()
    drawMobileElements()
    drawNetworkConnections()
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

function drawNetworkConnections() {
    Object.entries(networkConfigs).forEach(([key, value]) => updateDrawNetwork(key, value));
}

function updateDrawNetwork(network, networkConfig) {
    document.querySelectorAll(`.${network}-border-line`).forEach(line => line.remove());
    document.querySelectorAll(`.${network}-line`).forEach(line => line.remove());

    if (networkConfig['checkbox'].checked) {
        createConnections(
            networkConfig['svgConfig']
        );

    } else {
        document.querySelectorAll(`.${network}-border-line`).forEach(line => line.remove());
        document.querySelectorAll(`.${network}-line`).forEach(line => line.remove());
    }

}

function createConnections({ networkType, network, color, width, dashArray, curvedLine, focalPointX, focalPointY, curvatureStrength }) {
    network.forEach(pair => {
        const node1 = nodes.find(node => node.id === pair[0]);
        const node2 = nodes.find(node => node.id === pair[1]);
        if (node1 && node2) {
            drawLine(networkType,
                nodeXOffset + node1.x * nodeSize + nodeSize / 2, nodeYOffset + node1.y * nodeSize + nodeSize / 2,
                nodeXOffset + node2.x * nodeSize + nodeSize / 2, nodeYOffset + node2.y * nodeSize + nodeSize / 2,
                color, width, dashArray, curvedLine, focalPointX, focalPointY, curvatureStrength
            );
        }
    });
}

function drawLine(networkType, x1, y1, x2, y2, color, width, dashArray, curvedLine = false, curvatureFocalPointX, curvatureFocalPointY, curvatureStrength) {
    if (curvedLine) {
        // If curvedLine is true, use the drawCurvedLine function
        drawCurvedLine(networkType, x1, y1, x2, y2, color, width, dashArray, curvatureFocalPointX, curvatureFocalPointY, curvatureStrength);
    } else {

        // Draw a thicker black line as the border
        const borderLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        borderLine.setAttribute("class", `border-line ${networkType}-border-line`);
        borderLine.setAttribute("x1", x1);
        borderLine.setAttribute("y1", y1);
        borderLine.setAttribute("x2", x2);
        borderLine.setAttribute("y2", y2);
        borderLine.setAttribute("stroke", "black");
        borderLine.setAttribute("stroke-width", `${width}`);
        borderLine.setAttribute("stroke-linecap", "round");
        borderLine.setAttribute("stroke-dasharray", dashArray);
        svg.appendChild(borderLine);

        // Draw the colored line on top
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("class", `line ${networkType}-line`);
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", `${width / 2}`);
        line.setAttribute("stroke-linecap", "round");
        line.setAttribute("stroke-dasharray", dashArray);
        svg.appendChild(line);
    }
}

function drawCurvedLine(networkType, x1, y1, x2, y2, color, width, dashArray, focalPointX, focalPointY, curvatureStrength = 100) {
    // Calculate the midpoint of the line
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    // Calculate the direction vector from the focal point to the midpoint
    let directionX = midX - focalPointX;
    let directionY = midY - focalPointY;

    // Normalize the direction vector to get a unit vector
    const length = Math.sqrt(directionX * directionX + directionY * directionY);
    if (length !== 0) { // Avoid division by zero
        directionX /= length;
        directionY /= length;
    }

    // Adjust the control point to bend the line away from the focal point
    const controlX = midX + curvatureStrength * directionX;
    const controlY = midY + curvatureStrength * directionY;

    // Create an SVG path element for the curved line
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;
    path.setAttribute("class", `border-line ${networkType}-border-line`);
    path.setAttribute("d", d);
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", `${width}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-dasharray", dashArray);

    // Draw a thicker black path as the border
    const borderPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    borderPath.setAttribute("class", `line ${networkType}-line`);
    borderPath.setAttribute("d", d);
    borderPath.setAttribute("stroke", "black");
    borderPath.setAttribute("stroke-width", `${width / 2}`);
    borderPath.setAttribute("fill", "none");
    borderPath.setAttribute("stroke-dasharray", dashArray);
    svg.appendChild(borderPath);

    // Append the colored curved line
    svg.appendChild(path);
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
        if (unitType === 'M') {
            networksToUse = [meleeNetwork];
        } else if (unitType === 'A') {
            networksToUse = [meleeNetwork, archerNetwork];
        } else if (unitType === 'F') {
            networksToUse = [meleeNetwork, flierNetwork];
        } else if (unitType === 'S') {
            networksToUse = [meleeNetwork, siegeNetwork];
        } else if (unitType === 'R') {
            networksToUse = [meleeNetwork];
        } else if (unitType === 'V') {
            networksToUse = [meleeNetwork, cavalryNetwork];
        }
    }

    // Find and highlight all reachable nodes for each network
    networksToUse.forEach(network => {
        const accessibleNodes = network
            .filter(pair => pair[0] === nodeId || pair[1] === nodeId)
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
let clickedUnit = null;

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
    console.log(actionUnitId)
    console.log(units)
    const actionUnit = units.find(unit => unit.id === actionUnitId);
    console.log(actionUnit)

    // get target unit from target Node
    console.log(targetNodeId)
    const targetUnit = units.find(unit => unit.node === targetNodeId);
    console.log(targetUnit)

    // If there's a target unit, handle combat or swapping
    if (targetUnit) {
        if (actionUnit.team === targetUnit.team) {
            // Swap the units
            handleSwap(actionUnit, targetUnit)
        } else {
            // Enemy unit: initiate combat
            units = handleCombat(actionUnit, targetUnit, actionUnit.node, targetUnit.node, units);
        }
    } else if (targetNodeId) {
        // If there is a target node, and no target unit on it, move unit
        handleMove(actionUnit, actionUnit.node, targetNodeId);
    }

    drawMobileElements(nodes, units, meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork, nodeSize);

}

// Add click event listeners to units and nodes
function addClickEventListeners() {
    const unitCircles = document.querySelectorAll(".unit-circle");
    unitCircles.forEach(circle => {
        circle.addEventListener("click", handleClick);
    });

    const nodeElements = document.querySelectorAll(".node");
    nodeElements.forEach(node => {
        node.addEventListener("click", handleClick);
    });
}


// MOVEMENT logic
function handleMove(u, x, y) {
    console.log('handleMove')
    const draggedUnitIdInt = parseInt(u.id);
    if (unitCanMove(u, x, y)) {
        writeToLog(`\nmove unit ${draggedUnitIdInt} from node:${x} -> node:${y}`)
        u.node = y;
    } else {
        writeToLog(`cannot move unit ${draggedUnitIdInt} from node:${x} -> node:${y}`)
    }
}


function handleSwap(u, v) {
    if (unitCanMove(u, u.node, v.node) & unitCanMove(v, v.node, u.node)) {
        const tempNode = u.node;
        u.node = v.node;
        v.node = tempNode;
        writeToLog(`\nSwapped unit:${u.id} <-> unit:${v.id}`);
    } else {
        writeToLog(`\nCannot swap unit:${u.id} <-> unit:${v.id}`);
    }
}
function unitCanMove(u, x, y) {
    console.log(unitTypes)
    console.log(u.type)
    for (const movementNetwork of unitTypes[u.type]["movementNetworks"]) {
        if (networkContainsConnection(movementNetwork, x, y)) {
            return true
        }
    }
    return false
}

function networkContainsConnection(network, x, y) {
    return network.some(pair => pair[0] === x && pair[1] === y);
}



// COMBAT logic
function handleCombat(u, v, x, y, units) {
    console.log('handleCombat')
    if (unitCanAttack(u, x, y)) {
        units = unitTypes[u.type]["combatHandler"](u, v, x, y, units)
        return units.filter(u => u.health > 0)
    } else {
        writeToLog('cannot attack')
        return units
    }
}

function unitCanAttack(u, x, y) {
    for (const attackNetwork of unitTypes[u.type]["attackNetworks"]) {
        if (networkContainsConnection(attackNetwork, x, y)) {
            return true
        }
    }
    return false
}

function handleMeleeCombat(attacker, defender, x, y, units) {
    while (attacker.health > 0 && defender.health > 0) {
        // Attacker attacks first
        let damage = Math.max(1, attacker.attack_melee - defender.defense);
        defender.health -= damage;
        if (defender.health <= 0) {
            writeToLog(`Attacker wins with ${attacker.health} health left.`)
            // Defender is defeated: move attacker to node, remove defender, stop combat
            attacker.node = defender.node
            return units.filter(u => u.id !== defender.id);
        }

        // Defender attacks back
        damage = Math.max(1, defender.attack_melee - attacker.defense);
        attacker.health -= damage;
        if (attacker.health <= 0) {
            writeToLog(`Defender wins with ${defender.health} health left.`)
            // Attacker is defeated: remove attacker, stop combat
            return units.filter(u => u.id !== attacker.id);
        }
    }
}

function handleArcherCombat(attacker, defender, x, y, units) {
    let damage = Math.max(1, attacker.attack_range - defender.defense);
    writeToLog(`Archer deals ${damage} damage.`)
    defender.health -= damage;
    if (defender.health <= 0) {
        writeToLog('Archer kills target.')
        // Defender is defeated
        units = units.filter(u => u.id !== defender.id);
    } else {
        writeToLog(`Target has ${defender.health} health left.`)
    }
    return units
}

function handleSiegeCombat(attacker, defender, x, y, units) {
    let damage = Math.max(1, attacker.attack_range - defender.defense);
    writeToLog(`Siege deals ${damage} damage.`)
    defender.health -= damage;
    if (defender.health <= 0) {
        writeToLog('Siege kills target.')
        // Defender is defeated
        units = units.filter(u => u.id !== defender.id);
    } else {
        writeToLog(`Target has ${defender.health} health left.`)
    }
    return units
}

function handleMonsterCombat(attacker, defender, x, y, units) {
    attacker.health += 1;
    defender.health -= 1;
    writeToLog(`Monster eats 1 health from defender.`)
    return handleMeleeCombat(attacker, defender, x, y, units)
}


function handleCavalryCombat(attacker, defender, x, y, units) {
    defender.health -= attacker.attack_melee;
    // Defender killed with first attack
    if (defender.health <= 0) {
        writeToLog(`Attacker wins with ${attacker.health} health left.`)
        // Defender is defeated: move attacker to node, remove defender, stop combat
        attacker.node = defender.node
        return units.filter(u => u.id !== defender.id);
    }
    return handleMeleeCombat(attacker, defender, x, y, units)
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


