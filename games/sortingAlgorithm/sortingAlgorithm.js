var lineCount = 100;
let lines;
var delay = 10;

var arrayAccesses = 0;
var arrayComparisons = 0;
var canChange = true;

var ids = [];
//1 in 20 chance happening 20 times = 1 in 1048576
window.onload = function(){
    lines = document.getElementsByClassName("lines")[0];

    FillLines();
    Shuffle();

    //bind space to bubble sort
    document.onkeydown = function(e){
        if(e.keyCode == 32){
            BubbleSort()
        }
    }

    //update the array accesses and comparisons every 50ms
    let updateText = setInterval(function(){
        document.getElementById("aa").innerText = arrayAccesses;
        document.getElementById("ac").innerText = arrayComparisons;
    }, 50);

 }

/**
 * Fills the lines div with lineCount number of lines
 * @returns {void}
*/
function FillLines(){
    while(lines.firstChild){
        lines.removeChild(lines.firstChild);
    }

    lines.style.gap = (100 / lineCount / 2) + "%";
    for(var i = 0; i < lineCount; i++){
        let newline = document.createElement("div");
        newline.setAttribute("class", "line");
        newline.setAttribute("id", "line" + i);
        newline.style.background = "white";
        newline.style.width = (100 / lineCount / 2) + "%";
        newline.style.height = Lerp(1, 100, i / lineCount) + "%";
        lines.appendChild( newline);
    }
}

/**
 * Changes the size of the array and refills the lines div
 * @returns {void}
*/

function ChangeArraySize(){
    if(!canChange){
        return;
    }

    lineCount = document.getElementById("as").value;
    FillLines();
    Shuffle();
}

/**
 * Changes the delay of the sorting algorithms
 * @returns {void}
*/
function ChangeSortingDelay(){
    delay = document.getElementById("sd").value;
}

/**
 * Shuffles the array
 * @param {boolean} skipCheck - Whether or not to skip the canChange check
 * @returns {void}
*/
function Shuffle(skipCheck){
    if(!canChange && !skipCheck){
        return;
    }

    arrayAccesses = 0;
    arrayComparisons = 0;

    for(var x = 0; x < 3; x++){
        for(var i = 0; i < lineCount; i++){
            document.getElementById("line" + i).style.background = "white";
            let newIndex = Math.floor(Math.random() * lineCount);

            SetChildAtIndex(lines, i, newIndex);
        }
    }
}

/**
 * Sorts the array using bubble sort
 * This algorithm is O(n^2) and is stable
 * @returns {void}
 * @async
*/
async function BubbleSort(){
    if(!canChange){
        return;
    }
    canChange = false;

    for(var i = 0; i < lineCount; i++){
        // SetChildToColor(lines, i, "red");
        await new Promise(a => setTimeout(a, delay));
        for(var j = 0; j < lineCount - i - 1; j++){
            SetChildToColor(lines, j + 1, "blue");
            SetChildToColor(lines, j, "blue");
            await new Promise(a => setTimeout(a, delay));
            if(GetChildHeight(lines, j) > GetChildHeight(lines, j+1)){
                SetChildAtIndex(lines, j + 1, j);
                arrayAccesses += 2;
            }
            SetChildToColor(lines, j + 1, "white");
            SetChildToColor(lines, j, "white");
            arrayComparisons++;
        }
        SetChildToColor(lines, lineCount - i - 1, "green");
    }
    await SortedCheck("BubbleSort");
    canChange = true;
}

/**
 * Sorts the array using selection sort
 * This algorithm is O(n^2) and is not stable
 * @returns {void}
 * @async
*/
async function SelectionSort(){
    if(!canChange){
        return;
    }
    canChange = false;

    for(var i = 0; i < lineCount; i++){
        let minIndex = i;
        for(var j = i + 1; j < lineCount; j++){
            SetChildToColor(lines, j, "blue");
            SetChildToColor(lines, minIndex, "blue");
            await new Promise(a => setTimeout(a, delay));
            if(parseFloat(GetChildAtIndex(lines, j).style.height) < parseFloat(GetChildAtIndex(lines, minIndex).style.height)){
                SetChildToColor(lines, minIndex, "white");
                minIndex = j;
            }
            SetChildToColor(lines, j, "white");
            SetChildToColor(lines, minIndex, "white");
            arrayComparisons++;
        }
        SetChildAtIndex(lines, minIndex, i);
        arrayAccesses += 2;
        SetChildToColor(lines, i, "green");
    }
    await SortedCheck("SelectionSort");
    canChange = true;
}

