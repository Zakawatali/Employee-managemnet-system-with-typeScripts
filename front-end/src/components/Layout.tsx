// src/layouts/UserLayout.jsx
import React from "react";
import SideBar from "./sideBar";

export default function Layout({ children }) {
  return (
   
    <div className="flex-1  min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
        <main className="flex-1 p-4 md:ml-64 mt-12 md:mt-0">
       {children}
      </main>
    </div>
  );
}
