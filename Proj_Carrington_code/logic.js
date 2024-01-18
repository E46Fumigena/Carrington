import {Avatar, Player, Meter} from "./modules/player.js";
import {randomSignedIntIntervaled, randomWeightedInt, completeRectCollisionCheck, randomUnsignedIntIntervaled,rectangleCollisionCheck} from "./modules/calc.js";
import {Pear} from "./modules/pears.js";
import {Mine} from "./modules/mine.js";
import {Explosion, GremlinDischarge} from "./modules/explosion.js";
import {Gremlin} from "./modules/gremlin.js";
import {InfoDisplay} from "./modules/infodisplay.js";
import {PlayerSubmix, PearChannel, PearSubmix, MineSubmix, GeneralMix, ExplosionChannel} from "./modules/audiomix.js";

async function loadSound(soundPath, audioContext){

    try{

        const response = await fetch(`${soundPath}`);

        playerOneMoveSound = await audioContext.decodeAudioData(await response.arrayBuffer());
    }
    catch (err) {
        
        console.error(`Unable to fetch the audio file. Error: ${err.message}`);
    }
}


async function loadSoundExplosion(soundPath, audioContext){

    try{

        const response = await fetch(soundPath);

        soundExplosion = await audioContext.decodeAudioData(await response.arrayBuffer());
    }
    catch (err) {
        
        console.error(`Unable to fetch the audio file. Error: ${err.message}`);
    }
}


/*
async function loadSoundPlayer(audioContext, playersNumber, soundsNumber){

    try{

        for(let i = 0; i < playersNumber; i++){

            for(let j = 0; j < soundsNumber; j++){

                const response = await fetch(`./sounds/player_${i}_${j}.wav`);

                playerSoundsArray[i][j] = await audioContext.decodeAudioData(await response.arrayBuffer());
            }
        }

        console.log(playerSoundsArray);
    }
    catch (err) {
        
        console.error(`Unable to fetch the audio file. Error: ${err.message}`);
    }
}
*/

async function loadSoundPlayer(audioContext, playersNumber, soundsNumber){

    try{

        for(let i = 0; i < playersNumber; i++){

            const shovelArray = [];

            for(let j = 0; j < soundsNumber; j++){

                const response = await fetch(`./sounds/player_${i}_${j}.wav`);

                shovelArray.push(await audioContext.decodeAudioData(await response.arrayBuffer()));
            }

            playerSoundsArray.push(shovelArray);
        }
    }
    catch (err) {
        
        console.error(`Unable to fetch the audio file. Error: ${err.message}`);
    }
}


function playOneHit(buffer, audioContext, outputNode){

    let source = audioContext.createBufferSource();

    source.buffer = buffer;

    source.connect(outputNode);

    source.loop = false;

    source.start();
}


function playPlayerLoop(buffer, playerIndex, loopIndex, audioContext, outputNode){

    playerLoopsArray[playerIndex][loopIndex] = audioContext.createBufferSource();

    playerLoopsArray[playerIndex][loopIndex].buffer = buffer;

    playerLoopsArray[playerIndex][loopIndex].connect(outputNode);

    playerLoopsArray[playerIndex][loopIndex].loop = true;

    playerLoopsArray[playerIndex][loopIndex].start();
}


function lobbyLoop(){

    if(playersArray.length > 0){

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        let xAllPressed = true;
        let rbumperAllPressed = true;

        let currentGamepad = -1;

        let alivePlayerIndex = -1;

        for(let i = 0; i < playersArray.length; i++){
            
            currentGamepad = navigator.getGamepads()[playersArray[i].gamepadIndex];

            if(currentGamepad.buttons[2].pressed){

                if(!playersArray[i].isAlive){

                    playersArray[i].isAlive = true;

                    playerCounter++;
                }
                else{

                    avatarsArray[i].drawIdentifier();

                    console.log(`player index is: ${i}`);
                }

            }
            else{
                
                if(playersArray[i].isAlive){
                    
                    xAllPressed = false;
                }
            }

            if(!currentGamepad.buttons[5].pressed){

                if(playersArray[i].isAlive){

                    rbumperAllPressed = false;
                }
            }

            if(playersArray[i].isAlive){

                alivePlayerIndex++;

                avatarsArray[i].originX = window.innerWidth / (playerCounter + 1) * (alivePlayerIndex + 1);

                avatarsArray[i].draw(playersArray);

                metersArray[i].draw(alivePlayerIndex * window.innerWidth / playerCounter, window.innerWidth / playerCounter, playersArray[i].health, playersArray[i].stamina, playersArray[i].charges);
            }
        }

        if(playerCounter > 1 && xAllPressed === true && rbumperAllPressed === true){

            stageLobbyOn = false;

            stageCountdownOn = true;
        }
    }
}


function countdownLoop(timeStamp){

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if(startTime === 0){

        startTime = timeStamp;

        countdownValue = 3;
    }

    timeDepo = timeStamp - startTime;

    if(timeDepo % 1000 < previousModulo){

        if(countdownValue > -1){
            
            countdownValue--;
        }
        else{

            stageCountdownOn = false;

            stageGameOn = true;

            let originX = 0;

            for(let i = 0; i < pearsNumber; i++){

                let pearType = randomWeightedInt(pearTypesAndWeights);

                let ceilingCounter = randomUnsignedIntIntervaled(ceilingCounterInterval[0], ceilingCounterInterval[1]);

                if(ceilingCounter === 0){console.log("FAULT!")}

                let floorCounter = randomUnsignedIntIntervaled(floorCounterInterval[0], floorCounterInterval[1]);

                pearsArray.push(new Pear(i, pearType, pearWidth, pearWidth, originX, ceilingY, pearSpeedMax, pearAcceleration, ceilingCounterInterval, floorCounterInterval,
                     true, ctx, pearTypesAndWeights, pearColours, superPearColour, superPearIndicatorRadiusMultiplier, ceilingCounter, floorCounter, 0, false, 
                     gremlinSuperHealthPears, gremlinSuperChargePears, gremlinSuperStaminaPears));

                originX = originX + pearWidth;
            }

            theGremlin = new Gremlin(window.innerWidth / 2 - gremlinWidth / 2, floorY, gremlinWidth, gremlinHeight, gremlinSlumberColour, gremlinLiveColour, gremlinUnleashPears,
                                            0, 0, gremlinSpeedMax, 0, gremlinDischarges, 0, gremlinDischargeDamage,
                                            gremlinDischargeRange, 1, gremlinTimeBetweenDischarges, gremlinPrimeDischargeTime, false, gremlinLifeCounter, gremlinLifeCounterMax, gremlinMaxSpeedPears);

            gremlinDischarge = new GremlinDischarge(gremlinDischargeRange / 2 , 0 , 0 , gremlinDamageInterval , explosionSpeed , false, 1, explosionLineWidthMultiplier, gremlinDischargeHitProbability);

            startTime = 0;//!!!
        }
    }

    alphaValue = (1000 - timeDepo % 1000) / 1000;

    ctx.font = `${window.innerHeight / 5}px Arial`;

    ctx.fillStyle = `rgba(255,255,255,${alphaValue})`;

    ctx.textAlign = "center";

    if(countdownValue > 0){
        
        ctx.fillText(`${countdownValue}`, window.innerWidth / 2, window.innerHeight / 2.5);
    }
    else if(countdownValue === 0){

        ctx.fillText("Start!", window.innerWidth / 2, window.innerHeight / 2.5);
    }

    previousModulo = timeDepo % 1000;
}


