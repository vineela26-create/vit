import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // wait until Firebase responds
  if (user === undefined) return null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
