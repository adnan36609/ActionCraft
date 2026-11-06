import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Login from "./pages/login";
import Home from "./pages/home";
import Agents from "./pages/agents";
import CreateAgent from "./pages/create-agent";
import Integrations from "./pages/integrations";

import { fetchMeApi } from "@/features/auth";
import { setUser, clearUser } from "@/redux/userSlice";

function App() {
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth);

  // Check existing authentication session
  useEffect(() => {
    let active = true;

    const fetchCurrentUser = async () => {
      try {
        const user = await fetchMeApi();

        if (active) {
          dispatch(setUser(user));
        }
      } catch {
        if (active) {
          dispatch(clearUser());
        }
      }
    };

    fetchCurrentUser();

    return () => {
      active = false;
    };
  }, [dispatch]);

  // Initial authentication loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0e0e12] text-zinc-400">
        Checking authentication...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" replace /> : <Login />
          }
        />

        {/* Home */}
        <Route
          path="/"
          element={
            user ? <Home /> : <Navigate to="/login" replace />
          }
        />

        {/* Agent management */}
        <Route
          path="/agents"
          element={
            user ? <Agents /> : <Navigate to="/login" replace />
          }
        />

        {/* Create agent */}
        <Route
          path="/agents/new"
          element={
            user ? <CreateAgent /> : <Navigate to="/login" replace />
          }
        />

        {/* Integrations */}
        <Route
          path="/integrations"
          element={
            user ? <Integrations /> : <Navigate to="/login" replace />
          }
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={
            <Navigate to={user ? "/" : "/login"} replace />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;