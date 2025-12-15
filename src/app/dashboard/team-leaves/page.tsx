"use client";

import { useEffect, useState } from "react";
import api from "@/src/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";

export default function TeamLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    api
      .get("/leaves")
      .then((res) => {
        setLeaves(res.data.data || res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load team leaves");
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="p-10 text-center">Loading team leaves...</div>;

  return (
    <div className="py-6 px-14">
      <div className="mb-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-8 text-center">Team Leaves</h1>

      {leaves.length === 0 ? (
        <p className="text-center text-gray-600">
          No leave requests from your team.
        </p>
      ) : (
        <div className="grid gap-6">
          {leaves.map((leave: any) => (
            <div key={leave.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xl font-semibold">
                    {leave.employee.first_name} {leave.employee.last_name} -{" "}
                    {leave.leave_type.toUpperCase()} Leave
                  </p>
                  <p className="text-gray-600 mt-2">
                    {leave.start_date} → {leave.end_date} ({leave.duration_days}{" "}
                    days)
                  </p>
                  <p className="mt-3">{leave.reason}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium mb-4 block ${
                      leave.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : leave.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {leave.status.toUpperCase()}
                  </span>

                  {leave.status === "pending" && (
                    <Link
                      href={`/dashboard/leaves/${leave.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Review
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
