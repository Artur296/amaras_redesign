"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LiveContentSync() {
  const router = useRouter();

  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        bc = new BroadcastChannel("amaras_content_sync");
        bc.onmessage = (event) => {
          if (event.data?.type === "CONTENT_UPDATED") {
            router.refresh();
          }
        };
      } catch {}
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === "amaras_live_content_v2" && e.newValue) {
        router.refresh();
      }
    };
    window.addEventListener("storage", onStorage);

    // If page is loaded or refreshed shortly after a publish in this browser, refresh server components
    try {
      const raw = localStorage.getItem("amaras_live_content_v2");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.timestamp && Date.now() - parsed.timestamp < 60_000) {
          router.refresh();
        }
      }
    } catch {}

    return () => {
      if (bc) bc.close();
      window.removeEventListener("storage", onStorage);
    };
  }, [router]);

  return null;
}
