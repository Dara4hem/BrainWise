import React from "react";
import AppRoutes from "./routes";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AppProvider } from "./context/AppContext";
import Notification from "./components/Notification";
import ChatWidget from "./components/ChatWidget"; 

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppProvider>
          <Notification />

          <ChatWidget />

          <AppRoutes />
        </AppProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
