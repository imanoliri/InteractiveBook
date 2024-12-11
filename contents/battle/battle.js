import { drawAll } from './draw.js';
import { defineUnitTypes } from './units.js';
import { definenetworkConfigs, toggleNetwork } from './networks.js';
import { add_instructions_modal, add_map_info_modal } from './info_modals.js';

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



document.addEventListener('DOMContentLoaded', () => {
    fetchBattlesToChoose().then(defineHtmlElementsAndCallbacks);
});



function defineHtmlElementsAndCallbacks() {
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


    // Add info modals
    add_instructions_modal()
    add_map_info_modal(battleMapInfoHTML)
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
        // Get metadata for this battle and update map info modal
        getMetadata()
        add_map_info_modal(battleMapInfoHTML)
        console.log("Battle metadata fetched:", battle_metadata);
    } catch (error) {
        console.error(`Error loading metadata for ${selectedBattle}:`, error);
    }
}

function createBattle() {

    // Nodes & units
    deploymentLevel = parseInt(slider.value, 10);
    nodes = createNodes(nodes);
    units = deployUnits(units, deploymentLevel);

    // Set CSS variables
    setCSSVariables()

    // Define unit types and networks
    unitTypes = defineUnitTypes(meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork);
    networkConfigs = definenetworkConfigs(svg, nodes, nodeSize, nodeXOffset, nodeYOffset, checkboxMeleeNetwork, checkboxArcherNetwork, checkboxFlierNetwork, checkboxCavalryNetwork, checkboxSiegeNetwork, meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork)

    drawAll(nodes, units, unitTypes, meleeNetwork, nodeSize, nodeXOffset, nodeYOffset, nodeXScale, nodeYScale, networkConfigs)
}

function getMetadata() {
    battleName = battle_metadata["battle_name"]
    nodeSize = configNodeSizeToPx(battle_metadata["nodeSize"]);
    nodeXOffset = configNodeSizeToPx(battle_metadata["nodeXOffset"]);
    nodeYOffset = configNodeSizeToPx(battle_metadata["nodeYOffset"]);
    nodeXScale = battle_metadata["nodeXScale"];
    nodeYScale = battle_metadata["nodeYScale"];
    battleMapFile = `${selectedBattle}/${battle_metadata["battle_map_file"]}`;
    console.log(battle_metadata)
    battleMapInfoHTML = `${selectedBattle}/${battle_metadata["battle_map_info_html"]}`;
    console.log(battleMapInfoHTML)

    // Update HTML elements
    document.title = battleName;
    document.querySelector("h1").textContent = battleName;
    document.documentElement.style.setProperty('--battle-map-file', `url(${battleMapFile})`);
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
function configNodeSizeToPx(vh) {
    return (vh / 100 / 1000) * window.innerHeight;
}


function setCSSVariables() {
    document.documentElement.style.setProperty('--node-size', `${nodeSize}px`);
    document.documentElement.style.setProperty('--unit-size', `${nodeSize}px`);
    document.documentElement.style.setProperty('--node-size-highlight', `${nodeSize * 1.2}px`);
    document.documentElement.style.setProperty('--unit-size-highlight', `${nodeSize * 1.2}px`);
}
