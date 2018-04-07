// Initialize Firebase
var config = {
    apiKey: "AIzaSyCZSpOhRVPzvxqwV8Ve9GOVqk8LmqKY1yU",
    authDomain: "eatu-f3ea8.firebaseapp.com",
    databaseURL: "https://eatu-f3ea8.firebaseio.com",
    projectId: "eatu-f3ea8",
    storageBucket: "eatu-f3ea8.appspot.com",
    messagingSenderId: "768020933384"
};
firebase.initializeApp(config);
var database = firebase.database();

//variables
var coords;

 //================================
function initAutocomplete() {
    var chicago = {lat: 41.896, lng: -87.621};
    var map = new google.maps.Map(document.getElementById('map'), {
        center: chicago,
        zoom: 12,
        mapTypeId: 'roadmap'
    });

    //create empty marker
    var myMarker = new google.maps.Marker({
        map: map
    });
    centerMarker = new google.maps.Marker({
        map: map
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.LEFT_CENTER].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }
        console.log("places: ", places);
        console.log("places length: ", places.length);
        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            // Create a marker for each place.
            // markers.push(new google.maps.Marker({
            //     map: map,
            //     title: place.name,
            //     position: place.geometry.location
            // }));
            
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
                } else {
                bounds.extend(place.geometry.location);
            }
            
        });

        myMarker.setPosition(places[0].geometry.location)
        console.log(myMarker);
        console.log(myMarker.position)

        map.fitBounds(bounds);
    });

    // Listen for clicks on the map and get the location of the click
    map.addListener("click", function(e) {
        
        console.log("map clicked");
        var lat = e.latLng.lat();
        var lng = e.latLng.lng();
        console.log(lat,lng);

        coords = new google.maps.LatLng(lat,lng);
        myMarker.setPosition(coords);
    });
}

var userID = sessionStorage.getItem("storage-userID");
var groupID = sessionStorage.getItem("storage-groupID");
console.log("user ID: ", userID);
console.log("group ID: ", groupID);

$("#submit-button").on("click", function(){
    event.preventDefault();
    console.log("you clicked submit!");
    
    var newRef = "groups/" + groupID + "/users/" + userID;
    var coordsString = JSON.stringify(coords);
    database.ref(newRef).update({
        location: coordsString
    });
});

//==============================================================
//====================Database Query==========================
//===================for page 4==========================
//==============================================================
var queryRef = "groups/" + groupID + "/users";
var locationArray = [];
database.ref(queryRef).orderByKey().on("child_added", function(snapshot) {
    console.log(snapshot.val());
    
    console.log(snapshot.val().name);
    console.log(snapshot.val().location);
    var locationObj = snapshot.val().location;
    var coords = JSON.parse(locationObj);
    console.log(coords);
    console.log(coords.lat)
    locationArray.push(coords);

    var centerLocation = findCenter(locationArray);
    centerMarker.setPosition(centerLocation);

    
});


function findCenter(locations){
    console.log("in findCenter function")
    console.log("findCenter: ", locations)
    var latSum = 0;
    var lngSum = 0;
    var qty = 0;
    for(var i = 0; i < locations.length; i++){

        latSum += locations[i].lat;
        lngSum += locations[i].lng;
        qty++;
    }
    console.log("findCenter latSum: ", latSum);
    console.log("findCenter lngSum: ", lngSum);
    var latAvg = latSum/qty;
    var lngAvg = lngSum/qty;
    console.log("findCenter lat: ", latAvg);
    console.log("findCenter lng: ", lngAvg);
    var center = {
        lat: latAvg,
        lng: lngAvg
    }
    console.log(center);
    return center;

}