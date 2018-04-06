var userID;
console.log("user id:", userID)
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

$("#submit-button").on("click", function () {
    event.preventDefault();
    console.log("you clicked submit!");
    var enteredUserName = $("#name").val();
    var enteredGroupName = $("#group-name").val();
    if (!enteredUserName) {
        console.log("no name entered");
        return;
    }
    if (!enteredGroupName) {
        console.log("no group name entered");
        return;
    }

    var newPush = database.ref("/groups").push({
        groupName: enteredGroupName
    })
    var groupID = newPush.key;
    var newRef = "/groups/" + groupID + "/users";

    var user = database.ref(newRef).push({
        name: enteredUserName
    });
    userID = user.key;
    console.log("my user id:", userID);
    console.log("your group id is: ", groupID);

    //set User ID and Group ID to Local storage
    sessionStorage.setItem("storage-userName", enteredUserName);
    sessionStorage.setItem("storage-groupName", enteredGroupName);
    sessionStorage.setItem("storage-userID", userID);
    sessionStorage.setItem("storage-groupID", groupID);



    //move to page 3
    //location.href = "./index3.html";
    location.href = "./googlemaps-api-test3.html";

    // database.ref().once('value').then(function(snapshot){
    //     var grpname = snapshot.child("groups").child(id).child("groupName").val();
    //     console.log(grpname);
    // });





});