import React from 'react'

const RenderEventContent = (eventInfo) => {
  return (
    <div className="relative group">
      <div
        className="w-3 h-3 rounded-full bg-red-600 mx-auto my-1"
        title={eventInfo.event.title}
      ></div>

      {/* Show on hover */}
      <div className="hidden group-hover:block absolute z-10 bg-white text-black p-2 border shadow-md rounded-md text-sm">
        <strong>{eventInfo.event.title}</strong><br />
        {new Date(eventInfo.event.start).toLocaleTimeString()}
      </div>
    </div>
  )
}

export default RenderEventContent