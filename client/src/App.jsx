// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import LandingCreate from "./pages/LandingCreate.jsx";
import BlankPage from "./pages/BlankPage.jsx";
import CalendarsPage from "./pages/CalendarsPage.jsx";
import CreateCalendarPage from "./pages/CreateCalendarPage.jsx";
import CreateDaysDashboard from "./pages/CreateDaysDashboard.jsx";
import DayEditDay1 from "./pages/DayEditDay1.jsx";
import DayEditDay2 from "./pages/DayEditDay2.jsx";
import DayEditDay3 from "./pages/DayEditDay3.jsx";
import DayEditDay4 from "./pages/DayEditDay4.jsx";
import DayEditDay5 from "./pages/DayEditDay5.jsx";
import DayEditDay6 from "./pages/DayEditDay6.jsx";
import DayEditDay7 from "./pages/DayEditDay7.jsx";
import DayPreviewPage from "./pages/DayPreviewPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<LandingCreate />} />
        <Route path="/app/create" element={<CreateCalendarPage />} />
        <Route path="/app/create/days" element={<CreateDaysDashboard />} />
        <Route path="/app/calendars/:id/edit" element={<CreateDaysDashboard />} />
        <Route path="/app/calendars" element={<CalendarsPage />} />
        <Route path="/app/calendar/:id/edit" element={<BlankPage title="Edit Calendar" />} />
        <Route path="/app/calendar/:id/preview" element={<BlankPage title="Preview Calendar" />} />
        <Route path="/app/calendar/:id/share" element={<BlankPage title="Share Calendar" />} />
        <Route path="/app/calendar/day/1/edit" element={<DayEditDay1 />} />
        <Route path="/app/calendar/day/2/edit" element={<DayEditDay2 />} />
        <Route path="/app/calendar/day/3/edit" element={<DayEditDay3 />} />
        <Route path="/app/calendar/day/4/edit" element={<DayEditDay4 />} />
        <Route path="/app/calendar/day/5/edit" element={<DayEditDay5 />} />
        <Route path="/app/calendar/day/6/edit" element={<DayEditDay6 />} />
        <Route path="/app/calendar/day/7/edit" element={<DayEditDay7 />} />
        <Route path="/app/calendar/day/:id/preview" element={<DayPreviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
