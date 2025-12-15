"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/src/lib/api";

export default function LeavesList() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/leaves")
      .then((res) => {
        setLeaves(res.data.data || res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load leaves");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center">Loading leaves...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Leaves</h1>
        <Link
          href="/dashboard/leaves/apply"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Apply New Leave
        </Link>
      </div>

      {leaves.length === 0 ? (
        <p className="text-center text-gray-600">No leave requests yet.</p>
      ) : (
        <div className="grid gap-6">
          {leaves.map((leave: any) => (
            <Link
              key={leave.id}
              href={`/dashboard/leaves/${leave.id}`}
              className="block"
            >
              <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xl font-semibold">
                      {leave.leave_type.toUpperCase()} Leave
                    </p>
                    <p className="text-gray-600 mt-1">
                      {leave.start_date} → {leave.end_date} (
                      {leave.duration_days} days)
                    </p>
                    <p className="mt-3">{leave.reason}</p>
                    {leave.reviewer_notes && (
                      <p className="mt-3 text-sm italic text-gray-700">
                        Manager note: "{leave.reviewer_notes}"
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      leave.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : leave.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {leave.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
