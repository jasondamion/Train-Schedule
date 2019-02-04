$(document).ready(function(){
    //FIREBASE=========================================================
    var config = {
        apiKey: "AIzaSyCk0CpiOTck9_sPMRtcT0nKDs-rkkrFtUo",
        authDomain: "train-schedule-9d5a8.firebaseapp.com",
        databaseURL: "https://train-schedule-9d5a8.firebaseio.com",
        projectId: "train-schedule-9d5a8",
        storageBucket: "train-schedule-9d5a8.appspot.com",
        messagingSenderId: "1049842891613"
      };
    firebase.initializeApp(config);
    //VARIABLES=========================================================
    var database = firebase.database();
    
    // When they click the button
    $("#submit").on("click", function() {
    
    //To put the values on firebase
        var name = $('#nameInput').val().trim();
        var dest = $('#destInput').val().trim();
        var time = $('#timeInput').val().trim();
        var freq = $('#freqInput').val().trim();
    
    // Add to firebase
        database.ref().push({
            name: name,
            dest: dest,
            time: time,
            freq: freq,
            timeAdded: firebase.database.ServerValue.TIMESTAMP
        });
        // To stop it from refreshing
        $("input").val('');
        return false;
    });
    
    //On click function
    database.ref().on("child_added", function(childSnapshot){
        // console.log(childSnapshot.val());
        var name = childSnapshot.val().name;
        var dest = childSnapshot.val().dest;
        var time = childSnapshot.val().time;
        var freq = childSnapshot.val().freq;
    
        console.log("Name: " + name);
        console.log("Destination: " + dest);
        console.log("Time: " + time);
        console.log("Frequency: " + freq);
       
    
    //Convert train time================================================
        var freq = parseInt(freq);
        //Current time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment().format('HH:mm'));
        //First time: Pushed back one year to come before current time
        // var dConverted = moment(time,'hh:mm').subtract(1, 'years');
        var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
        console.log("DATE CONVERTED: " + dConverted);
        var trainTime = moment(dConverted).format('HH:mm');
        console.log("TRAIN TIME : " + trainTime);
        
        //Difference between the times
        var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
        var tDifference = moment().diff(moment(tConverted), 'minutes');
        console.log("DIFFERENCE IN TIME: " + tDifference);
        //Remainder
        var tRemainder = tDifference % freq;
        console.log("TIME REMAINING: " + tRemainder);
        //Mins till next train
        var minsAway = freq - tRemainder;
        console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
        //The next train
        var nextTrain = moment().add(minsAway, 'minutes');
        console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));
       
    
     //The table data=====================================================
     //To add to the table, the trains
    $('#currentTime').text(currentTime);
    $('#trainTable').append(
            "<tr><td id='nameDisplay'>" + childSnapshot.val().name +
            "</td><td id='destDisplay'>" + childSnapshot.val().dest +
            "</td><td id='freqDisplay'>" + childSnapshot.val().freq +
            "</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
            "</td><td id='awayDisplay'>" + minsAway  + ' minutes until arrival' + "</td></tr>");
     },

    function(errorObject){
        console.log("Read failed: " + errorObject.code)
    });
    

    
    }); 