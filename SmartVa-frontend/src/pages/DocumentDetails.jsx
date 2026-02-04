import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import NewResponse from "../components/NewResponse";
import {
  useGetDocumentByIdQuery,
  useDeleteDocumentMutation,
} from "../redux/document/DocumentSlice";
import EditDocument from "../components/EditDocument";
import DeleteModal from "../components/DeleteModal";

const DocumentDetails = () => {
  const [addResponse, setAddResponse] = useState(false);
  const [responseDocumentId, setResponseDocumentId] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const [editDoc, setEditDoc] = useState(false);
  const [deleteDocument] = useDeleteDocumentMutation();

  const { data: fetchedDoc, isLoading, isError } =
    useGetDocumentByIdQuery(id);

  const doc = fetchedDoc?.data;

  if (isLoading) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Loading document...
      </p>
    );
  }

  if (isError || !doc) {
    return (
      <div className="p-8 text-center text-red-500 font-semibold">
        Document not found.
      </div>
    );
  }

  const handleDelete = async (id) => {
    try {
      await deleteDocument(id).unwrap();
      navigate("/document");
    } catch (error) {
      console.error(error);
    }
  };

  const docBorderColor =
    doc.type === "incoming"
      ? "border-purple-500"
      : "border-green-500";

  const docBadgeColor =
    doc.type === "incoming"
      ? "bg-purple-100 text-purple-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="bg-gray-100 min-h-screen p-8 dark:bg-gray-800 dark:text-white mt-16">
      {/* Main Document Card */}
      <div
        className={`bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md border-l-4 ${docBorderColor}`}
      >
        <Link
          to="/document"
          className="inline-block mb-4 text-sm text-gray-500 hover:underline"
        >
          ← Back to Documents
        </Link>

        {/* Title + Badge */}
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-green-600">
            {doc.title}
          </h1>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${docBadgeColor}`}
          >
            {doc.type}
          </span>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {doc.description}
        </p>

        {/* Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong>Reference:</strong> {doc.ref || "—"}
          </p>
          <p>
            <strong>Category:</strong> {doc.category}
          </p>
          <p>
            <strong>Sender:</strong> {doc.sender}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {doc.responseStatus.replace("_", " ")}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(doc.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setEditDoc(true)}
            className="border rounded-md px-4 py-2 hover:bg-gray-500 hover:text-white"
          >
            Edit
          </button>

          <DeleteModal
            dialogMessage={`Are you sure you want to delete ${doc.title}?`}
            handlingDelete={() => handleDelete(doc._id)}
          />
        </div>
      </div>

      {/* Responses Header */}
      <div className="flex justify-between items-center mt-10 mb-4">
        <h2 className="text-xl font-semibold text-green-500">
          Responses
        </h2>

        {/* Plus Button (UI only) */}
        <button
          title="Add Response"
          className="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600"
          onClick={()=>{
            console.log('about to add response to doc id:', doc._id)
            setResponseDocumentId(doc._id)
            setAddResponse(true)

          }}
        >
          <FaPlus /> Add Response
        </button>
      </div>

      {/* Responses */}
      {doc.responses && doc.responses.length > 0 ? (
        <div className="space-y-4">
          {doc.responses.map((resp, index) => {
            const respBorder =
              resp.type === "incoming"
                ? "border-purple-500"
                : "border-green-500";

            const respBadge =
              resp.type === "incoming"
                ? "bg-purple-100 text-purple-700"
                : "bg-green-100 text-green-700";

            return (
              <div
                key={index}
                className={`bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-md border-l-4 ${respBorder}`}
              >
                {/* Response Header */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800 dark:text-gray-200">
                    {resp.title}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${respBadge}`}
                  >
                    {resp.type}
                  </span>
                </div>

                {resp.ref && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ref: {resp.ref}
                  </p>
                )}

                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {resp.summary}
                </p>

                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <p>
                    Needs Further Response:{" "}
                    {resp.needsFurtherResponse ? "Yes" : "No"}
                  </p>
                  {resp.respondedAt && (
                    <p>
                      Responded At:{" "}
                      {new Date(resp.respondedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 italic">
          No responses added yet.
        </p>
      )}

      {editDoc && (
        <EditDocument
          document={doc}
          onCancel={() => setEditDoc(false)}
        />
      )}

      {addResponse && (
        <NewResponse
          documentId={responseDocumentId}
          close={() => setAddResponse(false)}
        />
      )}
    </div>
  );
};

export default DocumentDetails;
