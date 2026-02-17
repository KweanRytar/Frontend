// src/pages/EditDocument.jsx
import React, { useState } from "react";
import { useUpdateDocumentMutation } from "../redux/document/DocumentSlice";
import { toast } from "react-toastify";

const EditDocument = ({ document, onCancel }) => {
  const [updateDocument, { isLoading }] = useUpdateDocumentMutation();

  const {
    _id,
    title,
    description,
    category,
    sender,
    ref,
    type,
    receptionMode,
    fileCategory,
    responseStatus,
    responses = [],
    createdAt,
    
  } = document;

  // Form data for main document
  const [formData, setFormData] = useState({
    title: title || "",
    description: description || "",
    category: category || "General",
    sender: sender || "",
    ref: ref || "",
    type: type || "incoming",
    receptionMode: receptionMode || "virtual",
    fileCategory: fileCategory || "",
    resStatus: responseStatus === "responded",
    createdAt: createdAt || "",
  });

  // Responses state
  const [responseList, setResponseList] = useState(
    responses.length > 0
      ? responses.map((r) => ({
          title: r.title || "",
          ref: r.ref || "",
          summary: r.summary || "",
          resStatus: r.needsFurtherResponse || false,
          receptionMode: r.receptionMode || "virtual",
          fileCategory: r.fileCategory || "",
          type: r.type || "outgoing",
          respondedAt: r.respondedAt
            ? new Date(r.respondedAt).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
        }))
      : [
          {
            title: "",
            ref: "",
            summary: "",
            resStatus: false,
            receptionMode: "virtual",
            fileCategory: "",
            type: "outgoing",
            respondedAt: new Date().toISOString().slice(0, 10),
          },
        ]
  );

  // Handle main document input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "receptionMode" && value === "virtual"
        ? { fileCategory: "" }
        : {}),
    }));
  };

  // Handle response input changes
  const handleResponseChange = (index, field, value) => {
    const updated = [...responseList];
    updated[index][field] = value;

    // Reset fileCategory if receptionMode changes to virtual
    if (field === "receptionMode" && value === "virtual") {
      updated[index].fileCategory = "";
    }

    setResponseList(updated);
  };

  // Add a new blank response
  const addResponse = () => {
    setResponseList([
      ...responseList,
      {
        title: "",
        summary: "",
        ref: "",
        type: "outgoing",
        needsFurtherResponse: false,
        receptionMode: "virtual",
        fileCategory: "",
        respondedAt: new Date().toISOString().slice(0, 10),
      },
    ]);
  };

  // Remove a response
  const removeResponse = (index) => {
    setResponseList(responseList.filter((_, i) => i !== index));
  };

  // Submit updated document
  const handleSubmit = async (e) => {
  e.preventDefault();

  const updatedBody = {
    ...formData,
    responseStatus: formData.resStatus ? "responded" : "not_required",
    responses: responseList.map((r) => ({
      title: r.title,
      summary: r.summary,
      ref: r.ref || undefined,
      type: ["incoming", "outgoing"].includes(r.type) ? r.type : "outgoing",
      resStatus: Boolean(r.resStatus),
      receptionMode: r.receptionMode,
      fileCategory: r.receptionMode === "in-person" ? r.fileCategory || undefined : undefined,
      respondedAt: r.respondedAt ? new Date(r.respondedAt) : new Date(),
    })),
  };

  try {
    console.log("Updating document with data:", updatedBody);
    await updateDocument({ id: _id,  updatedBody }).unwrap(); // Spread updatedBody
    toast.success("Document updated successfully!");
    onCancel();
  } catch (err) {
    console.error(err);
    toast.error("Failed to update document. Please try again.");
  }
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-100 dark:bg-gray-800 dark:text-white rounded-2xl shadow-lg w-full max-w-5xl p-6 mx-4 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6">Edit Document</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Title & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-36 p-4"
              />
            </div>
          </div>

          {/* Category, Sender, Reference */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Sender</label>
              <input
                type="text"
                name="sender"
                value={formData.sender}
                onChange={handleChange}
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Reference</label>
              <input
                type="text"
                name="ref"
                value={formData.ref}
                onChange={handleChange}
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
              />
            </div>
          </div>

          {/* Reception Mode & File Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Reception Mode</label>
              <select
                name="receptionMode"
                value={formData.receptionMode}
                onChange={handleChange}
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 px-4 py-2"
              >
                <option value="virtual">Virtual</option>
                <option value="in-person">In-Person</option>
              </select>
            </div>
            {formData.receptionMode === "in-person" && (
              <div className="flex flex-col">
                <label className="mb-1 font-semibold">File Category</label>
                <input
                  type="text"
                  name="fileCategory"
                  value={formData.fileCategory}
                  onChange={handleChange}
                  className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                />
              </div>
            )}
          </div>

          {/* Type & Response Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 px-4 py-2"
              >
                <option value="incoming">Incoming</option>
                <option value="outgoing">Outgoing</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <label className="font-semibold">Responded:</label>
              <input
                type="checkbox"
                checked={formData.resStatus}
                onChange={(e) =>
                  setFormData({ ...formData, resStatus: e.target.checked })
                }
                className="h-5 w-5 accent-green-500"
              />
            </div>
          </div>

          {/* Responses */}
          {formData.resStatus && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Responses</h3>
              {responseList.map((resp, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 mb-4 bg-gray-200 dark:bg-gray-600"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div className="flex flex-col">
                      <label className="mb-1 font-semibold">Response Title</label>
                      <input
                        type="text"
                        value={resp.title}
                        onChange={(e) =>
                          handleResponseChange(index, "title", e.target.value)
                        }
                        className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-1 font-semibold">Reference</label>
                      <input
                        type="text"
                        value={resp.ref}
                        onChange={(e) =>
                          handleResponseChange(index, "ref", e.target.value)
                        }
                        className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col mb-2">
                    <label className="mb-1 font-semibold">Summary</label>
                    <textarea
                      value={resp.summary}
                      onChange={(e) =>
                        handleResponseChange(index, "summary", e.target.value)
                      }
                      className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-24 p-4"
                    />
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex flex-col">
                      <label className="mb-1 font-semibold">Type</label>
                      <select
                        value={resp.type}
                        onChange={(e) =>
                          handleResponseChange(index, "type", e.target.value)
                        }
                        className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-2"
                      >
                        <option value="incoming">Incoming</option>
                        <option value="outgoing">Outgoing</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="font-semibold">Needs Further Response</label>
                      <input
                        type="checkbox"
                        checked={resp.resStatus}
                        onChange={(e) =>
                          handleResponseChange(
                            index,
                            "resStatus",
                            e.target.checked
                          )
                        }
                        className="h-5 w-5 accent-green-500"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1 font-semibold">Reception Mode</label>
                      <select
                        value={resp.receptionMode}
                        onChange={(e) =>
                          handleResponseChange(index, "receptionMode", e.target.value)
                        }
                        className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-2"
                      >
                        <option value="virtual">Virtual</option>
                        <option value="in-person">In-Person</option>
                      </select>
                    </div>

                    {resp.receptionMode === "in-person" && (
                      <input
                        type="text"
                        value={resp.fileCategory}
                        onChange={(e) =>
                          handleResponseChange(index, "fileCategory", e.target.value)
                        }
                        placeholder="File Category"
                        className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-2"
                      />
                    )}

                    <div className="flex flex-col">
                      <label className="mb-1 font-semibold">Responded At</label>
                      <input
                        type="date"
                        value={resp.respondedAt}
                        onChange={(e) =>
                          handleResponseChange(index, "respondedAt", e.target.value)
                        }
                        className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-2"
                      />
                    </div>

                    <button
                      type="button"
                      className="ml-auto bg-red-500 text-white p-2 rounded-md"
                      onClick={() => removeResponse(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="bg-blue-500 text-white p-2 rounded-md"
                onClick={addResponse}
              >
                Add Response
              </button>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-500 text-white p-2 rounded-md flex-1"
            >
              {isLoading ? "Updating..." : "Update Document"}
            </button>
            <button
              type="button"
              onClick={onCancel}
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

export default EditDocument;
