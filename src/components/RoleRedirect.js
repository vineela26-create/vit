import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRedirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      const email = user.email;
      const role = localStorage.getItem(`role_${email}`);

      if (role === "student") {
        navigate("/student", { replace: true });
      } else if (role === "faculty") {
        navigate("/faculty", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return null;
}
