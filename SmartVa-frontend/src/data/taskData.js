import mongoose from 'mongoose';
const mockTasks = [];
const delegates = [
  { name: "Alice Johnson", email: "alice@example.com", phone: "+49 123 456 7890" },
  { name: "Bob Smith", email: "bob@example.com", phone: "+49 111 222 3334" },
  { name: "Charlie Evans", email: "charlie@example.com", phone: "+49 555 677 8899" },
  { name: "Diana Prince", email: "diana@example.com", phone: "+39 666 778 8990" },
  { name: "Ethan Hunt", email: "ethan@example.com", phone: "+39 333 445 5667" },
  { name: "Frank Miller", email: "frank@example.com", phone: "+49 210 987 6543" },
  { name: "Grace Lee", email: "grace@example.com", phone: "+49 200 300 400" },
  { name: "Hank Zhao", email: "hank@example.com", phone: "+49 400 500 600" },
];
const priorities = ["Low", "Medium", "High"];
const statuses = ["Pending", "In Progress", "Completed"];

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

for (let i = 1; i <= 100; i++) {
  mockTasks.push({
    _id: i,
    title: `Task ${i}`,
    description: `Description for Task ${i}`,
    dueDate: randomDate(new Date("2025-07-01"), new Date("2025-12-31")),
    delegate: [{ userId: i + 100, ...delegates[i % delegates.length] }],
    priorites: priorities[i % priorities.length],
    status: statuses[i % statuses.length],
    userId: i + 200,
    subtasks: [
      {
        title: `Subtask 1 for Task ${i}`,
        description: `Description for subtask 1 of Task ${i}`,
        dueDate: randomDate(new Date("2025-07-01"), new Date("2025-12-31")),
        delegate: [{ userId: i + 101, ...delegates[(i + 1) % delegates.length] }],
        priority: priorities[(i + 1) % priorities.length],
        status: statuses[(i + 1) % statuses.length],
      },
      {
        title: `Subtask 2 for Task ${i}`,
        description: `Description for subtask 2 of Task ${i}`,
        dueDate: randomDate(new Date("2025-07-01"), new Date("2025-12-31")),
        delegate: [{ userId: i + 102, ...delegates[(i + 2) % delegates.length] }],
        priority: priorities[(i + 2) % priorities.length],
        status: statuses[(i + 2) % statuses.length],
      },
    ],
  });
}
export default mockTasks;
