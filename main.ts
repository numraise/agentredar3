/**
 * Custom Radar for Minecraft Agent
 */
//% color="#AA278D" icon="\uf21e" block="Radar"
namespace customRadar {
    /**
     * Scans for the closest hostile monster within a specified radius and makes the agent face it.
     * @param radius the radius to scan for monsters, eg: 10
     */
    //% block="scan for danger within radius %radius"
    //% radius.defl=10
    export function scanForDanger(radius: number) {
        let agentPos = agent.getPosition();
        let x = agentPos.getValue(Axis.X);
        let y = agentPos.getValue(Axis.Y);
        let z = agentPos.getValue(Axis.Z);

        // Selector for hostile monsters within the radius
        let selector = `@e[family=monster,x=${x},y=${y},z=${z},r=${radius}]`;
        let queryResult = mobs.queryTarget(mobs.target(selector));
        
        // Parse the JSON data
        let monsters: any[] = JSON.parse(queryResult);
        
        if (monsters && monsters.length > 0) {
            player.say("⚠️ Radar: Monster Detected!");

            let closestMonster: any = monsters[0];
            let minDistance = -1;

            // Find the closest monster
            for (let monster of monsters) {
                let mPos = monster.position;
                let dx = mPos.x - x;
                let dy = mPos.y - y;
                let dz = mPos.z - z;
                let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (minDistance === -1 || distance < minDistance) {
                    minDistance = distance;
                    closestMonster = monster;
                }
            }

            if (closestMonster) {
                let mPos = closestMonster.position;
                player.say("Target: " + closestMonster.name + " (" + Math.round(minDistance) + " blocks)");

                // Make the agent face the monster
                let angle = Math.atan2(mPos.x - x, mPos.z - z) * 180 / Math.PI;
                agent.teleport(agentPos, angle);

                // Safety retreat
                if (minDistance < 3) {
                    player.say("Too close! Retreating...");
                    agent.move(SixDirection.Back, 2);
                }
            }
        }
    }
}

/**
 * Background loops and event handlers
 */
// Automatically scan for danger every 5 seconds
loops.forever(function () {
    customRadar.scanForDanger(10);
    loops.pause(5000);
});

// Manual trigger via chat command
player.onChat("radar", function (radius: number) {
    if (!radius) {
        radius = 10;
    }
    customRadar.scanForDanger(radius);
});
