// Read and set any environment variables with the dotenv package
require("dotenv").config();

// Required to import the 'keys.js' file
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

function run() {
    switch (arg1) {
        case "concert-this":
        concertThis(arg2);
        break;

        case "spotify-this-song":
        spotifyThis(arg2);
        break;

        case "movie-this":
        movieThis(arg2);
        break;

        case "do-what-it-says":
        doWhatItSays(arg2);
        break;
    }
}


function concertThis(arg) {
    
}

function spotifyThis(arg) {

}

function movieThis(arg) {

}

function doWhatItSays(arg) {

}