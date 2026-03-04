/**
 * Custom Radar Extension for Agent
 */
//% weight=100 color=#AA278D icon="\uf21e" block="Radar"
namespace customRadar {
    /**
     * Scan for danger around the agent
     * @param radius scan radius, eg: 10
     */
    //% blockId="custom_radar_scan"
    //% block="scan for danger within radius %radius"
    export function scanForDanger(radius: number): void {
        player.say("Radar active! Scanning radius: " + radius);
    }
}
