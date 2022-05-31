import React from 'react'
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import logo from "../assets/favicon.png"

function Main() {
  let activeStyle = { color: '#108dc7' };
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/dang-nhap')
  }

  return (
    <>
      <div className='header'>
        <div className='container'>
          <div className='header-inner'>
            <img src={logo} />
            <ul className='menu'>
              <li>
                <NavLink to="/" style={({ isActive }) => isActive ? activeStyle : undefined}>Danh sách</NavLink>
              </li>
              <li>
                <NavLink to="/theo-doi" style={({ isActive }) => isActive ? activeStyle : undefined}>Theo dõi</NavLink>
              </li>
              <li>
                <NavLink to="/thong-bao" style={({ isActive }) => isActive ? activeStyle : undefined}>Thông báo</NavLink>
              </li>
              <li>
                <NavLink to="/bieu-do" style={({ isActive }) => isActive ? activeStyle : undefined}>Biểu đồ</NavLink>
              </li>
              <li>
                <NavLink to="/ca-nhan" style={({ isActive }) => isActive ? activeStyle : undefined}>Cá nhân</NavLink>
              </li>
              <li>
                <span onClick={logout} style={{fontWeight: "bold", cursor: "pointer"}}>Đăng xuất</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  )
}

export default Main