function gameLoop(timeStamp){

    let currentGamepad = -1;

    let currentSpeedMax = 0;

    let currentAcceleration = 0;

    let subtractStamina = false;

    let alivePlayerIndex = -1;
/*
    let previousAlivePlayersArray = [];

    for(let i = 0; i < playersArray.length; i++){


    }
*/


    if (startTime === 0){
        //skipped frame
        startTime = timeStamp;

        previousTimeStamp = timeStamp;
    }
    else{

        //pay attention to delta = 0 ! in an extremely improbable situation, it might backfire <- obsolete, but important obs nonetheless
        //LE skipped a frame in order to have a valid previousTimeStamp
        deltaTimeStamp = timeStamp - previousTimeStamp;

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        //*************UPDATE VALUES********************

        //UPDATE AVATARS

        updateAvatars: for(let i = 0; i < playersArray.length; i++){

            let previousPlayerSpeed = playersArray[i].speed;

            let previousLeftLanceCounter = playersArray[i].lanceLeftCounter;

            let previousRightLanceCounter = playersArray[i].lanceRightCounter;

            if(playersArray[i].isAlive){

                let targetsArrayLeft = [];

                let targetsArrayRight = [];

                alivePlayerIndex++;

                if(playersArray[i].counterStaggering > 0){

                    playersArray[i].counterStaggering = playersArray[i].counterStaggering - deltaTimeStamp;

                    if(playersArray[i].counterStaggering < 0){

                        playersArray[i].counterStaggering = 0;
                    }
                }


                currentGamepad = navigator.getGamepads()[playersArray[i].gamepadIndex];

                //*******************MOVEMENT Section */

                //movement button to the RIGHT pressed; processing movement to the RIGHT
                if(currentGamepad.buttons[15].pressed && playersArray[i].counterStaggering === 0){

                    //playersSubmixArray[i].setPlayerPan(avatarsArray[i].originX);

                    //playBuffer(playerOneMoveSound, audioContext, playersSubmixArray[i].moveGain);

                    //playPlayerLoop(playerSoundsArray[i][0], i, 0, audioContext, playersSubmixArray[i].moveGain);


                    //sprint buttons pressed condition
                    if((currentGamepad.buttons[5].pressed || currentGamepad.buttons[4].pressed) && playersArray[i].stamina != 0){

                        currentSpeedMax = playerSpeedSprintMax;

                        currentAcceleration = playerAcceleration + playerAccelerationSprint;

                        subtractStamina = true;
                    }
                    else{

                        currentSpeedMax = playersArray[i].speedMax;

                        currentAcceleration = playerAcceleration;
                    }

                    //speed condition
                    if(playersArray[i].speed >= 0){

                        playersArray[i].speed = playersArray[i].speed + currentAcceleration;

                        if(playersArray[i].speed > currentSpeedMax){

                            playersArray[i].speed = currentSpeedMax;
                        }

                        avatarsArray[i].originX = avatarsArray[i].originX + playersArray[i].speed * deltaTimeStamp / 1000;

                        if(subtractStamina){

                            playersArray[i].stamina = playersArray[i].stamina - playerStaminaConsumption * deltaTimeStamp / 1000;

                            if(playersArray[i].stamina < 0){
        
                                playersArray[i].stamina = 0;
                            }
                        }
                    }
                    // if player was sprinting in previous frame and has attained a speed greater than playersArray[i].speedMax, but is sprinting no more
                    else if(!subtractStamina && playersArray[i].speed >= 0 && Math.abs(playersArray[i].speed) > currentSpeedMax){

                        playersArray[i].speed = playersArray[i].speed - playerDeceleration;

                        if(playersArray[i].speed < currentSpeedMax){

                            playersArray[i].speed = currentSpeedMax;
                        }

                        avatarsArray[i].originX = avatarsArray[i].originX + playersArray[i].speed * deltaTimeStamp / 1000;
                    }

                }
                //processing player's inertial movement to the RIGHT. it also covers the situation in which the left move button is pressed at this time and it makes so that
                //the player starts moving to the left only after it first reaches v = 0 by decelerating inertially.
                else if(playersArray[i].speed > 0){

                    playersArray[i].speed = playersArray[i].speed - playerDeceleration;

                    if(playersArray[i].speed < 0){

                        playersArray[i].speed = 0;
                    }

                    avatarsArray[i].originX = avatarsArray[i].originX + playersArray[i].speed * deltaTimeStamp / 1000;                
                }

                //movement button to the LEFT pressed; processing movement to the LEFT
                if(currentGamepad.buttons[14].pressed && playersArray[i].counterStaggering === 0){

                    //sprint buttons pressed condition
                    if((currentGamepad.buttons[5].pressed || currentGamepad.buttons[4].pressed) && playersArray[i].stamina != 0){

                        currentSpeedMax = playerSpeedSprintMax;

                        currentAcceleration = playerAcceleration + playerAccelerationSprint;

                        subtractStamina = true;
                    }
                    else{

                        currentSpeedMax = playersArray[i].speedMax;

                        currentAcceleration = playerAcceleration;
                    }
                    //speed condition
                    if(playersArray[i].speed <= 0){

                        playersArray[i].speed = playersArray[i].speed - currentAcceleration;

                        if(Math.abs(playersArray[i].speed) > currentSpeedMax){

                            playersArray[i].speed = - currentSpeedMax;
                        }

                        avatarsArray[i].originX = avatarsArray[i].originX + playersArray[i].speed * deltaTimeStamp / 1000;

                        if(subtractStamina){

                            playersArray[i].stamina = playersArray[i].stamina - playerStaminaConsumption * deltaTimeStamp / 1000;

                            if(playersArray[i].stamina < 0){
        
                                playersArray[i].stamina = 0;
                            }
                        }
                    }
                    // if player was sprinting in previous frame and has attained a speed greater than playersArray[i].speedMax, but is sprinting no more
                    else if(!subtractStamina && playersArray[i].speed <= 0 && Math.abs(playersArray[i].speed) > currentSpeedMax){

                        playersArray[i].speed = playersArray[i].speed + playerDeceleration;

                        if(Math.abs(playersArray[i].speed) < currentSpeedMax){

                            playersArray[i].speed = - currentSpeedMax;
                        }

                        avatarsArray[i].originX = avatarsArray[i].originX + playersArray[i].speed * deltaTimeStamp / 1000;
                    }

                }
                //processing player's inertial movement to the LEFT. it also covers the situation in which the right move button is pressed at this time and it makes so that
                //the player starts moving to the right only after it first reaches v = 0 by decelerating inertially.
                else if(playersArray[i].speed < 0){

                    playersArray[i].speed = playersArray[i].speed + playerDeceleration;

                    if(playersArray[i].speed > 0){

                        playersArray[i].speed = 0;
                    }

                    avatarsArray[i].originX = avatarsArray[i].originX + playersArray[i].speed * deltaTimeStamp / 1000;
                }


                //check for wall collision
                //left
                if(avatarsArray[i].originX <= 0){

                    playOneHit(playerSoundsArray[i][3], audioContext, playersSubmixArray[i].hitGain);

                    avatarsArray[i].originX = 1;
                    //if the player is already in staggering mode and hits the wall inertially, the higher of the staggering counter values takes precedence
                    playersArray[i].counterStaggering = Math.max(Math.abs(playersArray[i].speed) * staggeringMaxTime * 1000 / playerSpeedMax, playersArray[i].counterStaggering);//player's Staggering counter is in milliseconds

                    let wallDamage = Math.floor(Math.abs(playersArray[i].speed) * damageReference / playerSpeedMax);

                    playersArray[i].health = playersArray[i].health - wallDamage;

                    infoDisplaysArray[i].injectInfo(`-${wallDamage}`, pearColours[0]);

                    playersArray[i].speed = 0;

                    if(playersArray[i].health < 0){

                        playersArray[i].health = 0;
                    }

                    if(playersArray[i].health === 0){

                        playersArray[i].isAlive = false;

                        playersArray[i].speed = 0;

                        //continue updateAvatars;
                    }
                }
                //right
                if(avatarsArray[i].originX + avatarsArray[i].width >= window.innerWidth){

                    playOneHit(playerSoundsArray[i][3], audioContext, playersSubmixArray[i].hitGain);

                    avatarsArray[i].originX = window.innerWidth - avatarsArray[i].width - 1;
                    //if the player is already in staggering mode and hits the wall inertially, the higher of the staggering counter values takes precedence
                    playersArray[i].counterStaggering = Math.max(Math.abs(playersArray[i].speed) * staggeringMaxTime * 1000 / playerSpeedMax, playersArray[i].counterStaggering);//player's Staggering counter is in milliseconds

                    let wallDamage = Math.floor(Math.abs(playersArray[i].speed) * damageReference / playerSpeedMax);

                    playersArray[i].health = playersArray[i].health - wallDamage;

                    infoDisplaysArray[i].injectInfo(`-${wallDamage}`, pearColours[0]);

                    playersArray[i].speed = 0;

                    if(playersArray[i].health < 0){

                        playersArray[i].health = 0;
                    }

                    if(playersArray[i].health === 0){

                        playersArray[i].isAlive = false;

                        playersArray[i].speed = 0;

                        //continue updateAvatars;
                    }
                }
                //if the player is staggering, this makes its avatar blink by modulating the alpha channel of the avatar
                if(playersArray[i].counterStaggering > 0){

                    alphaCounter++;

                    avatarsArray[i].alphaChannel = 1/StaggeringPulseWidth * alphaCounter;

                    if(alphaCounter === StaggeringPulseWidth){

                        alphaCounter = 0;
                    }
                }
                else{

                    avatarsArray[i].alphaChannel = 1;
                }


                //***************MELEE Section */

                //********SINGLE Condenser discharges*/

                //initiate LANCE to the LEFT
                if(currentGamepad.buttons[2].pressed && playersArray[i].lanceLeftCounter === 0){

                    if((playersArray[i].lanceRightCounter === 0 && !dualWieldingOn) || dualWieldingOn){

                        if(playersArray[i].charges >= playersArray[i].maxChargesPerCapacitor){

                            playersArray[i].lanceLeftCounter = lanceDurationMax * 1000 + deltaTimeStamp;

                            playersArray[i].totalDischargingCapsLeft = 1;

                            playersArray[i].charges = playersArray[i].charges - playersArray[i].maxChargesPerCapacitor;
                        }
                    }
                }

                //initiate LANCE to the RIGHT
                if(currentGamepad.buttons[1].pressed && playersArray[i].lanceRightCounter === 0){

                    if((playersArray[i].lanceLeftCounter === 0 && !dualWieldingOn) || dualWieldingOn){

                        if(playersArray[i].charges >= playersArray[i].maxChargesPerCapacitor){

                            playersArray[i].lanceRightCounter = lanceDurationMax * 1000 + deltaTimeStamp;

                            playersArray[i].totalDischargingCapsRight = 1;

                            playersArray[i].charges = playersArray[i].charges - playersArray[i].maxChargesPerCapacitor;
                        }
                    }
                }


                //*********MULTIPLE Capacitor discharges*/

                //initiate MULTIPLE LANCES to the LEFT
                if(currentGamepad.buttons[3].pressed && playersArray[i].lanceLeftCounter === 0){

                    if((playersArray[i].lanceRightCounter === 0 && !dualWieldingOn) || dualWieldingOn){

                        if(Math.floor(playersArray[i].charges / playersArray[i].maxChargesPerCapacitor) >= 2){

                            playersArray[i].lanceLeftCounter = lanceDurationMax * 1000 + deltaTimeStamp;

                            playersArray[i].totalDischargingCapsLeft = Math.floor(playersArray[i].charges / playersArray[i].maxChargesPerCapacitor);

                            playersArray[i].charges = playersArray[i].charges % playersArray[i].maxChargesPerCapacitor;
                        }
                    }
                }

                //initiate MULTIPLE LANCES to the RIGHT
                if(currentGamepad.buttons[0].pressed && playersArray[i].lanceRightCounter === 0){

                    if((playersArray[i].lanceLeftCounter === 0 && !dualWieldingOn) || dualWieldingOn){

                        if(Math.floor(playersArray[i].charges / playersArray[i].maxChargesPerCapacitor) >= 2){

                            playersArray[i].lanceRightCounter = lanceDurationMax * 1000 + deltaTimeStamp;

                            playersArray[i].totalDischargingCapsRight = Math.floor(playersArray[i].charges / playersArray[i].maxChargesPerCapacitor);

                            playersArray[i].charges = playersArray[i].charges % playersArray[i].maxChargesPerCapacitor;
                        }
                    }
                }


                

                //process TARGETS to the LEFT lances
                if(playersArray[i].lanceLeftCounter > 0){

                    targetsArrayLeft = [... playersArray[i].indexTargetsLeft(i, avatarsArray, playersArray, lanceLength, avatarWidth)];

                    if(targetsArrayLeft.length > 0){

                        if(previousTargetCheck[i] === false){

                            playPlayerLoop(playerSoundsArray[i][2], i, 2, audioContext, playersSubmixArray[i].lanceContactGain);
                        }

                        previousTargetCheck[i] = true;

                        for(let j = 0; j < targetsArrayLeft.length; j++){

                            playersArray[targetsArrayLeft[j]].health = playersArray[targetsArrayLeft[j]].health - (healthPerSecondLanceConsumption * deltaTimeStamp / 1000) / targetsArrayLeft.length * playersArray[i].totalDischargingCapsLeft;

                            if(playersArray[targetsArrayLeft[j]].health < 0){

                                playersArray[targetsArrayLeft[j]].health = 0;
                            }

                            if(playersArray[targetsArrayLeft[j]].health === 0){

                                playersArray[targetsArrayLeft[j]].isAlive = false;
                            }
                        }
                    }
                    else{

                        if(previousTargetCheck[i] === true){

                            playerLoopsArray[i][2].stop();
                        }

                        previousTargetCheck[i] = false;
                    }
                }

                //process TARGETS to the Right lances
                if(playersArray[i].lanceRightCounter > 0){

                    targetsArrayRight = [... playersArray[i].indexTargetsRight(i, avatarsArray, playersArray, lanceLength, avatarWidth)];

                    if(targetsArrayRight.length > 0){

                        if(previousTargetCheck[i] === false){

                            playPlayerLoop(playerSoundsArray[i][2], i, 2, audioContext, playersSubmixArray[i].lanceContactGain);
                        }

                        previousTargetCheck[i] = true;                        

                        for(let j = 0; j < targetsArrayRight.length; j++){

                            playersArray[targetsArrayRight[j]].health = playersArray[targetsArrayRight[j]].health - (healthPerSecondLanceConsumption * deltaTimeStamp / 1000) / targetsArrayRight.length * playersArray[i].totalDischargingCapsRight;

                            if(playersArray[targetsArrayRight[j]].health < 0){

                                playersArray[targetsArrayRight[j]].health = 0;
                            }

                            if(playersArray[targetsArrayRight[j]].health === 0){

                                playersArray[targetsArrayRight[j]].isAlive = false;
                            }
                        }
                    }
                    else{

                        if(previousTargetCheck[i] === true){

                            playerLoopsArray[i][2].stop();
                        }

                        previousTargetCheck[i] = false;
                    }
                }

                //decrement LEFT lance/s COUNTER
                if(playersArray[i].lanceLeftCounter > 0){

                    playersArray[i].lanceLeftCounter = playersArray[i].lanceLeftCounter - deltaTimeStamp;

                    if(playersArray[i].lanceLeftCounter < 0){

                        playersArray[i].lanceLeftCounter = 0;
                    }

                    if(playersArray[i].lanceLeftCounter === 0){

                        playersArray[i].totalDischargingCapsLeft = 0;
                    }
                }

                //decrement RIGHT lance/s COUNTER
                if(playersArray[i].lanceRightCounter > 0){

                    playersArray[i].lanceRightCounter = playersArray[i].lanceRightCounter - deltaTimeStamp;

                    if(playersArray[i].lanceRightCounter < 0){

                        playersArray[i].lanceRightCounter = 0;
                    }

                    if(playersArray[i].lanceRightCounter === 0){

                        playersArray[i].totalDischargingCapsRight = 0;
                    }
                }

                if(currentGamepad.buttons[11].pressed && playersArray[i].counterStaggering === 0 && minesArray[i].primed === false && playersArray[i].speed != 0 && playersArray[i].health > mineHealthCost && playersArray[i].charges >= mineChargeCost){

                    if(playersArray[i].speed < 0 && avatarsArray[i].originX + avatarWidth < window.innerWidth - mineWidth - mineThrow){

                        minesArray[i].primed = true;

                        minesArray[i].originX = avatarsArray[i].originX + avatarWidth + mineThrow;

                        minesArray[i].originY = floorY - mineHeight;

                        playersArray[i].health = playersArray[i].health - mineHealthCost;

                        playersArray[i].charges = playersArray[i].charges - mineChargeCost;
                    }

                    if(playersArray[i].speed > 0 && mineWidth + mineThrow < avatarsArray[i].originX){

                        minesArray[i].primed = true;

                        minesArray[i].originX = avatarsArray[i].originX - mineThrow - mineWidth;

                        minesArray[i].originY = floorY - mineHeight;

                        playersArray[i].health = playersArray[i].health - mineHealthCost;

                        playersArray[i].charges = playersArray[i].charges - mineChargeCost;
                    }
                }

            

                avatarsArray[i].draw(playersArray);

                avatarsArray[i].drawLance(playersArray, avatarsArray, targetsArrayLeft, targetsArrayRight, lanceXOffsetRange, lanceXOffsetRangeTargeted, lanceYOffsetRange, lanceYOffsetRangeTargeted, lanceHeightMultiplier);

                metersArray[i].draw(alivePlayerIndex * window.innerWidth / playerCounter, window.innerWidth / playerCounter, playersArray[i].health, playersArray[i].stamina, playersArray[i].charges);

                //minesArray[i].draw(playersColours, ctx);
            }

            
            

            //move sounds start/stop
            if(previousPlayerSpeed === 0 && playersArray[i].speed !=0){

                playPlayerLoop(playerSoundsArray[i][0], i, 0, audioContext, playersSubmixArray[i].moveGain);

                //console.log("pupu!!!");
            }

            if(previousPlayerSpeed != 0 && playersArray[i].speed === 0){

                playerLoopsArray[i][0].stop();

                //console.log("giugiuc!!!");
            }

            //lance sounds start/stop
            if(previousLeftLanceCounter === 0 && playersArray[i].lanceLeftCounter > 0){

                playPlayerLoop(playerSoundsArray[i][1], i, 1, audioContext, playersSubmixArray[i].lanceGain);
            }

            if(previousRightLanceCounter === 0 && playersArray[i].lanceRightCounter > 0){

                playPlayerLoop(playerSoundsArray[i][1], i, 1, audioContext, playersSubmixArray[i].lanceGain);
            }

            if(previousLeftLanceCounter > 0 && playersArray[i].lanceLeftCounter === 0){

                playerLoopsArray[i][1].stop();
            }

            if(previousRightLanceCounter > 0 && playersArray[i].lanceRightCounter === 0){

                playerLoopsArray[i][1].stop();
            }

            //player panning update
            playersSubmixArray[i].setPlayerPan(avatarsArray[i].originX);                
             

        }

        for(let i = 0; i < pearsArray.length; i++){

            

            pearsArray[i].update(playersArray, avatarsArray, deltaTimeStamp, floorY, ceilingY, healthBonus, staminaBonus, boulderMalus, staggeringMaxTime, damageReference, theGremlin, infoDisplaysArray, audioContext, playerSoundsArray, playersSubmixArray, playerLoopsArray);

            pearsArray[i].draw();

            
        }

        for(let i = 0; i < minesArray.length; i++){

            if(minesArray[i].primed){

                minesArray[i].update(avatarsArray, pearsArray, playersArray);

                minesArray[i].draw(playersColours, ctx);

                if(!minesArray[i].primed){
                    
                    explosionsArray[i].isLive = true;
                    explosionsArray[i].originX = minesArray[i].originX + minesArray[i].width/2;
                    explosionsArray[i].originY = floorY;

                    playOneHit(soundExplosion, audioContext, explosionsChannelsArray[i].explosionPanner);

                    explosionsChannelsArray[i].setExplosionPan(explosionsArray[i].originX);

                    //console.log(`mine index: ${i}`);
                    //console.log(`epicenter X: ${explosionsArray[i].originX}`);
                    //console.log(`epicenter Y: ${explosionsArray[i].originY}`);
                }
            }

        }

        for(let i = 0; i < explosionsArray.length;i++){

            explosionsArray[i].update(deltaTimeStamp, avatarsArray, playersArray, minesArray, explosionsArray, floorY, infoDisplaysArray, pearColours, playerSoundsArray, playersSubmixArray, audioContext, playerLoopsArray, soundExplosion, explosionsChannelsArray);
            explosionsArray[i].draw(playersColours[i],ctx, deltaTimeStamp);
        }

        theGremlin.update(deltaTimeStamp, gremlinDischarge, floorY, soundExplosion, audioContext, explosionsChannelsArray);

        theGremlin.draw(ctx);

        gremlinDischarge.update(deltaTimeStamp, avatarsArray, playersArray, minesArray, explosionsArray, floorY, infoDisplaysArray, pearColours, playerSoundsArray, playersSubmixArray, audioContext, playerLoopsArray, soundExplosion, explosionsChannelsArray);
        gremlinDischarge.draw(gremlinDischargeColour,ctx, deltaTimeStamp);

        for(let i = 0; i < infoDisplaysArray.length; i++){

            if(playersArray[i].isAlive){

                infoDisplaysArray[i].update(deltaTimeStamp, avatarsArray, playersArray);

                infoDisplaysArray[i].draw();
            }
        }

        previousTimeStamp = timeStamp;
    }


}


