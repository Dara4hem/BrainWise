import React from "react";
import AppRoutes from "./routes";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AppProvider } from "./context/AppContext";
import Notification from "./components/Notification";
import ChatWidget from "./components/ChatWidget"; // استيراد الشات بوت

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppProvider>
          {/* مكون الإشعارات العام */}
          <Notification />

          {/* مكون الشات بوت العائم */}
          <ChatWidget />

          {/* الراوتس */}
          <AppRoutes />
        </AppProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
