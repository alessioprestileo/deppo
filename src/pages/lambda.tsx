import React, { useEffect, useState } from 'react'

const Lambda: React.FC = () => {
  const [data, setData] = useState()
  const fetchData = async () => {
    const response = await fetch('/.netlify/functions/hello')
    const parsed = await response.json()

    setData(parsed)
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
