import axios from 'axios'

import React, { useEffect, useState } from 'react'

const Lambda: React.FC = () => {
  const [data, setData] = useState()
  const fetchData = async () => {
    const response = await axios.get('/.netlify/functions/hello')

    setData(response.data)
  }
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <div>LAMBDA</div>
      <div>DATA: {JSON.stringify(data)}</div>
    </>
  )
}

export default Lambda
