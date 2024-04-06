//scroll variables
const SCROLL_SPEED = 4;
var currScroll = 0;
const MAX_SCROLL = 0;
const MIN_SCROLL = -130;
var movingDown = false;

//food items to hold the calories and amount of each food
var foodItems = {
    'apple': {calories: 95, amount: 0},
    'banana': {calories: 110, amount: 0},
    'orange': {calories: 62, amount: 0},
    'mango': {calories: 201, amount: 0},
    '20 grapes': {calories: 69, amount: 0},
    'pineapple': {calories: 452, amount: 0},
    'watermelon slice': {calories: 30, amount: 0},
    '8 strawberies': {calories: 45, amount: 0},
    '40 blueberries': {calories: 31, amount: 0},
    '60 raspberry': {calories: 65, amount: 0},
    'kiwi': {calories: 42, amount: 0},
    'pear': {calories: 102, amount: 0},
    'peach': {calories: 59, amount: 0},
    'plum': {calories: 30, amount: 0},
    'gatorade': {calories: 140, amount: 0},
    'coke': {calories: 140, amount: 0},
    'mcchicken': {calories: 400, amount: 0},
    'big mac': {calories: 540, amount: 0},
    'medium fries': {calories: 340, amount: 0},
    'venti starbucks peppermint hot chocolate': {calories: 530, amount: 0},
    'venti starbucks mocha cookie crumble frappuccino': {calories: 590, amount: 0},
    'burger king whopper': {calories: 657, amount: 0},
    'burger onion rings': {calories: 410, amount: 0},
    'burger king chicken fries': {calories: 290, amount: 0},
    '1g of plutonium': {calories: 20000000000, amount: 0},
    '1lbs of grass': {calories: 64, amount: 0},
    'boost weight gain': {calories: 360, amount: 0},
    'bowl of cheerios': {calories: 224, amount: 0},
    'cup of 2% milk': {calories: 122, amount: 0},
    'cup of orange juice': {calories: 112, amount: 0},
    'cup of apple juice': {calories: 114, amount: 0},
    '6 pack of beer': {calories: 864, amount: 0},
    'bottle of wine': {calories: 625, amount: 0},
    'bottle of vodka': {calories: 1540, amount: 0},
    'jar of peanut butter': {calories: 5888, amount: 0},
    'jar of nutella': {calories: 4000, amount: 0},
    'subway meatball sub': {calories: 480, amount: 0},
    'subway chicken bacon ranch': {calories: 620, amount: 0},
    'subway steak and cheese': {calories: 380, amount: 0},
    'subway tuna': {calories: 480, amount: 0},
}

//animals and the calories needed per day
const animals = {
    //animal then calories needed per day
    'whale': 200000,
    'elephant': 60000,
    'cow': 30000,
    'horse': 25000,
    'gorilla': 8000,
    'bengaltiger': 6500,
    'nasaastronaut': 3500,
    'pig': 2200,
    'human': 2000,
    'dog': 500,
    'goose': 400,
    'duck': 300,
    'chicken': 260,
    'cat': 200,
    'hamster': 20,
    'mouse': 10,
    'ant': 0.5,
}

//current calories to pass to the html
var currentCalories = 0;

window.onload = function () {
    //bind scroll to a function
    window.addEventListener('wheel', function(e){ ScrollBody(e.deltaY > 0); });
    currScroll = MAX_SCROLL;
}

/**
    * AddCalories adds the calories of the food to the current calories and updates the amount of the food
    * @param {string} food - the food to add the calories of
    * @returns nothing
 */
function AddCalories(food) {
    currentCalories += foodItems[food].calories;
    foodItems[food].amount += 1;
    document.getElementById(food + ' amount').innerHTML = foodItems[food].amount;
    document.getElementsByClassName('totalCalories')[0].innerHTML = 'Calories : ' + currentCalories;

    caloriesCanFeed();
}

/**
 * RemoveCalories removes the calories of the food to the current calories and updates the amount of the food
 * @param {string} food - the food to remove the calories of
 * @returns nothing
*/
function RemoveCalories(food) {
    if(foodItems[food].amount == 0) return;

    currentCalories -= foodItems[food].calories;
    foodItems[food].amount -= 1;
    document.getElementById(food + ' amount').innerHTML = foodItems[food].amount;
    document.getElementsByClassName('totalCalories')[0].innerHTML = 'Calories : ' + currentCalories;

    caloriesCanFeed();
}

/**
 * caloriesCanFeed uses the current calories to feed the biggest animal first until there are no more calories
 * @returns {array} animalsFed - the animals that were fed
*/
function caloriesCanFeed() {
    //use up the calories to feed the biggest animal first until there are no more calories
    var calories = currentCalories;
    var animalsFed = [];
    var animalCount = [];

    //clear children from feeds
    var feeds = document.getElementsByClassName('feeds')[0];
    while (feeds.firstChild) feeds.removeChild(feeds.firstChild);

    for (var animal in animals) {
        while (calories >= animals[animal]) {
            calories -= animals[animal];

            if(animalsFed.includes(animal)){
                animalCount[animalsFed.indexOf(animal)] += 1;
            }else{
                //create a new div for the animal
                animalsFed.push(animal);
                animalCount.push(1);

                var newDiv = document.createElement('div');
                newDiv.className = 'feedItem';
                newDiv.setAttribute('id', 'feedItem' + animalsFed.indexOf(animal));
                newDiv.style.marginLeft = "1%";
                newDiv.style.marginRight = "1%";

                var title = document.createElement('h1');
                title.className = 'feedItemTitle';
                title.innerHTML = animal;
                newDiv.appendChild(title);

                var img = document.createElement('img');
                img.className = 'itemImage';
                img.setAttribute('id', 'feed' + animal);
                newDiv.appendChild(img);

                var amount = document.createElement('h1');
                amount.className = 'feedItemAmount';
                amount.setAttribute('id', animal + 'Amount');
                amount.innerHTML = animalCount[animalsFed.indexOf(animal)] + 'x';
                newDiv.appendChild(amount);

                document.getElementsByClassName('feeds')[0].appendChild(newDiv);
            }
        }
    }

    //update the images of the animals with the amount fed
    for(var i = 0; i < animalsFed.length; i++){
        document.getElementById(animalsFed[i] + 'Amount').innerHTML = animalCount[i] + 'x';
    }
    return animalsFed;
}

/**
 * ScrollBody scrolls the body up or down
 * @param {boolean} up - whether to scroll up or down
 * @returns nothing
*/
function ScrollBody(up) {
    //prevent jittering
    if(up && movingDown){
        movingDown = false;
        return;
    }else if(!up && !movingDown){
        movingDown = true;
        return;
    }



    currScroll += SCROLL_SPEED * (up ? -1 : 1);
    currScroll = Math.max(MIN_SCROLL, Math.min(MAX_SCROLL, currScroll));
    document.getElementsByClassName('itemGrid')[0].style.transform = 'translateY(' + currScroll + 'vw)';
}