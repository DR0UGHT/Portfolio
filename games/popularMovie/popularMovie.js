//http request options
const options = {method: 'GET', headers: {accept: 'application/json'}};

//variables
var debug = false;
var canVote = false;
var typeOfGame = "";
var currScore = 0;

//left and right movie objects
var leftMovie = {
    title: "",
    poster: "",
    rating: "",
    releaseDate: "",
    budget: "",
}

var rightMovie = {
    title: "",
    poster: "",
    rating: "",
    releaseDate: "",
    budget: "",
}

/**
 * StartGame sets the type of game and hides the menu
 * @param {string} type - the type of game to play (Dates, Budgets, Ratings)
 * @returns nothing
 */
function StartGame(type) {
    if(type != 'Again') typeOfGame = type;

    HideMenu();
    HideLossScreen();
    SetLeftMovie();
    SetRightMovie();
    canVote = true;
    currScore = 0;
    vs.style.background = "linear-gradient(to top, #FFFFFF 0%, #FFFFFF 100%)";
    document.getElementById("hasRight").style.display = "none";
    document.getElementById("movieRatingRight").style.display = "none";

    //show the buttons
    document.getElementById("higher").style.display = "block";
    document.getElementById("lower").style.display = "block";

    //show the score
    document.getElementById("scoreText").style.display = "block";

    //set the buttons to the correct text
    document.getElementById("higher").innerHTML = (typeOfGame == "Dates") ? "Newer" : "Higher";
    document.getElementById("lower").innerHTML = (typeOfGame == "Dates") ? "Older" : "Lower";
    document.getElementById("has").innerHTML = (typeOfGame == "Dates") ? "was released on" : (typeOfGame == "Budgets") ? "has a budget of" : "has a rating of";
    document.getElementById("hasRight").innerHTML =  document.getElementById("has").innerHTML;
}

/**
 * HideMenu hides the menu and shows the game
 * @returns nothing
*/
function HideMenu() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "block";
}

/**
 * ShowMenu shows the menu and hides the game
 * @returns nothing
*/
function ShowMenu() {
    document.getElementById("menu").style.display = "flex";
    document.getElementById("game").style.display = "none";
}

/**
 * VoteHigher checks if the right movie is higher than the right movie
 * @returns nothing
*/
function VoteHigher() {
    if(!canVote) return;
    canVote = false;

    var compareLeft;
    var compareRight;
    if(typeOfGame == "Dates") {
        compareLeft = leftMovie.releaseDate;
        compareRight = rightMovie.releaseDate;
    } else if(typeOfGame == "Budgets") {
        compareLeft = leftMovie.budget;
        compareRight = rightMovie.budget;
    } else{
        compareLeft = leftMovie.rating;
        compareRight = rightMovie.rating;
    }

    if(LessThan(compareLeft, compareRight)) {
        loseScreen();
    }else{
        currScore++;
        document.getElementById("scoreText").innerHTML = "Score : " + currScore;
        var fillAmount = 0;
        var vs = document.getElementById("vs");
        var increaseSize = setInterval(() => {
            fillAmount += 1;
            if(fillAmount <= 100){
                vs.style.background = "linear-gradient(to top, #74cf64 " + fillAmount + "%, #FFFFFF " + fillAmount + "%)";
            }else if(fillAmount == 250) {
                SetLeftMovie();
                SetRightMovie();
            }else if(fillAmount > 325) {
                vs.style.background = "linear-gradient(to top, #FFFFFF " + fillAmount + "%, #FFFFFF " + fillAmount + "%)";
                clearInterval(increaseSize);
            }
        }, 10); 
    }
}

