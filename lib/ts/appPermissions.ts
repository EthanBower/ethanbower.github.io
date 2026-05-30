"use client";

export class AppPermissions {
    public static gyroPermissions: { gyroCompatible: boolean, gyroscopeEnabled: boolean } = {
        gyroCompatible: false,
        gyroscopeEnabled: false
    };

    public static initialize () {
        AppPermissions.gyroPermissions.gyroCompatible = 
            (typeof DeviceOrientationEvent !== "undefined") && 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (typeof (DeviceOrientationEvent as any).requestPermission === "function");
    }

    public static async askGyroPermissionsAsync(): Promise<void> {
        try {
            if (!this.gyroPermissions.gyroCompatible) {
                return;
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const permission = await (DeviceOrientationEvent as any).requestPermission();
            if (permission !== "granted") {
                AppPermissions.gyroPermissions.gyroscopeEnabled = false;
                return;
            }
            
            AppPermissions.gyroPermissions.gyroscopeEnabled = true;
        } catch(err) {
            console.error("Gyroscope permission failed", err);
        }
    }
}

AppPermissions.initialize();