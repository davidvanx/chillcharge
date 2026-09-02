import React from "react";
import { Outlet } from "react-router-dom";
import iPhoneFrame from "@/components/charging/iPhoneFrame";
import BottomNav from "@/components/BottomNav";
import AccessibilityFab from "@/components/AccessibilityFab";

export default function Layout() {
  return (
    <iPhoneFrame>
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-hidden relative">
          <Outlet />
        </div>
        <BottomNav />
      </div>
      <AccessibilityFab />
    </iPhoneFrame>
  );
}