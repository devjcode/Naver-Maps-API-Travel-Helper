//***2021-09-08 

//Auth
const CLIENT_ID = "mh2xhg862g";
const CLIENT_SECRET = "n6YVWkaxZMNHYq9DEkwOjx33MhS1ML6cWkNjIGvB";

//DB 
const STOAGE_DATA_KEY = "SAVED LOCATION";

//HTML Element 
const saveButton = document.querySelector('#saveLocation');
const locationList = document.querySelector('#location-list');

// js 
let currentLocation = [];  //local storage에 보낼 array
let lat,lng; //geolocation으로 따온 lat,lng 저장할 공간
let map; //map이 init되면 담겨질 지도객체
let paths = [];

function ccc(location) {
    const l = new naver.maps.LatLng(location.lat, location.lng);
    paths.push(l);

}


function saveLoc() {
    localStorage.setItem(STOAGE_DATA_KEY, JSON.stringify(currentLocation));

    currentLocation.forEach(ccc);


    const polyline = new naver.maps.Polyline({
        map: map,
        path: paths
    });
}

function loadLoc() {
    const savedLoc = localStorage.getItem(STOAGE_DATA_KEY);

    if(savedLoc != null) {
        const parsedLoc = JSON.parse(savedLoc);

        currentLocation = parsedLoc;
        parsedLoc.forEach(paintLoc);
    }
}

function paintLoc(location) {
    const li = document.createElement('li');
    li.innerText = `${location.lat} / ${location.lng }`;
    locationList.appendChild(li);

    const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(location.lat, location.lng),
        map: map,
    });
}

function initMap() {
    const loc = new naver.maps.LatLng(lat, lng);
    map = new naver.maps.Map(document.querySelector('#map'));
    map.setCenter(loc);
    
    naver.maps.Event.addListener(map, 'click', function(e) {
        //클릭시 그 위치에 마커 생성 이벤트
        const marker = new naver.maps.Marker({
            map: map,
        });
        marker.setPosition(e.latlng);

        // 그 위치의 행정주소 얻어오기
        reverseGeocodingApi(e.latlng._lat,e.latlng._lng,'getMarkerLocation');
        
        //(위도경도)객체로 묶어서 저장시키기
        const tmploc = {
            "lat":e.latlng._lat,
            "lng":e.latlng._lng
        }

        currentLocation.push(tmploc);
    });
}

// reverse geocoding callback function -1 : get current location
function getCurrentLocation(data) {

    const currentregion = data['results'][0]['region'];
    const r1 = `${currentregion['area1']['name']} ${currentregion['area2']['name']} ${currentregion['area3']['name']}`;
    
    const location = document.querySelector('#location');
    location.innerText = r1;
}

// reverse geocoding callback function -2 : get marker location 
function getMarkerLocation(data) {
    const region = data['results'][0]['region'];
    const r = `${region['area1']['name']} ${region['area2']['name']} ${region['area3']['name']}`;

}
function reverseGeocodingApi(lat, lng, callback) {
    const url = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=${lng},${lat}&orders=admcode,legalcode,addr,roadaddr&output=json&sourcecrs=epsg:4326&callback=${callback}`;
    
    const settings = {
        url: url,
        dataType:'jsonp',
        method: "GET",
        data: {
          "X-NCP-APIGW-API-KEY-ID": CLIENT_ID,
          "X-NCP-APIGW-API-KEY": CLIENT_SECRET
        },
        //jsonp:'parse'
    }
      
    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}

function onGeoOk(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    
    //현 위치 받아오기
    reverseGeocodingApi(lat,lng,'getCurrentLocation');
    //지도시작
    initMap();
    //저장된 위치 불러오기
    loadLoc();

}   
function onGeoError() {
    alert("I can't find you !");
}


navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
saveButton.addEventListener('click', saveLoc);






