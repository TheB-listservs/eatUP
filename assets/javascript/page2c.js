console.log("inside page2c JS!!!")

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

// grabbing the groups in firebase and adding them to the drop down
database.ref("/groups").on("child_added", function (grabData) {
    var opt = document.createElement('option');
    var groupId = grabData.key; 
    var groups = grabData.val().groupName; 
    var newGroupDiv = $(opt).addClass("item").attr("data-id", groupId).html(groups);
    $("#group-menu").append(newGroupDiv)

});



$("#submit-button").on("click", function () {
    event.preventDefault();
    console.log("you clicked submit!");
    var selectedGroupId = $("#group-menu").find(":selected").attr("data-id") 
    var newRef = "groups/" + selectedGroupId + "/users";
    //set Group ID to Local storage
    sessionStorage.setItem("storage-groupID", selectedGroupId);

    //move to page 3
    location.href = "./index4.html";
    //location.href = "./backend-page3.html";
});