const CLIENT_ID = "mh2xhg862g";
const CLIENT_SECRET = "n6YVWkaxZMNHYq9DEkwOjx33MhS1ML6cWkNjIGvB";

let url = 'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&sourcecrs=epsg:4326&orders=admcode,legalcode,addr,roadaddr&output=xml';

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

function fetchRequest(lat,lng) {
    url = 'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=129.1133567,35.2982640&sourcecrs=epsg:4326&orders=admcode,legalcode,addr,roadaddr&output=xml'

    fetch(url, {
        mode: 'no-cors', //cors 문제 해결
        headers: {
            "X-NCP-APIGW-API-KEY-ID": CLIENT_ID,
            "X-NCP-APIGW-API-KEY": CLIENT_SECRET
        }
    });
}


function onGeoOk(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    //jqueryAjaxRequest(lat,lng);
    fetchRequest(lat,lng);

}   
function onGeoError() {
    alert("I can't find you ");
}


navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);