function mainLoop(timeStamp){

    
    if(stageLobbyOn){

        lobbyLoop();
    }

    if(stageCountdownOn){

        countdownLoop(timeStamp);
    }

    if(stageGameOn){

        gameLoop(timeStamp);
    }

    window.requestAnimationFrame(mainLoop);
}

/********************************************/
//START - GLOBAL VARIABLES DECLARATIONS


const htmlCanvas = document.getElementById("htmlCanvas");
const ctx = htmlCanvas.getContext("2d");

ctx.scale(1,1);

//const audioContext = new AudioContext();



htmlCanvas.width = window.innerWidth;
htmlCanvas.height = window.innerHeight;

const ceilingYToWindowHeightMultiplier = 25;
let ceilingY = window.innerHeight / ceilingYToWindowHeightMultiplier;

const floorYToWindowHeightMultiplier = 50;
let floorY = window.innerHeight - window.innerHeight / floorYToWindowHeightMultiplier;

const pearsNumber = 50;

let pearsArray = [];

//PLAYER / AVATAR
const avatarCrestsNumber = 4;
const avatarStripesNumber = 3;
const avatarCrestOffsetMultiplier = 4;

const pearToAvatarMultiplier = 1.4;
let avatarWidth = window.innerWidth / pearsNumber * pearToAvatarMultiplier;

