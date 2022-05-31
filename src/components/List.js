import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import {Spinner, Row, Col, Button} from 'react-bootstrap';
import useFunction from "./useFunction"
import 'bootstrap-daterangepicker/daterangepicker.css'
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { FaFilter, FaCalendarAlt } from "react-icons/fa";
import ReactPaginate from 'react-paginate';


function List() {
  const [list, setList] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterDateDisplay, setFilterDateDisplay] = useState('');
  const [commonCode, setCommonCode] = useState('');
  const [department, setDepartment] = useState([]);
  const { convertIntToDate, convertIntToDateTime } = useFunction();
  const [limitEntry, setLimitEntry] = useState(30);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [filterReportType, setFilterReportType] = useState('');
  const [filterKey, setFilterKey] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterIncident, setFilterIncident] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelFilter, setIsCancelFilter] = useState(false);

  const getList = async () => {
    setIsCancelFilter(false);
    const filter = {
      page: page,
      limitEntry: limitEntry
    };
    if (filterStatus != '') {
      filter['status'] = filterStatus
    }

    if (filterDate != '') {
      filter['reportTime'] = filterDate
    }

    if (filterReportType != '') {
      filter['reportType'] = filterReportType
    }

    if (filterKey != '') {
      filter['searchKey'] = filterKey
    }

    if (filterDepartment != '') {
      filter['departmentId'] = filterDepartment
    }

    if (filterIncident != '') {
      filter['incidentObject'] = filterIncident
    }
    
    setIsLoading(true);
    await axios.post('https://qlsc.maysoft.io/server/api/getAllReports', filter, {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    }).then(response => {
      setList(response.data.data.data);
      setTotalPage(response.data.data.sizeQuerySnapshot)
    }).catch (err => {
      console.log(err);
    }).finally(() => {
      setIsLoading(false);
    })
  }

  const getCommonCode = async () => {
    await axios.post('https://qlsc.maysoft.io/server/api/getCommon', {
      groups: 'incidentObject, reportStatus, reportType'
    }, {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    }).then(response => {
      setCommonCode(response.data.data)

    }).catch (err => {
      console.log(err);
    })
  }

  useEffect(() => {
    getList();
  }, [page])

  useEffect(() => {
    getCommonCode();
    getDepartment();
  }, [])

  const handleChangeStatus = (e) => {
    setFilterStatus(e.target.value);
  }

  const handleEvent = (event, picker) => {
    setFilterDate(picker.startDate / 1000 + ', ' + picker.endDate / 1000);
    setFilterDateDisplay(convertIntToDate(picker.startDate / 1000) + ' - ' + convertIntToDate(picker.endDate / 1000));
  }

  const handleChangePage = (event) => {
    setPage(event.selected + 1);
  }

  const handleChangeReportType = (e) => {
    setFilterReportType(e.target.value);
  }

  const handleChangeSearchKey = (e) => {
    setFilterKey(e.target.value);
  }

  const handleChangeDepartment = (e) => {
    setFilterDepartment(e.target.value);
  }

  const getDepartment = () => {
    axios.post('https://qlsc.maysoft.io/server/api/getAllDepartments', {}, {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    }).then(response => {
      setDepartment(response.data.data.data);
    }).catch(err => {
      console.log(err);
    })
  }

  const handleChangeIncident = (e) => {
    setFilterIncident(e.target.value);
  }

  useEffect(() => {
    getList();
  }, [isCancelFilter])

  const cancelFilter = () => {
    setIsCancelFilter(true);
    setFilterDate('');
    setFilterDepartment('');
    setFilterIncident('');
    setFilterStatus('');
    setFilterReportType('');
    setFilterKey('');

   
  }

  return (
    <div className='list-report'>
      <div className='container'>
        <div className='filter'>
          <Row>
            <Col xs={6} md={3} style={{marginBottom: 7}}>
              <input className='form-control' placeholder={'Tìm từ khóa...'} onChange={handleChangeSearchKey} value={filterKey} />
            </Col>
            <Col xs={6} md={3} style={{marginBottom: 7}}>
              <div className='search-status'>
                <select onChange={handleChangeStatus} value={filterStatus} className="form-control">
                  <option value="">--- Chọn trạng thái ---</option>
                  {
                    commonCode?.reportStatus?.map((item, index) => {
                      return (<option key={index} value={item.code}>{item.name}</option>)
                    })
                  }
                </select>
              </div>
            </Col>
            <Col xs={6} md={3} style={{marginBottom: 7}}>
              <div className='search-report-type'>
                <select onChange={handleChangeReportType} value={filterReportType} className="form-control">
                  <option value="">--- Chọn loại báo cáo ---</option>
                  {
                    commonCode?.reportType?.map((item, index) => {
                      return (<option key={index} value={item.code}>{item.name}</option>)
                    })
                  }
                </select>
              </div>
            </Col>
            <Col xs={6} md={3} style={{marginBottom: 7}}>
              <div className='search-report-type'>
                <select onChange={handleChangeDepartment} value={filterDepartment} className="form-control">
                  <option value="">--- Chọn phòng ban ---</option>
                  {
                    department?.map((item, index) => {
                      return (<option key={index} value={item.id}>{item.departmentName}</option>)
                    })
                  }
                </select>
              </div>
            </Col>
            <Col xs={6} md={3} style={{marginBottom: 7}}>
              <div className='search-incident'>
                <select onChange={handleChangeIncident} value={filterIncident} className="form-control">
                  <option value="">--- Chọn đối tượng ---</option>
                  {
                    commonCode?.incidentObject?.map((item, index) => {
                      return (<option key={index} value={item.code}>{item.name}</option>)
                    })
                  }
                </select>
              </div>
            </Col>
            <Col xs={6} md={3} style={{marginBottom: 7}}>
              <div className='search-date'>
                <DateRangePicker onEvent={handleEvent}>
                  <div className='search-date-display form-control'>
                    <div>{filterDateDisplay}</div>
                    <FaCalendarAlt size="20" style={{margin: 2}} />
                  </div>
                </DateRangePicker>
              </div>
            </Col>
            <Col xs={6} md={1} style={{marginTop: 5}}>
              <div className='icon-filter'>
                <FaFilter size="25" onClick={getList} style={{marginRight: 5}} />
                <Button className='btn btn-sm' variant="outline-dark" onClick={cancelFilter}>Hủy</Button>
              </div>
            </Col>
          </Row>
        </div>
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Trạng thái</th>
              <th>Thời gian</th>
              <th>Loại</th>
              <th>#</th>
              <th>Mô tả ngắn</th>
            </tr>
          </thead>
          <tbody>
            {
              list?.map((item) => {
                return (
                <tr key={item.id.toString()}>  
                  <td><b>{item.reportNo}</b></td>
                  <td>
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
                  </td>
                  <td>
                    <i>{convertIntToDateTime(item.reportTime)}</i>
                  </td>
                  <td>
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
                  </td>
                  <td>{item?.detector}</td>
                  <td>{item?.shortDescription}</td>
                </tr>
                )
              })
            }
          </tbody>
        </Table>
        <div className='paginate'>
          <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handleChangePage}
            pageRangeDisplayed={3}
            pageCount={Math.ceil(totalPage / limitEntry)}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
          />
        </div>
        { isLoading ?
        <div className='loading'>
          <Spinner animation="border" variant="primary" />
        </div>
        : null
        }
      </div>
    </div>
  )
}

export default List