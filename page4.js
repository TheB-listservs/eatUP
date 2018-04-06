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