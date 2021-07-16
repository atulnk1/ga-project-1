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
    let newObj = {busStopCode: null, busArray: [], busList: "", mapLink: ""}
    newObj.busStopCode = newData.BusStopCode
    for(let i = 0; i < newData.Services.length; i++){
      newObj.busArray.push(newData.Services[i].ServiceNo)
      console.log(newData.Services[i].ServiceNo)
    }
    newObj.mapLink = `https://developers.onemap.sg/commonapi/staticmap/getStaticImage?layerchosen=default&lat=${lat}&lng=${long}&zoom=17&height=512&width=400&lines=[[${lat},${long}],[${element.stoplat},${element.stoplong}]]:177,0,0:3&points=[${lat},${long},%22255,255,178%22,%22Y%22]|[${element.stoplat},${element.stoplong},%22175,50,0%22,%22B%22]`
    // newArr.push(newData.BusStopCode)
    newObj.busList = newObj.busArray.join(', ')
    newArr.push(newObj)
    
    // console.log(response)
  }

  console.log(newArr)

  // console.log(newArr)

  // getBus(data)

  createTable(data, newArr)
  
}


// const main = async (lat, long) => {
//   let { data, error } = await supabase
//   .rpc('nearest_stops_dynamic', {your_lat: lat, your_long: long} )

//   if(error) {
//     console.error(error)
//   }

//   console.log(data)
  
//   const newArr = []
//   for(let element of data) {
//     const myHeaders = new Headers();
//     myHeaders.append("AccountKey", BUS_KEY);
//     const requestOptions = {
//       method: 'GET',
//       headers: myHeaders,
//       redirect: 'follow'
//     };
//     console.log(element.busstopcode)
//     const response = await fetch(`http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${element.busstopcode}`, requestOptions)
//     const newData = await response.json()
//     let newObj = {busStopCode: null, busArray: [], busList: ""}
//     newObj.busStopCode = newData.BusStopCode
//     for(let i = 0; i < newData.Services.length; i++){
//       newObj.busArray.push(newData.Services[i].ServiceNo)
//       console.log(newData.Services[i].ServiceNo)
//     }
//     // newArr.push(newData.BusStopCode)
//     newObj.busList = newObj.busArray.join(', ')
//     newArr.push(newObj)
    
//     // console.log(response)
//   }

//   console.log(newArr)

//   // console.log(newArr)

//   // getBus(data)

//   createTable(data, newArr)
  
// }


// const main = async (lat, long) => {
//   let { data, error } = await supabase
//   .rpc('nearest_stops_dynamic', {your_lat: lat, your_long: long} )

//   if(error) {
//     console.error(error)
//   }

//   console.log(data)

//   const newArr = []
//   for(let element of data) {
//     const myHeaders = new Headers();
//     myHeaders.append("AccountKey", BUS_KEY);
//     const requestOptions = {
//       method: 'GET',
//       headers: myHeaders,
//       redirect: 'follow'
//     };
//     console.log(element.busstopcode)
//     fetch(`http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${element.busstopcode}`, requestOptions)
//       .then(response => response.json())
//       .then(result => console.log(result.BusStopCode))
//       // .then(result => newArr.push(result))
//       .catch(error => console.log('error', error));
    
//     // console.log(response)
//   }

//   // console.log(newArr)

//   // getBus(data)

//   createTable(data)
  
// }

// const getBus = async (data) => {
//   for(let element of data) {
//     const myHeaders = new Headers();
//     myHeaders.append("AccountKey", BUS_KEY);
//     const requestOptions = {
//       method: 'GET',
//       headers: myHeaders,
//       redirect: 'follow'
//     };
//     console.log(element.busstopcode)
//     fetch(`http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${element.busstopcode}}}`, requestOptions)
//       .then(response => response.text())
//       .then(result => console.log(result))
//       .catch(error => console.log('error', error));
    
//     console.log(response)
//   }

// }


const createTable = (data, newArr) => {
  let table = document.querySelector('table')
  let thead = document.createElement('THEAD')
  let th1 = document.createElement('th')
  let th2 = document.createElement('th')
  let th3 = document.createElement('th')
  let th4 = document.createElement('th')
  th1.innerHTML = 'Bus Stop Code'
  th2.innerHTML = 'Stop Name' 
  th3.innerHTML = 'Bus Numbers'
  th4.innerHTML = 'Map Links'
  thead.appendChild(th1)
  thead.appendChild(th2)
  thead.appendChild(th3)
  thead.appendChild(th4)
  table.appendChild(thead)

  let tbody = document.createElement('TBODY')
  for(let i = 0; i < data.length; i++){
    let row = document.createElement('tr')
    row.className = "table-row"
    let rowDataOne = document.createElement('td')
    rowDataOne.innerHTML = data[i].busstopcode
    let rowDataTwo = document.createElement('td')
    rowDataTwo.innerHTML = data[i].description
    console.log(newArr[i].busList)
    let rowDataThree = document.createElement('td')
    rowDataThree.innerHTML = newArr[i].busList
    let rowDataFour = document.createElement('td')
    let a = document.createElement('a')
    let text = document.createTextNode('Map Link')
    a.appendChild(text)
    a.title = 'Map Link'
    a.href = newArr[i].mapLink
    a.target = "_blank"
    rowDataFour.appendChild(a)

    

    row.appendChild(rowDataOne)
    row.appendChild(rowDataTwo)
    row.appendChild(rowDataThree)
    row.appendChild(rowDataFour)

    tbody.appendChild(row)

  }

  table.appendChild(tbody)
}



