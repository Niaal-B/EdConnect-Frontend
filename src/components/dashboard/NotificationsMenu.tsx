import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import api from "@/lib/api";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type Notification = {
  id: number;
  recipient: number;
  sender: number;
  sender_username: string;
  notification_type: string;
  message: string;
  related_object_id: number;
  related_object_type: string;
  is_read: boolean;
  created_at: string;
};

export const NotificationsMenu = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const ws = useRef<WebSocket | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const getMessagesUrl = () => {
    if (user?.role === "mentor") return "/mentor/messages";
    return "/student/messages"; 
  };
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications/");
      setNotifications(res.data.results);
      setUnreadCount(res.data.filter((n: Notification) => !n.is_read).length);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsHost = import.meta.env.VITE_BACKEND_WEBSOCKET_HOST;
    const wsUrl = `${wsProtocol}//${wsHost}/ws/notifications/`;

    ws.current = new WebSocket(wsUrl);


    ws.current.onmessage = (event) => {
      console.log(event);
      const data = JSON.parse(event.data);
      if (data.type === "notification") {
        const newNotification = data.notification;
        
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((count) => count + 1);
        
        toast(newNotification.message, {
          description: `From: ${newNotification.sender_username}`,
          duration: 5000,
          action: {
            label: "Open",
            onClick: () => {
              navigate(getMessagesUrl());   },
          },
        });
      }
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem key={n.id} className="cursor-pointer">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">
                  {n.notification_type.replaceAll("_", " ")}
                </p>
                <p className="text-xs text-gray-500">{n.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>
            </DropdownMenuItem>
          ))
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-bridgeblue-600 cursor-pointer">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};