/**
 * Agent Monster Radar Blocks
 */
//% weight=100 color=#AA278D icon="\uf21e" block="Radar"
namespace customRadar {
    /**
     * Scans for the closest hostile monster within a specified radius and makes the agent face it.
     * @param radius the radius to scan for monsters, eg: 10
     */
    //% blockId="custom_radar_scan"
    //% block="scan for danger within radius %radius"
    //% radius.min=1 radius.max=50 radius.defl=10
    export function scanForDanger(radius: number): void {
        let agentPos = agent.getPosition();
        let x = agentPos.getValue(Axis.X);
        let y = agentPos.getValue(Axis.Y);
        let z = agentPos.getValue(Axis.Z);

        // Selector สำหรับค้นหามอนสเตอร์
        let selector = "@e[family=monster,x=" + x + ",y=" + y + ",z=" + z + ",r=" + radius + "]";
        
        // จุดสำคัญ: ใน MakeCode queryTarget จะคืนค่าเป็นอาเรย์ของข้อมูลอยู่แล้ว 
        // ไม่ต้องใช้ JSON.parse
        let monsters = mobs.queryTarget(mobs.target(selector));
        
        if (monsters && monsters.length > 0) {
            let closestMonster = monsters[0];
            let minDistance = -1;

            for (let i = 0; i < monsters.length; i++) {
                let monster = monsters[i];
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
                player.say("⚠️ Target: " + closestMonster.name + " (" + Math.round(minDistance) + " blocks)");
                
                // คำนวณมุมเพื่อให้ Agent หันหน้าไปหา
                let mPos = closestMonster.position;
                let angle = Math.atan2(mPos.x - x, mPos.z - z) * 180 / Math.PI;
                agent.teleport(agentPos, angle);

                if (minDistance < 3) {
                    player.say("Too close! Retreating...");
                    agent.move(SixDirection.Back, 2);
                }
            }
        }
    }
}

// ระบบรันอัตโนมัติ
loops.forever(function () {
    customRadar.scanForDanger(10);
    loops.pause(5000);
});