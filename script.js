const getBtn = document.getElementById('get-data');
const infoContainer = document.querySelector('.info-container');
const pinContainer = document.querySelector('.pin-container');
const postOfficeContainer = document.querySelector('.post-container');
const lat = document.getElementById('lat');
const long = document.getElementById('long');
const city = document.getElementById('city');
const region = document.getElementById('region');
const organisation = document.getElementById('organisation');
const hostname = document.getElementById('hostname');
const map = document.getElementById('map');
const x = document.getElementById('x');
const timeZone = document.getElementById('time-zone');
const dateTime = document.getElementById('date-time');
const pincode = document.getElementById('pincode');
const message = document.getElementById('message');
const search = document.getElementById('search');


var IP;
var latitude;
var longitude;
var pin;

var postOfficeArr=[];

fetch('https://api.ipify.org?format=json')
.then((resp)=>resp.json())
.then((data)=>{
    console.log(data.ip);
    IP=data.ip;
    document.getElementById('ip').innerText = data.ip;
}).catch((e)=>{
    console.log("Error while fetching Ip address",e);
})

getBtn.addEventListener('click',()=>{
        setTimeout(() => {
            fetch(`https://ipinfo.io/${IP}/geo?token=66acf15f22508e`)
            .then((resp)=>resp.json())
            .then((data)=>{
                console.log("data",data);
                let location=data.loc;
                latitude = location.split(',')[0];
                longitude = location.split(',')[1];
                lat.innerHTML = `<strong>Lat: </strong>${latitude}`;
                long.innerHTML = `<strong>Long: </strong>${longitude}`;
                city.innerHTML = `<strong>City: </strong>${data.city}`;
                region.innerHTML = `<strong>Region: </strong>${data.region}`;
                organisation.innerHTML = `<strong>Organisation: </strong>${data.org}`;
                hostname.innerHTML = `<strong>Hostname: </strong>${data.hostname}`;
               
    
                map.setAttribute('src',`https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=14&amp&output=embed`);
    
                let datetime_str = new Date().toLocaleString("en-US", { timeZone: `${data.timezone}` });
                timeZone.innerHTML = `<strong>Time Zone: </strong>${data.timezone}`;
                dateTime.innerHTML = `<strong>Date And Time: </strong>${datetime_str}`;
                pin = data.postal;
                pincode.innerHTML = `<strong>Pincode: </strong>${data.postal}`;
                postOffice(pin);
    
            })
            .catch((e)=>console.log('Error',e))

           

        }, 1000);


        getBtn.style.display='none';
        infoContainer.style.display='flex';
        pinContainer.style.display='block';
})

function postOffice(pin) {
    console.log(pin);
    fetch(`https://api.postalpincode.in/pincode/${pin}`)
    .then((resp)=>resp.json())
    .then((data)=>{
        console.log(data);
        console.log(data[0]);
        message.innerHTML = `<strong>Message: </strong>${data[0].Message}`;
        console.log(data[0].PostOffice);
        postOfficeArr = data[0].PostOffice;
        search.style.display='block';

        showPostOffice(postOfficeArr);
    })
    .catch((e)=>{
        console.log("Error",e);
    })
    
}

function showPostOffice(Arr) {
    postOfficeContainer.innerHTML='';
    let myHtml='';
    Arr.forEach((ele)=>{
        myHtml+=`
        <div class="post-content">
         <div><strong>Name:</Strong> ${ele.Name}</div>
         <div><strong>Branch Type:</Strong> ${ele.BranchType}</div>
         <div><strong>Delivery Status:</Strong> ${ele.DeliveryStatus}</div>
         <div><strong>District:</Strong> ${ele.District}</div>
         <div><strong>Division:</Strong> ${ele.Division}</div>
        </div>
        `
    })
    postOfficeContainer.innerHTML=myHtml;
}


search.addEventListener('input',()=>{
    var filterArr = postOfficeArr.filter((ele)=>{
        if(ele.Name.toLowerCase().includes(search.value.trim().toLowerCase()) || ele.BranchType.toLowerCase().includes(search.value.trim().toLowerCase())){
            return ele;
        }
    })
    showPostOffice(filterArr);
})