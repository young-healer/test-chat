import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./App.scss";
import cucumber from "./cucumber-rick.png";
const App = () => {
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const myDate = new Date().toLocaleTimeString();

  const socketRef = useRef();

  useEffect(() => {

    socketRef.current = io.connect("/");
    socketRef.current.on("your id", (id) => {
      setYourID(id);
    });
    socketRef.current.on("message", (message) => {
      receivedMessage(message);
    });
  }, []);
    console.log()

  function receivedMessage(message) {
    setMessages((oldMsgs) => [...oldMsgs, message]);
    document.getElementsByClassName("dialog")[0]?.scroll(0,2000)

  }

  function sendMessage(e) {

    e.preventDefault();
    if (message !== "") {
      const messageObject = {
        body: message,
        id: yourID,
        data: myDate,
      };
      setMessage("");
      socketRef.current.emit("send message", messageObject);
    }
  }

  function handleChange(e) {

    setMessage(e.target.value);
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <img src={cucumber} />
          <p>test-chat</p>
        </div>
      </div>
      <div className="dialog">
        {messages.map((message, index) => {
          if (message.id === yourID) {
            return (
              <div className="your-message" key={index}>
                <div className="message">{message.body}</div>
                <span className="date">{message.data}</span>
              </div>
            );
          }
          return (
            <div className="interlocutors">
              {messages.length - 1 === index && (
                <img className="avatar-for-dialogs" src={cucumber} />
              )}
              <div className="interlocutor" key={index}>
                <div className="message">{message.body}</div>
                <span className="date">{message.data}</span>
              </div>
            </div>
          );
        })}
      </div>
      <br />
      <form className="footer" onSubmit={sendMessage}>
        <textarea
          className="textarea"
          value={message}
          onChange={handleChange}
          placeholder="Type a message..."
        />
        <button className="button-send">Send</button>
      </form>
    </div>
  );
};
export default App;