const avatarToGamespaceHeightMultiplier = 6;
let avatarHeight = (window.innerHeight - ceilingY - window.innerHeight / floorYToWindowHeightMultiplier)/ avatarToGamespaceHeightMultiplier;

const avatarRndYIntervalMultiplier = 0.0157;// the number fed into the randomSignedIntIntervaled() in order to obtain the vertical random "vibration" effect on moving avatars; it is relative to the height of the avatar
let avatarRndYInterval = avatarHeight * avatarRndYIntervalMultiplier;// in pixels

const avatarCrestHeightMultiplier = 6;
let centerAvatarOriginX = window.innerWidth / 2;
let avatarOriginY = floorY - avatarHeight;


const playersColours = ["255, 0, 0", "0, 180, 255", "0, 255, 0", "255, 165, 0"];
const defaultAvatarAlphaChannel = 1;
const defaultMeterAlphaChannel = 1;
const playerHealthMax = 100;
const playerStaminaMax = 100;

const playerSpeedMaxMultiplier = 1.5;
let playerSpeedMax = window.innerWidth / playerSpeedMaxMultiplier; //pixels/second; the maximum player speed is a fraction of the space available horizontally inside the 
                                                                    //window in focus

const playerAccelerationMultiplier = 20; // playerAcceleration = playerSpeedMax / playerAccelerationMultiplier !!!MUST BE >= 1 !!!; 
let playerAcceleration = playerSpeedMax / playerAccelerationMultiplier;

