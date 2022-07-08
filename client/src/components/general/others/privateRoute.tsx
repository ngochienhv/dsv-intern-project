import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.token ? <Outlet /> : <Navigate to="/login" />;
}
