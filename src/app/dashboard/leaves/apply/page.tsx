"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import api from "@/src/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    leave_type: z.enum(["vacation", "sick", "personal"]),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    reason: z.string().min(10, "Reason must be at least 10 characters"),
  })
  .refine(
    (data) => {
      return new Date(data.end_date) >= new Date(data.start_date);
    },
    {
      message: "End date cannot be before start date",
      path: ["end_date"],
    }
  );

type FormData = z.infer<typeof formSchema>;

export default function ApplyLeave() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leave_type: "vacation",
      start_date: "",
      end_date: "",
      reason: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/leaves", data);
      toast.success("Leave applied successfully!");
      reset();
      router.push("/dashboard/my-leaves");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to apply leave");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">Apply for Leave</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium mb-2">Leave Type</label>
          <select
            {...register("leave_type")}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="vacation">Vacation</option>
            <option value="sick">Sick</option>
            <option value="personal">Personal</option>
          </select>
          {errors.leave_type && (
            <p className="text-red-500 text-sm mt-1">
              {errors.leave_type.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Start Date</label>
          <input
            type="date"
            {...register("start_date")}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.start_date && (
            <p className="text-red-500 text-sm mt-1">
              {errors.start_date.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">End Date</label>
          <input
            type="date"
            {...register("end_date")}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.end_date && (
            <p className="text-red-500 text-sm mt-1">
              {errors.end_date.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Reason</label>
          <textarea
            {...register("reason")}
            rows={5}
            placeholder="Explain why you need this leave..."
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.reason && (
            <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-lg font-medium"
        >
          {isSubmitting ? "Submitting..." : "Apply for Leave"}
        </button>
      </form>
    </div>
  );
}