const playerDecelerationMultiplier = 10; // playerDeceleration = playerSpeedMax / playerDecelerationMultiplier !!! MUST BE >= 1 !!!
let playerDeceleration = playerSpeedMax / playerDecelerationMultiplier;

const playerAccelerationSprintMultiplier = 1.5;
let playerAccelerationSprint = playerAcceleration / playerAccelerationSprintMultiplier;

const playerStaminaConsumptionMultiplier = 10;
const playerStaminaConsumption = playerStaminaMax / playerStaminaConsumptionMultiplier; //sprint resource consumption per second

const playerSpeedSprintMaxMultiplier = 0.60
let playerSpeedSprintMax = playerSpeedMax / playerSpeedSprintMaxMultiplier; // the maximum speed available during sprinting time

const damageReferenceMultiplier = 4; // actualReferenceDamage = playerHealthMax / damageReferenceMultiplier
let damageReference = playerHealthMax / damageReferenceMultiplier;

const staggeringMaxTime = 5; //in seconds; the maximum period of time a player will stutter during the game, unless it is a collision with a wall during a sprint (in which case it might be greater).
                            //it corresponds to the Staggering time caused by a hit by
                            //a falling boulder

const StaggeringPulseWidth = 10; //the smaller it is, the faster the alpha channel passes through maximum from minimum - makes the player's avatar blink while staggered

