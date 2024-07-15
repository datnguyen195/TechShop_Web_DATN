import React from "react";
import { Route, Routes } from "react-router-dom";
import path from "./ultils/path";
import { Home, Login, Public } from "./pages/public";

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
