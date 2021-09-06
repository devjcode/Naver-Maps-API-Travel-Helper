const CLIENT_ID = "mh2xhg862g";
const CLIENT_SECRET = "n6YVWkaxZMNHYq9DEkwOjx33MhS1ML6cWkNjIGvB";

const CL = "current location";
const saveButton = document.querySelector('#saveLocation');
const locationList = document.querySelector('#location-list');
let currentLocation = [];

let lat,lng;
let map;

function saveLoc() {
    localStorage.setItem(CL, JSON.stringify(currentLocation));
}

function loadLoc() {
    const savedLoc = localStorage.getItem(CL);

    if(savedLoc != null) {
        const parsedLoc = JSON.parse(savedLoc);

        currentLocation = parsedLoc;
        parsedLoc.forEach(paintLoc);
    }
}

function paintLoc(l) {
    const li = document.createElement('li');
    li.innerText = `${l.lat} / ${l.lng }`;
    locationList.appendChild(li);
}

function initMap() {
    map = new naver.maps.Map(document.querySelector('#map'));
    
    
    naver.maps.Event.addListener(map, 'click', function(e) {
        const marker = new naver.maps.Marker({
            map: map,
        });
        marker.setPosition(e.latlng);

        const tmploc = {
            "lat":e.latlng._lat,
            "lng":e.latlng._lng
        }

        currentLocation.push(tmploc);
    });

}

// request callback function
function parse(data) {
    const region = data['results'][0]['region'];
    const r = `${region['area1']['name']} ${region['area2']['name']} ${region['area3']['name']}`;
    const location = document.querySelector('#location');
    location.innerText = r;
}
function jqueryAjaxRequest(lat,lng) {
    const url = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=${lng},${lat}&orders=admcode,legalcode,addr,roadaddr&output=json&sourcecrs=epsg:4326&callback=parse`;
    
    var settings = {
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
    const loc = new naver.maps.LatLng(lat, lng);

    //구한 좌표로 reverse geocoding 통신
    jqueryAjaxRequest(lat,lng);

    //구한 좌표를 naveMap에 표시
    map.setCenter(loc);
}   
function onGeoError() {
    alert("I can't find you !");
}


navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
saveButton.addEventListener('click', saveLoc);
loadLoc();




