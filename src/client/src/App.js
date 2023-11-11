import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
const server_api_url = process.env.REACT_APP_SERVER_API_URL;
console.log('Server API URL: ', server_api_url)

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [devMode, setDevMode] = useState(false);

  function convertNewlinesToJSX(text) {
    return text.split('\n').map((line, index, array) => (
        index === array.length - 1 ? line : <React.Fragment key={index}>{line}<br/></React.Fragment>
    ));
  }

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom(); // Scroll to bottom whenever messages change
  }, [messages]);

  const sendMessage = async () => {
    if (!input) return;
    const user_message = input;
    setMessages(prevMessages => [...prevMessages, { text: user_message, sender: 'user' }]);
    setInput('');

    //const updatedMessages = [...messages, { text: input, sender: 'user' }];
    if (devMode){
      const sampleResponse = "This is a sample response in developer mode.\n Life goes on and on and on and onnn.";
      setMessages(prevMessages => [...prevMessages, { text: sampleResponse, sender: 'ai' }]);
    }
    else {
      try {
        // Send input to backend
        const response = await axios.post(`${server_api_url}/chat`, {
          messages: [{role: "user", content: user_message}]
        })
            .catch(error => {
              console.error('Error sending message:', error);
              console.log(error.response); // This will give you more insight
            });

        // Extracting AI response from the response data
        const aiResponse = response.data.choices[0].message.content;
        setMessages(prevMessages => [...prevMessages, { text: aiResponse, sender: 'ai' }]);

      } catch (error){
        console.error('Error sending message:', error);
        setMessages(prevMessages => [...prevMessages, { text: "Error getting response.", sender: 'ai' }]);
      }
    }

    // Clear input after sending
    setInput('');
  };

  return(
      <div className="App">
        <div className="dev-mode-toggle">
          <label>
            Developer Mode:
            <input
                type="checkbox"
                checked={devMode}
                onChange={() => setDevMode(!devMode)}
            />
          </label>
        </div>
           <div className="chatbox">
               <div className="messages">
                 {messages.map((message, index) => (
                     <div key={index} className={`message ${message.sender}`}>
                       <img
                           src={message.sender === 'user' ? '/usericon.jpg' : '/aiicon.png'}
                           alt={message.sender}
                           className="profile-icon"
                       />
                       <span className="message-text">{convertNewlinesToJSX(message.text)}</span>
                     </div>
                 ))}
                 <div ref={messagesEndRef} />
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
