import React, { useEffect, useState, useMemo } from 'react'

// Components
import NoteDetails from '../components/NoteDetails'
import Overview from '../components/Overview'
import TodayTask from '../components/TodayTask'
import UpcomingEvents from '../components/UpcomingEvents'
import Visitors from '../components/Visitors'
import QuickNotes from '../components/QuickNotes'
import AddAndManageButtons from '../components/AddAndManageButtons'
import DocumentSummary from '../components/DocumentSummary'
import Busy from '../data/Busy'
import NewTask from '../components/NewTask'
import CreateEvent from '../components/CreateEvent'
import NewVisitor from '../components/NewVisitor'
import NewDocument from '../components/NewDocument'
import NewContact from '../components/NewContact'
import ContactCard from '../components/ContactCard'
import ContactDetailsCard from '../components/ContactDetailsCard'
import { useGetUserInfoQuery } from '../redux/dashboard/OverviewSlice'
import { Navigate } from 'react-router-dom'
 


// Redux queries (RTK Query hooks)
import { useGetAllContactsQuery } from '../redux/Contact/ContactSlice'
import { useGetDocumentsQuery } from '../redux/document/DocumentSlice'
import { useGetEventsForTodayQuery } from '../redux/event/EventSlice'
import { useGetNotesQuery } from '../redux/Note/NoteSlice'
import { useGetEmergencyTasksQuery, useGetOverdueTasksQuery,  useGetPendingTasksQuery, useGetTasksDueIn72HoursQuery, useGetAllTasksQuery } from '../redux/Task/TaskSlice'
import { useGetAllVisitorsQuery, useGetVisitorsByDayQuery } from '../redux/visitor/visitorSlice'

import { useNavigate } from 'react-router-dom'


