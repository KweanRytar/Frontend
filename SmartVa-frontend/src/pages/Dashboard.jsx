import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Overview from "../components/Overview";
import TodayTask from "../components/TodayTask";
import UpcomingEvents from "../components/UpcomingEvents";
import Visitors from "../components/Visitors";
import QuickNotes from "../components/QuickNotes";
import DocumentSummary from "../components/DocumentSummary";
import AddAndManageButtons from "../components/AddAndManageButtons";
import Busy from "../data/Busy";
import ContactDetailsCard from "../components/ContactDetailsCard";
import NoteDetails from "../components/NoteDetails";
import NewTask from "../components/NewTask";
import NewContact from "../components/NewContact";
import NewVisitor from "../components/NewVisitor";
import CreateEvent from "../components/CreateEvent";
import NewDocument from "../components/NewDocument";
import DocumentDetails from "./DocumentDetails";

// Redux
import { useGetUserInfoQuery } from "../redux/dashboard/OverviewSlice";
import { useGetAllContactsQuery } from "../redux/Contact/ContactSlice";
import { useGetDocumentsQuery } from "../redux/document/DocumentSlice";
import { useGetEventsForTodayQuery } from "../redux/event/EventSlice";
import { useGetNotesQuery } from "../redux/Note/NoteSlice";
import {
  useGetEmergencyTasksQuery,
  useGetOverdueTasksQuery,
  useGetPendingTasksQuery,
  useGetTasksDueIn72HoursQuery,
  useGetAllTasksQuery,
} from "../redux/Task/TaskSlice";
import {
  useGetAllVisitorsQuery,
  useGetVisitorsByDayQuery,
} from "../redux/visitor/visitorSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  // ================= API =================
  const { data: userData } = useGetUserInfoQuery();
  const { data: contactsData } = useGetAllContactsQuery();
  const { data: taskTotalData } = useGetAllTasksQuery();
  const { data: notesData } = useGetNotesQuery();
  const { data: documentsData } = useGetDocumentsQuery();
  const { data: visitorsTotalData } = useGetAllVisitorsQuery();
  const { data: eventsTodayData } = useGetEventsForTodayQuery();
  const { data: visitorsTodayData } = useGetVisitorsByDayQuery(today);

  const { data: emergencyData } = useGetEmergencyTasksQuery();
  const { data: overdueData } = useGetOverdueTasksQuery();
  const { data: pendingData } = useGetPendingTasksQuery();
  const { data: dueSoonData } = useGetTasksDueIn72HoursQuery();

  // ================= DERIVED STATE =================
  const userName = userData?.user?.userName || "";

  const emergencyTasks = emergencyData?.tasks || [];
  const overdueTasks = overdueData?.tasks || [];
  const pendingTasks = pendingData?.tasks || [];
  const dueSoonTasks = dueSoonData?.tasks || [];

  const eventsToday = eventsTodayData?.events || [];
  const visitorsToday = visitorsTodayData?.visitors || [];
  const contacts = contactsData?.contacts || [];
  const notes = notesData?.notes || [];
  const documents = documentsData?.data || [];

  // ================= FILTER LAST 7 DAYS =================
  const last7DaysFilter = (items = []) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return items.filter((item) => {
      if (!item?.createdAt && !item?.updatedAt) return false;

      const created = item.createdAt ? new Date(item.createdAt) : null;
      const updated = item.updatedAt ? new Date(item.updatedAt) : null;

      return (
        (created && created >= sevenDaysAgo) ||
        (updated && updated >= sevenDaysAgo)
      );
    });
  };

  const recentContacts = useMemo(
    () => last7DaysFilter(contacts),
    [contacts]
  );
  const recentNotes = useMemo(() => last7DaysFilter(notes), [notes]);
  const recentDocuments = useMemo(
    () => last7DaysFilter(documents),
    [documents]
  );

  // ================= PRIORITY TASKS =================
  const priorityTasks = useMemo(() => {
    const all = [
      ...emergencyTasks,
      ...overdueTasks,
      ...pendingTasks,
      ...dueSoonTasks,
    ];

    const unique = Array.from(
      new Map(
        all
          .filter((task) => task?._id)
          .map((task) => [task._id, task])
      ).values()
    );

    return unique.slice(0, 10);
  }, [emergencyTasks, overdueTasks, pendingTasks, dueSoonTasks]);

  // ================= MODAL STATE =================
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showNewDocumentModal, setShowNewDocumentModal] = useState(false);
  const [showNewVisitorModal, setShowNewVisitorModal] = useState(false);
  const [showNewContactModal, setShowNewContactModal] = useState(false);

  return (
    <div className=" top-48 bg-gray-100 dark:bg-gray-900 min-h-screen p-6 md:p-10">

      {/* HERO */}
      <div className="bg-emerald-600 text-white rounded-2xl p-6 shadow-lg mb-12">
        <h1 className="text-2xl md:text-3xl font-semibold">
          Welcome back,{" "}
          {userName
            ? userName.charAt(0).toUpperCase() + userName.slice(1)
            : "User"}
        </h1>
        <p className="text-sm opacity-90 mt-1">
          Here’s your operational overview for today.
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        <Overview name="Contacts" total={contactsData?.totalContacts || 0} />
        <Overview name="Tasks" total={taskTotalData?.totalTasks || 0} />
        <Overview name="Notes" total={notesData?.totalNotes || 0} />
        <Overview name="Documents" total={documentsData?.total || 0} />
        <Overview name="Visitors" total={visitorsTotalData?.total || 0} />
      </div>

      {/* PRIORITY + EVENTS */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
  {/* Priority Tasks */}
  <div className="lg:col-span-2 w-full bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col">
    <h2 className="text-lg font-semibold text-emerald-600 mb-4">
      Priority Tasks
    </h2>

    <div className="flex flex-col gap-4">
      {priorityTasks.length > 0 ? (
        priorityTasks.map((task) => (
          <TodayTask
            key={task._id}
            title={task.title}
            dueDate={task.dueDate ? new Date(task.dueDate).toLocaleString() : "No due date"}
            id={task._id}
          />
        ))
      ) : (
        <p className="text-gray-500">No urgent tasks 🎉</p>
      )}
    </div>

    <div className="mt-4">
      <AddAndManageButtons
        inform="Create Task"
        manage="Manage Tasks"
        display={() => setShowNewTaskModal(true)}
        direction="/task"
      />
    </div>
  </div>

  {/* Today’s Events */}
  <div className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col">
    <h2 className="text-lg font-semibold text-emerald-600 mb-4">
      Today’s Events
    </h2>

    <div className="flex flex-col gap-4">
      {eventsToday.length > 0 ? (
        eventsToday.slice(0, 3).map((event) => (
          <UpcomingEvents key={event._id} event={event} />
        ))
      ) : (
        <p className="text-gray-500">No events scheduled</p>
      )}
    </div>

    <div className="mt-4">
      <AddAndManageButtons
        inform="Create Event"
        manage="Manage Events"
        display={() => setShowCreateEventModal(true)}
        direction="/event"
      />
    </div>
  </div>
</div>

      {/* ===== OPERATIONS (Visitors + Contacts) ===== */}
      <div className="grid lg:grid-cols-2 gap-6 mb-12">

        {/* Visitors */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-emerald-600 mb-4">
            Today’s Visitors
          </h2>

          {visitorsToday.length > 0 ? (
            visitorsToday.slice(0, 4).map((visitor) => (
              <Visitors
                key={visitor._id}
                name={visitor.name}
                time={new Date(visitor.createdAt).toDateString()}
                purpose={visitor.message}
                details={() =>
                  navigate(`/visitor-details/${visitor._id}`, {
                    state: { visitor },
                  })
                }
              />
            ))
          ) : (
            <p className="text-gray-500">No visitors today</p>
          )}
          <div className="mt-4">
            <AddAndManageButtons
              inform="Log a new Visitor"
              manage="Manage Visitors"
              display={() => setShowNewVisitorModal(true)  }
              direction="/visitor"
            />
          </div>
        </div>

        {/* Contacts */}
       <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
  <h2 className="text-lg font-semibold text-emerald-600 mb-4">
    Recent Contacts
  </h2>

  {recentContacts.length > 0 ? (
    recentContacts.slice(0, 4).map((contact) => (
      <div
        key={contact._id}
        onClick={() => setSelectedContact(contact)}
        className="cursor-pointer p-3 rounded-xl border border-gray-200 dark:border-gray-700 mb-3"
      >
        <p className="font-medium">{contact.name}</p>
        <p className="text-sm text-gray-500">{contact.email}</p>
      </div>
    ))
  ) : (
    <p className="text-gray-500">No recent contacts</p>
  )}

  <div className="mt-4">
    <AddAndManageButtons
      inform="Create Contact"
      manage="Manage Contacts"
      display={() => setShowNewContactModal(true)}
      direction="/contact"
    />
  </div>
</div>

      {/* ===== NOTES + DOCUMENTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">

        {/* Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-emerald-600 mb-4">
            Recently Edited Notes
          </h2>

          {recentNotes.length > 0 ? (
            recentNotes.slice(0, 4).map((note) => (
              <QuickNotes
                key={note._id}
                time={new Date(note.createdAt).toDateString()}
                title={note.title}
                shortendDescription={
                  note.contentText?.length > 50
                    ? note.contentText.substring(0, 50) + "..."
                    : note.contentText
                }
                details={()=> setSelectedNote(note)}
              />
            ))
          ) : (
            <p className="text-gray-500">No recent notes</p>
          )}
          <div className="mt-4">
            <AddAndManageButtons
              inform="Create Note"
              manage="Manage Notes"
              display={() => navigate("/create-note")}
              direction="/note"
            />
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-emerald-600 mb-4">
            Recently Updated Documents
          </h2>

          {recentDocuments.length > 0 ? (
            recentDocuments.slice(0, 10).map((doc) => (
              <div
  key={doc._id}
  onClick={() => navigate(`/document-details/${doc._id}`, { state: { doc } })}
  className="cursor-pointer"
>
  <DocumentSummary
    title={doc.title}
    sender={doc.sender}
    type={doc.type}
    time={new Date(doc.updatedAt).toLocaleString()}
  />
</div>
            ))
          ) : (
            <p className="text-gray-500">No recent documents</p>
          )}
           <div className="mt-4">
            <AddAndManageButtons
              inform="Create new Document"
              manage="Manage Documents"
              display={() => setShowNewDocumentModal(true)  }
              direction="/document"
            />
          </div>
        </div>
       
      </div>

    
    </div>
      {/* ===== CALENDAR ===== */}
      <div className=" w-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm ">
        <h2 className="text-lg font-semibold text-emerald-600 mb-4">
          Event Calendar
        </h2>
        <div className="overflow-x-auto">
          <Busy />
        </div>
      </div>




      {/* modals */}
      {selectedContact && (
        <ContactDetailsCard 
          contact={selectedContact}
          unDisplayDetails={() => setSelectedContact(null)}
        />
      )}

      {selectedNote && (
        <NoteDetails 
          note={selectedNote}
          close={() => setSelectedNote(null)}
          
        />
      )}


      {showCreateEventModal && (
        <CreateEvent 
          close={()=> setShowCreateEventModal(false)}

        />
      )}


      {showNewTaskModal && (
        <NewTask 
          close={() => setShowNewTaskModal(false)}
        />
      )}

      {showNewContactModal && (
  <NewContact
    close={() => setShowNewContactModal(false)}
  />
)}

{showNewDocumentModal && (
  <NewDocument
    close={() => setShowNewDocumentModal(false)}
  />
)}



      {showNewVisitorModal && (
        <NewVisitor 
          close={() => setShowNewVisitorModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