/**
 * VoteLower checks if the right movie is lower than the right movie
 * @returns nothing
*/
function VoteLower() {
    if(!canVote) return;
    canVote = false;

    var compareLeft = "";
    var compareRight = "";
    if(typeOfGame == "Dates") {
        compareLeft = leftMovie.releaseDate;
        compareRight = rightMovie.releaseDate;
    } else if(typeOfGame == "Budgets") {
        compareLeft = leftMovie.budget;
        compareRight = rightMovie.budget;
    } else{
        compareLeft = leftMovie.rating;
        compareRight = rightMovie.rating;
    }

    if(LessThan(compareRight, compareLeft)) {
        loseScreen();
    }else{
        currScore++;
        document.getElementById("scoreText").innerHTML = "Score : " + currScore;
        var fillAmount = 0;
        var vs = document.getElementById("vs");
        var increaseSize = setInterval(() => {
            fillAmount += 1;
            if(fillAmount <= 100){
                vs.style.background = "linear-gradient(to top, #74cf64 " + fillAmount + "%, #FFFFFF " + fillAmount + "%)";
            }else if(fillAmount == 250) {
                SetLeftMovie();
                SetRightMovie();
            }else if(fillAmount > 325) {
                vs.style.background = "linear-gradient(to top, #FFFFFF " + fillAmount + "%, #FFFFFF " + fillAmount + "%)";
                clearInterval(increaseSize);
            }
        }, 10);        
    }
}

/**
 * LessThan checks if the left value is less than the right value
 * @param {string} left - the left value to compare
 * @param {string} right - the right value to compare
 * @returns {boolean} - if the left value is less than the right value
*/
function LessThan(left, right) {
    console.log(left + " " + right);
    if (typeOfGame == "Dates" && !Date1Earlier(left, right)) return true;
    else if (left > right) return true;
 
     return false;
 }

function loseScreen() {
    var vs = document.getElementById("vs");
    var fillAmount = 0.0;
    document.getElementById("vsText").innerHTML = "X";
    document.getElementById("fScore").innerHTML = currScore;

    document.getElementById("hasRight").style.display = "block";
    document.getElementById("movieRatingRight").style.display = "block";
    document.getElementById("higher").style.display = "none";
    document.getElementById("lower").style.display = "none";
    document.getElementById("scoreText").style.display = "none";
    var increaseSize = setInterval(() => {
        fillAmount += 1;
        if(fillAmount <= 100){
            vs.style.background = "linear-gradient(to top, #cf5656 " + fillAmount + "%, #FFFFFF " + fillAmount + "%)";
        }
        if(fillAmount > 550) {
            ShowLossScreen();
            clearInterval(increaseSize);
        }
    }, 10);
}

/**
 * GetMovie gets a random movie from the list of movies, usinf themoviedb api
 * @returns {object} - the movie object
 * @returns {string} title - the title of the movie
 * @returns {string} poster - the poster of the movie
 * @returns {string} rating - the rating of the movie
 * @returns {string} releaseDate - the release date of the movie
 * @returns {string} budget - the budget of the movie
 * @returns {number} id - the id of the movie
*/
async function GetMovie() {
    var randomMovie = Math.floor(Math.random() * movies.length);
    // var randomMovie = 23;
    var returnedPosterURL = "";
    var returnedRating = "";
    var returnedReleaseDate = "";
    var returnedBudget = "";
    var returnedId = 0;

    console.log(movies[randomMovie]);
    fetch('https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=' + movies[randomMovie], options)
    .then(response => response.json())
    .then(response => {
        returnedPosterURL = response.results[0].poster_path;
        returnedRating = response.results[0].vote_average;
        returnedRating = Math.round(returnedRating * 10) / 10;
        returnedReleaseDate = response.results[0].release_date;
        returnedId = response.results[0].id;
    })
    .catch(err => console.error(err));

    while(returnedId == 0){
        await new Promise(r => setTimeout(r, 500));
    }

    fetch('https://api.themoviedb.org/3/movie/' + returnedId + '?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb')
    .then(response => response.json())
    .then(response => returnedBudget = response.budget)
    .catch(err => console.error(err));

    while(returnedPosterURL == "" || returnedRating == "" || returnedReleaseDate == "" || returnedBudget == "") {
        await new Promise(r => setTimeout(r, 500));
    }

    return {
        title: movies[randomMovie],
        poster: 'http://image.tmdb.org/t/p/w500/' + returnedPosterURL,
        rating: returnedRating,
        releaseDate: returnedReleaseDate,
        budget: returnedBudget,
        id: returnedId
    }
}

