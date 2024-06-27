import React, { useEffect, useRef, useState } from 'react'
import {Line} from "react-chartjs-2"


import {Chart as ChartJS,
  LineElement,
  CategoryScale, // X-axis
  LinearScale,//Y-axis
  PointElement,
  

} from "chart.js"

import "./index.css"


ChartJS.register(
  LineElement,
  CategoryScale, 
  LinearScale,
  PointElement,
  

)

const Chart= () => {
  const [data,setData]=useState([])
  const [timeFrame,settimeFrame]=useState("daily")
  const chartRef=useRef(null)

  useEffect(()=>{

    fetch("./data.json")
    .then(response=>response.json())
    .then(data=>setData(data))
  },[timeFrame])
  

  
const filteredData=data.filter((item)=>{
  const date=new Date(item.timestamp)
  console.log(date)
  if (timeFrame==="daily") return true 
  if (timeFrame==="weekly") return date.getDate()%7===0;
  if (timeFrame==="monthly") return date.getDate()===1 
  return false
})

const labels=filteredData.map(item=>new Date(item.timestamp).toLocaleDateString())
const values=filteredData.map(item=>item.value)
const dataValues={
  labels,
  datasets:[{
    labels:"sales of the week",
    data:values,
    backgroundColor:"aqua",
    borderColor:"black",
    pointBorderColor:"aqua"
  }]

}

const options={
  responsive:true,
  Plugins:{
    zoom:{
      pan:{
        enabled:true,
        mode:"x"
      },
    }
  },
  scales:{
    y:{
      //min:3,
       //max:6
    }
  }
}

const downloadChart=()=>{
 const link=document.createElement("a");
 link.href=chartRef.current.toBase64Image();
 link.download="chart.png";
 link.click()

}
   
  return (
    <div >
      <button onClick={downloadChart} className='btn btn-success mb-3'>Download Chart</button>

    <div className='mb-3'>
      <button onClick={()=>settimeFrame("daily")} className='btn btn-primary mr-2'>Daily</button>
      <button onClick={()=>settimeFrame("weekly")} className='btn btn-warning mr-2'>Weekly</button>
      <button onClick={()=>settimeFrame("monthly")} className='btn btn-danger'>Monthly</button>
    </div>

    <Line ref={chartRef} data={dataValues} options={options}>

    </Line>
      
    </div>
  )
}

export default Chart
