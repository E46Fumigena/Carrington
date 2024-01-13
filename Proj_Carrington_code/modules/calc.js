//generates a random integer within the boundaries of the [-theNumber, theNumber] interval
function randomSignedIntIntervaled(theNumber){

    let unsignedNumber = Math.floor(Math.random() * (theNumber + 1));
    
    if(Math.random() < 0.5){

        return(-unsignedNumber);
    }
    else{

        return(unsignedNumber);
    }
}

//returns a random index in an array, given the array
function randomArrayPosition(theArray){

    let position = Math.floor(Math.random() * theArray.length);

    return(position);
}

//returns an integer which takes values from an interval with positive boundaries
//a < b
function randomUnsignedIntIntervaled(a, b){

    let number = a + Math.floor(Math.random() * (b - a + 1));

    return(number);
}


//generates a random positive integer that takes value from 0 to array.length - 1, using the weights declared in each element of the array; array must contain at least 2 elements
function randomWeightedInt(theArray){

    let workArray = [];

    for(let i = 0; i < theArray.length; i++){

        for(let j = 0; j < theArray[i]; j++){

            workArray.push(i);
        }
    }

    let position = Math.floor(Math.random() * workArray.length);
        
    return(workArray[position]);
}


//generic collision detection; the first array contains the coordinates of the four corners of a rectangle, the second too;
//the function checks if any of the four corners of the first rectangle are inside of the second rectangle or are on its contour lines
//both arrays contain this structure: [[topLeftX, topLeftY], [topRightX, topRightY], [bottomRightX, bottomRightY], [bottomLeftX, bottomLeftY]]
function rectangleCollisionCheck(firstRectangle, secondRectangle){

    for(let i = 0; i < 4; i++){

        if((firstRectangle[i][0] >= secondRectangle[0][0] && firstRectangle[i][0] <= secondRectangle[1][0]) 
        
        && (firstRectangle[i][1] >= secondRectangle[0][1] && firstRectangle[i][1] <= secondRectangle[3][1])){

            return(true);
        }
    }

    return(false);
}

//this collision check function applies the first collision in both ways, to perform a complet collision check
function completeRectCollisionCheck(firstRectangle, secondRectangle){

    if(rectangleCollisionCheck(firstRectangle, secondRectangle)){console.log("collision!"); return(true)}
    if(rectangleCollisionCheck(secondRectangle, firstRectangle)){console.log("collision!"); return(true)}

    return(false);
}



export {randomSignedIntIntervaled, randomWeightedInt, completeRectCollisionCheck, randomArrayPosition, randomUnsignedIntIntervaled, rectangleCollisionCheck};