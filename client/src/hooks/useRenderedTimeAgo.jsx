import { useEffect, useState } from "react";

export function useRenderedTimeAgo(lastUpdate) {
  const [rendered, setRendered] = useState(false);
  const [timeAgo, setTimeAgo] = useState("—");

  useEffect(() => {
    const interval = setInterval(() => {
      if (!lastUpdate) {
        setRendered(false);
        setTimeAgo("—");
        return;
      }

      const diffSeconds = Math.floor((new Date() - lastUpdate) / 1000);
      setRendered(diffSeconds <= 120);

      if (diffSeconds < 60) setTimeAgo(`${diffSeconds} second${diffSeconds !== 1 ? "s" : ""} ago`);
      else if (diffSeconds < 3600) {
        const minutes = Math.floor(diffSeconds / 60);
        setTimeAgo(`${minutes} minute${minutes !== 1 ? "s" : ""} ago`);
      } else if (diffSeconds < 86400) {
        const hours = Math.floor(diffSeconds / 3600);
        setTimeAgo(`${hours} hour${hours !== 1 ? "s" : ""} ago`);
      } else {
        const days = Math.floor(diffSeconds / 86400);
        setTimeAgo(`${days} day${days !== 1 ? "s" : ""} ago`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  return [rendered, timeAgo];
}