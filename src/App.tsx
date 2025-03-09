import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Подключаем стили

const API_URL = "http://10.211.55.5:5121/api/auth"; // Бэкенд URL

const App: React.FC = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const handleSendEmail = async () => {
    try {
      const res = await axios.post(`${API_URL}/send-code`,{email});
      setMessage(res.data.message); // Сообщение от сервера
      setStep(2);
    } catch (error: any) {
      // Если ошибка приходит от сервера
      if (error.response) {
        // Ответ от сервера
        setMessage(`Ошибка: ${error.response.data.message || "Неизвестная ошибка"}`);
      } else if (error.request) {
        // Нет ответа от сервера
        setMessage("Ошибка при соединении с сервером. Попробуйте позже.");
      } else {
        // Ошибка в запросе
        setMessage(`Ошибка: ${error.message}`);
      }
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await axios.post(`${API_URL}/verify-code`,{email,code});
      setMessage(res.data.message); // Сообщение от сервера
      if (res.data.success) setStep(3);
    } catch (error: any) {
      // Если ошибка приходит от сервера
      if (error.response) {
        // Ответ от сервера
        setMessage(`Ошибка: ${error.response.data.message || "Неизвестная ошибка"}`);
      } else if (error.request) {
        // Нет ответа от сервера
        setMessage("Ошибка при соединении с сервером. Попробуйте позже.");
      } else {
        // Ошибка в запросе
        setMessage(`Ошибка: ${error.message}`);
      }
    }
  };

  return (
      <div className="container">
        {step === 1 && (
            <>
              <h2>Введите Email</h2>
              <input
                  type="email"
                  placeholder="Введите вашу почту"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={handleSendEmail}>Продолжить</button>
            </>
        )}
        {step === 2 && (
            <>
              <h2>Введите код</h2>
              <input
                  type="text"
                  placeholder="Введите код из письма"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
              />
              <button onClick={handleVerifyCode}>Проверить</button>
            </>
        )}
        {step === 3 && <h2>✅ Регистрация завершена!</h2>}
        {message && <p>{message}</p>}
      </div>
  );
};

export default App;