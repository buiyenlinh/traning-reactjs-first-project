import axios from 'axios';
import React, {useEffect, useState} from 'react'
import logo from "../assets/favicon.png"
import { Spinner } from 'react-bootstrap'
import { useNavigate } from "react-router-dom"
function Login () {
  const [user, setUser] = useState({username: '', password: ''});
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleLogin = (e) => {
    e.preventDefault();
    setError(validate(user));

    if (user.username && user.password) {
      login();
    }
  }

  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = 'Tên đăng nhập là bắt buộc';
    }
    
    if (!values.password) {
      errors.password = 'Mật khẩu là bắt buộc';
    }

    return errors;
  }

  const checkUsername = (_username) => {
    setUser(user => ({...user, username: _username}));
   
    if (!_username) {
      setError(pre => ({...pre, username: 'Tên đăng nhập là bắt buộc'}));
    } else {
      setError(pre => ({...pre, username: ''}));
    }
  }

  const checkPassword = (_password) => {
    setUser(pre => ({...pre, password: _password}));
    if (!_password) {
      setError(pre => ({...pre, password: 'Mật khẩu là bắt buộc'}));
    } else {
      setError(pre => ({...pre, password: ''}));
    }
  }

  const login = () => {
    setIsLoading(true);
    axios.post('https://qlsc.maysoft.io/server/api/auth/login', user)
    .then(response => {
      if (response.data.status) {
        let token = response.data.data.token_type + ' ' + response.data.data.access_token;
        localStorage.setItem('token', token);
        navigate('/')
      } else {
        setError(error => ({...error, error: response.data.errors}));
      }
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      setIsLoading(false);
    })
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  })

  return (
    <div className='login'>
      <div className='login-inner'>
        <div className='logo'>
          <img src={logo} />
        </div>
        <form onSubmit={handleLogin} >
          <div className='form-group mb-2'>
            <label><b>Tên đăng nhập</b></label>
            <input type="text" onChange={e => checkUsername(e.target.value)} value={user.username} name="username" className='form-control'/>
            <div className="text-danger error">{error.username}</div>
          </div>
          <div className='form-group mb-2'>
            <label><b>Mật khẩu</b></label>
            <input type="password" onChange={e => checkPassword(e.target.value)} value={user.password} name="password" className='form-control' />
            <div className="text-danger error">{error.password}</div>
          </div>
          <button type="submit" className='btn btn-primary w-100'>Đăng nhập</button>
          <div className='error text-danger' style={{marginTop: 15}} >{error.error}</div>
        </form>
      </div>
      {
        isLoading
        ? 
          <div className='loading'>
            <Spinner animation="border" variant="primary" />
          </div>
        : null
      }
    </div>
  )
}

export default Login;
