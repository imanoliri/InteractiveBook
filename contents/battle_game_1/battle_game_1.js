
document.addEventListener("DOMContentLoaded", function () {

    // Get HTML elements
    const battlefield = document.getElementById("battlefield");
    const slider = document.getElementById("difficultySlider");
    const sliderValue = document.getElementById("sliderValue");
    const setDifficultyButton = document.getElementById("setDifficultyButton");
    const logTextbox = document.getElementById("logTextbox");
    logTextbox.value = ""

    // Add their listeners
    sliderValue.textContent =  parseInt(slider.value, 10);
    slider.addEventListener("input", function() {
        sliderValue.textContent = slider.value;
    });
    setDifficultyButton.addEventListener("click", function() {
        location.reload();
    });


    

    // Nodes & units
    let deploymentLevel = parseInt(slider.value, 10);
    let nodes = createNodes();
    let units = createUnits(deploymentLevel);

    
    // Networks
    let meleeNetwork = createMeleeNetwork();
    let archerNetwork = createArcherNetwork();
    let flierNetwork = createFlierNetwork();

    
    // Set CSS variables
    const numberNodes = nodes.length;
    const nodeSizePercentage = 100/Math.sqrt(numberNodes**2)
    let nodeSize = vhToPixels(`${nodeSizePercentage}vh`);
    setCSSVariables(nodeSizePercentage)

function setCSSVariables(nodeSizePercentage) {
    document.documentElement.style.setProperty('--node-size', `${nodeSizePercentage}vh`);
    document.documentElement.style.setProperty('--unit-size', `${nodeSizePercentage}vh`);
    document.documentElement.style.setProperty('--node-size-highlight', `${nodeSizePercentage*1.2}vh`);
    document.documentElement.style.setProperty('--unit-size-highlight', `${nodeSizePercentage*1.2}vh`);
}

    drawAll(nodes, units, meleeNetwork, archerNetwork, flierNetwork, nodeSize)
});


// CREATE functions
function createNodes() {
    let nodes = [
        { id: 1, x: 1, y: 14 }, { id: 2, x: 3, y: 14 },
        { id: 3, x: 9, y: 14 }, { id: 4, x: 12, y: 14 },
        { id: 5, x: 2, y: 12 }, { id: 6, x: 7, y: 12 },
        { id: 7, x: 11, y: 12 }, { id: 8, x: 3, y: 8 },
        { id: 9, x: 7, y: 8 }, { id: 10, x: 12, y: 8 },
        { id: 11, x: 5, y: 5 }, { id: 12, x: 9, y: 6 },
        { id: 13, x: 13, y: 5.5 }, { id: 14, x: 11.5, y: 4.5 },
        { id: 15, x: 15, y: 4 }, { id: 16, x: 13, y: 2 },
        { id: 17, x: 16, y: 1 }
    ]
    return invertYScale(nodes)
}

function invertYScale(nodes) {
    const maxY = Math.max(...nodes.map(node => node.y));
    return nodes.map(node => ({
        ...node,
        y: maxY - node.y + 1
    }));
}

