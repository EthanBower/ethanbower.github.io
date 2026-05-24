"use client";

import { AppPermissions } from "@/lib/ts/appPermissions";
import { useEffect, useState } from "react";

export default function Permissions({ onComplete }: { onComplete: () => Promise<void>; }) {
  const [permissionsNeeded, setPermissionsNeeded] = useState(String);

  useEffect(() => {
    AppPermissions.initialize();

    setPermissionsNeeded(String(AppPermissions.gyroPermissions.permissionsNeeded));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col gap-4 items-center justify-center bg-white">
        <button onClick={async () => { await AppPermissions.enableGyroscopeAsync(); }} className="text-center text-black">
          Enable Motion { permissionsNeeded }
        </button>
        <button onClick={onComplete} className="text-center text-black">
          Complete
        </button>
    </div>
  );
}