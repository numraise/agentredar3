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
        let ax = agentPos.getValue(Axis.X);
        let ay = agentPos.getValue(Axis.Y);
        let az = agentPos.getValue(Axis.Z);

        // Selector สำหรับค้นหามอนสเตอร์
        let selector = "@e[family=monster,x=" + ax + ",y=" + ay + ",z=" + az + ",r=" + radius + "]";
        
        // ใน MakeCode queryTarget จะคืนค่าเป็นข้อมูลที่พร้อมใช้งานได้ทันที (ไม่ต้องใช้ JSON.parse)
        let monsters = mobs.queryTarget(mobs.target(selector));
        
        if (monsters && monsters.length > 0) {
            player.say("⚠️ Radar: Monster Detected!");

            let closestMonster = monsters[0];
            let minDistance = -1.0;

            // ค้นหาตัวที่ใกล้ที่สุด
            for (let i = 0; i < monsters.length; i++) {
                let monster = monsters[i];
                let mPos = monster.position;
                let dx = mPos.x - ax;
                let dy = mPos.y - ay;
                let dz = mPos.z - az;
                let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (minDistance === -1.0 || distance < minDistance) {
                    minDistance = distance;
                    closestMonster = monster;
                }
            }

            if (closestMonster) {
                let targetPos = closestMonster.position;
                player.say("Target: " + closestMonster.name + " (" + Math.round(minDistance) + " blocks)");

                // คำนวณมุม (Yaw) เพื่อให้ Agent หันหน้าไปหา
                let angle = Math.atan2(targetPos.x - ax, targetPos.z - az) * 180 / Math.PI;
                agent.teleport(agentPos, angle);

                // ถอยหนีถ้าใกล้เกินไป
                if (minDistance < 3) {
                    player.say("Too close! Retreating...");
                    agent.move(SixDirection.Back, 2);
                }
            }
        }
    }
}

// ระบบสแกนอัตโนมัติทุก 5 วินาที
loops.forever(function () {
    customRadar.scanForDanger(10);
    loops.pause(5000);
});

// คำสั่งแชทเพื่อทดสอบมือ
player.onChat("radar", function (radius: number) {
    if (!radius) {
        radius = 10;
    }
    customRadar.scanForDanger(radius);
});
