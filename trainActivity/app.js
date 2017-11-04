// Initialize Firebase
var config = {
	apiKey: "AIzaSyCUVxcG3SnQOFBwjqUlUjasnflZvQ5SkhA",
	authDomain: "trainproject-zz.firebaseapp.com",
	databaseURL: "https://trainproject-zz.firebaseio.com",
	projectId: "trainproject-zz",
	storageBucket: "",
	messagingSenderId: "1034445679284"
};
firebase.initializeApp(config);
 // Create a variable to reference the database.
 var database = firebase.database();
// Initial Values
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;

// --------------------------------------------------------------
// Whenever a user clicks the submit button
$("#submit").on("click", function(event) {
  // Prevent form from submitting
  event.preventDefault();
  // Get the input values
  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrainTime = $("#firstTrainTime").val().trim();
  var frequency = $("#frequency").val().trim();

  database.ref().push({
  	trainName: trainName,
  	destination: destination,
  	firstTrainTime: firstTrainTime,
  	frequency: frequency
  });

  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTrainTime").val("");
  $("#frequency").val("");

});
// --------------------------------------------------------------
// At the initial load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(childSnapshot) {
	//set the train name, destination,... variables to variables stored in firebase
	trainName = childSnapshot.val().trainName;
	destination = childSnapshot.val().destination;
	firstTrainTime = childSnapshot.val().firstTrainTime;
	frequency = childSnapshot.val().frequency;
    
	// console.log(trainName);
	// console.log(destination);
	// console.log(firstTrainTime);
	// console.log(frequency);

  //updating time schedule
  function updatingTrainSchedule() {
        // First Time (pushed back 1 year to make sure it comes before current time)
        console.log("first train time: "+firstTrainTime);
        // console.log("frequency: "+frequency);
        var firstTrainTimeConverted = moment(firstTrainTime, "hh:mm a").subtract(1, "years");
        // console.log("time converted: "+firstTrainTimeConverted.format("hh:mm a"));
        // Current Time
        var currentTime = moment();
        // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm a"));
        // Difference between the times
        var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);
        // Time apart (remainder)
        var tRemainder = diffTime % frequency;
        console.log(tRemainder);
        // Minute Until Train
        var minutesAway = frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + minutesAway);
        // Next Train
        var nextArrival = moment().add(minutesAway, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm a"));
        
        //update time so it updates the train schedule automatically every minute
        // function updateTime() {
        //   var newCurrentTime = moment().format("hh:mm a");
        //   console.log(newCurrentTime);
          
        //   diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
        //   console.log("DIFFERENCE IN TIME: " + diffTime);
        //   tRemainder = diffTime % frequency;
        //   console.log(tRemainder);
        //   minutesAway = frequency - tRemainder;
        //   console.log("MINUTES TILL TRAIN: " + minutesAway);
        //   nextArrival = moment().add(minutesAway, "minutes");
        //   console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm a"));

        //   // update each train's data into the table
        //   $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
        //   frequency + "</td><td>" + moment(nextArrival).format("hh:mm a") + "</td><td>" + minutesAway + "</td></tr>");

        //   setTimeout(updateTime, 60000) //run update time every 60 seconds.
        // }
      
        // updateTime();
        // console.log("MINUTES TILL TRAIN: " + minutesAway);

        // console.log($("#train-table").children().children());
        // add each train's data into the table
        $("#train-table > tbody").append("<tr><td id='train-name'>" + trainName + "</td><td id='dest'>" + destination + "</td><td id='freq'>" +
        frequency + "</td><td id='next-arrival'>" + moment(nextArrival).format("hh:mm a") + "</td><td id='minutes-away'>" + minutesAway + "</td><td>"+"<button class='btn btn-success' id='update'>Update"+"</td><td>"+"<button class='btn btn-danger' id='remove'>Remove"+"</td></tr>");

        // //function to update train info
        // $("#update").on("click", function(event) {
        //   // Prevent form from submitting
        //   event.preventDefault();


        // });

        // //function to delete train info
        // $("#delete").on("click", function(event) {
        //   // Prevent form from submitting
        //   event.preventDefault();


        // });

        
      }

      
      
      updatingTrainSchedule();

      


 }, function(errorObject) {
	console.log("The read failed: " + errorObject.code);
});

