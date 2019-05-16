// Read and set any environment variables with the dotenv package
require("dotenv").config();

// Required to import the 'keys.js' file
var keys = require("./keys.js");
var fs = require("fs");
var Axios = require("axios");
var Spotify = require("node-spotify-api");
var Inquirer = require("inquirer");
var arg1 = process.argv[2];
var arg2 = [];

var spotify = new Spotify(keys.spotify);
var omdbkey = keys.omdb.key;
var bandskey = keys.bands.key;

function run() {
     inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Search for a song.", "Search for a movie.", "Search for a concert event.", "Do what it says."]
        }
])
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

function concertThis() {
    for (i=2; i<process.argv.length; i++) {
        arg2.push(process.argv[i]);
    }
    Axios.get("https://rest.bandsintown.com/artists/" + arg2 + "/events?app_id="+bandskey).then(
        function(response) {
            for (var i=0; i<response.data.length; i++) {
                var venue = response.data[i].venue.name;
                var locale = response.data[i].venue.city + ", " + response.data[i].venue.region;
                var date = response.data[i].datetime; //use moment to format
                var out = venue +"\n"+ locale +"\n"+ date +"\n";
                console.log(out);
                write(out);
                }
        }
    )
};

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
    var out = artist +"\n"+ song +"\n"+ link +"\n"+ album +"\n";
    console.log(out); 
      });
}

function movieThis() {
    for (i=2; i<process.argv.length; i++) {
        arg2.push(process.argv[i]);
    }
    Axios.get("http://www.omdbapi.com/?t="+arg2+"&y=&plot=short&apikey="+omdbkey).then(
        function(response) {
            var title = "Title: " + response.data.Title;
            var year = "Year of Release: " + response.data.Year;
            var ratingIMDB = "IMDB Rating: " + response.data.imdbRating;
            var ratingRT = "Rotten Tomato Rating: " + response.data.Ratings[0].Value; // does not always work... how to search key-value and return?
            var country = "Country of Production: " + response.data.Country;
            var language = "Language: " + response.data.Language;
            var plot = "Plot: " + response.data.Plot;
            var actors = "Actors: " + response.data.Actors;
            var out = title +"\n"+ year +"\n"+ ratingIMDB +"\n"+ ratingRT +"\n"+ country +"\n"+ language +"\n"+ plot +"\n"+ actors +"\n";
            console.log(out);
        }
    );
};

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", (err, data) => {
        if (err) {
            return console.log(err);
        }
        var itSays = data.split(",");
        console.log(itSays);
    })
}

function write(data) {
    fs.appendFile('log.txt', data, (err) => {
        if (err) throw err;
        console.log('The "data" was appended to file!');
      });
}

// doWhatItSays();
// concertThis();
movieThis();