function createUnits(deploymentLevel) {
    const dragonRiderHealth = 12 - 2 * Math.max((deploymentLevel - 2), 0);
    let units =  [
        { id: 1, team: 2, name: "Goblin Archer", type: "A", attack: 2, defense: 0, health: 4, node: 1, deployment: 1 },
        { id: 2, team: 2, name: "Goblin Warrior", type: "M", attack: 2, defense: 1, health: 4, node: 2, deployment: 1 },
        { id: 3, team: 2, name: "Goblin Archer", type: "A", attack: 2, defense: 0, health: 4, node: 3, deployment: 1 },
        { id: 4, team: 2, name: "Goblin Archer", type: "A", attack: 2, defense: 0, health: 4, node: 4, deployment: 1 },
        { id: 5, team: 2, name: "Goblin Warrior", type: "M", attack: 2, defense: 1, health: 4, node: 5, deployment: 1 },
        { id: 6, team: 2, name: "Goblin Warrior", type: "M", attack: 2, defense: 1, health: 4, node: 6, deployment: 1 },
        { id: 7, team: 2, name: "Goblin Warrior", type: "M", attack: 2, defense: 1, health: 4, node: 7, deployment: 1 },
        { id: 8, team: 2, name: "Goblin Warrior", type: "M", attack: 2, defense: 1, health: 4, node: 8, deployment: 2 },
        { id: 9, team: 2, name: "Goblin Warrior", type: "M", attack: 2, defense: 1, health: 4, node: 9, deployment: 2 },
        { id: 10, team: 2, name: "Goblin Warrior", type: "M", attack: 2, defense: 1, health: 4, node: 10, deployment: 2 },
        { id: 11, team: 1, name: "Dwarf Warrior", type: "M", attack: 2, defense: 1, health: 6, node: 11, deployment: 1 },
        { id: 12, team: 2, name: "Goblin Warrior", type: "M", attack: 2, defense: 1, health: 4, node: 12, deployment: 2 },
        { id: 13, team: 1, name: "Dwarf Warrior", type: "M", attack: 2, defense: 1, health: 6, node: 13, deployment: 1 },
        { id: 14, team: 1, name: "Dwarf Warrior", type: "M", attack: 2, defense: 1, health: 6, node: 14, deployment: 2 },
        { id: 15, team: 1, name: "Dwarf Archer", type: "A", attack: 2, defense: 0, health: 6, node: 15, deployment: 1 },
        { id: 16, team: 1, name: "Dwarf Archer", type: "A", attack: 2, defense: 0, health: 6, node: 16, deployment: 1 },
        { id: 17, team: 1, name: "Dragon Rider", type: "F", attack: 3, defense: 2, health: dragonRiderHealth, node: 17, deployment: 1 }
    ]
    units = units.filter(unit => unit.deployment <= deploymentLevel);
    return units
}

function createMeleeNetwork() {
    return [
        ...createPairs(1, [5, 2]),
        ...createPairs(2, [1, 5, 6, 3]),
        ...createPairs(3, [2, 6, 7, 4]),
        ...createPairs(4, [3, 7]),
        ...createPairs(5, [1, 2, 8]),
        ...createPairs(6, [2, 3, 9]),
        ...createPairs(7, [3, 4, 10]),
        ...createPairs(8, [5, 11, 9]),
        ...createPairs(9, [6, 8, 11, 12]),
        ...createPairs(10, [7, 12, 13]),
        ...createPairs(11, [8, 9, 12]),
        ...createPairs(12, [11, 9, 10, 13, 14]),
        ...createPairs(13, [10, 12, 14, 15]),
        ...createPairs(14, [12, 13, 16]),
        ...createPairs(15, [14, 13, 16, 17]),
        ...createPairs(16, [14, 13, 15, 17]),
        ...createPairs(17, [15, 16])
    ]
}

function createArcherNetwork() {
    return [
        [5, 6],
        [6, 5], [6, 7],
        [7, 6],
        [8, 9],
        [9, 8], [9, 10],
        [10, 9],
        ...createPairs(10, [14]),
        ...createPairs(12, [13]),
        ...createPairs(11, [14]),
        ...createPairs(14, [10, 15]),
        ...createPairs(13, [11, 12]),
        ...createPairs(15, [12, 10]),
        ...createPairs(16, [12, 10, 13])
    ]
}