// const createTable = (data) => {
//   let table = document.querySelector('table')
//   let thead = document.createElement('THEAD')
//   let th1 = document.createElement('th')
//   let th2 = document.createElement('th')
//   let th3 = document.createElement('th')
//   th1.innerHTML = 'Bus Stop Code'
//   th2.innerHTML = 'Stop Name' 
//   th3.innerHTML = 'Bus Numbers'
//   thead.appendChild(th1)
//   thead.appendChild(th2)
//   thead.appendChild(th3)
//   table.appendChild(thead)

//   let tbody = document.createElement('TBODY')
//   for(let element of data){
//     let row = document.createElement('tr')
//     row.className = "table-row"
//     let rowDataOne = document.createElement('td')
//     rowDataOne.innerHTML = element.busstopcode
//     let rowDataTwo = document.createElement('td')
//     rowDataTwo.innerHTML = element.description

//     row.appendChild(rowDataOne)
//     row.appendChild(rowDataTwo)
//     tbody.appendChild(row)

//   }

//   table.appendChild(tbody)
// }
// main()

// const main = async () => {
//   let { data, error } = await supabase
//   .rpc('nearest_stops2')

//   if(error) {
//     console.error(error)
//   }

//   console.log(data)
// }


// const main = async () => {
//   let { data, error } = await supabase
//   .from('bus_stop_view')
//   .select('busstopcode, description')

//   if(error) {
//     console.error(error)
//   }
  
//   console.log(data)

//   // NEED 
//   // let table = document.querySelector('table')
//   // let thead = document.createElement("THEAD")
//   // let th1 = document.createElement('th')
//   // let th2 = document.createElement('th')
//   // th1.innerHTML = 'Bus Stop Code'
//   // th2.innerHTML = 'Stop Name' 
//   // thead.appendChild(th1)
//   // thead.appendChild(th2)
//   // table.appendChild(thead)



// //   let table = document.querySelector("table");
// //   let header = Object.keys(data[0])
// //   generateTableHead(table, header)


//   // function generateTableHead(table, data) {
//   //   let thead = table.createTHead();
//   //   let row = thead.insertRow();
//   //   for (let key of data) {
//   //     let th = document.createElement("th");
//   //     let text = document.createTextNode(key);
//   //     th.appendChild(text);
//   //     row.appendChild(th);
//   //   }
//   // }
  
//   // function generateTable(table, data) {
//   //   for (let element of data) {
//   //     let row = table.insertRow();
//   //     for (key in element) {
//   //       let cell = row.insertCell();
//   //       let text = document.createTextNode(element[key]);
//   //       cell.appendChild(text);
//   //     }
//   //   }
//   // }
  
//   // let table = document.querySelector("table");
//   // let data = Object.keys(data[0]);
//   // generateTableHead(table, data);
//   // generateTable(table, mountains);





// }


// // const main = async () => {
// //   const { data, error } = await supabase
// //   .rpc('nearest_stops2')

// //   if(error) {
// //     console.error(error)
// //   }

// //   console.log(data)

// // }

// // const main = async () => {
// //   const { data, error } = await supabase
// //   .rpc('get_bustops', {payload: [{ long: 103.9398721}, {lat: 1.324219 }]})

// //   if(error) {
// //     console.error(error)
// //   }

// //   console.log(data)

// // }




// main()
// console.log(supabase)

// function geoFindMe() {

//     const status = document.querySelector('#status');
//     const mapLink = document.querySelector('#map-link');
  
//     mapLink.href = '';
//     mapLink.textContent = '';
  
//     function success(position) {
//       const latitude  = position.coords.latitude;
//       const longitude = position.coords.longitude;
  
//       status.textContent = '';
//       mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
//       mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
//     }
  
//     function error() {
//       status.textContent = 'Unable to retrieve your location';
//     }
  
//     if(!navigator.geolocation) {
//       status.textContent = 'Geolocation is not supported by your browser';
//     } else {
//       status.textContent = 'Locating…';
//       navigator.geolocation.getCurrentPosition(success, error);
//     }

//     const container = document.querySelector(".container");
  
// }


function goFineMeSimple() {

  const status = document.querySelector('#status');
  function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = `Latitude is: ${latitude}, Longitude is: ${longitude}`

    console.log(`Latitude is: ${latitude}, Longitude is: ${longitude}`);
    main(latitude, longitude)
  }

  function error() {
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