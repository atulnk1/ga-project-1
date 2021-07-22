"user strict";
const { createClient } = require('@supabase/supabase-js');


const supabaseUrl = 'https://lzrvibrmfmuawvsxigbq.supabase.co'
const supabaseKey = SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const main = async (lat, long) => {
  let { data, error } = await supabase
  .rpc('nearest_stops_dynamic_lat_long', {your_lat: lat, your_long: long} )

  if(error) {
    console.error(error)
  }

  console.log(data)
  
  const newArr = []
  for(let element of data) {
    const myHeaders = new Headers();
    myHeaders.append("AccountKey", BUS_KEY);
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    console.log(element.busstopcode)
    const response = await fetch(`http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${element.busstopcode}`, requestOptions)
    const newData = await response.json()
    let newObj = {busStopCode: null, busArray: [], busFullArray: [], busList: "", mapLink: ""}
    newObj.busStopCode = newData.BusStopCode
    for(let i = 0; i < newData.Services.length; i++){
      let busObj = {}
      newObj.busArray.push(newData.Services[i].ServiceNo)
      
      busObj.busNo = newData.Services[i].ServiceNo
      let newDate = new Date()
      let newTime = newDate.getTime()
      console.log(newTime)
      let timeInMins1 = Date.parse(newData.Services[i].NextBus.EstimatedArrival) - newTime 
      timeInMins1 = Math.round((timeInMins1/1000)/60)
      let timeInMins2 = Date.parse(newData.Services[i].NextBus2.EstimatedArrival) - newTime
      timeInMins2 = Math.round((timeInMins2/1000)/60)
      
      busObj.busTime1 = newData.Services[i].NextBus.EstimatedArrival
      if(timeInMins1 < 2){
        busObj.diffTime1 = "Soon"
      } else if (isNaN(timeInMins1)){
        busObj.diffTime1 = "Time not available"
      } else {
        busObj.diffTime1 = timeInMins1
      }
      busObj.busTime2 = newData.Services[i].NextBus2.EstimatedArrival
      if(timeInMins2 < 2){
        busObj.diffTime2 = "Soon"
      } else if (isNaN(timeInMins2)){
        busObj.diffTime2 = "Time not available"
      }else {
        busObj.diffTime2 = timeInMins2
      }
      newObj.busFullArray.push(busObj)


      // console.log(newData.Services[i].ServiceNo)
    }
    newObj.mapLink = `https://developers.onemap.sg/commonapi/staticmap/getStaticImage?layerchosen=default&lat=${lat}&lng=${long}&zoom=17&height=512&width=400&lines=[[${lat},${long}],[${element.stoplat},${element.stoplong}]]:177,0,0:3&points=[${lat},${long},%22255,255,178%22,%22Y%22]|[${element.stoplat},${element.stoplong},%22175,50,0%22,%22B%22]`
    // newArr.push(newData.BusStopCode)
    newObj.busList = newObj.busArray.join(', ')
    newArr.push(newObj)
    
    // console.log(response)
  }

  console.log(newArr)

  createTable2(data, newArr)
  
}

