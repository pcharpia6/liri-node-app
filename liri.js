// Read and set any environment variables with the dotenv package
require("dotenv").config();

// Required to import the 'keys.js' file
var keys = require("./keys.js");
// var express = require("express");
// var router = express.Router();
var axios = require("axios");
// var omdb = require("./omdb");
var Spotify = require("node-spotify-api");

var arg1 = process.argv[2];
var arg2 = [];



var spotify = new Spotify(keys.spotify);

// function run() {
//     switch () {
//         case "concert-this":
//         concertThis();
//         break;

//         case "spotify-this-song":
//         spotifyThis();
//         break;

//         case "movie-this":
//         movieThis();
//         break;

//         case "do-what-it-says":
//         doWhatItSays();
//         break;
//     }
// }

// spotify.search({type: "track", query: "mmbop"})
//     .then(function (spotRes) {
//         console.log(response);
//     })

// function concertThis() {

// }

function spotifyThis() {
    for (i=2; i<process.argv.length; i++) {
        arg2.push(process.argv[i]);
    }
    spotify.search({ type: 'track', query: arg2, limit: 1 }, function(err, data) {
        if (err) {
            spotify.search({type: "track", query: "Ace of Base", limit: 1})
            // return console.log('Error occurred: ' + err);
        }
    var artist = "Artist: " + data.tracks.items[0].artists[0].name;
    var song = "Song: " + data.tracks.items[0].name;
    var link = "Link: " + data.tracks.items[0].preview_url;
    var album = "Album: " + data.tracks.items[0].album.name;
    console.log(data.tracks.items[0].preview_url); 
      });
}

function movieThis() {
    for (i=2; i<process.argv.length; i++) {
        arg2.push(process.argv[i]);
    }
    arg2.join("+");
    // console.log(arg2);
    axios.get("http://www.omdbapi.com/?t="+arg2+"&y=&plot=short&apikey=8d2aecd1").then(
        function(response) {
            var title = "Title: " + response.data.Title;
            var year = "Year of Release: " + response.data.Year;
            var ratingIMDB = "IMDB Rating: " + response.data.imdbRating;
            var ratingRT = "Rotten Tomato Rating: " + response.data.Ratings[0].Value; // does not always work... how to search key-value and return?
            var country = "Country of Production: " + response.data.Country;
            var language = "Language: " + response.data.Language;
            var plot = "Plot: " + response.data.Plot;
            var actors = "Actors: " + response.data.Actors;
            console.log(title +"\n"+ year +"\n"+ ratingIMDB +"\n"+ ratingRT +"\n"+ country +"\n"+ language +"\n"+ plot +"\n"+ actors);
        }
    );
};

// function doWhatItSays() {

// }

spotifyThis();