const Dashboard = () => {
  // ====== STATE ======
   const navigate = useNavigate()
  const todaysDate = new Date();

  const [noteTodisplay, setNoteToDisplay]= useState()

 
  const {data: userData} = useGetUserInfoQuery()

  const [totalContact, setTotalContact] = useState()
  const [totalTask, setTotalTask] = useState()
  const [totalNotes, setTotalNotes] = useState()
  const [totalDocuments, setTotalDocuments] = useState()
  const [username, setUsername] = useState()
  const [totalVisitors, setTotalVisitors] = useState()
  const [newTaskOpen, setNewTaskOpen] = useState(false)
  const [createEventOpen, setCreateEventOpen] = useState(false)
  const [newVisitorOpen, setNewVisitorOpen] = useState(false)
  const [newDocumentOpen, setNewDocumentOpen] = useState(false)
  const [newContacts, setNewContacts] = useState(false)
  const [allContacts, setAllContacts] = useState()
  const [contacts, setContacts] = useState()
  const [viewContactDetails, setViewContactDetails] = useState(false)
  const [recentContacts, setRecentContact] = useState()
  
  const [noteDetails, setNoteDetails] = useState(false) 
  const [emergencyTasks, setEmergencyTasks] = useState([])
  const [overdueTasks, setOverdueTasks] = useState([])
  const [pendingTasks, setPendingTasks] = useState([])
  const [tasksDueIn3Days, setTasksDueIn3Days] = useState([])
  const [upComingEvents, setUpcomingEvents] = useState([])
  const [vistor4Day, setVisitor4Day] = useState([])
  const [currentContact, setCurrentContact] = useState()

  const [notes, setNotes] = useState([])
  const [latestNotes, setLatestNotes] = useState([])

  const [documents, setDocuments] = useState([])
  const [latestDocuments, setLatestDocuments] = useState([])

  const [randomNumber, setRandomNumber] = useState()
  const [userName, setUserName] = useState('')


  // Task categories for rotation
  const taskCategory = [
    'Red Zone Items',
    'Deadline Missed',
    'Awaiting Action',
    'Next 3 Days'
  ]

  // ====== API HOOKS ======
  const {data: allContactsData} = useGetAllContactsQuery()
  // const { data: totalContactsData } = useGetTotalContactsQuery()
  const { data: totalTaskData } = useGetAllTasksQuery()
  const { data: totalNotesData } = useGetNotesQuery()
  const { data: totalDocumentData } = useGetDocumentsQuery()
  const { data: totalVisitorsData } = useGetAllVisitorsQuery()
  const { data: emergencyTasksData } = useGetEmergencyTasksQuery()
  const { data: overdueTasksData } = useGetOverdueTasksQuery()
  const { data: tasksDueIn3DaysData } = useGetTasksDueIn72HoursQuery()
  const { data: pendingTasksData } = useGetPendingTasksQuery()
  const { data: eventForTodayData } = useGetEventsForTodayQuery()
  const { data: visitors4DayData } = useGetVisitorsByDayQuery(
    todaysDate.toISOString().split('T')[0]
  )
  


  // ====== SYNC DATA TO STATE ======
useEffect(() => {
  if (allContactsData) {
    setAllContacts(allContactsData.totalContacts);
    setContacts(allContactsData.contacts);
  }

 if(userData?.user) setUserName(userData?.user?.userName || '')


  if (visitors4DayData) setVisitor4Day(visitors4DayData.visitors || []);
  if (eventForTodayData) setUpcomingEvents(eventForTodayData.events || []);
  if (pendingTasksData) setPendingTasks(pendingTasksData?.tasks || []);
  if (tasksDueIn3DaysData) setTasksDueIn3Days(tasksDueIn3DaysData?.tasks || []);
  if (overdueTasksData) setOverdueTasks(overdueTasksData?.tasks || []);
  if (emergencyTasksData) setEmergencyTasks(emergencyTasksData?.tasks || []);

  // ✅ Removed totalContactsData line
  if (totalTaskData) setTotalTask(totalTaskData.totalTasks || 0);

  if (totalNotesData) {
    setTotalNotes(totalNotesData.totalNotes || 0);
    setNotes(totalNotesData.notes || []);
  }

  if (totalDocumentData) {
    setTotalDocuments(totalDocumentData.total || 0);
    setDocuments(totalDocumentData.data || []);
  }

  if (totalVisitorsData)
    setTotalVisitors(totalVisitorsData.total || 0);

  // Random number generator to rotate task category every 3 mins
  setRandomNumber(Math.floor(Math.random() * 4));
  const interval = setInterval(() => {
    setRandomNumber(Math.floor(Math.random() * 4));
  }, 180000);

  return () => clearInterval(interval);
}, [
  totalNotesData,
  totalTaskData,
  totalDocumentData,
  totalVisitorsData,
  emergencyTasksData,
  overdueTasksData,
  tasksDueIn3DaysData,
  pendingTasksData,
  eventForTodayData,
  visitors4DayData,
  allContactsData,
  
]);



  // ====== HELPERS ======

  // Format date into hh:mm AM/PM
  const dateConversion = (date) => {
    const originalHour = date.getHours()
    const hours = originalHour % 12 || 12
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const dayTime = originalHour >= 12 ? 'PM' : 'AM'
    return `${hours}:${minutes} ${dayTime}`

  }


  // recently created Contacts
   // ✅ Memoized filtered contacts (last 7 days)
const filteredContacts = useMemo(() => {
  if (!contacts) return [];
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  return contacts.filter(contact => {
    const createdAt = new Date(contact.createdAt);
    const updatedAt = new Date(contact.updatedAt);
    return createdAt >= sevenDaysAgo || updatedAt >= sevenDaysAgo;
  });
}, [contacts]);


  // Recently edited notes (last 7 days)
  const recentlyEditedNotes = () => {
    const now = new Date()
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(now.getDate() - 7)

    return notes.filter(note => {
      const createdAt = new Date(note.createdAt)
      const updatedAt = new Date(note.updatedAt)
      return createdAt >= sevenDaysAgo || updatedAt >= sevenDaysAgo
    })
  }

  // Recently edited documents (last 7 days)
  const recentlyEditedDocuments = () => {
    const today = new Date()
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(today.getDate() - 7)

    return documents.filter(document => {
      const createdAt = new Date(document.createdAt)
      const updatedAt = new Date(document.updatedAt)
      return createdAt >= sevenDaysAgo || updatedAt >= sevenDaysAgo
    })
  }




 // ====== UPDATE LATEST NOTES & DOCUMENTS ======
useEffect(() => {
  setLatestNotes(Array.isArray(notes) ? recentlyEditedNotes() : [])
  setLatestDocuments(Array.isArray(documents) ? recentlyEditedDocuments() : [])
}, [notes, documents])


const CreateNote = ()=>{
 

  navigate('/create-note')
}

  // ====== JSX ======
  return (
    <div className='bg-gray-100 min-h-screen p-8 dark:bg-gray-800 dark:text-white mt-10 md:mt-0'>
      <h1 className='text-3xl font-bold mt-22  mb-4'>Dashboard</h1>
      
      <small className='block mb-4 text-2xl text-white bg-green-500 p-4 rounded-md text-center'>
        {`Welcome back ${userName}`}
      </small>

      {/* Overview cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 mb-12'>
        <Overview name={'Contacts'} total={allContacts}/>
        <Overview name={'Tasks'} total={totalTask}/>
        <Overview name={'Notes'} total={totalNotes}/>
        <Overview name={'Documents'} total={totalDocuments}/>
        <Overview name={'Visitors'} total={totalVisitors}/>
      </div>

      {/* Task Categories (rotates every 3 mins) */}
      <small className='text-2xl'>{taskCategory[randomNumber]}</small>

      {/* Emergency / Overdue / Pending / Next 3 Days tasks */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10 mt-6'>
        {randomNumber === 0 && (
          emergencyTasks.length > 0 ?
            emergencyTasks.map(task => (
              <TodayTask key={task._id} title={task.title} dueDate={new Date(task.dueDate).toISOString()} id={task._id}/>
            ))
            : <p className="text-gray-500">No emergency task</p>
        )}

        {randomNumber === 1 && (
          overdueTasks?.length > 0 ?
            overdueTasks.map(task => (
              <TodayTask key={task._id} title={task.title} dueDate={new Date(task.dueDate)} id={task._id}/>
            ))
            : <p className='text-gray-500'>No overdue task</p>
        )}

        {randomNumber === 2 && (
          pendingTasks?.length > 0 ?
            pendingTasks.map(task => (
              <TodayTask key={task._id} title={task.title} dueDate={new Date(task.dueDate).toLocaleString()} id={task._id}/>
            ))
            : <p className='text-gray-500'>No pending task</p>
        )}

        {randomNumber === 3 && (
          tasksDueIn3Days?.length > 0 ?
            tasksDueIn3Days.map(task => (
              <TodayTask key={task._id} title={task.title} dueDate={new Date(task.dueDate).toLocaleString()} id={task._id}/>
            ))
            : <p className='text-gray-500'>No task due in next 72 hours</p>
        )}
      </div>

      <AddAndManageButtons inform={"Create Task"} manage={"Manage Tasks"} display={()=>setNewTaskOpen(true)} direction={'/task'}/>

      {/* Events */}
      <small className='text-2xl mb-10'>Upcoming Events</small>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10 mt-6'>
        {upComingEvents.length > 0 ? upComingEvents.map(event => (
          <UpcomingEvents key={event._id} event={event}/>
        )) : <p className='text-gray-500'>No event for today</p>}
      </div>
      <AddAndManageButtons inform={"Create Events"} manage={"Manage Events"} display={()=> setCreateEventOpen(true)} direction={'/event'}/>

      {/* Visitors */}
      <small className='text-2xl block mt-6'>Today's Visitor Log</small>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10 mt-6'>
        {vistor4Day.length > 0 ? vistor4Day.map(visitor => (
          <Visitors key={visitor._id} name={visitor.name} time={new Date(visitor.createdAt).toTimeString()} purpose={visitor.purpose} details={()=>{
                    navigate(`/visitor-details/${visitor._id}`, {
                      state: { visitor },
                    })
                  }}/>
        )) : <p className='text-gray-500'>No visitor for today</p>}
      </div>
      <AddAndManageButtons inform={"Create Visitor"} manage={"Manage Visitors"} display={()=> setNewVisitorOpen(true)} direction={'/visitor'}/>


        {/* Contacts */}
         <small className='text-2xl block mt-6'>Newest Connections</small>
         <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10 mt-6'>
        {
          allContacts > 0 ? filteredContacts.map(
            contact => (
             < ContactCard key={contact._id} companyName={contact.companyName} email={contact.email} name={contact.name} position={contact.position} phoneNumber={contact.phoneNumber} time={contact.createdAt} displayDetails={()=>{
              setCurrentContact(contact)
              setViewContactDetails(true)}}/>
            )
          ) : <p className='text-gray-500'>No recent contacts </p>
        }
         

         </div>
          <AddAndManageButtons inform={"Create New Connections"} manage={"Manage Contacts"} display={()=> setNewContacts(true)}  direction={'/contact'}/>
      {/* Notes */}
      <small className='text-2xl block mt-6'>Quick Notes</small>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10 mt-6'>
        {latestNotes.length > 0 ? latestNotes.map(note => (
          <QuickNotes key={note._id} time={new Date(note.createdAt).toString()} title={note.title} shortendDescription={note.contentText.length > 50 ? note.contentText.substring(0, 50) + '...' : note.description} details={()=>{
            setNoteToDisplay(note)
            setNoteDetails(true)


          }}/>
        )) : <p className='text-gray-500'>No recently edited notes</p>}
      </div>
      <AddAndManageButtons inform={"Create Note"} manage={"Manage Notes"} display={CreateNote} direction={'/note'}/>

      {/* Documents */}
      <small className='text-2xl block mt-6'>Document Summary</small>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-10 mt-6 justify-between gap-6'>
        {latestDocuments.length > 0 ? latestDocuments.map(document => (
          <DocumentSummary key={document._id} title={document.title} sender={document.sender} type={document.type} time={new Date(document.
updatedAt).toString()}/>
        )) : <p className='text-gray-500'>No recently created or edited documents</p>}
      </div>
      <AddAndManageButtons inform={"Create Document"} manage={"Manage Documents"} display={()=> setNewDocumentOpen(true)} direction={"/document"}/>

      {/* Busy Calendar */}
      <div className='mt-10'>
        <small className="text-2xl font-bold mb-4">Events</small>
        <div className='overflow-x-auto max-w-full'>
          <Busy />
        </div>
      </div>

{ newTaskOpen && <NewTask close={()=>setNewTaskOpen(false)} />}
{ createEventOpen && <CreateEvent close={()=>setCreateEventOpen(false)} />}
{newVisitorOpen && <NewVisitor close={()=>setNewVisitorOpen(false)} />}
{newDocumentOpen && <NewDocument close={()=>setNewDocumentOpen(false)}/>}
{newContacts && <NewContact close={()=> setNewContacts(false)}/>}

{viewContactDetails && <ContactDetailsCard contact={currentContact} unDisplayDetails={()=>{
  setViewContactDetails(false)
}} />}
{noteDetails && <NoteDetails close={()=>{setNoteDetails(false)}} note={noteTodisplay} />}

    </div>
  )
}

export default Dashboard
