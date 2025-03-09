import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Switch, FormControlLabel, Typography, Box, } from "@mui/material"; // Импортируем компоненты MUI
import "./App.css"; // Подключаем стили

const API_URL = "http://10.211.55.5:5121/api/auth"; // Бэкенд URL

// Тип для языка
type Language = "ru" | "en";
// test

const App: React.FC = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState<Language>("ru"); // Состояние для языка
  const [timer, setTimer] = useState(0); // Таймер для отправки кода

  // Локализованные тексты
  const texts = {
    ru: {
      enterEmail: "Введите Email",
      enterCode: "Введите код",
      continue: "Продолжить",
      check: "Проверить",
      registrationComplete: "✅ Регистрация завершена!",
      error: "Ошибка",
      unknownError: "Неизвестная ошибка",
      connectionError: "Ошибка при соединении с сервером. Попробуйте позже.",
      resendCode: "Отправить код повторно",
      timerPrefix: "Отправить код повторно через",
    },
    en: {
      enterEmail: "Enter Email",
      enterCode: "Enter code",
      continue: "Continue",
      check: "Check",
      registrationComplete: "✅ Registration complete!",
      error: "Error",
      unknownError: "Unknown error",
      connectionError: "Connection error. Please try again later.",
      resendCode: "Resend code",
      timerPrefix: "Resend code in",
    },
  };

  // Запуск таймера
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSendEmail = async () => {
    if (!validateEmail(email)) {
      setMessage(`${texts[language].error}: Неверный формат почты`);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/send-code`, { email });
      setMessage(res.data.message); // Сообщение от сервера
      setStep(2);
      setTimer(60); // Устанавливаем таймер на 60 секунд
    } catch (error: any) {
      if (error.response) {
        setMessage(`${texts[language].error}: ${error.response.data.message || texts[language].unknownError}`);
      } else if (error.request) {
        setMessage(texts[language].connectionError);
      } else {
        setMessage(`${texts[language].error}: ${error.message}`);
      }
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await axios.post(`${API_URL}/verify-code`, { email, code });
      setMessage(res.data.message); // Сообщение от сервера
      if (res.data.success) setStep(3);
    } catch (error: any) {
      if (error.response) {
        setMessage(`${texts[language].error}: ${error.response.data.message || texts[language].unknownError}`);
      } else if (error.request) {
        setMessage(texts[language].connectionError);
      } else {
        setMessage(`${texts[language].error}: ${error.message}`);
      }
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
      <Box className="container" sx={{ padding: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
          <FormControlLabel
              control={
                <Switch
                    checked={language === "en"}
                    onChange={() => setLanguage(language === "ru" ? "en" : "ru")}
                    color="primary"
                />
              }
              label={language === "ru" ? "EN" : "RU"}
          />
        </Box>

        {step === 1 && (
            <>
              <Typography variant="h5" gutterBottom>
                {texts[language].enterEmail}
              </Typography>
              <TextField
                  label={texts[language].enterEmail}
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  type="email"
                  error={!validateEmail(email) && email !== ""}
                  helperText={!validateEmail(email) && email !== "" ? `${texts[language].error}: Неверный формат почты` : ""}
              />
              <Button variant="contained" fullWidth onClick={handleSendEmail} sx={{ marginTop: 2 }}>
                {texts[language].continue}
              </Button>
            </>
        )}

        {step === 2 && (
            <>
              <Typography variant="h5" gutterBottom>
                {texts[language].enterCode}
              </Typography>
              <TextField
                  label={texts[language].enterCode}
                  variant="outlined"
                  fullWidth
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  margin="normal"
                  type="text"
              />
              <Button variant="contained" fullWidth onClick={handleVerifyCode} sx={{ marginTop: 2 }}>
                {texts[language].check}
              </Button>
              {timer > 0 ? (
                  <Typography variant="body1" sx={{ marginTop: 2 }}>
                    {texts[language].timerPrefix} {timer} сек.
                  </Typography>
              ) : (
                  <Button variant="outlined" onClick={handleSendEmail} sx={{ marginTop: 2 }}>
                    {texts[language].resendCode}
                  </Button>
              )}
            </>
        )}

        {step === 3 && <Typography variant="h5">{texts[language].registrationComplete}</Typography>}

        {message && <Typography variant="body1" color="error" sx={{ marginTop: 2 }}>{message}</Typography>}

      </Box>
  );
};

export default App;
