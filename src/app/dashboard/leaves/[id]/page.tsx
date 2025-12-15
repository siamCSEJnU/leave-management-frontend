"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import api from "@/src/lib/api";
import { Pencil, Trash2, Check, X, MessageSquarePlus } from "lucide-react";

export default function LeaveDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [leave, setLeave] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchLeave();
  }, [id]);

  const fetchLeave = async () => {
    try {
      const res = await api.get(`/leaves/${id}`);
      setLeave(res.data);
      fetchComments();
    } catch (err) {
      toast.error("Failed to load leave");
      router.push("/dashboard/leaves");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/leaves/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments");
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post(`/leaves/${id}/comments`, { comment_text: newComment });
      setNewComment("");
      toast.success("Comment added");
      fetchComments();
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  const handleEditComment = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditText(comment.comment_text);
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editText.trim()) return;

    try {
      await api.put(`/comments/${commentId}`, { comment_text: editText });
      toast.success("Comment updated");
      setEditingCommentId(null);
      setEditText("");
      fetchComments();
    } catch (err) {
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const result = await Swal.fire({
      title: "Delete comment?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/comments/${commentId}`);
      toast.success("Comment deleted");
      fetchComments();
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  const handleApprove = async () => {
    try {
      await api.patch(`/leaves/${id}/approve`, { reviewer_notes: "Approved" });
      toast.success("Leave approved!");
      fetchLeave();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to approve");
    }
  };

  const handleReject = async () => {
    const reason = prompt("Reason for rejection:");
    if (!reason) return;

    try {
      await api.patch(`/leaves/${id}/reject`, { reviewer_notes: reason });
      toast.success("Leave rejected");
      fetchLeave();
    } catch (err) {
      toast.error("Failed to reject");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!leave) return <div className="p-10 text-center">Leave not found</div>;

  const isManagerOrAdmin = ["manager", "admin"].includes(user.role);
  const isPending = leave.status === "pending";
  const isOwnLeave = leave.employee_id === user.id;
  const canApproveOrReject = isManagerOrAdmin && isPending && !isOwnLeave;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="mb-6 text-blue-600 hover:underline flex items-center gap-2"
      >
        ← Back to leaves
      </button>

      <div className="bg-white rounded-xl shadow p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold capitalize">
              {leave.leave_type} Leave
            </h1>
            <p className="text-gray-600 mt-2">
              Requested by: {leave.employee?.first_name}{" "}
              {leave.employee?.last_name}
            </p>
          </div>
          <span
            className={`px-6 py-3 rounded-full text-lg font-medium ${
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

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-gray-600">Start Date</p>
            <p className="text-xl font-semibold">{leave.start_date}</p>
          </div>
          <div>
            <p className="text-gray-600">End Date</p>
            <p className="text-xl font-semibold">{leave.end_date}</p>
          </div>
          <div>
            <p className="text-gray-600">Duration</p>
            <p className="text-xl font-semibold">{leave.duration_days} days</p>
          </div>
          <div>
            <p className="text-gray-600">Reason</p>
            <p className="text-xl font-semibold">{leave.reason}</p>
          </div>
        </div>

        {leave.reviewer_notes && (
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <p className="text-gray-600 font-medium">Manager Note:</p>
            <p className="mt-2 italic">"{leave.reviewer_notes}"</p>
          </div>
        )}

        {canApproveOrReject && (
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleApprove}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              Approve
            </button>
            <button
              onClick={handleReject}
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              Reject
            </button>
          </div>
        )}

        {isOwnLeave && isPending && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-8">
            <p className="text-yellow-800 font-medium">
              This is your own leave request. You cannot approve or reject it.
            </p>
          </div>
        )}

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Comments</h2>

          {/* Add Comment */}
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-4 py-3 border rounded-lg"
              rows={3}
              required
            />
            <button
              type="submit"
              className="mt-3 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <MessageSquarePlus size={20} />
              Post Comment
            </button>
          </form>

          {/* Comments List */}
          {comments.length === 0 ? (
            <p className="text-gray-600">No comments yet.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment: any) => {
                const isOwnComment = comment.user_id === user.id;

                return (
                  <div key={comment.id} className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-medium">
                            {comment.user.first_name} {comment.user.last_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleString()}
                          </p>
                        </div>

                        {editingCommentId === comment.id ? (
                          <div className="mt-3">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full px-4 py-2 border rounded-lg"
                              rows={3}
                            />
                            <div className="flex gap-3 mt-3">
                              <button
                                onClick={() => handleUpdateComment(comment.id)}
                                className="text-green-600 hover:text-green-800 flex items-center gap-1"
                              >
                                <Check size={18} />
                                Save
                              </button>
                              <button
                                onClick={() => setEditingCommentId(null)}
                                className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                              >
                                <X size={18} />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-2 text-gray-800">
                            {comment.comment_text}
                          </p>
                        )}
                      </div>

                      {isOwnComment && editingCommentId !== comment.id && (
                        <div className="flex gap-4 ml-4">
                          <button
                            onClick={() => handleEditComment(comment)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
