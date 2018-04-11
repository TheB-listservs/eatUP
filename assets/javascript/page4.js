//just to make sure that proper js file is linked:
console.log("Inside page-4 JS!!!")

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
var map;
var restaurantNumberLimit = 5;
var usersArray = [];
var userMarkerArray = [];

//get userID and groupID from session Storage
var userID = sessionStorage.getItem("storage-userID");
var userName = sessionStorage.getItem("storage-userName");
var groupID = sessionStorage.getItem("storage-groupID");
var groupName = sessionStorage.getItem("storage-groupName");
console.log("user Name: ", userName);
console.log("user ID: ", userID);
console.log("group Name: ", groupName);
console.log("group ID: ", groupID);


//==============================================================
//=======================Main Code==============================
//==============================================================

//----------------Google Maps "Init Map" Function----------------
function initMap() {
    //------------------Set Up Map-----------------
    //create map with initial center on chicago
    var chicago = { lat: 41.896, lng: -87.621 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: chicago
    });

    //create bounds object that will be adjusted based on restuarnat locations after "Zamato" API call resturns restuarants
    var bounds = new google.maps.LatLngBounds();
   
    //------------------Define Marker Creation Functions-----------------
   // create marker function that will be called later to generate restuarant and member markers
    function createMarker(coords) {
        newMarker = new google.maps.Marker({
            map: map,
            position: coords,
            animation: google.maps.Animation.DROP,
            icon: "./assets/images/marker-images/icons8-marker-48 (1).png"
        });

        return newMarker;
    }
    //create attach message function that will create a text box message when you hover over marker
    function attachMessage(marker, message) {
        var infowindow = new google.maps.InfoWindow({
            content: message
        });

        marker.addListener('mouseover', function () {
            infowindow.open(marker.get('map'), marker);
        });
        marker.addListener('mouseout', function () {
            infowindow.close(marker.get('map'), marker);
        });
    }

    //------------------Grab User Locations to Find Center-----------------
    // create ref for firebase that starts at the users node within the current group
    var queryRef = "groups/" + groupID + "/users";
    //grab snapshot of the users in the current group
    database.ref(queryRef).orderByKey().on("value", function (snapshot) {
        console.log("Firebase *Value* Event Handler")
        console.log(snapshot.val());
        var users = snapshot.val();

        //create array to store locations
        var locationArray = [];
        //for each user, get their location and push it to locationArray
        for (var key in users) {
            console.log(users[key].name);
            var coords = JSON.parse(users[key].location);
            console.log(coords)
            locationArray.push(coords);

            //get user name and push to usersArray
            var currentUser = {
                name: users[key].name,
                location: JSON.parse(users[key].location)
            }
            usersArray.push(currentUser)
        }
        console.log("locationArray : ", locationArray)
        console.log("locationArray length: ", locationArray.length)
        console.log("usersArray: ", usersArray)

        //pass the locaiton array to the findCenter function (defined below) 
        //save the value as centerLocation
        var centerLocation = findCenter(locationArray);
        var centerLat = centerLocation.lat;
        var centerLng = centerLocation.lng;

        //Create marker for center location
        var centerMarker = new google.maps.Marker({
            map: map,
            position: centerLocation,
            icon: "./assets/images/marker-images/icons8-hunt-40.png"
        });
        attachMessage(centerMarker, "This is the center location for your group")

        //------------------Submit Center Location to Zamato API to find resuarants-----------------
        $.ajax({
            method: 'GET',
            url: "https://developers.zomato.com/api/v2.1/geocode?lat=" + centerLat + "&lon=" + centerLng,
            headers: { 'user-key': 'ae713d7fa6256712cc3d8367859242ca' },
        }).then(function (response) {
            console.log("Zomato API response: ", response);
            
            //empty existing restaurant list
            $("#restaurant-list-content").empty();
            //for-loop for each restuarant
            for (var i = 0; i < restaurantNumberLimit; i++) {

                //save restaurant values to variables
                var restaurantName = response.nearby_restaurants[i].restaurant.name;
                var restaurantAddress = response.nearby_restaurants[i].restaurant.location.address;
                var restaurantType = response.nearby_restaurants[i].restaurant.cuisines;
                var restaurantMenu = response.nearby_restaurants[i].restaurant.menu_url;
                var restaurantLat = parseFloat(response.nearby_restaurants[i].restaurant.location.latitude);
                var restaurantLng = parseFloat(response.nearby_restaurants[i].restaurant.location.longitude);

                //create new HTML elements and append to restaurant-list-content div
                var h4Name = $("<h4>").html((i + 1) + ") " + restaurantName).addClass("ui header");
                var pAddress = $("<p>").html(restaurantAddress);
                var pType = $("<p>").html(restaurantType);
                var parentRestDiv = $("<div>").addClass("item");
                var newRestDiv = $("<a>").append(h4Name, pAddress, pType).attr("href", restaurantMenu).attr("target", "_blank");
                parentRestDiv.append(newRestDiv);
                $("#restaurant-list-content").append(parentRestDiv);

                // Create the upvote/down vote button and append to the div
                var upvoteDiv = $("<div>").addClass("vote roundrect").attr("data-vote", "none");
                var incrementUp = $("<div>").addClass("increment up");
                var incrementDown = $("<div>").addClass("increment down");
                var countDiv = $("<div>").addClass("count").html("0");
                upvoteDiv.append(incrementUp, incrementDown, countDiv);
                parentRestDiv.append(upvoteDiv);

                //create marker on map at the restuarant location
                var location = {
                    lat: restaurantLat,
                    lng: restaurantLng
                }
                var newMarker = createMarker(location);
                //newMarker.setLabel((i+1).toString());
                var windowText = "<h4>" + restaurantName + "</h4>" + restaurantAddress + "<br>" + restaurantType;
                attachMessage(newMarker, windowText);

                //extend bounds of map to include restaurnat location
                bounds.extend(location)

            }//end of restaurant for loop

            //after for loop, fit map to final bounds
            map.fitBounds(bounds);

        });//end of Zomato API call

        //------------------Put List of Users into Group Members div----------------
        userMarkerArray = [];
        $("#group-member-list").empty();
        for (i = 0; i < usersArray.length; i++) {
            //create new div for each member and append to group-memener-list div
            var newMemberDiv = $("<a>").addClass("item").html(usersArray[i].name).attr("data-marker-index", i).attr("data-marker-hidden", false);
            $("#group-member-list").append(newMemberDiv);

            //Create a marker for each member
            var memberMarker = createMarker(usersArray[i].location);
            memberMarker.setIcon("./assets/images/marker-images/icons8-street-view-filled-50.png");
            attachMessage(memberMarker, usersArray[i].name);
            userMarkerArray.push(memberMarker);
        }


    }); //end of databse ref on-value function

    //Creat click handler for group members - clicking on member name toggles their map=marker icon visibility
    $("#group-member-list").on("click", ".item", function () {
        console.log("you clicked a member")
        var index = $(this).attr("data-marker-index");
        var isHidden = $(this).attr("data-marker-hidden");
        if (isHidden == "true") {
            userMarkerArray[index].setMap(map);
            $(this).attr("data-marker-hidden", false);
        } else {
            userMarkerArray[index].setMap(null);
            $(this).attr("data-marker-hidden", true);
        }
    })

}//end of maps init function

