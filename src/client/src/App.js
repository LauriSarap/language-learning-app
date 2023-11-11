import React, { useState } from 'react';
import './App.css';
import {set} from "express/lib/application";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input) return;

    // Add user message to messages array
    const updatedMessages = [...messages, { text: input, sender: 'user' }];

    // TODO: Send 'input' to your backend and get the response from OpenAI
    // TODO: Add AI response to message array

    // AI response example for testing purposes
    const aiResponse = `Simulated response for: ${input}`;
    updatedMessages.push({ text: aiResponse, sender: 'ai' });

    // Update the state with new messages array
    setMessages(updatedMessages)

    // Clear input after sending
    setInput('');
  };

  return(
      <div className="App">
       <div className="chatbox">
         <div className="messages">
           {messages.map((message, index) => (
               <div key={index} className={`message ${message.sender}`}>
                 {message.text}
               </div>
           ))}
         </div>
         <div className="input-area">
           <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
           />
           <button onClick={sendMessage}>Send</button>
         </div>
       </div>
      </div>
  );
}

export default App;
