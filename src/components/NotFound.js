import React from 'react'
import { NavLink } from 'react-router-dom'

function NotFound() {
  return (
    <div style={{textAlign: 'center', marginTop: 30}}>
      <h1>Không tìm thấy trang</h1>
      <NavLink to="/">Quay về danh sách báo cáo</NavLink>
    </div>
  )
}

export default NotFound