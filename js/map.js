import {lat,lng} from './location.js';


var mapOptions = {
    center: new naver.maps.LatLng(lng, lat),
    zoom: 10
};

var map = new naver.maps.Map(document.querySelector('#map'), mapOptions);




