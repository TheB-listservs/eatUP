//just to make sure that proper js file is linked:
console.log("Inside page-2c JS!!!")

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
$("#submit-button").on("click", function () {
    event.preventDefault();
    console.log("you clicked submit!");
    var selectedGroupId = $("#group-menu").find(":selected").attr("data-id");
    var selectedGroupName = $("#group-menu").find(":selected").html();

    //set Group ID to Local storage
    sessionStorage.setItem("storage-groupID", selectedGroupId);
    sessionStorage.setItem("storage-groupName", selectedGroupName);

    //Go to page 4
    location.href = "./index4.html";
});