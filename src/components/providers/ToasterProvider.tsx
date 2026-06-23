"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "#ffffff",
          color: "#0f172a",
          borderRadius: "6px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        },
        success: {
          iconTheme: { primary: "#0d7c66", secondary: "#ffffff" },
        },
      }}
    />
  );
}
