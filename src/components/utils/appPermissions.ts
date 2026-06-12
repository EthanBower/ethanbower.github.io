"use client";

export class AppPermissions {
  public static gyroPermissions: {
    gyroCompatible: boolean;
    gyroscopeEnabled: boolean;
  } = {
    gyroCompatible: false,
    gyroscopeEnabled: false,
  };

  public static initialize() {
    AppPermissions.gyroPermissions.gyroCompatible =
      typeof DeviceOrientationEvent !== "undefined" &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      typeof (DeviceOrientationEvent as any).requestPermission === "function";
  }

  public static async askGyroPermissionsAsync(): Promise<void> {
    try {
      if (!this.gyroPermissions.gyroCompatible) {
        throw new Error("This device is not motion compatible.");
      }

      const permission =
        await // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (DeviceOrientationEvent as any).requestPermission();
      if (permission !== "granted") {
        AppPermissions.gyroPermissions.gyroscopeEnabled = false;
        throw new Error("This device rejected motion permissions.");
      }

      AppPermissions.gyroPermissions.gyroscopeEnabled = true;
    } catch (err) {
      throw new Error("Could not enable motion capabilities.", { cause: err });
    }
  }
}

AppPermissions.initialize();
