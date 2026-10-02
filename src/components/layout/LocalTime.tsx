"use client";

import { useEffect, useState } from "react";

const format = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Tunis",
});

export function LocalTime({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(format.format(new Date()));
    const id = window.setInterval(update, 15_000);
    const first = window.setTimeout(update, 0);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(first);
    };
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {time ?? "--:--"} GMT+1
    </span>
  );
}
