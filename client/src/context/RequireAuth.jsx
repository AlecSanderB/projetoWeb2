import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8081/api/me", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) setAuthorized(true);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!authorized) return <Navigate to="/" replace />;

  return children;
}