// // src/utils/delegateUtils.js

// const norm = (s) => (s || "").toLowerCase();
// const isCompleted = (status) => norm(status) === "completed";

// const isOverdue = (dueDate, status) => {
//   const d = new Date(dueDate);
//   const today = new Date();
//   return d < today && !isCompleted(status);
// };

// const matchDelegate = (del, query) => {
//   if (query?.email) return del.email === query.email;
//   if (query?.userId) return String(del.userId) === String(query.userId);
//   if (query?.name) return del.name === query.name;
//   return false;
// };

// const findDelegateInfo = (tasks, query) => {
//   for (const t of tasks) {
//     for (const d of t.delegate || []) {
//       if (matchDelegate(d, query)) return d;
//     }
//     for (const s of t.subtasks || []) {
//       for (const d of s.delegate || []) {
//         if (matchDelegate(d, query)) return d;
//       }
//     }
//   }
//   return null;
// };

// /**
//  * Returns details about a delegate:
//  * {
//  *   delegate: {name,email,phone} | null,
//  *   assignments: [{id,title,status,dueDate,type,parentTask?}, ...],
//  *   stats: {pending,completed,overdue,total}
//  * }
//  */
// export function getDelegateDetails(tasks, query) {
//   const delegateInfo = findDelegateInfo(tasks, query);

//   const assignments = [];
//   tasks.forEach((task) => {
//     // main task
//     if ((task.delegate || []).some((d) => matchDelegate(d, query))) {
//       assignments.push({
//         _id: task._id,
//         title: task.title,
//         status: task.status,
//         dueDate: task.dueDate,
//         type: "task",
//       });
//     }
//     // subtasks
//     (task.subtasks || []).forEach((sub, idx) => {
//       if ((sub.delegate || []).some((d) => matchDelegate(d, query))) {
//         assignments.push({
//           _id: `${task._id}-sub-${idx}`,
//           title: sub.title,
//           status: sub.status,
//           dueDate: sub.dueDate,
//           type: "subtask",
//           parentTask: task.title,
//         });
//       }
//     });
//   });

//   // compute stats
//   const stats = { pending: 0, completed: 0, overdue: 0, total: assignments.length };
//   assignments.forEach((a) => {
//     if (isCompleted(a.status)) stats.completed += 1;
//     else if (isOverdue(a.dueDate, a.status)) stats.overdue += 1;
//     else stats.pending += 1;
//   });

//   return { delegate: delegateInfo, assignments, stats };
// }

// export function filterAssignedTasks(assignments, filter = "all") {
//   const f = norm(filter);
//   if (f === "completed") return assignments.filter((a) => isCompleted(a.status));
//   if (f === "overdue") return assignments.filter((a) => isOverdue(a.dueDate, a.status));
//   if (f === "pending")
//     return assignments.filter((a) => !isCompleted(a.status) && !isOverdue(a.dueDate, a.status));
//   return assignments;
// }

export function getDelegateBg(pending, completed) {
  const total = pending + completed;
  
  // No tasks at all
  if (total === 0) return "bg-gray-400";
  
  // All tasks completed
  if (pending === 0 && completed > 0) return "bg-green-500";
  
  // Mix of pending and completed
  if (pending > 0 && completed > 0) {
    const completionRate = completed / total;
    if (completionRate >= 0.7) return "bg-green-400"; // 70%+ done
    if (completionRate >= 0.4) return "bg-yellow-400"; // 40-69% done
    return "bg-orange-400"; // Less than 40% done
  }
  
  // Only pending tasks (nothing completed yet)
  return "bg-red-500";
}