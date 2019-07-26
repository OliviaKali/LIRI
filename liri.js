//Global variables for each command
require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");

var command = process.argv[2];
var userInput = process.argv.slice(3).join("+");

function dispatch(command) {
    switch (command) {
        case "movie-this":
            movieSearch();
            break;
        case "spotify-this-song":
            songSearch();
            break;
        case "concert-this":
            eventSearch();
            break; 
    }
}
    switch(command) {
        case "do-what-it-says":
            doWhatItSay();
            break;
    }

//movie-this
function movieSearch() {
    if(!userInput){
        var queryUrl = "http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=trilogy";
        var type = "movie";
        console.log("-----------------------------"
        + "\nYou forgot to include a movie!" 
        + "\nHere's some information on Mr. Nobody!" 
        + "\n-----------------------------")  
    } else {
    var queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";
        var type = "movie";  
    }

    axios.get(queryUrl).then(
        function (response) {
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("Movie's Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Movie Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Cast: " + response.data.Actors);
        })
        .catch(function (error) {
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

//spotify-this-song
function songSearch() {
    var spotify = new Spotify(keys.spotify);

    if (!userInput) {
        spotify.search({ type: 'track', query: "The Sign by Ace of Base", limit: 3 })
            .then(function (response) {
                var artist = response.tracks.items[0].album.artists[0].name;
                var album = response.tracks.items[0].album.name;
                var previewLink = response.tracks.items[0].preview_url
                var songName = response.tracks.items[0].name
                console.log("-----------------------------"
                + "\nYou forgot to include a song!" 
                + "\nHere's some information on The Sign!" 
                + "\n-----------------------------")  
                console.log("Artist: " + artist);
                console.log("Song: " + songName);
                console.log("Album: " + album);
                console.log("Preview Link: " + previewLink);
            })
            .catch(function (err) {
                console.log(err);
            })
        }
    else {
        spotify.search({ type: 'track', query: userInput, limit: 3 })
        .then(function (response) {
            var artist = response.tracks.items[0].album.artists[0].name;
            var album = response.tracks.items[0].album.name;
            var previewLink = response.tracks.items[0].preview_url
            var songName = response.tracks.items[0].name

            console.log("Artist: " + artist);
            console.log("Song: " + songName);
            console.log("Album: " + album);
            console.log("Preview Link: " + previewLink);
        })
        .catch(function (err) {
            console.log(err);
        })
    }
}

//concert-this (Bands In Town)
function eventSearch() {
    var bandsURL = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp";

        axios.get(bandsURL).then(
            function (response) {
                var location = response.data[0].venue.city + ", " +
                    response.data[0].venue.region + " " +
                    response.data[0].venue.country;
                var date = response.data[0].datetime;
                // date = data.split(", ")
                var dateFormatted = moment(date, "YYYY-MM-DDTHH:mm:ss").format("MM/DD/YYYY")
            
                console.log("Venue: " + response.data[0].venue.name);
                console.log("Location: " + location);
                console.log("Date: " + dateFormatted);
            })
        .catch(function(error) {
            if (error.response) {
              console.log("---------------Data---------------");
              console.log(error.response.data);
              console.log("---------------Status---------------");
              console.log(error.response.status);
              console.log("---------------Status---------------");
              console.log(error.response.headers);
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log("Error", error.message);
            }
            console.log(error.config);
          });
}

// do-what-it-says
function doWhatItSay () {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }  
        var data =  data.split(",")

        command = data[0]
        userInput = data[1]
        
        dispatch(command);
        console.log(data)
    })
}

dispatch(command);