require("dotenv").config();

// Load all npm packages
var keys = require("./keys.js");
var Twitter = require('twitter');
var request = require('request');
var Spotify = require('node-spotify-api');
var fs = require("fs");

// Load in spotify and twitter authentication keys
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Set argument variables
var searchArgs = process.argv;
var input1 = process.argv[2];
var input2 = process.argv[3];

// Empty search term variable to be filled by multiple arguments
var searchTerm = "";

// Fills searchTerm variable with multiple argument entries
for (var i = 3; i < searchArgs.length; i++) {
    if (i > 3 && i < searchArgs.length) {
        searchTerm = searchTerm + "+" + searchArgs[i];
    } else {
        searchTerm += searchArgs[i];
    };
};

// Calls liriCommand function
liriCommand(input1, searchTerm);

// main liriCommand that pulls in user inputs and runs functions based on those inputs
function liriCommand(input1, searchTerm) {
    switch (input1) {
        case "my-tweets":
            myTweets();
            break;

        case "spotify-this-song":
            spotifySong(searchTerm);
            break;

        case "movie-this":
            movieThis(searchTerm);
            break;

        case "do-what-it-says":
            doWhatItSays();
            break;
    };
};

// Function to pull in 20 of the user's most recent tweets
function myTweets() {
    client.get('statuses/user_timeline', function (error, tweets, response) {
        if (!error && response.statusCode === 200) {

            // Then we print out the tweets
            for (i = 0; i < 20; i++) {
                console.log("");
                console.log("----------------------------------");
                console.log("Time and date of tweet: " + tweets[i].created_at);
                console.log("Tweet: " + tweets[i].text);
            };
        } else {
            console.log("Error");
        };
    });
};

// Spotify song search function
function spotifySong() {
    // If user didn't input a song title, search "The Sign" by Ace of Base
    if (searchTerm === "") {
        spotify.search({ type: 'track', query: "the sign ace of base" }, function (err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            } else {
                // Logs information of Ace of Base to the console
                console.log("");
                console.log("----------------------------------");
                console.log("Artist: " + data.tracks.items[0].artists[0].name);
                console.log("Song: " + data.tracks.items[0].name);
                console.log("Preview: " + data.tracks.items[0].preview_url);
                console.log("Album: " + data.tracks.items[0].album.name);
                console.log("----------------------------------");
                console.log("");
            };
        });
    } else {
        // Search Spotify for user's song title input
        spotify.search({ type: 'track', query: searchTerm }, function (err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            } else {
                // Logs information of the searched song to the console
                console.log("");
                console.log("----------------------------------");
                console.log("Artist: " + data.tracks.items[0].artists[0].name);
                console.log("Song: " + data.tracks.items[0].name);
                console.log("Preview: " + data.tracks.items[0].preview_url);
                console.log("Album: " + data.tracks.items[0].album.name);
                console.log("----------------------------------");
                console.log("");
            };
        });
    };
};

// Functio to search OMDB for movie info
function movieThis() {
    // If user doesn't enter a search term, search for "Mr. Nobody"
    if (searchTerm === "") {
        request(("http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy"), function (error, response, body) {

            // If there were no errors and the response code was 200 (i.e. the request was successful)...
            if (!error && response.statusCode === 200) {

                // Then we print out the OMDB information
                console.log("----------------------------------");
                console.log("Movie Title: " + JSON.parse(body).Title);
                console.log("Year: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
                console.log("----------------------------------");
            } else {
                console.log('Error occurred: ' + error)
            };
        });
    } else {
        // If user inputs search term(s), search OMDB for that term
        request(("http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy"), function (error, response, body) {

            // If there were no errors and the response code was 200 (i.e. the request was successful)...
            if (!error && response.statusCode === 200) {

                // Then we print out the OMDB info for that movie
                console.log("----------------------------------");
                console.log("Movie Title: " + JSON.parse(body).Title);
                console.log("Year: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
                console.log("----------------------------------");
            } else {
                console.log('Error occurred: ' + error)
            };
        });
    };
};

// Function to read random.txt and perform the action from that file
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        };

        // Create an array of data from the random.txt file
        var dataArr = data.split(",");

        // Set the input for the liriCommand to the first item in the array
        input1 = dataArr[0];

        // Set the search term as a combination of any other data that comes after the initial command in the random.txt file
        for (i = 1; i < dataArr.length; i++) {
            searchTerm = searchTerm + " " + dataArr[i];
        };

        // Call the liriCommand function to use the random.txt data to perform a liri function
        liriCommand(input1, searchTerm);

    });
};