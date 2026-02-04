// // src/utils/delegateUtils.js



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