//-----------------findCenter Function Definition------------------------------
function findCenter(locations) {
    console.log("In findCenter Function")
    var latSum = 0;
    var lngSum = 0;
    var qty = 0;
    for (var i = 0; i < locations.length; i++) {

        latSum += locations[i].lat;
        lngSum += locations[i].lng;
        qty++;
    }
    console.log("findCenter latSum: ", latSum);
    console.log("findCenter lngSum: ", lngSum);
    var latAvg = latSum / qty;
    var lngAvg = lngSum / qty;
    console.log("findCenter lat: ", latAvg);
    console.log("findCenter lng: ", lngAvg);
    var center = {
        lat: latAvg,
        lng: lngAvg
    }
    console.log("findCenter center: ", center);
    return center;
    console.log("end find cneter function")
}
//-----------------Upvote/Downvote Click Event Handler---------------------------
$(document).on("click", ".increment", function () {
    var count = parseInt($("~ .count", this).text());
    var status = $(this).parent().attr("data-vote");
    if ($(this).hasClass("up")) {

        if ((status === "none")) {
            $(this).parent().attr("data-vote", "up");
            var count = count + 1;
            $("~ .count", this).text(count);
        } else if ((status === "down")) {
            $(this).parent().attr("data-vote", "up");
            var count = count + 2;
            $("~ .count", this).text(count);
        }

    } else {
        if ((status === "none")) {
            $(this).parent().attr("data-vote", "down");
            var count = count - 1;
            $("~ .count", this).text(count);
        } else if ((status === "up")) {
            $(this).parent().attr("data-vote", "down");
            var count = count - 2;
            $("~ .count", this).text(count);
        }
    }

    $(this).parent().addClass("bump");
    var that = $(this);
    setTimeout(function () {
        that.parent().removeClass("bump");
    }, 400);
});

//-----------------click event to hide sidebars------------------------------
//---group member sidebar toggle
$("#group-memebers-toggle").on("click", function(){
    console.log("you clicked me!!")
    var visible = $("#sidebar").attr("data-show")
    if(visible === "true"){
        $("#group-member-list").hide();
        $("#sidebar").css("height", "auto");
        $("#sidebar").attr("data-show", false)
    }else{
        $("#group-member-list").show();
        $("#sidebar").css("height", "");
        $("#sidebar").attr("data-show", true)
    }
})
//---Restaurant sidebar toggle
$("#restaurants-toggle").on("click", function(){
    console.log("you clicked me!!")
    var visible = $("#restaurant-list").attr("data-show")
    if(visible === "true"){
        $("#restaurant-list-content").hide();
        $("#restaurant-list").css("height", "auto");
        $("#restaurant-list").attr("data-show", false)
    }else{
        $("#restaurant-list-content").show();
        $("#restaurant-list").css("height", "");
        $("#restaurant-list").attr("data-show", true)
    }
})
