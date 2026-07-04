"use client";

import InfoBanner from "@/src/components/ui/infoBanner";
import { appVersion, whatsNewJsonUrl } from "@/src/components/utils/globals";
import { useSettings } from "@/src/providers/settingsProvider";
import { useEffect, useState } from "react";

type WhatsNewJsonItem = {
    mergedAt: string;
    title: string;
}

export default function WhatsNewBanner() {
    const { settings, settingsLoaded, setSettings } = useSettings();
    const [data, setData] = useState<WhatsNewJsonItem[] | null>(null);

    useEffect(() => {
        if (!settingsLoaded) return;
        if (settings.lastSeenVersion === appVersion) return;

        async function loadWhatsNew() {
            const res = await fetch(whatsNewJsonUrl);
            const resJson = (await res.json()) as WhatsNewJsonItem[];
            const uniqueData = Array.from(
                new Map(resJson.map(item => [item.title.toLowerCase(), item])).values()
            );

            setData(uniqueData);
        }

        loadWhatsNew().catch((reject) => {
            console.log(new Error(`Error loading WhatsNew JSON payload.`, { cause: String(reject) }));
        })

        // 'settings.lastSeenVersion' should not be in dependency array as it will re-trigger this flow when cache is reset.
        // Ideally, the desired effect is to run only once on loading which that will go against.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settingsLoaded]);

    function closeBanner() {
        setData(null);
        setSettings((s) => ({
            ...s,
            lastSeenVersion: appVersion,
        }));
    }

    return (
        <InfoBanner enable={data !== null} flashingTitle="WHAT'S NEW" title={`This Site Updated to ${appVersion}!`} onClose={closeBanner} >
            {data &&
                data.map((item, i) => (
                    <div key={i} className="py-2 border-b border-white/10 last:border-b-0">
                        <div className="text-xs text-white/50">
                            {toDateString(item.mergedAt)}
                        </div>
                        <div className="text-sm text-white font-medium">
                            {item.title}
                        </div>
                    </div>
                ))
            }
        </InfoBanner>
    );
}

function toDateString(dateTime: string): string {
    const date = new Date(dateTime);

    if (isNaN(date.getTime())) {
        return "[Date Not Found]";
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}