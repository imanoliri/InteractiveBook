

// Instructions Modal
export function add_instructions_modal() {
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
}

// Map Info Modal
export function add_map_info_modal(battleMapInfoHTML) {
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
}