import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
const server_api_url = process.env.SERVER_API_URL;
require('dotenv').config();

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input) return;

    const updatedMessages = [...messages, { text: input, sender: 'user' }];

    try {

      // Send input to backend
      const response = await axios.post(server_api_url, {
        messages: [{role: "user", content: input}]
      });

      // Extracting AI response from the response data
      const aiResponse = response.data.choices[0].message.content;
      updatedMessages.push({text: aiResponse, sender:'ai'});

    } catch (error){
      console.error('Error sending message:', error)
      updatedMessages.push({ text: "Error getting response.", sender: 'ai' });
    }

    // State update with new messages array
    setMessages(updatedMessages);

    // Clear input after sending
    setInput('');
  };

  return(
      <div className="App">
       <div className="chatbox">
         <div className="messages">
           {messages.map((message, index) => (
               <div key={index} className={`message ${message.sender}`}>
                 <img
                     src={message.sender === 'user' ? '/usericon.jpg' : '/aiicon.png'}
                     alt={message.sender}
                     className="profile-icon"
                 />
                 <span className="message-text">{message.text}</span>
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