//LANCES
const lanceLengthMultiplier = 3.5;
let lanceLength = avatarWidth * lanceLengthMultiplier; //max length of electrical discharge; it is shorter when the target is closer

const lanceDurationMax = 5; //time duration of charge lance in seconds

const healthLanceTotalConsumptionMultiplier = 0.80; //the fraction of the max health of a player that is consumed if said player is exposed to one lance for the full time
                                                    //of the life of a lance
let healthLanceTotalConsumption = playerHealthMax * healthLanceTotalConsumptionMultiplier;

let healthPerSecondLanceConsumption =  healthLanceTotalConsumption / lanceDurationMax;

const dualWieldingOn = false;

const lanceOverlapLengthMultiplier = 0.25;
let lanceOverlapLength = avatarWidth * lanceOverlapLengthMultiplier;//how much the lance overlaps with the target's avatar

const lanceXOffsetRange = 2; //in pixels; it is the interval [-lanceXOffsetRange, lanceXOffsetRange] in which the random X offset takes values when drawing an untargeted lance

let lanceXOffsetRangeTargetedMultiplier = 4;//calc for the relation between lanceXOffsetRange and lanceXOffsetRangeTargeted

let lanceXOffsetRangeTargeted = lanceXOffsetRange * lanceXOffsetRangeTargetedMultiplier; //in pixels; it is the interval [-lanceXOffsetRangeTargeted, lanceXOffsetRangeTargeted] in which the random X offset takes values when drawing a targeted lance

const lanceYOffsetRange = 2; //in pixels; it is the interval [-lanceYOffsetRange, lanceYOffsetRange] in which the random X offset takes values when drawing an untargeted lance

let lanceYOffsetRangeTargetedMultiplier = 2;//calc for the relation between lanceYOffsetRange and lanceYOffsetRangeTargeted

let lanceYOffsetRangeTargeted = lanceYOffsetRange * lanceYOffsetRangeTargetedMultiplier; //in pixels; it is the interval [-lanceYOffsetRangeTargeted, lanceYOffsetRangeTargeted] in which the random X offset takes values when drawing a targeted lance

let lanceHeightMultiplier = 0.2;//defines the fraction of the lance height used to draw the white "dischargey" effect when the lance is targeted

//CAPACITORS
const chargesPerCapacitor = 3;

const numberOfCapacitors = 3;

//PEARS

let pearWidth = window.innerWidth / pearsNumber;

const pearSpeedMaxMultiplier = 2.3;

let pearSpeedMax = (floorY - ceilingY) / pearSpeedMaxMultiplier;//in pixels; max distance covered per second by a pear in freefall

const pearAccelerationMultiplier = 2;

let pearAcceleration = pearSpeedMax / pearAccelerationMultiplier;//it takes the pearAccelerationMultiplier number of seconds to get from 0 to pearSpeedMax

const healthBonusMultiplier = 5;//a fraction of the playerHealthMax value
let healthBonus = playerHealthMax / healthBonusMultiplier;

const superhealthBonus = playerHealthMax;//ATTENTION!! when applied, the overflow must be shaved off

const staminaBonusMultiplier = 5;//a fraction of the playerStaminaMax value
let staminaBonus = playerStaminaMax / staminaBonusMultiplier;

const superStaminaBonus = playerStaminaMax;//ATTENTION!! when applied, the overflow must be shaved off

const chargeBonus = 1;//the number of charges gained from a collision with a charge bonus object
const superChargeBonus = chargesPerCapacitor;//the number of charges gained from a collision with a supercharge bonus object

let boulderMalus = damageReference;

