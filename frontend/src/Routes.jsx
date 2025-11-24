import React from "react";
import {Routes, Route } from 'react-router-dom';

import Dashboard from "./pages/Dashboard/Dashboard";
import LandingPage from "./pages/LandingPage/LandingPage";
import AddNewVillage from "./pages/ProfilePages/AddNewVillagePage/AddNewVillage";
import ChangePassword from "./pages/ProfilePages/ChangePasswordPage/ChangePassword";
import DeleteVilage from "./pages/ProfilePages/DeleteVillagePage/DeleteVillage";
import Feedback from "./pages/ProfilePages/FeedbackAndSupportPage/Feedback";
import NotificationPage from "./pages/ProfilePages/NotificationsPage/NotificationPage";
import ReorderVillages from "./pages/ProfilePages/ReorderVillagesPage/ReorderVillages";
import SigninPage from './pages/SigninPage/SigninPage';
import SignupPage from "./pages/SignupPage/SignupPage";
import VillageDetailPage from "./pages/VillageDetailPage/VillageDetailPage";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/add-village" element={<AddNewVillage />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/delete-village" element={<DeleteVilage />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/reorder-villages" element={<ReorderVillages />} />
            <Route path="/village/:playerTag" element={<VillageDetailPage />} />
        </Routes>
    )
}