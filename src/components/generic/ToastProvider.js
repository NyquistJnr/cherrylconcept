"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider({ children }) {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="toast-custom"
        bodyClassName="toast-body"
        progressClassName="toast-progress"
      />
      <style jsx global>{`
        .toast-custom {
          font-family: inherit;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .toast-body {
          padding: 12px;
          font-size: 14px;
          line-height: 1.4;
        }

        .toast-progress {
          background: linear-gradient(90deg, #8b5cf6, #ec4899);
        }

        .Toastify__toast--success {
          background: #10b981;
          color: white;
        }

        .Toastify__toast--error {
          background: #ef4444;
          color: white;
        }

        .Toastify__toast--info {
          background: #3b82f6;
          color: white;
        }

        .Toastify__toast--warning {
          background: #f59e0b;
          color: white;
        }
      `}</style>
    </>
  );
}