/**
 * The merge function for merge sort
 * @returns {void}
 * @param {Array} arr - The array to merge
 * @param {number} left - The left index of the array
 * @param {number} middle - The middle index of the array
 * @param {number} right - The right index of the array
 * @async
 * @see MergeSort
 * @see MergeSortMain
*/
async function Merge(arr, left, middle, right){
    var n1 = middle - left + 1;
    var n2 = right - middle;

    var L1 = new Array(n1);
    var R1 = new Array(n2);

    var L2 = new Array(n1);
    var R2 = new Array(n2);

    for(var i = 0; i < n1; i++){
        L1[i] = arr[0][left + i];
        L2[i] = arr[1][left + i];
    }

    for(var i = 0; i < n2; i++){
        R1[i] = arr[0][middle + 1 + i];
        R2[i] = arr[1][middle + 1 + i];
    }

    var i = 0;
    var j = 0;
    var k = left;

    //Merge the temp arrays back into arr[left..right]
    while(i < n1 && j < n2){
        if(L1[i] <= R1[j]){
            lines.children[k].style.background = "blue";

            await new Promise(a => setTimeout(a, delay));
            lines.children[k].style.height = L1[i] + "%";
            lines.children[k].id = L2[i];

            arr[0][k] = L1[i];
            arr[1][k] = L2[i];

            lines.children[k].style.background = "white";
            i++;
        }else{
            lines.children[k].style.background = "blue";

            await new Promise(a => setTimeout(a, delay));
            lines.children[k].style.height = R1[j] + "%";
            lines.children[k].id = R2[j];

            arr[0][k] = R1[j];
            arr[1][k] = R2[j];

            lines.children[k].style.background = "white";
            j++;
        }
        arrayAccesses += 2;
        arrayComparisons++;
        k++;
    }

    //Copy remaining elements of L[] if any
    while(i < n1){
        lines.children[k].style.background = "blue";

        await new Promise(a => setTimeout(a, delay));
        lines.children[k].style.height = L1[i] + "%";
        lines.children[k].id = L2[i];

        arr[0][k] = L1[i];
        arr[1][k] = L2[i];

        lines.children[k].style.background = "white";
        arrayAccesses += 2;
        i++;
        k++;
    }

    //Copy remaining elements of R[] if any
    while(j < n2){
        lines.children[k].style.background = "blue";

        await new Promise(a => setTimeout(a, delay));
        lines.children[k].style.height = R1[j] + "%";
        lines.children[k].id = R2[j];

        arr[0][k] = R1[j];
        arr[1][k] = R2[j];

        lines.children[k].style.background = "white";
        arrayAccesses += 2;
        j++;
        k++;
    }

    await new Promise(a => setTimeout(a, delay));
    return arr;
}


/**
 * Sorts the array using merge sort
 * @returns {void}
 * @param {Array} arr - The array to sort
 * @param {number} left - The left index of the array
 * @param {number} right - The right index of the array
 * @async
 * @see MergeSortMain
 * @see Merge
*/
async function MergeSort(arr, left, right){
    if(left >= right){
        return;
    }

    await new Promise(a => setTimeout(a, delay));

    var middle = left + parseInt((right - left) / 2);
    await MergeSort(arr, left, middle);
    await MergeSort(arr, middle + 1, right);
    await Merge(arr, left, middle, right);
}

/**
 * Sorts the array using merge sort
 * This algorithm is O(n log n) and is stable
 * @returns {void}
 * @async
 * @see MergeSort
 * @see Merge
*/
async function MergeSortMain(){
    if(!canChange){
        return;
    }
    canChange = false;
    var elementHeights = GetLineChildrenHeights(lines);
    var elementChildIds = GetLineChildrenIDs(lines);
    var combined = [elementHeights, elementChildIds];

    await MergeSort(combined, 0, combined[0].length - 1);
    await SortedCheck("MergeSort");
    canChange = true;

}

