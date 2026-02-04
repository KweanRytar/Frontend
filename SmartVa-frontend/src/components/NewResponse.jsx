import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAddDocumentResponseMutation } from "../redux/document/DocumentSlice";

const NewResponse = ({ documentId, close }) => {
  const id = documentId;

  const [addDocumentResponse, { isLoading }] =
    useAddDocumentResponseMutation();

  const [responseData, setResponseData] = useState({
    title: "",
    ref: "",
    summary: "",
    resStatus: false,
    receptionMode: "virtual",
    fileCategory: "",
    type: "outgoing",
    respondedAt: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setResponseData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      responseData.receptionMode === "in-person" &&
      !responseData.fileCategory
    ) {
      toast.error("File category is required for in-person responses");
      return;
    }

    const payload = {
      ...responseData,
      respondedAt: responseData.respondedAt
        ? new Date(responseData.respondedAt).toISOString()
        : new Date().toISOString(),
    };

    try {
      const res = await addDocumentResponse({
        id,
        responseBody: payload,
      }).unwrap();

      toast.success(res?.message || "Response added successfully");
      close();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add response");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-100 dark:bg-gray-800 dark:text-white rounded-2xl shadow-lg w-full max-w-2xl p-6 mx-4">
        <h2 className="text-2xl font-bold mb-6">Add New Response</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Title</label>
            <input
              type="text"
              name="title"
              value={responseData.title}
              onChange={handleChange}
              className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
              required
            />
          </div>

          {/* Reference */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Reference (optional)</label>
            <input
              type="text"
              name="ref"
              value={responseData.ref}
              onChange={handleChange}
              className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
            />
          </div>

          {/* Summary */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Summary</label>
            <textarea
              name="summary"
              value={responseData.summary}
              onChange={handleChange}
              className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-28 p-4"
              required
            />
          </div>

          {/* Incoming / Outgoing */}
          <div>
            <p className="font-semibold mb-2">Response Type</p>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="incoming"
                  checked={responseData.type === "incoming"}
                  onChange={handleChange}
                />
                <span className="text-blue-500 font-semibold">Incoming</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="outgoing"
                  checked={responseData.type === "outgoing"}
                  onChange={handleChange}
                />
                <span className="text-green-500 font-semibold">Outgoing</span>
              </label>
            </div>
          </div>

          {/* Reception Mode */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Reception Mode</label>
            <select
              name="receptionMode"
              value={responseData.receptionMode}
              onChange={handleChange}
              className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-14 p-4"
            >
              <option value="virtual">Virtual</option>
              <option value="in-person">In-Person</option>
            </select>
          </div>

          {/* File Category (conditional) */}
          {responseData.receptionMode === "in-person" && (
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">File Category</label>
              <input
                type="text"
                name="fileCategory"
                value={responseData.fileCategory}
                onChange={handleChange}
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                placeholder="e.g. Memo, Letter, Report"
                required
              />
            </div>
          )}

          {/* Response Date */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Response Date</label>
            <input
              type="date"
              name="respondedAt"
              value={responseData.respondedAt}
              onChange={handleChange}
              className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
            />
          </div>

          {/* Needs Further Response */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="resStatus"
              checked={responseData.resStatus}
              onChange={handleChange}
            />
            <span className="font-semibold">
              Requires further response
            </span>
          </label>

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-500 text-white p-2 rounded-md flex-1"
            >
              {isLoading ? "Saving..." : "Add Response"}
            </button>

            <button
              type="button"
              onClick={close}
              className="bg-gray-500 text-white p-2 rounded-md flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewResponse;
