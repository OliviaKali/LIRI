//Global variables for each command
require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");

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
    if(process.argv.length > 3){
        var queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";
        var type = "movie";    
    } else {
        var queryUrl = "http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=trilogy";
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

    // var spotifyURI = spotify':'songName":""6rqhFgbbKwnb9MLmUQDhG6"
    // var spotifyURL = "http://open.spotify.com/"+ songName + "/6rqhFgbbKwnb9MLmUQDhG6"

    //if (command === "spotify-this-song")
    spotify.search({ type: 'track', query: userInput, limit: 3 })
        .then(function (response) {

            var artist = response.tracks.items[0].album.artists[0].name;
            var album = response.tracks.items[0].album.name;
            var previewLink = response.tracks.items[0].preview_url
            var songName = response.tracks.items[0].name
            // response = JSON.stringify(response);

            console.log("Artist: " + artist);
            console.log("Song: " + songName);
            console.log("Album: " + album);
            console.log("Preview Link: " + previewLink);
            // console.log(response.tracks.items[0].external_urls.spotify)
        })
        .catch(function (err) {
            console.log(err);
        })
}

//concert-this (Bands In Town)
function eventSearch() {

    var bandsURL = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp";

    // console.log(bandsURL)
        axios.get(bandsURL).then(
            function (response) {
                var location = response.data[0].venue.city + ", " +
                    response.data[0].venue.region + " " +
                    response.data[0].venue.country

                console.log(response.data[0].venue.name)
                console.log(response.data[0].datetime)
                console.log(location)

            })
        // .catch(function(error) {
        //     if (error.response) {
        //       console.log("---------------Data---------------");
        //       console.log(error.response.data);
        //       console.log("---------------Status---------------");
        //       console.log(error.response.status);
        //       console.log("---------------Status---------------");
        //       console.log(error.response.headers);
        //     } else if (error.request) {
        //       console.log(error.request);
        //     } else {
        //       console.log("Error", error.message);
        //     }
        //     console.log(error.config);

        //   });
}


// do-what-it-says
function doWhatItSay () {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }  
        var data =  data.split(",")
        // var result = 0;

        // for (var i = 0; i< data.length; i++) {
        //     if (data[i]) {
        //         result += data[i]
        //     }
        // }

        // console.log(data[0]);
        dispatch(command);
        // var data = data[0]
        console.log(data)
    })
}

dispatch(command);