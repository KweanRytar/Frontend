import React, { useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import ConfirmAction from "../components/ConfirmAction";
import DeleteModal from "../components/DeleteModal";

import { useGetAllContactsQuery } from "../redux/dashboard/OverviewSlice";
import {
  useGetContactByCompanyNameQuery,
  useGetContactByNameQuery,
  useDeleteContactMutation,
} from "../redux/Contact/ContactSlice";

import NewContact from "../components/NewContact";
import ContactDetailsCard from "../components/ContactDetailsCard";
import EditContact from "../components/EditContact";

const Contact = () => {

  const confirm = ConfirmAction()
  // filters
  const [nameInput, setNameInput] = useState("");
  const [companyNameInput, setCompanyNameInput] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [contactByName, setContactByName] = useState(false);
  const [contactByCompanyName, setContactByCompanyName] = useState(false);

  const [newContact, setNewContact] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [displayDetails, setDisplayDetails] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null);
  const [editContact, setEditContact] = useState(false);

  // extract contacts
  const [deleteContact] = useDeleteContactMutation();

  const {
    data: allContactData,
    isLoading: allContactLoading,
  } = useGetAllContactsQuery();

  const { data: contactByNameData } = useGetContactByNameQuery(name, {
    skip: !name,
  });

  const { data: contactByCompanyNameData } =
    useGetContactByCompanyNameQuery(companyName, {
      skip: !companyName,
    });

  // Trigger search on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.target.name === "nameInput") {
        setName(nameInput.trim());
        setContactByName(true);
        setContactByCompanyName(false);
      } else {
        setCompanyName(companyNameInput.trim());
        setContactByCompanyName(true);
        setContactByName(false);
      }
    }
  };

  // delete contact
  const handleDelete = async (id) => {
    confirm.show( async ()=>{
      try {
      const response = await deleteContact(id).unwrap();
      toast.success(response?.message);
    } catch (error) {
      toast.error(error?.message || "Could not delete contact");
    }

    })
    
  };

  const filteredContacts = useMemo(() => {
    const allContacts = allContactData?.contacts || [];
    const namedContact = contactByNameData?.data || [];
    const contactCompany = contactByCompanyNameData?.data || [];

    if (contactByCompanyName) return contactCompany;
    if (contactByName) return namedContact;
    return allContacts;
  }, [
    allContactData,
    contactByNameData,
    contactByCompanyNameData,
    contactByCompanyName,
    contactByName,
  ]);

  if (allContactLoading)
    return (
      <div className="text-center mt-20 text-gray-500">
        <p>Contacts loading...</p>
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen p-8 dark:bg-gray-800 dark:text-white mt-16 md:mt-22">
      <div className="flex justify-between">
        <h1>Contacts</h1>
      <button
  className="bg-green-500 rounded-md cursor-pointer px-2 h-8 text-white"
  onClick={() => setNewContact(true)}
>
  <FaPlus className="inline text-white dark:text-black" />
</button>
      </div>

      <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md space-y-3">
       <input
  type="text"
  name="nameInput"
  placeholder="Search contact by name..."
  className="w-full p-2 focus:outline-none"
  value={nameInput}
  onChange={(e) => {
    const value = e.target.value;
    setNameInput(value);

    if (value.trim() === "") {
      setName("");
      setContactByName(false);
    }
  }}
  onKeyDown={handleKeyDown}
/>


        <input
          type="text"
          name="companyInput"
          placeholder="Search contact by company..."
          className="w-full p-2 focus:outline-none"
          value={companyNameInput}
          onChange={(e) => {
            const value = e.target.value
            setCompanyNameInput(value)
          if(value.trim()=== ''){
            setCompanyNameInput('' )
             setCompanyName(false)
          }
          }}
          onKeyDown={handleKeyDown}
        />
      </div>

      {filteredContacts.length === 0 ? (
        <p className="text-gray-600 mt-6">No contact found.</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredContacts.map((contact) => (
            <main
              key={contact._id}
              className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow"
            >
              <strong className="text-xl font-bold text-green-500">
                {contact.name}
              </strong>

              <p className="text-gray-700 dark:text-gray-300 mt-2">
                {contact.companyName}
              </p>

              <small>
                {contact.position} —{" "}
                <span className="text-sm text-gray-500">{contact.email}</span>
              </small>

              <p>{contact.phoneNumber}</p>

              <div className="text-sm text-gray-500 mt-4">
                Created: {new Date(contact.createdAt).toLocaleDateString()} |
                Updated: {new Date(contact.updatedAt).toLocaleDateString()}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  className="rounded-md border-2 border-gray-500 p-2 hover:bg-gray-500 hover:text-white"
                  onClick={() => {
                    setCurrentContact(contact);
                    setDisplayDetails(true);
                  }}
                >
                  View
                </button>

                <button
                  className="rounded-md border-2 border-gray-500 p-2 hover:bg-gray-500 hover:text-white"
                  onClick={() => {
                    setContactToEdit(contact);
                    setEditContact(true);
                    console.log(contact)
                  }}
                >
                  Edit
                </button>

                <button
                  className="rounded-md border-2 border-red-500 p-2 hover:bg-red-500 hover:text-white"
                  onClick={() => handleDelete(contact._id)}
                >
                  Delete
                </button>
              </div>
            </main>
          ))}
        </div>
      )}

      {newContact && <NewContact close={()=>setNewContact(false)} />}
      {displayDetails && (
        <ContactDetailsCard
          contact={currentContact}
          unDisplayDetails={() => setDisplayDetails(false)}
        />
      )}
      {editContact && (
        <EditContact contact={contactToEdit} close={() => setEditContact(false)} />
      )}
    </div>
  );
};

export default Contact;
