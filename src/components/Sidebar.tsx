"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const baseItems = [{ name: "Dashboard", href: "/dashboard" }];

  const employeeItems = [
    { name: "My Leaves", href: "/dashboard/my-leaves" },
    { name: "Apply Leave", href: "/dashboard/leaves/apply" },
  ];

  const managerItems = [
    { name: "Team Leaves", href: "/dashboard/team-leaves" },
  ];

  const adminItems = [
    { name: "Manage Users", href: "/dashboard/users" },
    { name: "All Leaves", href: "/dashboard/all-leaves" },
  ];

  let menuItems = baseItems;

  if (user.role === "employee") {
    menuItems = [...menuItems, ...employeeItems];
  } else if (user.role === "manager") {
    menuItems = [...menuItems, ...employeeItems, ...managerItems];
  } else if (user.role === "admin") {
    menuItems = [...menuItems, ...adminItems];
  }

  return (
    <aside className="w-64 bg-white shadow-md h-screen fixed left-0 ">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6 text-gray-800">Menu</h2>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block py-3 px-4 rounded-lg transition ${
                  pathname === item.href
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
