import React from 'react'
import { useRoutes } from 'react-router-dom'
import Main from "./components/Main"
import Persional from "./components/Personal"
import List from "./components/List"
import Login from "./components/Login"
import NotFound from "./components/NotFound"
import Follow from "./components/Follow"
import Chart from "./components/Chart"
import Notification from "./components/Notification"
function Router() {
  const element = useRoutes([
    {
      path: "/dang-nhap",
      element: <Login />,
    },
    {
      path: '/',
      element: <Main />,
      children: [
        { path: "/danh-sach", element: <List /> },
        { path: "/theo-doi", element: <Follow /> },
        { path: "/thong-bao", element: <Notification /> },
        { path: "/bieu-do", element: <Chart /> },
        { path: "/ca-nhan", element: <Persional />},
      ]
    },
    {
      path: "*", element: <NotFound />,
    },
  ]);
  return element;
}

export default Router