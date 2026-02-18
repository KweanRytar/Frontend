import React from "react";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { CiCircleMore } from "react-icons/ci";

const ContactCard = ({
  name,
  companyName,
  email,
  position,
  phoneNumber,
  time,
  displayDetails,
}) => {
  const formatDate = (t) => new Date(t).toLocaleDateString();
  const initial = name?.charAt(0)?.toUpperCase();

  return (
    <div
      onClick={displayDetails}
      className="cursor-pointer group
                 bg-white dark:bg-gray-800
                 border border-gray-200 dark:border-gray-700
                 rounded-2xl p-4
                 shadow-sm hover:shadow-md
                 transition-all duration-200
                 flex flex-col justify-between"
    >
      {/* HEADER: Avatar + Name + Company */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full 
                        bg-[#008235]/10 text-[#008235] 
                        flex items-center justify-center 
                        font-semibold text-lg">
          {initial}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {companyName || "—"}
          </p>
        </div>
      </div>

      {/* CONTACT INFO */}
      <div className="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2 truncate">
          <MdOutlineEmail className="text-[#008235]" />
          <span className="truncate">{email?.toLowerCase()}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaPhoneAlt className="text-[#008235]" />
          <span>{`0${phoneNumber}`}</span>
        </div>

        {position && (
          <div className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 text-[10px] w-fit">
            {position}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-[10px] text-gray-400">
          {formatDate(time)}
        </span>

        <span className="text-[10px] px-2 py-1 rounded-full bg-[#008235]/20 text-[#008235] font-medium flex items-center gap-1">
          <CiCircleMore className="text-xs" />
          Details
        </span>
      </div>
    </div>
  );
};

export default ContactCard;
