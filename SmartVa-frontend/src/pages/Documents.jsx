import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { toast } from "react-toastify";

import EditDocument from "../components/EditDocument";
import ConfirmAction from "../components/ConfirmAction";
import NewDocument from "../components/NewDocument";

import {
  useGetDocumentsQuery,
  useDeleteDocumentMutation,
} from "../redux/document/DocumentSlice";

const truncateText = (text, max = 80) =>
  text?.length > max ? text.slice(0, max) + "..." : text;

const Documents = () => {
  const navigate = useNavigate();

  const [editView, setEditView] = useState(false);
  const [showNewDocument, setShowNewDocument] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // 🔹 Pagination
  const [page, setPage] = useState(1);
  const limit = 9;

  // 🔹 Filters
  const [filters, setFilters] = useState({
    title: "",
    ref: "",
    sender: "",
    category: "",
    fileCategory: "",
    receptionMode: "",
    status: "",
  });

  const confirm = ConfirmAction();
  const [deleteDocument] = useDeleteDocumentMutation();

  const { data, isLoading, isError } = useGetDocumentsQuery({
    ...filters,
    page,
    limit,
  });

  const documents = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // 🔥 Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleClearFilters = () => {
    setFilters({
      title: "",
      ref: "",
      sender: "",
      category: "",
      fileCategory: "",
      receptionMode: "",
      status: "",
    });
  };

  const handleDelete = (id) => {
    confirm.show(async () => {
      try {
        await deleteDocument(id).unwrap();
        toast.success("Document deleted");
      } catch (err) {
        toast.error(err?.data?.message || "Delete failed");
      }
    });
  };

  if (isLoading)
    return (
      <p className="text-center mt-20 text-gray-500">Loading...</p>
    );

  if (isError)
    return (
      <p className="text-center mt-20 text-red-500">
        Failed to load documents
      </p>
    );

  return (
    <div className="bg-gray-100 min-h-screen p-8 dark:bg-gray-800 dark:text-white mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          Documents ({total})
        </h1>
        <button
          onClick={() => setShowNewDocument(true)}
          className="bg-green-500 px-4 py-2 rounded-md text-white hover:bg-green-600"
        >
          <FaPlus className="inline mr-1" /> New
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            ["title", "Filter by title..."],
            ["category", "Filter by category..."],
            ["sender", "Filter by sender..."],
            ["ref", "Filter by ref..."],
            ["fileCategory", "Filter by file category..."],
          ].map(([name, placeholder]) => (
            <input
              key={name}
              name={name}
              placeholder={placeholder}
              className="p-2 rounded-md border dark:bg-gray-800"
              value={filters[name]}
              onChange={handleFilterChange}
            />
          ))}

          <select
            name="receptionMode"
            className="p-2 rounded-md border dark:bg-gray-800"
            value={filters.receptionMode}
            onChange={handleFilterChange}
          >
            <option value="">All reception modes</option>
            <option value="virtual">Virtual</option>
            <option value="in-person">In-Person</option>
          </select>

          <select
            name="status"
            className="p-2 rounded-md border dark:bg-gray-800"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="responded">Responded</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleClearFilters}
            className="text-sm text-red-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Documents */}
      {documents.length === 0 ? (
        <p className="text-center text-gray-500">
          No documents found.
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <li
              key={doc._id}
              className={`bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-md border-l-4 ${
                doc.type === "incoming"
                  ? "border-purple-500"
                  : "border-green-500"
              }`}
            >
              <div className="flex justify-between mb-2">
                <h2 className="text-lg font-bold text-green-600">
                  {doc.title}
                </h2>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-200">
                  {doc.type}
                </span>
              </div>

              <p className="text-sm mb-2">
                {truncateText(doc.description)}
              </p>

              <p className="text-sm">
                <strong>Sender:</strong> {doc.sender}
              </p>

              <div className="flex justify-between mt-4 text-sm">
                <span>
                  {new Date(doc.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <HiOutlineChatBubbleLeftRight />
                  {doc.responses?.length || 0}
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() =>
                    navigate(`/document-details/${doc._id}`, {
                      state: { doc },
                    })
                  }
                  className="flex-1 border rounded-md py-1"
                >
                  View
                </button>
                <button
                  onClick={() => {
                    setSelectedDoc(doc);
                    setEditView(true);
                  }}
                  className="flex-1 border rounded-md py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="flex-1 border border-red-500 rounded-md py-1"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Prev
          </button>

          <span>
            Page <strong>{page}</strong> of{" "}
            <strong>{totalPages}</strong>
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {editView && (
        <EditDocument
          document={selectedDoc}
          onCancel={() => setEditView(false)}
        />
      )}

      {showNewDocument && (
        <NewDocument close={() => setShowNewDocument(false)} />
      )}
    </div>
  );
};

export default Documents;
