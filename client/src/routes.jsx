import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import RequireAuth from "./context/RequireAuth";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}