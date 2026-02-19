import React, { useEffect, useMemo, useState } from "react";
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
import { useGetAllVisitorsQuery, useGetVisitorsByDayQuery } from "../redux/visitor/visitorSlice";

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
  const last7DaysFilter = (items) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return items.filter((item) => {
      const created = new Date(item.createdAt);
      const updated = new Date(item.updatedAt);
      return created >= sevenDaysAgo || updated >= sevenDaysAgo;
    });
  };

  const recentContacts = useMemo(() => last7DaysFilter(contacts), [contacts]);
  const recentNotes = useMemo(() => last7DaysFilter(notes), [notes]);
  const recentDocuments = useMemo(() => last7DaysFilter(documents), [documents]);

  // ================= PRIORITY TASK ORDER =================
  const priorityTasks = [
    ...emergencyTasks,
    ...overdueTasks,
    ...pendingTasks,
    ...dueSoonTasks,
  ].slice(0, 5);

  // ================= JSX =================
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6 md:p-10">

      {/* ===== HERO HEADER ===== */}
      <div className="bg-emerald-600 text-white rounded-2xl p-6 shadow-lg mb-12">
        <h1 className="text-2xl md:text-3xl font-semibold">
          Welcome back, {userName.charAt(0).toUpperCase() + userName.slice(1)}
        </h1>
        <p className="text-sm opacity-90 mt-1">
          Here’s your operational overview for today.
        </p>
      </div>

      {/* ===== KPI SECTION ===== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        <Overview name="Contacts" total={contactsData?.totalContacts || 0} />
        <Overview name="Tasks" total={taskTotalData?.totalTasks || 0} />
        <Overview name="Notes" total={notesData?.totalNotes || 0} />
        <Overview name="Documents" total={documentsData?.total || 0} />
        <Overview name="Visitors" total={visitorsTotalData?.total || 0} />
      </div>

      {/* ===== PRIORITY + EVENTS ===== */}
      <div className="grid lg:grid-cols-3 gap-6 mb-12">

        {/* Priority Tasks */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-emerald-600 mb-4">
            Priority Tasks
          </h2>

          {priorityTasks.length > 0 ? (
            priorityTasks.map((task) => (
              <TodayTask
                key={task._id}
                title={task.title}
                dueDate={new Date(task.dueDate).toLocaleString()}
                id={task._id}
              />
            ))
          ) : (
            <p className="text-gray-500">No urgent tasks 🎉</p>
          )}

          <div className="mt-4">
            <AddAndManageButtons
              inform="Create Task"
              manage="Manage Tasks"
              display={() => navigate("/task")}
              direction="/task"
            />
          </div>
        </div>

        {/* Today's Events */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-emerald-600 mb-4">
            Today’s Events
          </h2>

          {eventsToday.length > 0 ? (
            eventsToday.slice(0, 3).map((event) => (
              <UpcomingEvents key={event._id} event={event} />
            ))
          ) : (
            <p className="text-gray-500">No events scheduled</p>
          )}

          <div className="mt-4">
            <AddAndManageButtons
              inform="Create Event"
              manage="Manage Events"
              display={() => navigate("/event")}
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
                className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 mb-3"
              >
                <p className="font-medium">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.email}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No recent contacts</p>
          )}
        </div>
      </div>

      {/* ===== NOTES + DOCUMENTS ===== */}
      <div className="grid lg:grid-cols-2 gap-6 mb-12">

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
              />
            ))
          ) : (
            <p className="text-gray-500">No recent notes</p>
          )}
        </div>

        {/* Documents */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-emerald-600 mb-4">
            Recently Updated Documents
          </h2>

          {recentDocuments.length > 0 ? (
            recentDocuments.slice(0, 4).map((doc) => (
              <DocumentSummary
                key={doc._id}
                title={doc.title}
                sender={doc.sender}
                type={doc.type}
                time={new Date(doc.updatedAt).toLocaleString()}
              />
            ))
          ) : (
            <p className="text-gray-500">No recent documents</p>
          )}
        </div>
      </div>

      {/* ===== CALENDAR ===== */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-emerald-600 mb-4">
          Event Calendar
        </h2>
        <div className="overflow-x-auto">
          <Busy />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
