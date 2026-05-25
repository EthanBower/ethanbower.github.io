"use client";

import { AppPermissions } from "@/lib/ts/appPermissions";
import { SceneController } from "../../ts/threeScene";

export default function Permissions() {
  async function enableGyro() {
    await AppPermissions.enableGyroscopeAsync();

    const threeScene = SceneController.getInstance();
    if (!threeScene.ready) {
      alert("Scene is not yet ready...");
    }
    
    threeScene.frontPage!.mainCamera.enableGyroEventListener();
  }

  return (
    <div>
      <button onClick={async () => { await enableGyro(); }} className="popup-button-blue">
        Activate Motion
      </button>
    </div>
  );
}