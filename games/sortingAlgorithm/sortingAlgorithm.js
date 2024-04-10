var lineCount = 100;
let lines;
var delay = 1;

var arrayAccesses = 0;
var arrayComparisons = 0;
var canChange = true;


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

 }

function FillLines(){
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

function Shuffle(){
    for(var x = 0; x < 3; x++){
        for(var i = 0; i < lineCount; i++){
            let newIndex = Math.floor(Math.random() * lineCount);

            SetChildAtIndex(lines, i, newIndex);
        }
    }
}

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
        SetChildToColor(lines, i, "green");
    }
    await SortedCheck("SelectionSort");
    canChange = true;
}

async function MergeSortMain(){
    if(!canChange){
        return;
    }
    canChange = false;
    const divElements = Array.from(lines.children);
    MergeSort(divElements, 0, lineCount - 1).then(async() => {
        //await SortedCheck("MergeSort");
        console.log("Sorted");
        canChange = true;
    });
}

async function merge(arr, leftStart, middle, rightEnd){
    const leftArr = arr.slice(leftStart, middle + 1);
    const rightArr = arr.slice(middle + 1, rightEnd + 1);

    let i = 0,
        j = 0,
        k = leftStart;

    while(i < leftArr.length && j < rightArr.length){
        if(GetChildHeight(lines, leftStart + i) <= GetChildHeight(lines, middle + 1 + j)){
            arr[k++] = leftArr[i++];
        }else{
            arr[k++] = rightArr[j++];
        }
       
        SetChildAtIndex(lines, leftStart + i, k);
        await new Promise(a => setTimeout(a, delay));
    }

    while(i < leftArr.length){
        arr[k++] = leftArr[i++];
        console.log("Setting " + (leftStart + i - 1) + " to " + k);
        SetChildAtIndex(lines, leftStart + i - 1, k);
        await new Promise(a => setTimeout(a, delay));
    }

    while(j < rightArr.length){
        arr[k++] = rightArr[j++];
        SetChildAtIndex(lines, middle + 1 + j - 1, k);
        await new Promise(a => setTimeout(a, delay));
    }
}


async function MergeSort(arr, left = 0, right = lineCount){
    if(left >= right){
        return;
    }
    const middle = Math.floor((left + right) / 2);
    await MergeSort(arr, left, middle);
    await MergeSort(arr, middle + 1, right);
    await merge(arr, left, middle, right);
}

async function SortedCheck(algorithm){
    console.log("Checking if sorted");
    for(var i = 0; i < lineCount - 1; i++){
        SetChildToColor(lines, i, "red");
        await new Promise(a => setTimeout(a, 10));
        if(GetChildHeight(lines, i) > GetChildHeight(lines, i+1)){
            console.log("Not sorted, error in " + algorithm);
            return;
        }
        SetChildToColor(lines, i, "green");
    }
}

function SetChildAtIndex(parent, oldIndex, newindex){
    console.log("Swapping " + oldIndex + " with " + newindex);
    let childBeforeHeight = GetChildHeight(parent, oldIndex);
    let childAfterHeight = GetChildHeight(parent, newindex);
    let childBeforeID = parent.children[oldIndex].id;
    let childAfterID = parent.children[newindex].id;
    
    parent.children[oldIndex].style.height = childAfterHeight + "%";
    parent.children[oldIndex].id = childAfterID;

    parent.children[newindex].style.height = childBeforeHeight + "%";
    parent.children[newindex].id = childBeforeID;

    // parent.insertBefore(parent.children[oldIndex], parent.children[newindex]);
}

function SetChildToColor(parent, index, color){
    let child = parent.children[index];
    if(child == null){
        return;
    }
    child.style.background = color;
}

function GetChildAtIndex(parent, index){
    return parent.children[index];
}

function GetChildHeight(parent, index){
    return parseFloat(parent.children[index].style.height);
}
function Lerp(a, b, t){
    return a + (b - a) * t;
}   