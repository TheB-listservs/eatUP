//just to make sure that proper js file is linked:
console.log("Inside page-2b JS!!!")

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
// ===========Populating Drop Down Menu=============
//==================================================
// grabbing the groups in firebase and adding them to the drop down
database.ref("/groups").on("child_added", function (grabData) {
    var opt = document.createElement('option');
    var groupId = grabData.key; 
    var groups = grabData.val().groupName; 
    var newGroupDiv = $(opt).addClass("item").attr("data-id", groupId).html(groups);
    $("#group-menu").append(newGroupDiv)

});

//==================================================
// ==================Submit Button==================
//==================================================
//entering a name and selecting a group on submit button click
$("#submit-button").on("click", function () {
    event.preventDefault();
    console.log("you clicked submit!");
    var enteredUserName = $("#name").val();
    var selectedGroupId = $("#group-menu").find(":selected").attr("data-id") 
    var selectedGroupName = $("#group-menu").find(":selected").html();
    
    //make sure that username was entered, otherwise return
    if (!enteredUserName) {
        console.log("no name entered");
        return;
    }

    //push username to firebase under the selected group node, save the key as "userID"
    var newRef = "groups/" + selectedGroupId + "/users";
    var user = database.ref(newRef).push({
        name: enteredUserName
    });
    userID = user.key;

    //set User ID and Group ID to session storage
    sessionStorage.setItem("storage-userName", enteredUserName);
    sessionStorage.setItem("storage-userID", userID);
    sessionStorage.setItem("storage-groupID", selectedGroupId);
    sessionStorage.setItem("storage-groupName", selectedGroupName);


    //Go to page 3
    location.href = "./index3.html";
    //location.href = "./backend-page3.html";

});



