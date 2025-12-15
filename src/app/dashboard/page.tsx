"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/src/components/Sidebar";

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (err) {
      localStorage.clear();
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64">
        {/* Top Navbar */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Leave Management System
            </h1>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-sm text-gray-600 capitalize">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="p-10">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            Welcome back, {user.first_name}!
          </h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-600 mb-4 text-lg">Leave Balance</p>
              <p className="text-6xl font-bold text-blue-600">
                {user.leave_balance}
              </p>
              <p className="text-gray-600 mt-4">days remaining</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-600 mb-4 text-lg">Pending Requests</p>
              <p className="text-6xl font-bold text-yellow-600">3</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-600 mb-4 text-lg">Approved This Year</p>
              <p className="text-6xl font-bold text-green-600">12</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold mb-8">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a
                href="/dashboard/leaves/apply"
                className="block bg-blue-600 text-white text-center py-8 rounded-xl hover:bg-blue-700 transition text-2xl font-medium"
              >
                Apply for Leave
              </a>
              <a
                href="/dashboard/leaves"
                className="block bg-gray-700 text-white text-center py-8 rounded-xl hover:bg-gray-800 transition text-2xl font-medium"
              >
                View My Leaves
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
