// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import LandingCreate from "./pages/LandingCreate.jsx";
import BlankPage from "./pages/BlankPage.jsx";
import CalendarsPage from "./pages/CalendarsPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<LandingCreate />} />
        <Route path="/app/create" element={<BlankPage title="Create a New Advent Calendar" />} />
        <Route path="/app/calendars" element={<CalendarsPage />} />
        <Route path="/app/calendar/:id/edit" element={<BlankPage title="Edit Calendar" />} />
        <Route path="/app/calendar/:id/preview" element={<BlankPage title="Preview Calendar" />} />
        <Route path="/app/calendar/:id/share" element={<BlankPage title="Share Calendar" />} />
      </Routes>
    </Router>
  );
}

export default App;