const superBoulderMalus = playerHealthMax;//the amount subtracted from playerHealthMax value when a collision occurs between a player and a super boulder. it must be an instakill
//so the value is equal to the playerHealthMax value. any overflow must be shaven off

const ceilingCounterInterval = [1000, 8000];//in milliseconds, it is the interval of time from which the resting time of a pear at the ceiling is randomly chosen

const floorCounterInterval = [2000, 7000];//in milliseconds, it is the interval of time from which the resting time of a boulder on the floor is randomly chosen

//ATTENTION!!! The weights MUST be POSITIVE INTEGERS!
const healthPearWeight = 30;

const superHealthPearWeight = 1;

const staminaPearWeight = 40;

const superStaminaPearWeight = 1;

const chargePearWeight = 40;

const superChargePearWeight = 1;

const boulderPearWeight = 80;

const superBoulderPearWeight = 1;

const voidPearWeight = 800;

//weights of pears by type of pear. every element of this array is the weight used in the random generation function randomWeightedInt()
//types of pears by index:
/*
0 - health bonus
1 - superhealth bonus
2 - stamina bonus
3 - superstamina bonus
4 - charge bonus
5 - supercharge bonus
6 - boulder malus
7 - superboulder malus
8 - void pear
*/

const pearTypesAndWeights = [healthPearWeight, superHealthPearWeight, staminaPearWeight, superStaminaPearWeight, chargePearWeight, superChargePearWeight, boulderPearWeight, superBoulderPearWeight, voidPearWeight];

//colours of pears by type of pear

//const pearColours = ["Chartreuse", "Chartreuse", "Turquoise", "Turquoise", "Crimson", "Crimson", "Black", "Black"];

const pearColours = ["127, 255, 0", "127, 255, 0", "64, 224, 208", "64, 224, 208", "220, 20, 60", "220, 20, 60", "0, 0, 0", "0, 0, 0"];

const superPearColour = "OrangeRed";

const superPearIndicatorRadiusMultiplier = 4;//fraction of a pear width to be the radius of the super pear indicator circle

let alphaCounter = 0;

//MINES
const mineWidthMultiplier = 0.6;
let mineWidth = avatarWidth * mineWidthMultiplier;
let mineHeight = mineWidth;

const coreOffsetMultiplier = 0.2;
let coreOffset = mineWidth * coreOffsetMultiplier;

const lineWidthMultiplier = 15;
let mineLineWidth = mineWidth / lineWidthMultiplier;

const mineThrowMultiplier = 0.1;
let mineThrow = mineWidth * mineThrowMultiplier;

const mineHealthCostMultiplier = 0.2;
let mineHealthCost = playerHealthMax * mineHealthCostMultiplier;

const mineChargeCost = 2;

//EXPLOSION
const explosionRadiusMultiplier = 0.33/2;
let explosionRadius = window.innerWidth * explosionRadiusMultiplier;

const explosionDamageMultiplier =  1;
let explosionDamage = damageReference * explosionDamageMultiplier;

const explosionSpeedMultiplier = 0.6;
let explosionSpeed = playerSpeedMax * explosionSpeedMultiplier;

const explosionLineWidthMultiplier = 1.4;

//GREMLIN

let theGremlin = {};

let gremlinDischarge = {};

const gremlinWidthMultiplier = 2;
let gremlinWidth = avatarWidth * gremlinWidthMultiplier;

let gremlinHeight = window.innerHeight - floorY;

const gremlinSlumberColour = "Tan";

const gremlinLiveColour = "Orchid";

const gremlinUnleashPears = 6;//health and charge pears accumulate until this amount is reached - then The Gremlin is unleashed; it should be an even number

let gremlinMaxSpeedPears = 8;//once The Gremlin has accumulated this nr of speed pears it attains speedMax; the current speed of The Gremlin is calculated by TROT:
                            //currentSpeed = speedMax * currentSpeedPears / maxSpeedPears
                            //the speed pears are accumulated by The Gremlin while isLive = true and isLive = false, unlike the other pears, which are accumulated only
                            //during the isLive = false phase

const gremlinSpeedMaxMultiplier = 1.3;
let gremlinSpeedMax = playerSpeedMax * gremlinSpeedMaxMultiplier;//pixel/seconds

const gremlinDischarges = 5;
//the time duration in seconds between discharges is calculated like this: gremlinLifeCounterMax / gremlinDischarges
//the first discharge takes place at the end of the first time interval between discharges
//the last discharge takes place exactly when gremlinLifeCounter goes back to 0 and The Gremlin slips into his deep slumber once more

const gremlinDamageMultiplier = 0.8;
let gremlinDischargeDamage = (gremlinUnleashPears / gremlinDischarges) * damageReference * gremlinDamageMultiplier;

const gremlinDamageIntervalPercentage = [100, 60];//at the epicenter of the gremlin discharge, the percentage of gremlinDischargeDamage inflicted as damage to a player 
                                        //is gremlinDamageInterval[0]; at the limit of the gremlinDischargeRange, the percentage of gremlinDischargeDamage
                                        //inflicted as damage to a player is gremlinDamageInterval[1]. the values between those limits are decreasing linearly

let gremlinDamageInterval = [gremlinDamageIntervalPercentage[0] * gremlinDischargeDamage / 100, gremlinDamageIntervalPercentage[1] * gremlinDischargeDamage / 100];                                        

const gremlinDischargeHitProbability = 80;//percent hit probability on targets in range of discharge; constant throughout the whole discharge range

const gremlinDischargeRangeMultiplier = 0.65;
let gremlinDischargeRange = window.innerWidth * gremlinDischargeRangeMultiplier;

const gremlinTimeBetweenDischarges = 7;//in seconds

const gremlinPrimeDischargeTimeMultiplier = 5;//The Gremlin does not move for a time interval of gremlinPrimeDischargeTime exactly before a discharge event
let gremlinPrimeDischargeTime = gremlinTimeBetweenDischarges / gremlinPrimeDischargeTimeMultiplier;

const gremlinDischargeColour = "255, 255, 255";

const gremlinSuperHealthPears = 3;//equivalent value in common pears amount for gremlin accumulators
const gremlinSuperChargePears = 3;
const gremlinSuperStaminaPears = 3;

