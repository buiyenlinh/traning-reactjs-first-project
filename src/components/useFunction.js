import React from 'react'
import moment from 'moment';
function useFunction() {
  const convertIntToDateTime = (_int) => {
    return moment(new Date(_int * 1000)).format('DD/MM/YYYY hh:MM')
  }

  const convertIntToDate = (_int) => {
    return moment(new Date(_int * 1000)).format('DD/MM/YYYY')
  }

  return {
    convertIntToDate,
    convertIntToDateTime
  }
}

export default useFunction