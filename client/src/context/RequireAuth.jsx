import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiGet } from "../api/api";

export default function RequireAuth({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await apiGet("/me");

        if (user && user.id) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (err) {
        console.error("Authorization check failed:", err);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!authorized) return <Navigate to="/" replace />;

  return children;
}