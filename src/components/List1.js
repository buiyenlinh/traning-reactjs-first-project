import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';
import moment from 'moment';
import { FaEllipsisV, FaCalendarAlt, FaFilter } from "react-icons/fa";
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';


function List() {
  const navigate = useNavigate();
  const [list, setList] = useState();
  const [commonCode, setCommonCode] = useState();
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI3IiwianRpIjoiZjhkM2RmZDM3MTY4MDA2OWQ2YjMwMDJiOWRjMWY2MGRkNTcyYjIxNzRjMDE5M2E0NjEzNjk1NzU0ZjMwYmNjMmRiNjEyYmJiZjdhOWI5MjEiLCJpYXQiOjE2MjM2Mzg2ODUsIm5iZiI6MTYyMzYzODY4NSwiZXhwIjoxNjU1MTc0Njg1LCJzdWIiOiJoR2I1R0NUbjJPOWhpWE5tNVdLUSIsInNjb3BlcyI6W119.swb_t5wE60KB613MrDHcqjXDU8Evj595DpAIa7FGNalDOZEfuhuACZxJ-eoHyB_i22EaRD46iWQ1sCImbFLFDXl54ScYKC9LGdjpWeK1j5-SdE0OBCJ4wRRwxCSPk--jT9dSP7NcXmbSL9Z-4BonW0cQ1ZLaF0_MClMFQOo45zWx1SE6pQ_M7IK-IRBJXW4NO0kt-5HS7v0jNzYTZvlkAYUdup9CKPsPQDZxWgNbga6B1bkpwwKhKxz0wCL2FS8Llm4OD1Q832_4w7ur1pY6-lhrX8nxcOrZlc8Mrn99K_CLmgrwHrF6LY5zU7PW0DDTFDJxWwmixJlaud7HrDcH0hUDMTq2zmOzEA7qOUrqvN4bWCI8j3CHZ13auQ0foI-9HtEJR_O-_qjdyBiy5Z3vjR8tmGD0x3qrdBuajgOSn62c_N-jIOhnM1nkwmjE49TK8nz4jyxtVuCdFJvDOMQPZDS4B3fkOWm2z00V3WZcjedvXVEP7wRxMbOGVrQxXyEwy3WfNOzOOrAps0JVsSUhhjOuqrhwdqcLNwpKvNlfph6d8hhMfa5l61M3DjvRgwBl3_Oi8kTdTh8tEf7M-dfuLkKWtWrGPRvAZpYnaxQjpfzuPFSNYKa3gjNXKu58njgwtd46e5AuOuj246rzXvMCyjEw-DzsXWn8GaJJDhyRxkY'

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getList();
      getCommonCode();
    } else {
      navigate('/');
    }
  }, [])

  const getList = async () => {
    const filter = { page: 1 };
    if (filterStatus != '') {
      filter['status'] = filterStatus
    }
    await axios.post('https://qlsc.maysoft.io/server/api/getAllReports', filter, {
      headers: {
        'Authorization': token
      }
    }).then(response => {
      setList(response.data.data.data)
    }).catch (err => {
      console.log(err);
    })
  }

  const getCommonCode = async () => {
    await axios.post('https://qlsc.maysoft.io/server/api/getCommon', {
      groups: 'incidentObject, reportStatus, reportType'
    }, {
      headers: {
        'Authorization': token
      }
    }).then(response => {
      setCommonCode(response.data.data)
      console.log(response.data.data)
    }).catch (err => {
      console.log(err);
    })
  }

  const convertIntToDate = (_int) => {
    return moment(new Date(_int * 1000)).format('MM/DD/YYYY hh:MM')
  }

  const handleChangeStatus = (e) => {
    setFilterStatus(e.target.value);
  }

  return (
    <div className='list-page'>
      <div className='container'>
        <div className='filter'>
          <div className='search-date'>
            <DateTimeRangePicker disableClock={true} onChange={setFilterDate} value={filterDate} />
          </div>
          <div className='search-status'>
            <select onChange={handleChangeStatus} value={filterStatus}>
              {
                commonCode?.reportStatus?.map((item, index) => {
                  return (<option key={index} value={item.code}>{item.name}</option>)
                })
              }
            </select>
          </div>
          <div className='icon-filter'>
            <FaFilter size="25" onClick={getList} />
          </div>
        </div>
        <ul className='list row'>
          {list?.map((item) => 
            <li key={item.id.toString()} className="col-12 col-md-6 col-sm-12">
              <div className='item'>
                <div>
                  <b>{item.reportNo}</b>
                  {
                    commonCode?.reportStatus?.map((rs_item, index) => {
                      if (rs_item?.code == item?.status) {
                        return (
                          <span key={index} className="status">
                            {rs_item?.name}
                          </span>
                        )
                      }
                    })
                  }
                  <div><i>{convertIntToDate(item.reportTime)}</i></div>
                  <div>
                    {
                      commonCode?.reportType?.map((rt_item, index) => {
                        if (rt_item.code == item?.reportType) {
                          return ( <span key={index}>{rt_item.name} </span> )
                        }
                      })
                    }
                     | 
                    {
                      commonCode?.incidentObject?.map((ict_item, index) => {
                        if (ict_item.code == item?.incidentObject) {
                          return ( <span key={index}> {ict_item.name}</span> )
                        }
                      })
                    }
                    </div>
                  <div>{item?.detector}</div>
                  <div>{item?.shortDescription}</div>
                </div>
                <div>
                  <FaEllipsisV/>
                </div>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default List