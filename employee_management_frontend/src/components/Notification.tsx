import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useNotification } from "../context/NotificationContext";

const Notification: React.FC = () => {
  const { notifications } = useNotification();

  return (
    <ToastContainer position="top-end" className="p-3">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          bg={
            notification.type === "success"
              ? "success"
              : notification.type === "error"
              ? "danger"
              : "info"
          }
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">
              {notification.type.charAt(0).toUpperCase() +
                notification.type.slice(1)}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {notification.message}
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default Notification;
