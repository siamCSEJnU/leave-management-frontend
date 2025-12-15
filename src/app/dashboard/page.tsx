"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/src/lib/api";
import toast from "react-hot-toast";
import Sidebar from "@/src/components/Sidebar";

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);
  const [personalLeaves, setPersonalLeaves] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (parsedUser.role === "admin") {
        fetchAdminData();
      } else {
        fetchPersonalData();
      }
    } catch (err) {
      localStorage.clear();
      router.push("/login");
    }
  }, [router]);

  const fetchPersonalData = async () => {
    try {
      const res = await api.get("/personal-leaves");
      const leaves = res.data.data || res.data;
      setPersonalLeaves(leaves);
      setPendingCount(leaves.filter((l: any) => l.status === "pending").length);
      setApprovedCount(
        leaves.filter((l: any) => l.status === "approved").length
      );
    } catch (err) {
      toast.error("Failed to load your leaves");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const res = await api.get("/users");
      const users = res.data.data || res.data;
      setAllUsers(users);
    } catch (err) {
      toast.error("Failed to load system data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  const totalUsers = allUsers.length;
  const activeUsers = allUsers.filter((u: any) => u.is_active).length;
  const managers = allUsers.filter((u: any) => u.role === "manager").length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64">
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

        <main className="p-10">
          {user.role === "admin" ? (
            <div className="text-center py-20">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Welcome, Admin {user.first_name}!
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                You have full control over the system.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-10">
                  <h3 className="text-2xl font-semibold mb-4">Total Users</h3>
                  <p className="text-6xl font-bold">{totalUsers}</p>
                </div>

                <div className="bg-linear-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-10">
                  <h3 className="text-2xl font-semibold mb-4">Active Users</h3>
                  <p className="text-6xl font-bold">{activeUsers}</p>
                </div>

                <div className="bg-linear-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-10">
                  <h3 className="text-2xl font-semibold mb-4">Managers</h3>
                  <p className="text-6xl font-bold">{managers}</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-800">
                Welcome back, {user.first_name}!
              </h2>

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
                  <p className="text-6xl font-bold text-yellow-600">
                    {pendingCount}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <p className="text-gray-600 mb-4 text-lg">
                    Approved This Year
                  </p>
                  <p className="text-6xl font-bold text-green-600">
                    {approvedCount}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-semibold mb-8">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <a
                    href="/dashboard/leaves/apply"
                    className="block bg-blue-600 text-white text-center py-8 rounded-xl hover:bg-blue-700 text-2xl font-medium"
                  >
                    Apply for Leave
                  </a>
                  <a
                    href="/dashboard/my-leaves"
                    className="block bg-gray-700 text-white text-center py-8 rounded-xl hover:bg-gray-800 text-2xl font-medium"
                  >
                    View My Leaves
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