const createTable2 = (data, newArr) => {
  // let table = document.querySelector('table')
  const container = document.querySelector('.container')
  let table = document.createElement('table')
  let thead = document.createElement('THEAD')
  let th1 = document.createElement('th')
  let th2 = document.createElement('th')
  let th3 = document.createElement('th')
  let th4 = document.createElement('th')
  let th5 = document.createElement('th')
  let th6 = document.createElement('th')

  th1.innerHTML = 'Bus Stop Code'
  th2.innerHTML = 'Stop Name' 
  th3.innerHTML = 'Bus Numbers'
  th4.innerHTML = 'Arriving In'
  th5.innerHTML = 'Next Bus'
  th6.innerHTML = 'Map Links'
  thead.appendChild(th1)
  thead.appendChild(th2)
  thead.appendChild(th3)
  thead.appendChild(th4)
  thead.appendChild(th5)
  thead.appendChild(th6)

  table.appendChild(thead)

  let tbody = document.createElement('TBODY')
  for(let i = 0; i < data.length; i++){
    let row = document.createElement('tr')
    row.className = "table-row"

    let rowDataOne = document.createElement('td')
    rowDataOne.innerHTML = data[i].busstopcode
    // rowDataOne.rowSpan = 2
    console.log(newArr[i].busFullArray.length)

    let rowDataTwo = document.createElement('td')
    rowDataTwo.innerHTML = data[i].description
    // rowDataTwo.rowSpan = 2
    row.appendChild(rowDataOne)
    row.appendChild(rowDataTwo)

    let rowDataThree = document.createElement('td')
    let rowDataFour = document.createElement('td')
    let rowDataFive = document.createElement('td')

    for(let j = 0; j < newArr[i].busFullArray.length; j++) {
      let row3 = document.createElement('tr')
      let row4 = document.createElement('tr')
      let row5 = document.createElement('tr')

      let innerRowData3 = document.createElement('td')
      let innerRowData4 = document.createElement('td')
      let innerRowData5 = document.createElement('td')

      innerRowData3.innerHTML = newArr[i].busFullArray[j].busNo
      innerRowData3.className = 'no-border'

      innerRowData4.innerHTML = newArr[i].busFullArray[j].diffTime1
      innerRowData4.className = 'no-border'

      innerRowData5.innerHTML = newArr[i].busFullArray[j].diffTime2
      innerRowData5.className = 'no-border'

      row3.appendChild(innerRowData3)
      row4.appendChild(innerRowData4)
      row5.appendChild(innerRowData5)


      rowDataThree.appendChild(row3)
      rowDataFour.appendChild(row4)
      rowDataFive.appendChild(row5)

    }

    row.appendChild(rowDataThree)
    row.appendChild(rowDataFour)
    row.appendChild(rowDataFive)
    

    let rowDataSix = document.createElement('td')
    let a = document.createElement('a')
    let text = document.createTextNode('Map Link')
    a.appendChild(text)
    a.title = 'Map Link'
    a.href = newArr[i].mapLink
    a.target = "_blank"
    rowDataSix.appendChild(a)

    row.appendChild(rowDataSix)

    tbody.appendChild(row)

    container.append(table)
  }

  table.appendChild(tbody)
}

// const createTable = (data, newArr) => {
//   // let table = document.querySelector('table')
//   const container = document.querySelector('.container')
//   let table = document.createElement('table')
//   let thead = document.createElement('THEAD')
//   let th1 = document.createElement('th')
//   let th2 = document.createElement('th')
//   let th3 = document.createElement('th')
//   let th4 = document.createElement('th')
//   th1.innerHTML = 'Bus Stop Code'
//   th2.innerHTML = 'Stop Name' 
//   th3.innerHTML = 'Bus Numbers'
//   th4.innerHTML = 'Map Links'
//   thead.appendChild(th1)
//   thead.appendChild(th2)
//   thead.appendChild(th3)
//   thead.appendChild(th4)
//   table.appendChild(thead)

//   let tbody = document.createElement('TBODY')
//   for(let i = 0; i < data.length; i++){
//     let row = document.createElement('tr')
//     row.className = "table-row"
//     let rowDataOne = document.createElement('td')
//     rowDataOne.innerHTML = data[i].busstopcode
//     let rowDataTwo = document.createElement('td')
//     rowDataTwo.innerHTML = data[i].description
//     console.log(newArr[i].busList)
//     let rowDataThree = document.createElement('td')
//     rowDataThree.innerHTML = newArr[i].busList
//     let rowDataFour = document.createElement('td')
//     let a = document.createElement('a')
//     let text = document.createTextNode('Map Link')
//     a.appendChild(text)
//     a.title = 'Map Link'
//     a.href = newArr[i].mapLink
//     a.target = "_blank"
//     rowDataFour.appendChild(a)

    

//     row.appendChild(rowDataOne)
//     row.appendChild(rowDataTwo)
//     row.appendChild(rowDataThree)
//     row.appendChild(rowDataFour)

//     tbody.appendChild(row)

//     container.append(table)
//   }

//   table.appendChild(tbody)
// }


const goFineMeSimple = () => {

  if(document.querySelector('table')) {
    let resetTable = document.querySelector('table')
    resetTable.innerHTML = ''
  }

  const status = document.querySelector('#status');
  const success = (position) => {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = `Your cooridnates are: Latitude: ${latitude}, Longitude: ${longitude}`

    console.log(`Your cooridnates are: Latitude is: ${latitude}, Longitude is: ${longitude}`);
    main(latitude, longitude)
  }

  const error = () => {
    status.textContent = 'Unable to retrieve your location';
  }

  if(!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser';
  } else {
    status.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(success, error);
  }

  

}

document.querySelector('#find-me').addEventListener('click', goFineMeSimple);