async function InsertionSort(){
    if(!canChange){
        return;
    }
    canChange = false;

    let key, j;
    for(var i = 1; i < lineCount; i++){
        key = GetChildHeight(lines, i);
        arrayAccesses++;
        j = i - 1;

        while(j >= 0 && GetChildHeight(lines, j) > key){
            SetChildToColor(lines, j, "blue");
            SetChildToColor(lines, j + 1, "blue");
            await new Promise(a => setTimeout(a, delay));
            SetChildToColor(lines, j, "white");
            SetChildToColor(lines, j + 1, "white");
            lines.children[j + 1].style.height = GetChildHeight(lines, j) + "%";
            j--;
            arrayComparisons++;
            arrayAccesses++;
        }
        lines.children[j + 1].style.height = key + "%";
        arrayAccesses++;
    }


    await SortedCheck("InsertionSort");
    canChange = true;
}

/**
 * The partition function for quick sort
 * @returns {number}
 * @param {Array} arr - The array to partition
 * @param {number} low - The low index of the array
 * @param {number} high - The high index of the array
 * @async
 * @see QuickSort
 * @see QuickSortMain
 */
async function PartitionQuick(arr, low, high){
    let pivot = arr[0][high];
    let i = low - 1;

    for(let j = low; j < high; j++){
        if(arr[0][j] < pivot){
            i++;

            document.getElementById(arr[1][j]).style.background = "blue";
            document.getElementById(arr[1][i]).style.background = "blue";
            await new Promise(a => setTimeout(a, delay));
            let temp = arr[0][i];
            arr[0][i] = arr[0][j];
            arr[0][j] = temp;

            let temp2 = arr[1][i];
            SwapIDsInfo(lines, arr[1][j], temp2);
            arr[1][i] = arr[1][j];
            arr[1][j] = temp2;

            document.getElementById(arr[1][j]).style.background = "white";
            document.getElementById(arr[1][i]).style.background = "white";

            arrayAccesses += 2;
            
        }
        arrayComparisons++;
    }

    document.getElementById(arr[1][i + 1]).style.background = "blue";
    document.getElementById(arr[1][high]).style.background = "blue";

    let temp = arr[0][i + 1];
    arr[0][i + 1] = arr[0][high];
    arr[0][high] = temp;
    

    let temp2 = arr[1][i + 1];
    SwapIDsInfo(lines, arr[1][high],  temp2);
    arr[1][i + 1] = arr[1][high];
    arr[1][high] = temp2;

    await new Promise(a => setTimeout(a, delay));
    document.getElementById(arr[1][i + 1]).style.background = "white";
    document.getElementById(arr[1][high]).style.background = "white";

    arrayAccesses += 2;
    return i + 1;
}

/**
 * Sorts the array using quick sort
 * @returns {void}
 * @param {Array} arr - The array to sort
 * @param {number} low - The low index of the array
 * @param {number} high - The high index of the array
 * @async
 * @see PartitionQuick
 * @see QuickSortMain
*/
async function QuickSort(arr, low, high){
    if(low < high){
        let pi = await PartitionQuick(arr, low, high);
        await QuickSort(arr, low, pi - 1);
        await QuickSort(arr, pi + 1, high);
    }
}


/**
 * Sorts the array using quick sort
 * This algorithm is O(n log n) and is not stable
 * @returns {void}
 * @async
 * @see PartitionQuick
 * @see QuickSort
*/
async function QuickSortMain(){
    if(!canChange){
        return;
    }
    canChange = false;
    var elementHeights = GetLineChildrenHeights(lines);
    var elementChildIds = GetLineChildrenIDs(lines);
    var combined = [elementHeights, elementChildIds];

    await QuickSort(combined, 0, lineCount - 1);
    await SortedCheck("QuickSort");
    console.log(combined);
    canChange = true;
}

