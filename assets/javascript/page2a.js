//just to make sure that proper js file is linked:
console.log("Inside page-2a JS!!!")

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
var userID;


//==================================================
// ==================Submit Button==================
//==================================================
$("#submit-button").on("click", function () {
    event.preventDefault();
    console.log("you clicked submit!");

    //save entered username and group name as variables
    var enteredUserName = $("#name").val();
    var enteredGroupName = $("#group-name").val();

    //make sure that username was entered, otherwise return
    if (!enteredUserName) {
        console.log("no name entered");
        return;
    }
    //make sure that group name was entered, otherwise return
    if (!enteredGroupName) {
        console.log("no group name entered");
        return;
    }

    //push group to firebase under "/groups" node, and save key as "groupID"
    var newPush = database.ref("/groups").push({
        groupName: enteredGroupName
    })
    var groupID = newPush.key;
    //push username to firebase under the new group node, save the key as "userID"
    var newRef = "/groups/" + groupID + "/users";
    var user = database.ref(newRef).push({
        name: enteredUserName
    });
    userID = user.key;
    console.log("my user id:", userID);
    console.log("your group id is: ", groupID);

    //set User ID and Group ID to session storage
    sessionStorage.setItem("storage-userName", enteredUserName);
    sessionStorage.setItem("storage-groupName", enteredGroupName);
    sessionStorage.setItem("storage-userID", userID);
    sessionStorage.setItem("storage-groupID", groupID);

    //Go to page 3
    location.href = "./index3.html";

});