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

    //Go to page 3
    location.href = "./index3.html";
    //location.href = "./backend-page3.html";

});