/**
 * Sorts the array using heap sort
 * @returns {void}
 * @param {Array} arr - The array to sort
 * @param {number} n - The size of the array
 * @param {number} i - The index of the array
 * @async
 * @see HeapSortMain
 * @see HeapSort
*/
async function Heapify(arr, n, i){
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;
    
    if(l < n && arr[0][l] > arr[0][largest]){
        largest = l;
    }
    if(r < n && arr[0][r] > arr[0][largest]){
        largest = r;
    }

    arrayComparisons += 1;
    if(largest != i){
        document.getElementById(arr[1][i]).style.background = "blue";
        document.getElementById(arr[1][largest]).style.background = "blue";
        await new Promise(a => setTimeout(a, delay));
        let swap = arr[0][i];
        arr[0][i] = arr[0][largest];
        arr[0][largest] = swap;

        let swap2 = arr[1][i];
        SwapIDsInfo(lines, arr[1][largest], swap2);
        arr[1][i] = arr[1][largest];
        arr[1][largest] = swap2;

        document.getElementById(arr[1][i]).style.background = "white";
        document.getElementById(arr[1][largest]).style.background = "white";
        arrayAccesses += 2;
        await Heapify(arr, n, largest);
    }
}

/**
 * Sorts the array using heap sort
 * @returns {void}
 * @param {Array} arr - The array to sort
 * @async
 * @see Heapify
 * @see HeapSortMain
*/
async function HeapSort(arr){
    let n = arr[0].length;

    for(let i = n / 2 - 1; i >= 0; i--){
        await Heapify(arr, n, i);
    }

    for(let i = n - 1; i > 0; i--){
        document.getElementById(arr[1][0]).style.background = "blue";
        document.getElementById(arr[1][i]).style.background = "blue";
        await new Promise(a => setTimeout(a, delay));
        let temp = arr[0][0];
        arr[0][0] = arr[0][i];
        arr[0][i] = temp;

        let temp2 = arr[1][0];
        SwapIDsInfo(lines, arr[1][i], temp2);
        arr[1][0] = arr[1][i];
        arr[1][i] = temp2;

        document.getElementById(arr[1][0]).style.background = "white";
        document.getElementById(arr[1][i]).style.background = "white";
        arrayAccesses += 2;
        await Heapify(arr, i, 0);
    }
}

/**
 * Sorts the array using heap sort
 * This algorithm is O(n log n) and is not stable
 * @returns {void}
 * @async
 * @see HeapSort
 * @see Heapify
*/
async function HeapSortMain(){
    if(!canChange){
        return;

    }
    canChange = false;
    var elementHeights = GetLineChildrenHeights(lines);
    var elementChildIds = GetLineChildrenIDs(lines);
    var combined = [elementHeights, elementChildIds];
    
    await HeapSort(combined);
    await SortedCheck("HeapSort");
    canChange = true;
}


/**
 * Sorts the array using shell sort
 * This algorithm is O(n log n) and is not stable
 * @returns {void}
 * @async
*/
async function ShellSort(){
    if(!canChange){
        return;
    }
    canChange = false;

    let n = lineCount;
    for(let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)){
        for(let i = gap; i < n; i++){
            let temp = GetChildHeight(lines, i);
            let temp2 = GetChildIndexFromHeight(temp);
            let j;
            for(j = i; j >= gap && GetChildHeight(lines, j - gap) > temp; j -= gap){
                arrayComparisons+=2;
                SetChildToColor(lines, j, "blue");
                SetChildToColor(lines, j - gap, "blue");
                await new Promise(a => setTimeout(a, delay));
                SetChildToColor(lines, j, "white");
                SetChildToColor(lines, j - gap, "white");
                lines.children[j].style.height = GetChildHeight(lines, j - gap) + "%";
                arrayAccesses += 2;
            }
            lines.children[j].style.height = temp + "%";
            arrayAccesses += 1;
        }
    }

    await SortedCheck("ShellSort");
    canChange = true;
}

