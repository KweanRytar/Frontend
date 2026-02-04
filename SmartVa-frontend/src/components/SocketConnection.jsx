

import { useEffect } from "react";
import { socket } from "../socket";
import { useGetUserInfoQuery } from "../redux/dashboard/OverviewSlice";
import { useDispatch } from "react-redux";
import overviewApi from "../redux/dashboard/OverviewSlice";

import { toast } from "react-toastify";


const SocketConnection = () => {
  const dispatch = useDispatch();
  const loggedIn = localStorage.getItem("isLoggedIn");
  const { data: userInfo, isLoading } = useGetUserInfoQuery();
  const userId = userInfo?.user?._id;

  useEffect(() => {
    if (!loggedIn || isLoading || !userId) return;

    if (!socket.connected) socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("join", userId);
      console.log("Joined room for userId:", userId);
    })

    

    // Listen for new notifications
    socket.on("new-notification", (notification) => {

      // extract title by slicing at the start and and end of the character ""

      const title = notification.message.slice(0, 20) + (notification.message.length > 20 ? "..." : "");
    
toast.info(`New Notification on: ${title}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // ❗ Invalidate the RTK query so the notification list updates immediately
      dispatch(
    overviewApi.util.updateQueryData(
      "getAllNotifications",
      undefined,
      (draft) => {
        draft.notifications.unshift({
          _id: crypto.randomUUID(),
          message: notification.message,
          createdAt: new Date(),
        });
      }
    )
  );
    });

    return () => {
      socket.off("new-notification");
      socket.disconnect();
    };
  }, [loggedIn, isLoading, userId]);

  return null;
};

export default SocketConnection;
