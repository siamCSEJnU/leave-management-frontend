"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardHome() {
  const router = useRouter();
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Leaves", href: "/dashboard/leaves" },
    { name: "Apply Leave", href: "/dashboard/leaves/apply" },
    ...(user.role === "admin"
      ? [{ name: "Manage Users", href: "/dashboard/users" }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Leave Management</h1>
          <div className="flex items-center space-x-6">
            <span className="text-gray-700">
              {user.first_name} {user.last_name} ({user.role})
            </span>
            <button
              onClick={() => {
                localStorage.clear();
                router.push("/login");
              }}
              className="text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white shadow h-screen">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Menu</h2>
            <ul className="space-y-3">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block py-3 px-4 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="flex-1 p-10">
          <h2 className="text-3xl font-bold mb-6">
            Welcome back, {user.first_name}!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <p className="text-gray-600 mb-2">Leave Balance</p>
              <p className="text-5xl font-bold text-blue-600">
                {user.leave_balance}
              </p>
              <p className="text-gray-600 mt-2">days remaining</p>
            </div>
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <p className="text-gray-600 mb-2">Pending Leaves</p>
              <p className="text-5xl font-bold text-yellow-600">2</p>
            </div>
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <p className="text-gray-600 mb-2">Approved This Year</p>
              <p className="text-5xl font-bold text-green-600">8</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
