

export function defineUnitTypes(meleeNetwork, archerNetwork, flierNetwork, siegeNetwork, cavalryNetwork) {
    return {
        M: { name: 'melee', color: 'red', movementNetworks: [meleeNetwork], attackNetworks: [meleeNetwork], combatHandler: handleMeleeCombat },
        A: { name: 'archer', color: 'green', movementNetworks: [meleeNetwork], attackNetworks: [meleeNetwork, archerNetwork], combatHandler: handleArcherCombat },
        S: { name: 'siege', color: 'white', movementNetworks: [meleeNetwork], attackNetworks: [meleeNetwork, archerNetwork, siegeNetwork], combatHandler: handleSiegeCombat },
        R: { name: 'monster', color: 'plum', movementNetworks: [meleeNetwork], attackNetworks: [meleeNetwork], combatHandler: handleMonsterCombat },
        V: { name: 'cavalry', color: 'yellow', movementNetworks: [meleeNetwork, cavalryNetwork], attackNetworks: [meleeNetwork, cavalryNetwork], combatHandler: handleCavalryCombat },
        F: { name: 'flier', color: 'blue', movementNetworks: [meleeNetwork, flierNetwork], attackNetworks: [meleeNetwork, flierNetwork], combatHandler: handleMeleeCombat }
    }
}


function writeToLog(message) {
    logTextbox.value = `${logTextbox.value}\n${message}`;
    logTextbox.scrollTop = logTextbox.scrollHeight;
}

// MOVEMENT logic
export function handleMove(u, x, y, unitTypes) {
    console.log('handleMove')
    const draggedUnitIdInt = parseInt(u.id);
    if (unitCanMove(u, x, y, unitTypes)) {
        writeToLog(`\nmove unit ${draggedUnitIdInt} from node:${x} -> node:${y}`)
        u.node = y;
    } else {
        writeToLog(`cannot move unit ${draggedUnitIdInt} from node:${x} -> node:${y}`)
    }
}


export function handleSwap(u, v, unitTypes) {
    if (unitCanMove(u, u.node, v.node, unitTypes) & unitCanMove(v, v.node, u.node, unitTypes)) {
        const tempNode = u.node;
        u.node = v.node;
        v.node = tempNode;
        writeToLog(`\nSwapped unit:${u.id} <-> unit:${v.id}`);
    } else {
        writeToLog(`\nCannot swap unit:${u.id} <-> unit:${v.id}`);
    }
}
function unitCanMove(u, x, y, unitTypes) {
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
export function handleCombat(u, v, x, y, units, unitTypes) {
    console.log('handleCombat')
    if (unitCanAttack(u, x, y, unitTypes)) {
        unitTypes[u.type]["combatHandler"](u, v)
        return units.filter(u => u.health > 0)
    } else {
        writeToLog('cannot attack')
        return units
    }
}

function unitCanAttack(u, x, y, unitTypes) {
    for (const attackNetwork of unitTypes[u.type]["attackNetworks"]) {
        if (networkContainsConnection(attackNetwork, x, y)) {
            return true
        }
    }
    return false
}

function handleMeleeCombat(attacker, defender) {
    while (attacker.health > 0 && defender.health > 0) {
        // Attacker attacks first
        let damage = Math.max(1, attacker.attack_melee - defender.defense);
        defender.health -= damage;
        if (defender.health <= 0) {
            writeToLog(`Attacker wins with ${attacker.health} health left.`)
            // Defender is defeated: move attacker to node, stop combat
            attacker.node = defender.node
            break
        }

        // Defender attacks back
        damage = Math.max(1, defender.attack_melee - attacker.defense);
        attacker.health -= damage;
        if (attacker.health <= 0) {
            writeToLog(`Defender wins with ${defender.health} health left.`)
            // Attacker is defeated: stop combat
            break
        }
    }
}

function handleArcherCombat(attacker, defender) {
    let damage = Math.max(1, attacker.attack_range - defender.defense);
    writeToLog(`Archer deals ${damage} damage.`)
    defender.health -= damage;
    if (defender.health <= 0) {
        writeToLog('Archer kills target.')
    } else {
        writeToLog(`Target has ${defender.health} health left.`)
    }
}

function handleSiegeCombat(attacker, defender) {
    let damage = Math.max(1, attacker.attack_range - defender.defense);
    writeToLog(`Siege deals ${damage} damage.`)
    defender.health -= damage;
    if (defender.health <= 0) {
        writeToLog('Siege kills target.')
    } else {
        writeToLog(`Target has ${defender.health} health left.`)
    }
}

function handleMonsterCombat(attacker, defender) {
    attacker.health += 1;
    defender.health -= 1;
    writeToLog(`Monster eats 1 health from defender.`)
    handleMeleeCombat(attacker, defender)
}


function handleCavalryCombat(attacker, defender) {
    defender.health -= attacker.attack_melee;
    // Defender killed with first attack
    if (defender.health <= 0) {
        writeToLog(`Attacker wins with ${attacker.health} health left.`)
        // Defender is defeated: move attacker to node, stop combat
        attacker.node = defender.node
        return
    }
    handleMeleeCombat(attacker, defender)
}