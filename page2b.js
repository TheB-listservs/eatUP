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

// grabbing the groups in firebase and adding them to the drop down
database.ref("/groups").on("child_added", function (grabData) {
    var opt = document.createElement('option');
    var groupId = grabData.key; 
    var groups = grabData.val().groupName;
    console.log(groups); 
    var newGroupDiv = $(opt).addClass("item").attr("data-id", groupId).html(groups);
    $("#group-menu").append(newGroupDiv)

});
    //entering a name and selecting a group on submit button click
    $("#submit-button").on("click", function () {
        event.preventDefault();
        console.log("you clicked submit!");
        var enteredUserName = $("#name").val();
        var selectedGroup = $("#group").val();
        if (!enteredUserName) {
            console.log("no name entered");
            return;
        }

        if (!selectedGroup) {
            console.log("no name entered");
            return;
        }

        var newPush = database.ref("/groups").push({
            groupName: selectedGroup
        })

        var id = newPush.key;
        var newRef = selectedGroup + id + "/users";

        var user = database.ref(newRef).push({
            name: enteredUserName
        });
        userID = user.key;




    });