function createFlierNetwork() {
    return [
        ...createPairs(1, [3, 4, 11, 12, 13, 14, 17]),
        ...createPairs(2, [4, 11, 12, 13, 14, 17]),
        ...createPairs(3, [1, 11, 12, 13, 14, 17]),
        ...createPairs(4, [1, 2, 11, 12, 13, 14, 17]),
        ...createPairs(11, [1, 2, 3, 4, 13, 14, 17]),
        ...createPairs(12, [1, 2, 3, 4, 17]),
        ...createPairs(13, [1, 2, 3, 4, 11, 17]),
        ...createPairs(14, [1, 2, 3, 4, 11, 17]),
        ...createPairs(17, [1, 2, 3, 4, 11, 12, 13, 14])
    ]
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

function vhToPixels(value) {
    // Extract the numerical part from the value (e.g., "30vh" -> 30)
    const numericValue = parseFloat(value);

    // Calculate the pixel equivalent using the window's inner height
    const pixels = (window.innerHeight * numericValue) / 100;
    return pixels;
}

// DRAW functions
function drawAll(nodes, units, meleeNetwork, archerNetwork, flierNetwork, nodeSize){
    
    // Set the focal point to the center of the page
    let maxNodesX = Math.max(...nodes.map(node => node.x)) * nodeSize;
    let maxNodesY = Math.max(...nodes.map(node => node.y)) * nodeSize;
    const focalPointX = maxNodesX / 2;
    const focalPointY = maxNodesY / 2;

    // Create SVG element for lines
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    battlefield.appendChild(svg);

    createConnections(svg, nodes, nodeSize, meleeNetwork, "red", nodeSize/10, "", 0, false);
    createConnections(svg, nodes, nodeSize, archerNetwork, "green", nodeSize/10, "10,10", 0, false);
    createConnections(svg, nodes, nodeSize, flierNetwork, "blue", nodeSize/300, "", 0, true, focalPointX, focalPointY, 150);

    drawNodes(nodes, units, nodeSize, meleeNetwork, archerNetwork, flierNetwork);
    drawUnits(nodes, units, nodeSize, meleeNetwork, archerNetwork, flierNetwork);
    drawUnitsTable(units);
    updateHealthBar(units);
    
}

function drawNodes(nodes, units, nodeSize, meleeNetwork, archerNetwork, flierNetwork) {
    nodes.forEach(node => {
        const div = document.createElement("div");
        div.classList.add("node");
        div.style.left = `${node.x * nodeSize}px`;
        div.style.top = `${node.y * nodeSize}px`;
        div.dataset.nodeId = node.id; // Assign the node ID as a data attribute

        // Add drag and drop event handlers for the nodes
        div.addEventListener("dragover", handleDragOver);
        div.addEventListener("drop", (event) => {handleDrop(event, nodes, units, meleeNetwork, archerNetwork, flierNetwork, nodeSize);});
        div.addEventListener('mouseenter', (event) => {handleNodeHoverHighlightAccessibleUnitsNodes(event, units, meleeNetwork, archerNetwork, flierNetwork);});
        div.addEventListener('mouseleave', handleNodeLeaveHighlight);

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

        // Position the circle at the node's coordinates
        circle.style.left = `${node.x * nodeSize}px`;
        circle.style.top = `${node.y * nodeSize}px`;

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
            <strong>Attack:</strong> ${unit.attack}<br>
            <strong>Defense:</strong> ${unit.defense}<br>
            <strong>Health:</strong> ${unit.health}<br>
            <strong>Node:</strong> ${unit.node}<br>
            <strong>Deployment:</strong> ${unit.deployment}
        `;
        circle.appendChild(tooltip);
        battlefield.appendChild(circle); // Append the unit circle to the battlefield

        // Drag event handler
        circle.addEventListener('mouseenter', (event) => {handleNodeHoverHighlightAccessibleUnitsNodes(event, units, meleeNetwork, archerNetwork, flierNetwork);});
        circle.addEventListener('mouseleave', handleNodeLeaveHighlight);
        circle.addEventListener("dragstart", handleDragStart);
        circle.addEventListener("dragover", handleDragOver);
        circle.addEventListener("drop", (event) => {handleDrop(event, nodes, units, meleeNetwork, archerNetwork, flierNetwork, nodeSize);});
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
            row.appendChild(cell); // Append the cell to the row
        }

        tableBody.appendChild(row); // Append the row to the table body
    });
}

function createConnections(svg, nodes, nodeSize, network, color, width, dashArray, lateralOffset, curvedLine, focalPointX, focalPointY, curvatureStrength) {
    network.forEach(pair => {
        const node1 = nodes.find(node => node.id === pair[0]);
        const node2 = nodes.find(node => node.id === pair[1]);
        if (node1 && node2) {
            drawLine(svg, 
                node1.x * nodeSize + nodeSize / 2, node1.y * nodeSize + nodeSize / 2,
                node2.x * nodeSize + nodeSize / 2, node2.y * nodeSize + nodeSize / 2,
                color, width, dashArray, lateralOffset, curvedLine, focalPointX, focalPointY, curvatureStrength
            );
        }
    });
}

function drawLine(svg, x1, y1, x2, y2, color, width, dashArray, lateralOffset = 0, curvedLine = false, curvatureFocalPointX, curvatureFocalPointY, curvatureStrength = 100) {
    if (curvedLine) {
        // If curvedLine is true, use the drawCurvedLine function
        drawCurvedLine(svg, x1, y1, x2, y2, color, width, dashArray, curvatureFocalPointX, curvatureFocalPointY, curvatureStrength);
    } else {
        // Adjust the coordinates by the lateral offset for a straight line
        const adjustedX1 = x1 + lateralOffset;
        const adjustedY1 = y1;
        const adjustedX2 = x2 + lateralOffset;
        const adjustedY2 = y2;

        // Draw a thicker black line as the border
        const borderLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        borderLine.setAttribute("x1", adjustedX1);
        borderLine.setAttribute("y1", adjustedY1);
        borderLine.setAttribute("x2", adjustedX2);
        borderLine.setAttribute("y2", adjustedY2);
        borderLine.setAttribute("stroke", "black");
        borderLine.setAttribute("stroke-width", `${width}`);
        borderLine.setAttribute("stroke-linecap", "round");
        borderLine.setAttribute("stroke-dasharray", dashArray);
        svg.appendChild(borderLine);

        // Draw the colored line on top
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", adjustedX1);
        line.setAttribute("y1", adjustedY1);
        line.setAttribute("x2", adjustedX2);
        line.setAttribute("y2", adjustedY2);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", `${width/2}`);
        line.setAttribute("stroke-linecap", "round");
        line.setAttribute("stroke-dasharray", dashArray);
        svg.appendChild(line);
    }
}

function drawCurvedLine(svg, x1, y1, x2, y2, color, width, dashArray, focalPointX, focalPointY, curvatureStrength = 100) {
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
    path.setAttribute("d", d);
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", `${width}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-dasharray", dashArray);

    // Draw a thicker black path as the border
    const borderPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    borderPath.setAttribute("d", d);
    borderPath.setAttribute("stroke", "black");
    borderPath.setAttribute("stroke-width", `${width/2}`);
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

        // Set a color for each team (you can customize these colors)
        if (team == 1) {
            teamSection.style.backgroundColor = "green";
        } else if (team == 2) {
            teamSection.style.backgroundColor = "orange";
        }

        healthBar.appendChild(teamSection);
    });
}


// HOVER callbacks
function handleNodeHoverHighlightAccessibleUnitsNodes(event, units, meleeNetwork, archerNetwork, flierNetwork) {
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

function handleNodeLeaveHighlight(event) {
    // Remove highlight from all nodes
    document.querySelectorAll('.highlight').forEach(node => {
        node.classList.remove('highlight');
    });
}


// DRAG AND DROP callbacks
let draggedUnitId = null; // Variable to store the ID of the dragged unit --> THIS IS SHARED BETWEEN handleDragStart() and handleDrop()

function handleDragStart(event) {
    draggedUnitId = event.target.dataset.unitId; // Store the ID of the dragged unit
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

function handleDrop(event, nodes, units, meleeNetwork, archerNetwork, flierNetwork, nodeSize) {
    event.preventDefault();
    const targetNodeId = event.target.dataset.nodeId; // Get the ID of the node being dropped on (it can come from the node itself or from a unit that belongs to it)

    if (draggedUnitId && targetNodeId) {
        const draggedUnit = units.find(unit => unit.id == draggedUnitId);
        const draggedUnitNodeIdInt = parseInt(draggedUnit.node);
        const targetNodeIdInt = parseInt(targetNodeId);

        if (draggedUnit) {
            // Check if there is a unit already assigned to the target node
            const targetUnit = units.find(unit => unit.node === targetNodeIdInt); 

            if (targetUnit) {
                units = handleCombat(draggedUnit, targetUnit, draggedUnitNodeIdInt, targetNodeIdInt, units, meleeNetwork, archerNetwork, flierNetwork)
                
            } else {
                // If no unit is in the target node, simply move the dragged unit to the target node
                handleMoveDrag(draggedUnit, draggedUnitNodeIdInt, targetNodeIdInt, meleeNetwork, archerNetwork, flierNetwork)
            }

            // Redraw the units to update their positions         
            drawAll(nodes, units, meleeNetwork, archerNetwork, flierNetwork, nodeSize);
        }
    }
}

function handleMoveDrag(u, x, y, meleeNetwork, archerNetwork, flierNetwork) {
    console.log('handleMoveDrag')
    const draggedUnitIdInt = parseInt(u.id);
    if (networkContainsConnection(meleeNetwork, x, y)) {
        writeToLog(`\nmove unit ${draggedUnitIdInt} from node:${x} -> node:${y}`)
        u.node = y;
    } else if (u.type === 'F' && networkContainsConnection(flierNetwork, x, y)){
        writeToLog(`\nfly unit ${draggedUnitIdInt} from node:${x} -> node:${y}`)
        u.node = y
    } else {
        writeToLog(`cannot move unit ${draggedUnitIdInt} from node:${x} -> node:${y}`)
    }

    return networkContainsConnection(meleeNetwork, x, y);
}

function networkContainsConnection(network, x, y) {
    return network.some(pair => pair[0] === x && pair[1] === y);
}


// COMBAT logic
function handleCombat(u, v, x, y, units, meleeNetwork, archerNetwork, flierNetwork) {
    console.log('handleCombat')
    if (u.team === v.team) {
        writeToLog(`\nswap unit:${u.id} <-> unit:${v.id}`)
        const tempNode = u.node;
        u.node = v.node;
        v.node = tempNode;
        return units;
    }

    if (u.type === 'M') {
        writeToLog(`\nmelee attack unit:${u.id} -> unit:${v.id}`)
        units = handleMeleeDrag(u, v, x, y, units, meleeNetwork, archerNetwork, flierNetwork)
    } else if (u.type === 'A') {
        writeToLog(`\nshoot unit:${u.id} -> unit:${v.id}`)
        units = handleArcherDrag(u, v, x, y, units, meleeNetwork, archerNetwork, flierNetwork)
    } else if (u.type === 'F') {
        writeToLog(`\nflying attack unit:${u.id} -> unit:${v.id}`)
        units = handleFlierDrag(u, v, x, y, units, meleeNetwork, archerNetwork, flierNetwork)
    } else{
        writeToLog(`\ncannot attack unit:${u.id} -> unit:${v.id}`)
    }

    return units.filter(u => u.health > 0)
}

function handleMeleeDrag(u, v, x, y, units, meleeNetwork, archerNetwork, flierNetwork) {
    console.log('handleMeleeDrag')
    if (networkContainsConnection(meleeNetwork, x, y)) {
        return handleMeleeCombat(u, v, x, y, units)
    } else {
        writeToLog('cannot attack')
        return units
    } 
}

function handleArcherDrag(u, v, x, y, units, meleeNetwork, archerNetwork, flierNetwork) {
    console.log('handleArcherDrag')
    if (networkContainsConnection(meleeNetwork, x, y)) {
        return handleArcherCombat(u, v, x, y, units)
    } else if (networkContainsConnection(archerNetwork, x, y)) {
        return handleArcherCombat(u, v, x, y, units)
    } else {
        writeToLog('cannot attack')
        return units
    }
}

function handleFlierDrag(u, v, x, y, units, meleeNetwork, archerNetwork, flierNetwork) {
    console.log('handleFlierDrag')
    if (networkContainsConnection(meleeNetwork, x, y)) {
        writeToLog('Flier attacks by land.')
        return handleMeleeCombat(u, v, x, y, units)
    } else if (networkContainsConnection(flierNetwork, x, y)){
        writeToLog('Flier attacks by air.')
        return handleMeleeCombat(u, v, x, y, units)
    } else {
        writeToLog('cannot attack')
        return units
    }
}

function handleMeleeCombat(attacker, defender, x, y, units){
    while (attacker.health > 0 && defender.health > 0) {
        // Attacker attacks first
        let damage = Math.max(1, attacker.attack - defender.defense);
        defender.health -= damage;
        if (defender.health <= 0) {
            writeToLog(`Attacker wins with ${attacker.health} health left.`)
            // Defender is defeated: move attacker to node, remove defender, stop combat
            attacker.node = defender.node
            return units.filter(u => u.id !== defender.id);
        }

        // Defender attacks back
        damage = Math.max(1, defender.attack - attacker.defense);
        attacker.health -= damage;
        if (attacker.health <= 0) {
            writeToLog(`Defender wins with ${defender.health} health left.`)
            // Attacker is defeated: remove attacker, stop combat
            return units.filter(u => u.id !== attacker.id);
        }
    }
}

function handleArcherCombat(attacker, defender, x, y, units){
    let damage = Math.max(1, attacker.attack - defender.defense);
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

