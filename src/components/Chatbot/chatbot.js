import React, { useState } from 'react';
import './Chatbot.css'; // Importar el archivo CSS
import axios from 'axios'; // Importar Axios para hacer solicitudes HTTP

const Chatbot = () => {
  const [messages, setMessages] = useState([]); // Guardar mensajes
  const [userInput, setUserInput] = useState(''); // Entrada del usuario

  // Función para manejar el mensaje del usuario
  const handleUserMessage = async (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      // Agregar mensaje del usuario a la lista de mensajes
      setMessages([...messages, { text: userInput, sender: 'user' }]);
      setUserInput('');

      const token = localStorage.getItem('access_token'); // Asegúrate de tener el token en localStorage
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      try {
        // Hacer una solicitud al backend de Django para obtener la respuesta
        const response = await axios.post('http://localhost:8000/api/api/generate-response/', {
          question: userInput
        }, {
          headers: {
            'Authorization': `Bearer ${token}` // Enviar el token en el encabezado
          }
        });

        // Agregar la respuesta del bot
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: response.data.answer, sender: 'bot' }
        ]);
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Hubo un error al obtener la respuesta.', sender: 'bot' }
        ]);
        console.error("Error en la solicitud:", error);
      }
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbox">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleUserMessage}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Chatbot;
