// src/pages/NewDocument.jsx
import React, { useState } from "react";
import {  useCreateDocumentMutation } from "../redux/document/DocumentSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const NewDocument = ({ close }) => {
  const navigate = useNavigate();

  // Main document state
  const [documentData, setDocumentData] = useState({
    title: "",
    description: "",
    ref: "",
    sender: "",
    category: "General",
    receptionMode: "",
    fileCategory: "",
    type: "incoming",
    responseStatus: "not_required",
    responses: [],
  });

  // Response input state
  const [newResponse, setNewResponse] = useState({
    title: "",
    ref: "",
    summary: "",
    resStatus: false,
    receptionMode: "virtual",
    fileCategory: "",
    type: "outgoing",
    respondedAt: new Date().toISOString().slice(0, 10),
  });

  const [createNewDocument, { isLoading }] = useCreateDocumentMutation();

  // Handle document input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDocumentData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "receptionMode" && value === "Virtual"
        ? { fileCategory: "" }
        : {}),
    }));
  };

  // Handle response input changes
  const handleResponseChange = (e, index = null) => {
    const { name, value, type, checked } = e.target;
    setNewResponse((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add a response to document
  const addResponse = () => {
    // Validation
    if (!newResponse.title || !newResponse.summary) {
      toast.error("Response title and summary are required");
      return;
    }
    if (
      newResponse.receptionMode === "in-person" &&
      !newResponse.fileCategory
    ) {
      toast.error("File category is required for in-person responses");
      return;
    }

    setDocumentData((prev) => ({
      ...prev,
      responses: [...prev.responses, newResponse],
    }));

    // Reset new response form
    setNewResponse({
      title: "",
      ref: "",
      summary: "",
      needsFurtherResponse: false,
      receptionMode: "virtual",
      fileCategory: "",
      type: "outgoing",
      respondedAt: new Date().toISOString().slice(0, 10),
    });
  };

  // Remove a response
  const removeResponse = (index) => {
    setDocumentData((prev) => ({
      ...prev,
      responses: prev.responses.filter((_, i) => i !== index),
    }));
  };

  // Submit the document
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      documentData.receptionMode === "in-person" &&
      !documentData.fileCategory
    ) {
      toast.error("File category is required for in-person documents");
      return;
    }

    try {
      const payload = { ...documentData };
      const response = await createNewDocument(payload).unwrap();
      toast.success(response?.message || "Document created successfully!");
      close();

      // Reset form
      setDocumentData({
        title: "",
        description: "",
        ref: "",
        sender: "",
        category: "General",
        receptionMode: "",
        fileCategory: "",
        type: "incoming",
        responseStatus: "not_required",
        responses: [],
      });
      navigate("/document");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create document");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-100 dark:bg-gray-800 dark:text-white rounded-2xl shadow-lg w-full max-w-4xl p-6 mx-4 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6">Create New Document</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Title + Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Title</label>
              <input
                type="text"
                name="title"
                value={documentData.title}
                onChange={handleChange}
                placeholder="Document Title"
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Description</label>
              <textarea
                name="description"
                value={documentData.description}
                onChange={handleChange}
                placeholder="Document Description"
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-24 p-4"
                required
              />
            </div>
          </div>

          {/* Ref, Sender, Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Reference</label>
              <input
                type="text"
                name="ref"
                value={documentData.ref}
                onChange={handleChange}
                placeholder="Document Reference (optional)"
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Sender</label>
              <input
                type="text"
                name="sender"
                value={documentData.sender}
                onChange={handleChange}
                placeholder="Sender Name"
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Category</label>
              <select
                name="category"
                value={documentData.category}
                onChange={handleChange}
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-14 p-4"
              >
                <option value="General">General</option>
                <option value="Legal">Legal</option>
                <option value="Financial">Financial</option>
                <option value="Personal">Personal</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Type + Reception Mode + File Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Document Type</label>
              <select
                name="type"
                value={documentData.type}
                onChange={handleChange}
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-14 p-4"
                required
              >
                <option value="incoming">Incoming</option>
                <option value="outgoing">Outgoing</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Reception Mode</label>
              <select
                name="receptionMode"
                value={documentData.receptionMode}
                onChange={handleChange}
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-14 p-4"
                required
              >
                <option value="">Select mode</option>
                <option value="virtual">Virtual</option>
                <option value="in-person">In-Person</option>
              </select>
            </div>

            {documentData.receptionMode === "in-person" && (
              <div className="flex flex-col">
                <label className="mb-1 font-semibold">
                  File Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fileCategory"
                  value={documentData.fileCategory}
                  onChange={handleChange}
                  placeholder="e.g. Letter, Invoice, Certificate"
                  className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                  required
                />
              </div>
            )}
          </div>

          {/* Response Status */}
          <div className="flex flex-col mt-4">
            <label className="font-semibold mb-2">Response Status</label>
            <div className="flex gap-6">
              {["not_required", "pending", "responded"].map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="responseStatus"
                    value={status}
                    checked={documentData.responseStatus === status}
                    onChange={handleChange}
                    className="h-5 w-5 text-green-500"
                  />
                  {status.replace("_", " ").toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          {/* Responses Section */}
          {documentData.responseStatus === "responded" && (
            <div className="mt-4 p-4 border border-gray-300 dark:border-gray-600 rounded-2xl">
              <h3 className="font-semibold mb-2">Add Response</h3>

              {/* Response Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <input
                  type="text"
                  name="title"
                  value={newResponse.title}
                  onChange={handleResponseChange}
                  placeholder="Response Title"
                  className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                />
                <input
                  type="text"
                  name="ref"
                  value={newResponse.ref}
                  onChange={handleResponseChange}
                  placeholder="Response Ref (optional)"
                  className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                />
              </div>

              <textarea
                name="summary"
                value={newResponse.summary}
                onChange={handleResponseChange}
                placeholder="Response Summary"
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-24 p-4 mt-2"
              />

              {/* Needs Further Response, Type, ReceptionMode */}
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="needsFurtherResponse"
                    checked={newResponse.needsFurtherResponse}
                    onChange={handleResponseChange}
                    className="h-5 w-5 text-green-500"
                  />
                  Needs Further Response
                </label>

                <select
                  name="type"
                  value={newResponse.type}
                  onChange={handleResponseChange}
                  className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-2"
                >
                  <option value="outgoing">Outgoing</option>
                  <option value="incoming">Incoming</option>
                </select>

                <select
                  name="receptionMode"
                  value={newResponse.receptionMode}
                  onChange={handleResponseChange}
                  className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-2"
                >
                  <option value="virtual">Virtual</option>
                  <option value="in-person">In-Person</option>
                </select>

                {newResponse.receptionMode === "in-person" && (
                  <input
                    type="text"
                    name="fileCategory"
                    value={newResponse.fileCategory}
                    onChange={handleResponseChange}
                    placeholder="File Category"
                    className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-2"
                  />
                )}

                <input
                  type="date"
                  name="respondedAt"
                  value={newResponse.respondedAt}
                  onChange={handleResponseChange}
                  className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-2"
                />

                <button
                  type="button"
                  onClick={addResponse}
                  className="ml-auto bg-blue-500 text-white p-2 rounded-md"
                >
                  Add Response
                </button>
              </div>

              {/* Display added responses */}
              {documentData.responses.length > 0 &&
                documentData.responses.map((resp, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 mt-2 bg-gray-200 dark:bg-gray-600"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{resp.title}</span>
                      <button
                        type="button"
                        onClick={() => removeResponse(index)}
                        className="bg-red-500 text-white p-1 rounded-md"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="text-sm">
                      <p>
                        <strong>Summary:</strong> {resp.summary}
                      </p>
                      <p>
                        <strong>Ref:</strong> {resp.ref || "-"}
                      </p>
                      <p>
                        <strong>Type:</strong> {resp.type}
                      </p>
                      <p>
                        <strong>Reception Mode:</strong> {resp.receptionMode}
                      </p>
                      {resp.receptionMode === "in-person" && (
                        <p>
                          <strong>File Category:</strong> {resp.fileCategory}
                        </p>
                      )}
                      <p>
                        <strong>Needs Further Response:</strong>{" "}
                        {resp.needsFurtherResponse ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Responded At:</strong>{" "}
                        {new Date(resp.respondedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-500 text-white p-2 rounded-md flex-1"
            >
              {isLoading ? "Creating..." : "Create Document"}
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

export default NewDocument;
