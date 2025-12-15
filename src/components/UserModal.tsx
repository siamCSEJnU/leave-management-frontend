"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "@/src/lib/api";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingUser?: any;
}

export default function UserModal({
  isOpen,
  onClose,
  onSuccess,
  editingUser,
}: UserModalProps) {
  const isEditing = !!editingUser;

  const [managers, setManagers] = useState<any[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(true);

  const [form, setForm] = useState({
    employee_id: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "employee",
    department: "",
    manager_id: "",
    leave_balance: 20,
  });

  useEffect(() => {
    api
      .get("/users")
      .then((res) => {
        const allUsers = res.data.data || res.data;
        setManagers(allUsers.filter((u: any) => u.role === "manager"));
        setLoadingManagers(false);
      })
      .catch(() => {
        toast.error("Failed to load managers");
        setLoadingManagers(false);
      });
  }, []);

  useEffect(() => {
    if (editingUser) {
      setForm({
        employee_id: editingUser.employee_id || "",
        email: editingUser.email || "",
        password: "",
        first_name: editingUser.first_name || "",
        last_name: editingUser.last_name || "",
        role: editingUser.role || "employee",
        department: editingUser.department || "",
        manager_id: editingUser.manager_id
          ? editingUser.manager_id.toString()
          : "",
        leave_balance: editingUser.leave_balance || 20,
      });
    } else {
      setForm({
        employee_id: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        role: "employee",
        department: "",
        manager_id: "",
        leave_balance: 20,
      });
    }
  }, [editingUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let payload: any = { ...form };
      payload.leave_balance = Number(payload.leave_balance);

      payload.manager_id = payload.manager_id
        ? Number(payload.manager_id)
        : null;

      if (payload.department === "") {
        payload.department = null;
      }

      if (isEditing) {
        const updatePayload = {
          first_name: payload.first_name,
          last_name: payload.last_name,
          role: payload.role,
          department: payload.department,
          manager_id: payload.manager_id,
          leave_balance: payload.leave_balance,
        };
        await api.put(`/users/${editingUser.id}`, updatePayload);
        toast.success("User updated successfully");
      } else {
        if (!payload.password) {
          toast.error("Password is required");
          return;
        }
        await api.post("/users", payload);
        toast.success("User created successfully");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black opacity-95 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isEditing ? "Edit User" : "Create New User"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {!isEditing && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Employee ID *
                </label>
                <input
                  name="employee_id"
                  type="text"
                  value={form.employee_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password *
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              First Name *
            </label>
            <input
              name="first_name"
              type="text"
              value={form.first_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Last Name *
            </label>
            <input
              name="last_name"
              type="text"
              value={form.last_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Manager</label>
            {loadingManagers ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <select
                name="manager_id"
                value={form.manager_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value="">No manager</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.first_name} {manager.last_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Leave Balance
            </label>
            <input
              name="leave_balance"
              type="number"
              value={form.leave_balance}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Department</label>
            <input
              name="department"
              type="text"
              value={form.department}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          <div className="col-span-2 flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEditing ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
