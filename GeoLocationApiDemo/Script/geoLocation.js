var map;
 var markers =[];
var infowindow;
function displayPosition(position)
{
    debugger;
    var lat = position.coords.latitude;
    var lan = position.coords.longitude;
    var timespan = new Date(position.timestamp);
    var accuracy = position.coords.accuracy;
    var altitude = position.coords.altitude;  //we can get value when device is moving
    var altitudeAccuracy = position.coords.altitudeAccuracy;
    var mLocation=document.getElementById('info');
    
    var plocation = document.getElementById('location');
    if (plocation)
    {
        plocation.innerHTML += "Latitude:" + lat +
                              "<br/>Longitude :" + lan +
        "<br/> TimeSpan :" + timespan +
        "<br/> Accuracy :" + accuracy;

        if (altitude) {
            mLocation.innerHTML += "<br/> Altitude :" + altitude
            "<br/> AltitudeAccuracy  :" + altitudeAccuracy;
        }
        else {
            mLocation.innerHTML += "Sorry No information available ..your device not moving ";
        }

    }
    loadMap(position.coords);

}
function displayError(error)
{
    
    alert("Error  while loading location :" + error.message);
}
var option = {
    enableHighAccuracy: false,
    maximumAge:2000,
    timeout:1000
}

function loadMap(coordinate)
{
    var geolatLan = new google.maps.LatLng(coordinate.latitude, coordinate.longitude);
    var options = {
        zoom: 11,
        center: geolatLan,
        mapTypeId: google.maps.MapTypeId.ROADMAP     // Diifernt map type :HYBRID,SATELLITE,TERRAIN
    }
    var element = document.getElementById('map')
    if (element)
    {
        map = new google.maps.Map(element, options);
       
        google.maps.event.addListener(map,"click",function (event) {
            map.panTo(event.latLng);                 //seting map center to cuurent click position 
            createMarker(event.latLng);
        })

    }

}

function createMarker(latLan) {
    var markerOption={
        position:latLan,
        map:map,
        clickable:true,
    }
    marker = new google.maps.Marker(markerOption);
    markers.push(marker);
    google.maps.event.addListener(marker, "click", function (event)
    {
        infowindow = new google.maps.InfoWindow({
      
            content: "Current Posistion:<br/> Latitude:" + event.latLng.lat() + "<br/>Longitude :" + event.latLng.lng()
        });
        infowindow.open(map, marker);
    })
}

window.onload = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayPosition, displayError, option)
    }
    else
        alert("No location Found ");

}
