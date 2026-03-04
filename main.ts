/**
 * Agent Monster Radar Blocks
 */
//% weight=100 color=#AA278D icon="\uf21e" block="Radar"
namespace customRadar {
    /**
     * สแกนหาอันตรายรอบตัว (Safe Version)
     * @param radius ระยะสแกน, eg: 10
     */
    //% blockId="custom_radar_scan"
    //% block="scan for danger within radius %radius"
    export function scanForDanger(radius: number): void {
        player.say("⚠️ ระบบ Radar ทำงาน! สแกนพื้นที่ในระยะ " + radius + " บล็อก...");
        
        // หมายเหตุ: ใน MakeCode ปกติ เราไม่สามารถดึงพิกัดมอนสเตอร์มาเป็นตัวแปรแบบละเอียดได้ตรงๆ 
        // แต่เราสามารถใช้เทคนิคอื่น (เช่น การรันคำสั่ง /execute เพื่อเสก Partical หรือให้ Agent วาร์ปไปหา) แทนได้
    }
}

// คำสั่งสำหรับพิมพ์ทดสอบในแชท
player.onChat("radar", function () {
    customRadar.scanForDanger(10);
});
