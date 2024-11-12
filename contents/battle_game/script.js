document.addEventListener("DOMContentLoaded", function () {
    const battlefield = document.getElementById("battlefield");

    // Nodes
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
    ];

    // Function to invert the Y scale
    function invertYScale(nodes) {
        const maxY = Math.max(...nodes.map(node => node.y));
        return nodes.map(node => ({
            ...node,
            y: maxY - node.y + 1
        }));
    }

    // Invert Y scale of the nodes
    nodes = invertYScale(nodes);

    // Units
    let units = [
        { id: 1, team: 2, name: "gobArch", type: "A", attack: 2, defense: 0, health: 4, node: 1, deployment: 1 },
        { id: 2, team: 2, name: "gobMel", type: "M", attack: 2, defense: 1, health: 4, node: 2, deployment: 1 },
        { id: 3, team: 2, name: "gobArch", type: "A", attack: 2, defense: 0, health: 4, node: 3, deployment: 1 },
        { id: 4, team: 2, name: "gobArch", type: "A", attack: 2, defense: 0, health: 4, node: 4, deployment: 1 },
        { id: 5, team: 2, name: "gobMel", type: "M", attack: 2, defense: 1, health: 4, node: 5, deployment: 1 },
        { id: 6, team: 2, name: "gobMel", type: "M", attack: 2, defense: 1, health: 4, node: 6, deployment: 1 },
        { id: 7, team: 2, name: "gobMel", type: "M", attack: 2, defense: 1, health: 4, node: 7, deployment: 1 },
        { id: 8, team: 2, name: "gobMel", type: "M", attack: 2, defense: 1, health: 4, node: 8, deployment: 2 },
        { id: 9, team: 2, name: "gobMel", type: "M", attack: 2, defense: 1, health: 4, node: 9, deployment: 2 },
        { id: 10, team: 2, name: "gobMel", type: "M", attack: 2, defense: 1, health: 4, node: 10, deployment: 2 },
        { id: 11, team: 1, name: "dwarfMel", type: "M", attack: 2, defense: 1, health: 6, node: 11, deployment: 1 },
        { id: 12, team: 1, name: "dwarfMel", type: "M", attack: 2, defense: 1, health: 6, node: 12, deployment: 2 },
        { id: 13, team: 1, name: "dwarfMel", type: "M", attack: 2, defense: 1, health: 6, node: 13, deployment: 1 },
        { id: 14, team: 1, name: "dwarfMel", type: "M", attack: 2, defense: 1, health: 6, node: 14, deployment: 2 },
        { id: 15, team: 1, name: "dwarfArch", type: "A", attack: 2, defense: 0, health: 6, node: 15, deployment: 1 },
        { id: 16, team: 1, name: "dwarfArch", type: "A", attack: 2, defense: 0, health: 6, node: 16, deployment: 1 },
        { id: 17, team: 1, name: "dragonRider", type: "F", attack: 4, defense: 2, health: 12, node: 17, deployment: 1 }
    ];

    const deploymentLevel = 1

    units = units.filter(unit => unit.deployment <= deploymentLevel);



    // Networks
    function createPairs(element, list) {
        // Initialize an empty array to store the pairs
        let pairs = [];
    
        // Loop through each item in the list and create a pair
        list.forEach(item => {
            pairs.push([element, item]);
        });
    
        return pairs; // Return the array of pairs
    }
    
    let meleeNetwork = [
        ...createPairs(1, [5, 2]),
        ...createPairs(2, [5, 6, 3]),
        ...createPairs(3, [6, 7, 4]),
        ...createPairs(4, [7, 3]),
        ...createPairs(5, [8]),
        ...createPairs(6, [9]),
        ...createPairs(7, [10]),
        ...createPairs(8, [11, 9]),
        ...createPairs(9, [11, 12]),
        ...createPairs(10, [13, 12]),
        ...createPairs(11, [8, 9, 12]),
        ...createPairs(12, [11, 9, 10, 13, 14]),
        ...createPairs(13, [10, 12, 14, 15]),
        ...createPairs(14, [12, 13, 16]),
        ...createPairs(15, [13, 16, 17]),
        ...createPairs(16, [14, 13, 15, 17]),
        ...createPairs(17, [15, 16])
    ];

    let archerNetwork = [
        ...createPairs(11, [14]),
        ...createPairs(14, [10]),
        ...createPairs(13, [11, 9, 19]),
        ...createPairs(15, [12, 10]),
        ...createPairs(16, [12, 10])
    ];

    let flierNetwork = [
        ...createPairs(1, [3, 4, 11, 12, 13, 14, 17]),
        ...createPairs(2, [4, 11, 12, 13, 14, 17]),
        ...createPairs(3, [1, 11, 12, 13, 14, 17]),
        ...createPairs(4, [1, 2, 11, 12, 13, 14, 17]),
        ...createPairs(11, [1, 2, 3, 4, 13, 14, 17]),
        ...createPairs(12, [1, 2, 3, 4, 17]),
        ...createPairs(13, [1, 2, 3, 4, 11, 17]),
        ...createPairs(14, [1, 2, 3, 4, 11, 17]),
        ...createPairs(17, [1, 2, 3, 4, 11, 12, 13, 14])
    ];

    function vhToPixels(value) {
        // Extract the numerical part from the value (e.g., "30vh" -> 30)
        const numericValue = parseFloat(value);
    
        // Calculate the pixel equivalent using the window's inner height
        const pixels = (window.innerHeight * numericValue) / 100;
        return pixels;
    }
    
    

     // Set CSS variables
     const numberNodes = nodes.length;
     const nodeSizePercentage = 100/Math.sqrt(numberNodes**2)
     let nodeSize = vhToPixels(`${nodeSizePercentage}vh`);

    document.documentElement.style.setProperty('--node-size', `${nodeSizePercentage}vh`);
    document.documentElement.style.setProperty('--unit-size', `${nodeSizePercentage}vh`);


    // Function to create the units table
    function createUnitsTable() {
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

    // Function to create unit circles on the map
    function createUnits() {
        units.forEach(unit => {
            const node = nodes.find(n => n.id === unit.node);
            if (!node) return; // Skip if the node is not found

            // Create the circular div for the unit
            const circle = document.createElement("div");
            circle.classList.add("unit-circle", `team-${unit.team}`, `type-${unit.type}`);
            circle.textContent = `unit:${unit.id}`;

            // Position the circle at the node's coordinates
            circle.style.left = `${node.x * nodeSize + nodeSize / 2}px`;
            circle.style.top = `${node.y * nodeSize + nodeSize / 2}px`;

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

            // Append the tooltip to the circle
            circle.appendChild(tooltip);
            battlefield.appendChild(circle); // Append the unit circle to the battlefield
        });
    }


    // Your existing createNodes and connection functions...

    // Call the function to create the table
    createUnitsTable();
    createUnits();


    // Create nodes
    function createNodes() {
        nodes.forEach(node => {
            const div = document.createElement("div");
            div.classList.add("node");
            div.style.left = `${node.x * nodeSize}px`;
            div.style.top = `${node.y * nodeSize}px`;
            div.textContent = node.id;
            battlefield.appendChild(div);
        });
    }

    // Create SVG element for lines
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    battlefield.appendChild(svg);

    
    // Function to draw lines with styles and colors
    function drawLine(x1, y1, x2, y2, color, width, dashArray, lateralOffset = 0, curvedLine = false, curvatureFocalPointX, curvatureFocalPointY, curvatureStrength = 100) {
        if (curvedLine) {
            // If curvedLine is true, use the drawCurvedLine function
            drawCurvedLine(x1, y1, x2, y2, color, width, dashArray, curvatureFocalPointX, curvatureFocalPointY, curvatureStrength);
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

    function drawCurvedLine(x1, y1, x2, y2, color, width, dashArray, focalPointX, focalPointY, curvatureStrength = 100) {
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
    

    // Draw connections with specific styles and colors
    function createConnections(network, color, width, dashArray, lateralOffset, curvedLine, focalPointX, focalPointY, curvatureStrength) {
        network.forEach(pair => {
            const node1 = nodes.find(node => node.id === pair[0]);
            const node2 = nodes.find(node => node.id === pair[1]);
            if (node1 && node2) {
                drawLine(
                    node1.x * nodeSize + nodeSize / 2, node1.y * nodeSize + nodeSize / 2,
                    node2.x * nodeSize + nodeSize / 2, node2.y * nodeSize + nodeSize / 2,
                    color, width, dashArray, lateralOffset, curvedLine, focalPointX, focalPointY, curvatureStrength
                );
            }
        });
    }

    // Set the focal point to the center of the page
    let maxNodesX = Math.max(...nodes.map(node => node.x)) * nodeSize;
    let maxNodesY = Math.max(...nodes.map(node => node.y)) * nodeSize;
    const focalPointX = maxNodesX / 2;
    const focalPointY = maxNodesY / 2;


    // Example usage to draw nodes and connections
    createNodes();
    createConnections(meleeNetwork, "red", nodeSize/10, "", 0, false); // Solid red lines for melee network
    createConnections(archerNetwork, "green", nodeSize/10, "10,10", 0, false); // Dashed green lines for archer network
    createConnections(flierNetwork, "blue", nodeSize/300, "", 0, true, focalPointX, focalPointY, 150); // Dotted blue lines for flier network

});
