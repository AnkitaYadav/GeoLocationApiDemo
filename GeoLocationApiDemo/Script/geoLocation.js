var map;
var markers = [];
var placeMarkers = [];
var infowindow;
var service;
var currentCoords = {};
function displayPosition(position) {

    var lat = position.coords.latitude;
    var lan = position.coords.longitude;
    currentCoords.lattitude = lat;
    currentCoords.longitude = lan;
    
    var timespan = new Date(position.timestamp);
    var accuracy = position.coords.accuracy;
    var altitude = position.coords.altitude;  //we can get value when device is moving
    var altitudeAccuracy = position.coords.altitudeAccuracy;
    var mLocation = document.getElementById('info');

    var plocation = document.getElementById('location');
    if (plocation) {
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
function displayError(error) {

    alert("Error  while loading location :" + error.message);
}
var option = {
    enableHighAccuracy: false,
    maximumAge: 2000,
    //timeout:5000
}

function loadMap(coordinate) {
    var geolatLan = new google.maps.LatLng(coordinate.latitude, coordinate.longitude);

    var options = {
        zoom: 11,
        center: geolatLan,
        mapTypeId: google.maps.MapTypeId.ROADMAP     // Diifernt map type :HYBRID,SATELLITE,TERRAIN
    }
    var element = document.getElementById('map')
    if (element) {
        map = new google.maps.Map(element, options);
        if(window.location.pathname == "/GeoPlace.html")
        service = new google.maps.places.PlacesService(map);

        google.maps.event.addListener(map, "click", function (event) {
            currentCoords.lattitude = event.latLng.lat();
            currentCoords.longitude = event.latLng.lng();
            map.panTo(event.latLng);                 //seting map center to cuurent click position 
            if (window.location.pathname == "/GeoMap.html")
            {
                clearLocationMarker();
                createMarker(event.latLng);
            }
           
        })
        showForm();
    }

}

function createMarker(latLan) {
    var markerOption = {
        position: latLan,
        map: map,
        clickable: true,
    }
    marker = new google.maps.Marker(markerOption);
    markers.push(marker);
    google.maps.event.addListener(marker, "click", function (event) {
      
        infowindow = new google.maps.InfoWindow({
            content: "Current Posistion:<br/> Latitude:" + event.latLng.lat() + "<br/>Longitude :" + event.latLng.lng()
        });
        infowindow.open(map, marker);
    })
   
}

function showForm() {
    var searchForm = $('#search-tab');
    if (searchForm) {
        $('#search-tab').css("visibility", "visible")
        $('#search-place').click(function () {
            searchForPlace(currentCoords.lattitude, currentCoords.longitude)
        })
    }
}

function searchForPlace(lat, lng) {
    var place = $('#placeName');
    if (place) {
        var name = $('#placeName').val();
        alert(name);
        if (name) {
            clearPlaceMarker();
            var placeRequest = {
                location: new google.maps.LatLng(lat, lng),
                radius: 1000,
                keyword: name
            }
            service.nearbySearch(placeRequest, function (results, status) {
                alert(status);
                if (status == google.maps.places.PlacesServiceStatus.OK)
                {
                    results.forEach(function (place) {
                        console.info(place)

                        createMarkerBasedOnPlace(place);
                    })
                }
            })
        }
        else {
            alert("No result found");
        }

    }


}
function createMarkerBasedOnPlace(place) {
    var placeName = place.name;
    var address = place.vicinity;
    var markerOption = {
        position: place.geometry.location,
        map: map,
        clickable: true,
    }
   var  placeMarker = new google.maps.Marker(markerOption);
   placeMarkers.push(placeMarker);
   google.maps.event.addListener(placeMarker, "click", function (place, placeMarker) {
        infowindow = new google.maps.InfoWindow({
            content: "Place Name:" + placeName + "<br/> Address :" + address
        });
        infowindow.open(map, placeMarker);
    })
}

function clearPlaceMarker() {
    placeMarkers.forEach(function (placeMarker) {
        placeMarker.setMap(null);
        placeMarkers = [];
    })
}

function clearLocationMarker() {
    markers.forEach(function (marker) {
        marker.setMap(null);
        markers = [];
    })
}
window.onload = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayPosition, displayError, option)
    }
    else
        alert("No location Found ");

}