const gremlinLifeCounter = 0;
const gremlinLifeCounterMax = 40;//in seconds


//Info Displays

const infoDisplayAvatarWidthMultiplier = 1.2;
let infoDisplayWidth = avatarWidth * infoDisplayAvatarWidthMultiplier;

const infoDisplayBaseMarginMultiplier = 0.15;
let infoDisplayBaseMargin = infoDisplayWidth * infoDisplayBaseMarginMultiplier;

const infoDisplayTopMarginMultiplier = 0.08;
let infoDisplayTopMargin = infoDisplayWidth * infoDisplayTopMarginMultiplier;

const infoDisplayLateralMarginMultiplier = 0.12;
let infoDisplayLateralMargin = infoDisplayWidth * infoDisplayLateralMarginMultiplier;

let infoDisplayFontType = "Arial";

const infoDisplayNumberOfCharacters = 3;//mainly, a "+" followed by a two digits integer, no spaces

const infoDisplayFontSizeMultiplier = 2;
let infoDisplayFontSize = Math.floor(infoDisplayWidth / infoDisplayNumberOfCharacters * infoDisplayFontSizeMultiplier);

const infoDisplayMaxCounter = 6;//in seconds, measures the maximum time of visibility of the text displayed in an infoDisplay cell

const infoDisplayAlphaSustainTimeMultiplier = 0.3;
//after this period of time the text in the infoDisplay begins to fade (alpha value becomes a fraction of the value of the time counter)
let infoDisplayAlphaSustainTime = infoDisplayMaxCounter * infoDisplayAlphaSustainTimeMultiplier;//in seconds


//Sound Section

let playerSoundsArray = [];

let playerLoopsArray = [[null, null, null], [null, null, null], [null, null, null], [null, null, null]];

let channelIndex = 0;

let soundExplosion = null;

const soundExplosionPath = "./sounds/explosion_001.wav";


let playersArray = [];
let avatarsArray = [];
let metersArray = [];
let minesArray = [];
let explosionsArray = [];
let infoDisplaysArray = [];
let playersSubmixArray = [];
let explosionsChannelsArray = [];

let previousTargetCheck = [false, false, false, false];

let playerCounter = 0;


let stageInitGame = true;

let stageLobbyOn = false;

let stageCountdownOn = false;

let stageGameOn = false;



let startTime = 0;

let previousTimeStamp = 0;

let deltaTimeStamp = 0;

let countdownValue = null;

let alphaValue = 1;

let timeDepo = 0;

let previousModulo = 0;

let previousSecondsModulo = 0;

let secondsCounter = 0;

let playerOneMoveSound = null;

let audioContext = null;

let audioDestination = null;

let generalMix = null;




/************************************************/
//END - GLOBAL VARIABLES DECLARATIONS



window.addEventListener("gamepadconnected", (e) => {

    if (stageInitGame){

        let playerIndex = 0;

        audioContext = new AudioContext();

        //audioDestination = audioContext.destination;

        generalMix = new GeneralMix(audioContext, 32);

        generalMix.setGeneralPan();

        //console.log(`first log of general mix:`);
        //console.log(generalMix);

        //loadSound("./sounds/player_1_move_source_001.wav", audioContext);

        loadSoundPlayer(audioContext, 4, 5);

        loadSoundExplosion(soundExplosionPath, audioContext);

        for(let i = 0; i < 5; i++){

            explosionsChannelsArray.push(new ExplosionChannel(audioContext, 0, generalMix.generalMixerLeft, generalMix.generalMixerRight));
        }

        console.log(explosionsChannelsArray);


        for(let i = 0; i < navigator.getGamepads().length; i++){

            if(navigator.getGamepads()[i] != null){

 

                playersArray.push(new Player(playerHealthMax, playerStaminaMax, chargesPerCapacitor, numberOfCapacitors, 40, 0, 2, false, playerIndex, playersColours[playerIndex], playerSpeedMax, 0, playerAcceleration, playerDeceleration, 0, 0, 0, 0, 0));

                avatarsArray.push(new Avatar(centerAvatarOriginX, avatarOriginY, avatarWidth, avatarHeight, avatarCrestsNumber, avatarCrestOffsetMultiplier, 
                    avatarCrestHeightMultiplier, avatarStripesNumber, playerIndex, -1 - playerIndex - 1, playersArray[playerIndex].playerColour, defaultAvatarAlphaChannel, ctx, lanceLength, lanceOverlapLength, avatarRndYInterval));
                    
                metersArray.push(new Meter(0, ceilingY, 6, 1, 200, 170, ctx, playerIndex, playersColours[playerIndex], defaultMeterAlphaChannel, playersArray[i].numberOfCapacitors, playersArray[i].maxHealth, playersArray[i].maxStamina, playersArray[i].maxChargesPerCapacitor));

                minesArray.push(new Mine(0 , 0 , mineWidth , mineHeight , coreOffset , 0 , playerIndex , mineLineWidth , false ));

                explosionsArray.push(new Explosion(explosionRadius , 0 , 0 , explosionDamage , explosionSpeed , false, 1, explosionLineWidthMultiplier));

                infoDisplaysArray.push(new InfoDisplay(i, 0, avatarOriginY, infoDisplayWidth, infoDisplayBaseMargin, infoDisplayTopMargin, infoDisplayLateralMargin,
                    infoDisplayFontType, infoDisplayNumberOfCharacters, infoDisplayMaxCounter, infoDisplayAlphaSustainTime, ctx, infoDisplayFontSize));

                playersSubmixArray.push(new PlayerSubmix(audioContext, channelIndex, generalMix.generalMixerLeft, generalMix.generalMixerRight));


                channelIndex++;

                playerIndex++;
            }
        }

        for(let i = 0; i < playersSubmixArray.length; i++){

            playersSubmixArray[i].bonusReceivedGain.gain.value = 0.2;

            playersSubmixArray[i].moveGain.gain.value = 0.8;

            playersSubmixArray[i].lanceGain.gain.value = 0.7;

        }

        //console.log(playersSubmixArray);

        //console.log(`second log of general mix:`);
        //console.log(generalMix);

        stageInitGame = false;

        stageLobbyOn = true;
    }
});
    
window.requestAnimationFrame(mainLoop);

export {playOneHit, playPlayerLoop};