import React, { useState, useRef } from "react";
import { Button, Offcanvas, Form } from "react-bootstrap";
import { FaCommentAlt } from "react-icons/fa";
import TypingIndicator from "./TypingIndicator";

type SenderType = "user" | "bot";

interface Message {
  sender: SenderType;
  text: string;
  isChoice?: boolean;
}

const ChatWidget: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [hasChosenLanguage, setHasChosenLanguage] = useState(false);
  const [botTyping, setBotTyping] = useState(false);

  // 1) Create a ref for the end of the messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Toggles the chat panel
  const toggleChat = () => {
    if (!showChat && !hasChosenLanguage) {
      const choiceMessage: Message = {
        sender: "bot",
        text: "اختر اللغة المناسبة",
        isChoice: true,
      };
      setMessages([choiceMessage]);
    }
    setShowChat(!showChat);
  };

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLanguageChoice = (choice: "hello" | "azayek") => {
    setHasChosenLanguage(true);
    setMessages((prev) => prev.filter((msg) => !msg.isChoice));

    const greetingMessage: Message = {
      sender: "bot",
      text:
        choice === "hello"
          ? "Hello! I'm Mustafa Darahem's Bot. I was created to help review the code. Ask me anything about the project, and I'll answer!"
          : "ازيك! انا بوت مصطفى دراهم. اتعملت علشان اساعد الشخص اللي بيراجع الكود. اسألني في أي حاجة تخص المشروع وهجاوبك!",
    };
    setMessages((prev) => [...prev, greetingMessage]);

    // Optionally scroll to bottom after greeting
    scrollToBottom();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      sender: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);

    const userQuery = input;
    setInput("");

    try {
      setBotTyping(true);

      const response = await fetch("http://127.0.0.1:8000/chatbot/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery }),
      });
      const data = await response.json();
      const botReply = data.response || "No reply from bot.";

      const botMessage: Message = {
        sender: "bot",
        text: botReply,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        sender: "bot",
        text: "Error occurred while fetching bot response.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setBotTyping(false);
      // Optionally auto-scroll after each new message
      scrollToBottom();
    }
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          zIndex: 9999,
        }}
      >
        <FaCommentAlt />
      </Button>

      <Offcanvas
        show={showChat}
        onHide={toggleChat}
        placement="end"
        style={{ width: "350px" }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>ChatBot</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column">

          {/* Scroll to Bottom Button */}
          <Button
            variant="link"
            className="ms-auto mb-2"
            onClick={scrollToBottom}
            style={{ textDecoration: "none" }}
          >
            Scroll to Bottom
          </Button>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              marginBottom: "1rem",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {messages.map((msg, idx) => {
              if (msg.isChoice) {
                return (
                  <div key={idx} style={{ margin: "10px 0" }}>
                    <div style={{ marginBottom: "10px" }}>
                      <strong>Bot:</strong> {msg.text}
                    </div>
                    <Button
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => handleLanguageChoice("hello")}
                    >
                      Hello
                    </Button>
                    <Button
                      variant="outline-success"
                      onClick={() => handleLanguageChoice("azayek")}
                    >
                      ازيك
                    </Button>
                  </div>
                );
              }

              // Detect code by triple backticks (```).
              const isCode = msg.sender === "bot" && msg.text.includes("```");

              if (isCode) {
                return (
                  <div
                    key={idx}
                    style={{
                      textAlign: "left",
                      margin: "5px 0",
                    }}
                  >
                    <strong>Bot:</strong>
                    <pre
                      style={{
                        backgroundColor: "#f5f2f0",
                        padding: "10px",
                        borderRadius: "5px",
                        overflowX: "auto",
                        marginTop: "5px",
                      }}
                    >
                      {msg.text}
                    </pre>
                  </div>
                );
              } else {
                return (
                  <div
                    key={idx}
                    style={{
                      textAlign: msg.sender === "user" ? "right" : "left",
                      margin: "5px 0",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "8px 12px",
                        borderRadius: "15px",
                        backgroundColor:
                          msg.sender === "user" ? "#007bff" : "#e9ecef",
                        color: msg.sender === "user" ? "#fff" : "#000",
                        maxWidth: "80%",
                      }}
                    >
                      {msg.sender === "bot" && !isCode ? "Bot: " : ""}
                      {msg.text}
                    </span>
                  </div>
                );
              }
            })}

            {botTyping && (
              <div style={{ textAlign: "left", margin: "5px 0" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "15px",
                    backgroundColor: "#e9ecef",
                    color: "#000",
                    maxWidth: "80%",
                  }}
                >
                  <TypingIndicator />
                </span>
              </div>
            )}

            {/* The bottom marker to scroll into view */}
            <div ref={messagesEndRef} />
          </div>

          <div>
            <Form.Control
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button variant="success" className="mt-2 w-100" onClick={handleSend}>
              Send
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default ChatWidget;
