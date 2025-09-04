// UserRoutes.jsx - Update routes to include new components
import React from "react";
import { Routes, Route } from "react-router-dom";
import UserPortalLayout from "./UserPortalLayout";
import Dashboard from "./Dashboard";
import Tickets from "./Tickets";
import TicketDetail from "./TicketDetail";
import NewTicket from "./NewTicket";
import Profile from "./Profile";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserPortalLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="tickets/:id" element={<TicketDetail />} />
        <Route path="new-ticket" element={<NewTicket />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;