/**
 * Sorts the array using cocktail sort
 * This algorithm is O(n^2) and is stable
 * @returns {void}
 * @async
*/
async function CocktailSort(){
    //fix this
    if(!canChange){
        return;
    }
    canChange = false;

    let swapped = true;
    let start = 0;
    let end = lineCount - 1;
    while(swapped){
        swapped = false;

        for(let i = start; i < end; i++){
            SetChildToColor(lines, i, "blue");
            SetChildToColor(lines, i + 1, "blue");
            await new Promise(a => setTimeout(a, delay));
            if(GetChildHeight(lines, i) > GetChildHeight(lines, i + 1)){
                SwapIDsInfo(lines, lines.children[i].id, lines.children[i + 1].id);
                swapped = true;
                arrayAccesses += 2;
            }
            SetChildToColor(lines, i, "white");
            SetChildToColor(lines, i + 1, "white");
            arrayComparisons++;
        }

        if(!swapped){
            break;
        }

        swapped = false;
        end--;

        for(let i = end - 1; i >= start; i--){
            SetChildToColor(lines, i, "blue");
            SetChildToColor(lines, i + 1, "blue");
            await new Promise(a => setTimeout(a, delay));
            if(GetChildHeight(lines, i) > GetChildHeight(lines, i + 1)){
                SwapIDsInfo(lines, lines.children[i].id, lines.children[i + 1].id);
                swapped = true;
                arrayAccesses += 2;
            }
            SetChildToColor(lines, i, "white");
            SetChildToColor(lines, i + 1, "white");
            arrayComparisons++;
        }

        start++;
    }

    await SortedCheck("CocktailSort");
    canChange = true;
}

/**
 * Sorts the array using gnome sort
 * This algorithm is O(n x n!) and is stable
 * @returns {void}
 * @async
*/
async function BogoSort(){
    if(!canChange){
        return;
    }

    canChange = false;
    while(!await SortedCheck("BogoSort")){
        Shuffle(true);
        //await new Promise(a => setTimeout(a, delay));
    }

    canChange = true;
}


/**
 * Checks if the array is sorted, makes lines green if sorted, red if not
 * @returns {boolean}
 * @param {string} algorithm - The algorithm to check
 * @async
*/
async function SortedCheck(algorithm){
    console.log("Checking if sorted");
    for(var i = 0; i < lineCount-1; i++){
        SetChildToColor(lines, i, "red");
        await new Promise(a => setTimeout(a, 10));
        if(GetChildHeight(lines, i) > GetChildHeight(lines, i+1)){
            console.log("Not sorted, error in " + algorithm);
            return false;
        }
        SetChildToColor(lines, i, "green");
    }
    SetChildToColor(lines, lineCount-1, "green");
    console.log("Sorted");
    return true;
}

/**
 * Gets the heights of the children of a parent
 * @returns {Array}
 * @param {Element} parent - The parent element
*/
function GetLineChildrenHeights(parent){
    var heights = [];
    for(const child of parent.children){
        heights.push(parseFloat(child.style.height));
    }
    return heights;
}

/**
 * Gets the IDs of the children of a parent
 * @returns {Array}
 * @param {Element} parent - The parent element
*/
function GetLineChildrenIDs(parent){
    var ids = [];
    for(const child of parent.children){
        ids.push(child.id);
    }
    return ids;
}

//Helper functions
function ReplaceFromString(str, val, replacement){
    return str.replace(val, replacement);
}

function SetChildAtIndex(parent, oldIndex, newindex){
    parent.insertBefore(parent.children[oldIndex], parent.children[newindex]);
}


function SetChildToColor(parent, index, color){
    let child = parent.children[index];
    if(child == null){
        return;
    }
    child.style.background = color;
}

function GetChildIndexFromHeight(height){
    for(var i = 0; i < lineCount; i++){
        if(GetChildHeight(lines, i) === height){
            return lines.children[i].id.substring(4);
        }
    }
}

function SwapIDs(parent, a, b){
    var childPos1 = GetChildFromID(parent, a);
    var childPos2 = GetChildFromID(parent, b);

    parent.insertBefore(childPos1, childPos2);
}

function SwapIDsInfo(parent, a, b){
    var childPos1 = GetChildFromID(parent, a);
    var childPos2 = GetChildFromID(parent, b);

    let temp = childPos1.id;
    childPos1.id = childPos2.id;
    childPos2.id = temp;

    let temp2 = childPos1.style.height;
    childPos1.style.height = childPos2.style.height;
    childPos2.style.height = temp2;
}

function GetChildFromID(parent, id){
    for(var i = 0; i < parent.children.length; i++){
        if(parent.children[i].id === id){
            return parent.children[i];
        }
    }

    console.log("Error: ID not found");
    return null;
}

function GetChildAtIndex(parent, index){
    return parent.children[index];
}
function GetHeightFromID(parent, id){
    return document.getElementById(id).style.height;
}

function GetChildHeight(parent, index){
    return parseFloat(parent.children[index].style.height);
}
function Lerp(a, b, t){
    return a + (b - a) * t;
}   