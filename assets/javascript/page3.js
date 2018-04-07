//just to make sure that proper js file is linked:
console.log("Inside page-3 JS!!!")

//==================================================
// ===============Initialize Firebase===============
//==================================================
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

//==================================================
// ================Global Variables=================
//==================================================
var coords;

var userID = sessionStorage.getItem("storage-userID");
var userName = sessionStorage.getItem("storage-userName");
var groupID = sessionStorage.getItem("storage-groupID");
var groupName = sessionStorage.getItem("storage-groupName");
console.log("user Name: ", userName);
console.log("user ID: ", userID);
console.log("group Name: ", groupName);
console.log("group ID: ", groupID);

//==================================================
// =============Initialize Google Maps==============
//==================================================
function initAutocomplete() {
    //creating lat/long object called chicago - using this to center map at this location
    var chicago = {lat: 41.896, lng: -87.621};
    //Initializing the map - calling the map div in the HTML file
    var map = new google.maps.Map(document.getElementById('map'), {
        center: chicago,
        zoom: 14,
        mapTypeId: 'roadmap'
    });

    //create empty marker to place user location once they click or enter a locaiton
    var myMarker = new google.maps.Marker({
        map: map
    });
    //creat empty marker to place the group center location
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
    
    // var markers = [];

    // Maps Search Box
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        console.log("EVENT: you entered something in the searchbox!")
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }
        console.log("Search Result (places): ", places);
        console.log("# of Results (places.length): ", places.length);
        // Clear out the old markers.
        // markers.forEach(function(marker) {
        //     marker.setMap(null);
        // });
        // markers = [];

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
        coords = places[0].geometry.location;
        map.fitBounds(bounds);
        console.log("Chosen Lat/Lng: ",myMarker.getPosition().lat(),myMarker.getPosition().lng())
        
    });

    // Click to add location
    // Listen for clicks on the map and get the location of the click
    map.addListener("click", function(e) {
        console.log("EVENT: you clicked the map!");
        var lat = e.latLng.lat();
        var lng = e.latLng.lng();
        console.log("Chosen Lat/Lng: ",lat,lng);
        coords = new google.maps.LatLng(lat,lng);
        myMarker.setPosition(coords);
    });
}


//==================================================
// ==================Submit Button==================
//==================================================
$("#submit-button").on("click", function(){
    event.preventDefault();
    console.log("EVENT: you clicked submit!");
    console.log("groupID: ", groupID)
    console.log("coords: ",coords)
    //if for some reason, the group ID is null (usually during development, when we haven't gone through the add or join gorup pages) then return
    if(!groupID){
        console.log("No group ID, can't submit");
        return;
    }
    //if the user tries to submit without entering a location then return
    if(!coords){
        console.log("Please Select a location before submitting");
        return;
    }
    var newRef = "groups/" + groupID + "/users/" + userID;
    var coordsString = JSON.stringify(coords);
    database.ref(newRef).update({
        location: coordsString
    });

    //Go to page 4
    location.href = "./index4.html";
});

//==============================================================
//====================Database Query==========================
//===================for page 4==========================
//==============================================================
// var queryRef = "groups/" + groupID + "/users";
// var locationArray = [];
// database.ref(queryRef).orderByKey().on("child_added", function(snapshot) {
//     console.log(snapshot.val());
    
//     console.log(snapshot.val().name);
//     console.log(snapshot.val().location);
//     var locationObj = snapshot.val().location;
//     var coords = JSON.parse(locationObj);
//     console.log(coords);
//     console.log(coords.lat)
//     locationArray.push(coords);

//     var centerLocation = findCenter(locationArray);
//     centerMarker.setPosition(centerLocation);

    
// });


// function findCenter(locations){
//     console.log("in findCenter function")
//     console.log("findCenter: ", locations)
//     var latSum = 0;
//     var lngSum = 0;
//     var qty = 0;
//     for(var i = 0; i < locations.length; i++){

//         latSum += locations[i].lat;
//         lngSum += locations[i].lng;
//         qty++;
//     }
//     console.log("findCenter latSum: ", latSum);
//     console.log("findCenter lngSum: ", lngSum);
//     var latAvg = latSum/qty;
//     var lngAvg = lngSum/qty;
//     console.log("findCenter lat: ", latAvg);
//     console.log("findCenter lng: ", lngAvg);
//     var center = {
//         lat: latAvg,
//         lng: lngAvg
//     }
//     console.log(center);
//     return center;

// }