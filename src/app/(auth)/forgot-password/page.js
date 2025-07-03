"use client";

import { Suspense } from "react";
import ForgotPasswordComponent from "@/components/auth-component/ForgotPassword";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordComponent />
    </Suspense>
  );
}
