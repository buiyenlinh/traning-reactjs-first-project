import Router from "./Router"
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import Main from "./components/Main"

function App() {
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const checkLogin = () => {
    let _token = localStorage.getItem('token');
    if (_token) {
      setToken(_token);
    } else {
      navigate('/dang-nhap');
    }
  }

  useEffect(checkLogin, [])

  return (
    <div className="App">
      <Router/>
    </div>
  );
}

export default App;
