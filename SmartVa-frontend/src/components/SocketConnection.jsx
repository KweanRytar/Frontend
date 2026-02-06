import { useEffect } from "react";
import { socket } from "../socket";
import { useGetUserInfoQuery } from "../redux/dashboard/OverviewSlice";
import { useDispatch } from "react-redux";
import overviewApi from "../redux/dashboard/OverviewSlice";
import { toast } from "react-toastify";

const SocketConnection = () => {
  const dispatch = useDispatch();
  const { data: userInfo, isLoading } = useGetUserInfoQuery();
  const userId = userInfo?.user?._id;

  useEffect(() => {
    if (isLoading || !userId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join", userId);

    const handleNotification = (notification) => {
      const title =
        notification.message.slice(0, 20) +
        (notification.message.length > 20 ? "..." : "");

      toast.info(`New Notification: ${title}`);

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
    };

    socket.on("new-notification", handleNotification);

    return () => {
      socket.off("new-notification", handleNotification);
      // ❌ DO NOT disconnect socket
    };
  }, [isLoading, userId, dispatch]);

  return null;
};

export default SocketConnection;
