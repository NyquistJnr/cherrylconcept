"use client";

import { useState } from "react";
import { withAuth } from "@/components/generic/ProtectedRoute";
import AccountSidebar from "@/components/account/AccountSidebar";
import AccountOverview from "@/components/account/AccountOverview";
import OrderHistory from "@/components/account/OrderHistory";
import Wishlist from "@/components/account/Wishlist";
import AccountSettings from "@/components/account/AccountSettings";
import AddressManager from "@/components/account/AddressManager";
import PaymentMethods from "@/components/account/PaymentMethods";

function AccountPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return <AccountOverview onTabChange={setActiveTab} />;
      case "orders":
        return <OrderHistory />;
      case "wishlist":
        return <Wishlist />;
      case "addresses":
        return <AddressManager />;
      case "payment":
        return <PaymentMethods />;
      case "settings":
        return <AccountSettings />;
      default:
        return <AccountOverview onTabChange={setActiveTab} />;
    }
  };

  return (
    <main className="pt-28 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1">{renderActiveTab()}</div>
        </div>
      </div>
    </main>
  );
}

// Wrap with authentication protection
export default withAuth(AccountPage);