/**
 * SetLeftMovie sets the left movie object
 * @returns nothing
*/
async function SetLeftMovie() {
    if(leftMovie.title == "") {
        var returnedId = 0;
        GetMovie().then(temp => {
            leftMovie.title = temp.title;
            leftMovie.poster = temp.poster;
            leftMovie.rating = temp.rating;
            leftMovie.releaseDate = temp.releaseDate;
            returnedId = temp.id;
        }).catch(err => console.error(err));

        while(returnedId == 0){
            await new Promise(r => setTimeout(r, 500));
        }
    
        fetch('https://api.themoviedb.org/3/movie/' + returnedId + '?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb')
        .then(response => response.json())
        .then(response => leftMovie.budget = response.budget)
        .catch(err => console.error(err));

        while(leftMovie.budget == 0){
            await new Promise(r => setTimeout(r, 500));
        }

        if(typeOfGame=="Budgets"){
            //make budget have commas to show money
            document.getElementById("movieRatingLeft").innerHTML = "$" + leftMovie.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }else{
        leftMovie.title = rightMovie.title;
        leftMovie.poster = rightMovie.poster;
        leftMovie.rating = rightMovie.rating;
        leftMovie.releaseDate = rightMovie.releaseDate;
        leftMovie.budget = rightMovie.budget;
    }
}

/**
 * SetRightMovie sets the right movie object
 * @returns nothing
*/
async function SetRightMovie() {
    GetMovie().then(temp => {
        if(leftMovie.title == temp.title){
            SetRightMovie();
            return;
        }
        
        rightMovie.title = temp.title;
        rightMovie.poster = temp.poster;
        rightMovie.rating = temp.rating;
        rightMovie.releaseDate = temp.releaseDate;
        rightMovie.budget = temp.budget;

        if(typeOfGame == "Dates") {
            document.getElementById("movieRatingLeft").innerHTML = leftMovie.releaseDate;
            document.getElementById("movieRatingRight").innerHTML = rightMovie.releaseDate;
        } else if(typeOfGame == "Budgets") {
            document.getElementById("movieRatingLeft").innerHTML = "$" + leftMovie.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById("movieRatingRight").innerHTML = "$" + rightMovie.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else{
            document.getElementById("movieRatingLeft").innerHTML = leftMovie.rating;
            document.getElementById("movieRatingRight").innerHTML = rightMovie.rating;
        }


        document.getElementById("movieTitleRight").innerHTML = "\"" + rightMovie.title + "\"";
        document.getElementById("moviePosterRight").src = rightMovie.poster;
        document.getElementById("movieTitleLeft").innerHTML = "\"" + leftMovie.title + "\"";
        document.getElementById("moviePosterLeft").src = leftMovie.poster;

        canVote = true;
    }).catch(err => console.error(err));
}

/**
 * Date1Earlier checks if date1 is earlier than date2
 * @param {string} date1 - the first date to compare
 * @param {string} date2 - the second date to compare
 * @returns {boolean} - if date1 is earlier than date2
*/
function Date1Earlier(date1, date2) {
    var date1Split = date1.split("-").map(Number);
    var date2Split = date2.split("-").map(Number);
    if(date1Split[0] < date2Split[0]) {
        return true;
    }else if(date1Split[0] == date2Split[0]) {
        if(date1Split[1] < date2Split[1]) {
            return true;
        }else if(date1Split[1] == date2Split[1]) {
            if(date1Split[2] < date2Split[2]) {
                return true;
            }
        }
    }
    return false;
}

/**
 * ShowLossScreen shows the loss screen in the html
 * @returns nothing
*/
function ShowLossScreen() {
    document.getElementById("loseScreen").style.display = "flex";
    document.getElementById("leftMovieInfo").style.display = "none";
    document.getElementById("rightMovieInfo").style.display = "none";
    document.getElementById("vs").style.display = "none";
}

/**
 * HideLossScreen hides the loss screen in the html
 * @returns nothing
*/
function HideLossScreen() {
    document.getElementById("loseScreen").style.display = "none";
    document.getElementById("leftMovieInfo").style.display = "flex";
    document.getElementById("rightMovieInfo").style.display = "flex";
    document.getElementById("vs").style.display = "block";
    document.getElementById("vsText").innerHTML = "VS";
}


//list of movies
const movies = [
    "The Shawshank Redemption",
    "The Godfather",
    "The Godfather Part II",
    "The Dark Knight",
    "12 Angry Men",
    "The Lord of the Rings: The Return of the King",
    "Pulp Fiction",
    "The Lord of the Rings: The Fellowship of the Ring",
    "Fight Club",
    "Forrest Gump",
    "Inception",
    "The Lord of the Rings: The Two Towers",
    "Star Wars: Episode V - The Empire Strikes Back",
    "The Matrix",
    "Goodfellas",
    "One Flew Over the Cuckoo's Nest",
    "Seven Samurai",
    "Se7en",
    "City of God",
    "The Silence of the Lambs",
    "It's a Wonderful Life",
    "Life Is Beautiful",
    "The Usual Suspects",
    "Leon: The Professional",
    "Saving Private Ryan",
    "Spirited Away",
    "American History X",
    "The Green Mile",
    "Interstellar",
    "Psycho",
    "City Lights",
    "Casablanca",
    "The Intouchables",
    "Modern Times",
    "Raiders of the Lost Ark",
    "The Pianist",
    "The Departed",
    "Rear Window",
    "Terminator 2: Judgment Day",
    "Back to the Future",
    "Whiplash",
    "Gladiator",
    "The Lion King",
    "The Prestige",
    "Apocalypse Now",
    "Memento",
    "Alien",
    "Sunset Boulevard",
    "The Lives of Others",
    "Django Unchained",
    "Cinema Paradiso",
    "Grave of the Fireflies",
    "The Shining",
    "Paths of Glory",
    "American Beauty",
    "The Dark Knight Rises",
    "Princess Mononoke",
    "Aliens",
    "Oldboy",
    "Witness for the Prosecution",
    "Once Upon a Time in America",
    "Das Boot",
    "Citizen Kane",
    "Vertigo",
    "North by Northwest",
    "Reservoir Dogs",
    "Braveheart",
    "Requiem for a Dream",
    "A Clockwork Orange",
    "Amelie",
    "Like Stars on Earth",
    "Lawrence of Arabia",
    "Double Indemnity",
    "Taxi Driver",
    "Eternal Sunshine of the Spotless Mind",
    "To Kill a Mockingbird",
    "Full Metal Jacket",
    "Singin' in the Rain",
    "2001: A Space Odyssey",
    "Toy Story 3",
    "Bicycle Thieves",
    "The Sting",
    "Toy Story",
    "Inglourious Basterds",
    "The Apartment",
    "Snatch",
    "Monty Python and the Holy Grail",
    "For a Few Dollars More",
    "L.A. Confidential",
    "Scarface (1983)",
    "The Lion King",
    "The Lego Movie",
    "Incredibles",
    "Incredibles 2",
    "Snow White and the Seven Dwarfs",
    "Cinderella",
    "Sleeping Beauty",
    "The Little Mermaid",
    "Beauty and the Beast",
    "Aladdin",
    "The Lion King",
    "Pocahontas",
    "Mulan",
    "The Princess and the Frog",
    "Tangled",
    "Frozen",
    "Moana",
    "Raya and the Last Dragon",
    "Encanto",
    "Toy Story",
    "Toy Story 2",
    "Toy Story 3",
    "Toy Story 4",
    "A Bug's Life",
    "Monsters, Inc.",
    "Finding Nemo",
    "The Incredibles",
    "Cars",
    "Ratatouille",
    "Up",
    "Brave",
    "Inside Out",
    "The Good Dinosaur",
    "Finding Dory",
    "Coco",
    "Onward",
    "Soul",
    "Luca",
    "Turning Red",
    "Cars 2",
    "Monsters University",
    "Planes",
    "Planes: Fire & Rescue",
    "Frozen II",
    "Raya and the Last Dragon",
    "Encanto",
    "The Little Mermaid",
    "Beauty and the Beast",
    "Aladdin",
]