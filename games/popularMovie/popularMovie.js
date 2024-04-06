const url= '"https://api.themoviedb.org/3/discover/movie?api_key=7d2a1aa3decd9987caef89b8479f5919';
const options = {method: 'GET', headers: {accept: 'application/json'}};
var debug = false;
var canVote = false;
var typeOfGame = "";
var currScore = 0;

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

    document.getElementById("higher").style.display = "block";
    document.getElementById("lower").style.display = "block";

    document.getElementById("scoreText").style.display = "block";

    if(typeOfGame == "Dates") {
        document.getElementById("higher").innerHTML = "Newer";
        document.getElementById("lower").innerHTML = "Older";
        document.getElementById("has").innerHTML = "was released on"
        document.getElementById("hasRight").innerHTML = "was released on"
    }else if (typeOfGame == "Budgets") {
        document.getElementById("higher").innerHTML = "Higher";
        document.getElementById("lower").innerHTML = "Lower";
        document.getElementById("has").innerHTML = "has a budget of"
        document.getElementById("hasRight").innerHTML = "has a budget of"
    }else{
        document.getElementById("higher").innerHTML = "Higher";
        document.getElementById("lower").innerHTML = "Lower";
        document.getElementById("has").innerHTML = "has a rating of"
        document.getElementById("hasRight").innerHTML = "has a rating of"
    }

}

function HideMenu() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "block";
}

function ShowMenu() {
    document.getElementById("menu").style.display = "flex";
    document.getElementById("game").style.display = "none";
}



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

    if((typeOfGame == "Dates" && !Date1Earlier(compareLeft, compareRight) || ((typeOfGame != "Dates") && compareLeft < compareRight))) {
        loseScreen();
    }else{
        currScore++;
        document.getElementById("scoreText").innerHTML = "Score : " + currScore;
        SetLeftMovie();
        SetRightMovie();
    }
}

function VoteLower() {
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

    if((typeOfGame == "Dates" && Date1Earlier(compareLeft, compareRight) || ((typeOfGame != "Dates") && compareLeft < compareRight))) {
        loseScreen();
    }else{
        currScore++;
        document.getElementById("scoreText").innerHTML = "Score : " + currScore;
        SetLeftMovie();
        SetRightMovie();
    }
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

async function GetPicture() {
    fetch('https://api.themoviedb.org/3/movie/157336?api_key=7d2a1aa3decd9987caef89b8479f5919', options)
    .then(response => response.json())
    .catch(err => console.error(err));

    return "done";
}

async function GetMovie() {
    var randomMovie = Math.floor(Math.random() * movies.length);
    // var randomMovie = 23;
    var returnedPosterURL = "";
    var returnedRating = "";
    var returnedReleaseDate = "";
    var returnedBudget = "";

    console.log(movies[randomMovie]);
    fetch('https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=' + movies[randomMovie], options)
    .then(response => response.json())
    .then(response => {
        returnedPosterURL = response.results[0].poster_path;
        returnedRating = response.results[0].vote_average;
        returnedRating = Math.round(returnedRating * 10) / 10;
        returnedReleaseDate = response.results[0].release_date;
        returnedBudget = response.results[0].budget;
    })
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
    }
}

async function SetLeftMovie() {
    if(leftMovie.title == "") {
        GetMovie().then(temp => {
            leftMovie.title = temp.title;
            leftMovie.poster = temp.poster;
            leftMovie.rating = temp.rating;
            leftMovie.releaseDate = temp.releaseDate;
            leftMovie.budget = temp.budget;
        }).catch(err => console.error(err));
    }else{
        leftMovie.title = rightMovie.title;
        leftMovie.poster = rightMovie.poster;
        leftMovie.rating = rightMovie.rating;
        leftMovie.releaseDate = rightMovie.releaseDate;
        leftMovie.budget = rightMovie.budget;
    }
}

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
            document.getElementById("movieRatingLeft").innerHTML = "$" + leftMovie.budget;
            document.getElementById("movieRatingRight").innerHTML = "$" + rightMovie.budget;
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
function ShowLossScreen() {
    document.getElementById("loseScreen").style.display = "flex";
    document.getElementById("leftMovieInfo").style.display = "none";
    document.getElementById("rightMovieInfo").style.display = "none";
    document.getElementById("vs").style.display = "none";
}

function HideLossScreen() {
    document.getElementById("loseScreen").style.display = "none";
    document.getElementById("leftMovieInfo").style.display = "flex";
    document.getElementById("rightMovieInfo").style.display = "flex";
    document.getElementById("vs").style.display = "block";
    document.getElementById("vsText").innerHTML = "VS";
}
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