// Read and set any environment variables with the dotenv package
require("dotenv").config();

// Required to import the 'keys.js' file
var keys = require("./keys.js");
var fs = require("fs");
var Axios = require("axios");
var Spotify = require("node-spotify-api");
var Inquirer = require("inquirer");
var Moment = require("moment");
var whatItSays = false;
var itSays;

var spotify = new Spotify(keys.spotify);
var omdbkey = keys.omdb.key;
var bandskey = keys.bands.key;

function getTask() {
    var task;
    Inquirer.prompt([
        { type: "list",
        message: "What would you like to do?",
        choices: ["Search for a song.", "Search for a movie.", "Search for a concert event.", "Do what it says."],
        name: "task" }
    ]).then((inqResp) => {
        task = inqResp.task
        getInput(task);
    })
};

function getInput(taskInput) {
    var song;
    switch (taskInput) {
        case "Search for a song.":
        if (whatItSays) {
            spotifyThis(itSays[1])
            break;
        }
        Inquirer.prompt([
            { type: "input",
            message: "What is the name of the song?",
            name: "song",
            default: "The Sign" }
        ]).then((inqResp) => {
            if (inqResp) {
                song = inqResp.song;
            }
            spotifyThis(song);
        })
        break;

        case "Search for a movie.":
        if (whatItSays) {
            movieThis(itSays[1])
            break;
        }
        Inquirer.prompt([
            { type: "input",
            message: "What is the name of the movie?",
            name: "movie",
            default: "Mr. Nobody" }
        ]).then((inqResp) => {
            if (inqResp) {
                movie = inqResp.movie;
            }
            movieThis(movie);
        })
        break;

        case "Search for a concert event.":
            if (whatItSays) {
                concertThis(itSays[1])
                break;
            }
        Inquirer.prompt([
            { type: "input",
            message: "What is the name of the musical group?",
            name: "band",
            default: "Sugar Ray" }
        ]).then((inqResp) => {
            if (inqResp) {
                band = inqResp.band;
            }
            concertThis(band);
        })
        break;

        case "Do what it says.":
        doWhatItSays();
        break;
    }
};

function concertThis(band) {
    var eventArray = [];
    Axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id="+bandskey).then(
        function(response) {
            for (var i=0; i<response.data.length; i++) {
                var venue = "Venue: " + response.data[i].venue.name;
                var locale = "Region: " + response.data[i].venue.city + ", " + response.data[i].venue.region;
                var date = "Date: " + Moment(response.data[i].datetime).format("MMM DD YYYY");
                var out = venue +"\n"+ locale +"\n"+ date +"\n";
                console.log(out);
                eventArray.push(out);
            }
            write(eventArray);
        }
    )
};

function spotifyThis(song) {
    spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
        if (err) {
            spotify.search({type: "track", query: "Ace of Base", limit: 1})
            return console.log('Error occurred: ' + err);
        }
    var artist = "Artist: " + data.tracks.items[0].artists[0].name;
    var song = "Song: " + data.tracks.items[0].name;
    var link = "Link: " + data.tracks.items[0].preview_url;
    var album = "Album: " + data.tracks.items[0].album.name;
    var out = artist +"\n"+ song +"\n"+ link +"\n"+ album +"\n";
    console.log(out);
    write(out);
      });
};

function movieThis(movie) {
    Axios.get("http://www.omdbapi.com/?t="+movie+"&y=&plot=short&apikey="+omdbkey).then(
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
            write(out);
        }
    );
};

function doWhatItSays() {
    whatItSays = true;
    fs.readFile("random.txt", "utf8", (err, data) => {
        if (err) {
            return console.log(err);
        }
        itSays = data.split(",");
        getInput(itSays[0]);
    })
}

function write(data) {
    fs.appendFile('log.txt', data, (err) => {
        if (err) throw err;
        console.log('The "data" was appended to file!');
      });
}

getTask();