"use client";

import { useState, useEffect } from "react";
import api from "@/src/lib/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import UserModal from "@/src/components/UserModal";
import Link from "next/link";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data || res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load users");
      setLoading(false);
    }
  };

  const confirmAction = async (
    user: any,
    action: "activate" | "deactivate" | "delete"
  ) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${action} ${user.first_name} ${user.last_name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: action === "delete" ? "#d33" : "#3085d6",
      confirmButtonText: `Yes, ${action}!`,
    });

    if (!result.isConfirmed) return;

    try {
      if (action === "delete") {
        await api.delete(`/users/${user.id}`);
        toast.success("User permanently deleted");
      } else if (action === "deactivate") {
        await api.post(`/users/${user.id}/deactivate`);
        toast.success("User deactivated");
      } else {
        await api.post(`/users/${user.id}/activate`);
        toast.success("User activated");
      }
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="py-6 px-12">
      <div className="mb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2  text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <button
          onClick={() => {
            setEditingUser(null);
            setShowModal(true);
          }}
          className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          + Create New User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">Balance</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">
                  {user.first_name} {user.last_name}
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 capitalize">{user.role}</td>
                <td className="px-6 py-4">{user.leave_balance} days</td>
                <td className="px-6 py-4">
                  <span
                    className={
                      user.is_active ? "text-green-600" : "text-red-600"
                    }
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>

                    {user.is_active ? (
                      <button
                        onClick={() => confirmAction(user, "deactivate")}
                        className="text-orange-600 hover:text-orange-800"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => confirmAction(user, "activate")}
                        className="text-green-600 hover:text-green-800"
                      >
                        Activate
                      </button>
                    )}

                    <button
                      onClick={() => confirmAction(user, "delete")}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
        }}
        onSuccess={fetchUsers}
        editingUser={editingUser}
      />
    </div>
  );
}
