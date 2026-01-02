"use client";

import { Suspense } from "react";
import LoadingSpinner from "@/components/generic/LoadingSpinner";
import OrderCallbackURL from "@/components/order-callbackurl-component/OrderCallbackURL";

export default function OrderCallbackURLPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OrderCallbackURL />
    </Suspense>
  );
}
