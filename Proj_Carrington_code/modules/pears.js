import {randomSignedIntIntervaled, randomWeightedInt, completeRectCollisionCheck, randomArrayPosition, randomUnsignedIntIntervaled} from "./calc.js";
import{InfoDisplay} from "./infodisplay.js";
import {playOneHit, playPlayerLoop} from "../logic.js";

class Pear{

    constructor(pearIndex, pearType, pearWidth, pearHeight, originX, originY, speedMax, acceleration, ceilingCounterInterval, floorCounterInterval, isLive, ctx, pearTypesAndWeights, pearColours, superPearColour, superPearIndicatorRadiusMultiplier, ceilingCounter, floorCounter, speed, collisioned,
                gremlinSuperHealthPears, gremlinSuperChargePears, gremlinSuperStaminaPears){

        this.pearIndex = pearIndex;
        this.pearType = pearType;
        this.width = pearWidth;
        this.height = pearHeight;
        this.originX = originX;
        this.originY = originY;
        this.speedMax = speedMax;
        this.acceleration = acceleration;
        this.ceilingCounterInterval = ceilingCounterInterval;
        this.floorCounterInterval = floorCounterInterval;
        this.isLive = isLive;
        this.ctx = ctx;
        this.pearTypesAndWeights = pearTypesAndWeights;
        this.pearColours = pearColours;
        this.superPearColour = superPearColour;
        this.superPearIndicatorRadiusMultiplier = superPearIndicatorRadiusMultiplier;

        this.ceilingCounter = ceilingCounter;
        this.floorCounter = floorCounter;
        this.speed = speed;

        this.collisioned = collisioned;

        this.gremlinSuperHealthPears = gremlinSuperHealthPears;
        this.gremlinSuperChargePears = gremlinSuperChargePears;
        this.gremlinSuperStaminaPears = gremlinSuperStaminaPears;

    }

    update(playersArray, avatarsArray, deltaTimeStamp, floorY, ceilingY, healthBonus, staminaBonus, boulderMalus, staggeringMaxTime, damageReference, theGremlin, infoDisplaysArray, audioContext, playerSoundsArray, playersSubmixArray, playerLoopsArray){

        if(this.ceilingCounter != 0){

            this.ceilingCounter = this.ceilingCounter - deltaTimeStamp;

            if(this.ceilingCounter < 0){

                this.ceilingCounter = 0;
            }
        }

        let collisionsRegistry = [];

        if((this.pearType != 6 && this.pearType != 7) && this.ceilingCounter === 0){
        
            if(this.originY < floorY){

                if(this.speed < this.speedMax){
                    
                    this.speed = this.speed + this.acceleration;
                    
                    if(this.speed > this.speedMax){

                        this.speed = this.speedMax;
                    }
                }

                this.originY = this.originY + this.speed * deltaTimeStamp / 1000;

                for(let i = 0; i < avatarsArray.length; i++){

                    if(playersArray[i].isAlive && this.isLive && this.pearType != 8 && this.pearType != 6 && this.pearType != 7){

                        if(completeRectCollisionCheck([[this.originX,this.originY], [this.originX + this.width, this.originY], [this.originX + this.width, this.originY + this.height], [this.originX, this.originY + this.height]],
                            [[avatarsArray[i].originX, avatarsArray[i].originY], [avatarsArray[i].originX + avatarsArray[i].width, avatarsArray[i].originY], [avatarsArray[i].originX + avatarsArray[i].width, avatarsArray[i].originY + avatarsArray[i].height]
                        , [avatarsArray[i].originX, avatarsArray[i].originY + avatarsArray[i].height]])){

                            collisionsRegistry.push(i);
                        }
                    }
                }


                if(collisionsRegistry.length != 0){

                    let collisionTarget = collisionsRegistry[randomArrayPosition(collisionsRegistry)];

                    //play player bonus received
                    playOneHit(playerSoundsArray[collisionTarget][4], audioContext, playersSubmixArray[collisionTarget].bonusReceivedGain);

                    switch(this.pearType){

                        case 0:

                            if(playersArray[collisionTarget].health < playersArray[collisionTarget].maxHealth){
                                    
                                infoDisplaysArray[collisionTarget].injectInfo(`+${Math.floor(healthBonus)}`, this.pearColours[this.pearType]);
                            }

                            playersArray[collisionTarget].health = playersArray[collisionTarget].health + healthBonus;

                            if(playersArray[collisionTarget].health > playersArray[collisionTarget].maxHealth){

                                playersArray[collisionTarget].health = playersArray[collisionTarget].maxHealth;
                            }

                        break;

                        case 1:

                            playersArray[collisionTarget].health = playersArray[collisionTarget].maxHealth;

                            infoDisplaysArray[collisionTarget].injectInfo(`max`, this.pearColours[this.pearType]);

                        break;

                        case 2:

                            if(playersArray[collisionTarget].stamina < playersArray[collisionTarget].maxStamina){
                                        
                                infoDisplaysArray[collisionTarget].injectInfo(`+${Math.floor(staminaBonus)}`, this.pearColours[this.pearType]);

                                console.log(this.pearColours[this.pearType]);
                            }

                            playersArray[collisionTarget].stamina = playersArray[collisionTarget].stamina + staminaBonus;

                            if(playersArray[collisionTarget].stamina > playersArray[collisionTarget].maxStamina){

                                playersArray[collisionTarget].stamina = playersArray[collisionTarget].maxStamina;
                            }

                        break;

                        case 3:

                            playersArray[collisionTarget].stamina = playersArray[collisionTarget].maxStamina;

                            infoDisplaysArray[collisionTarget].injectInfo(`max`, this.pearColours[this.pearType]);

                        break;

                        case 4:

                            if(playersArray[collisionTarget].charges < playersArray[collisionTarget].maxChargesPerCapacitor * playersArray[collisionTarget].numberOfCapacitors){

                                infoDisplaysArray[collisionTarget].injectInfo(`+1`, this.pearColours[this.pearType]);

                                playersArray[collisionTarget].charges = playersArray[collisionTarget].charges + 1;
                            }

                        break;

                        case 5:

                        if(playersArray[collisionTarget].charges < playersArray[collisionTarget].maxChargesPerCapacitor * playersArray[collisionTarget].numberOfCapacitors){

                            infoDisplaysArray[collisionTarget].injectInfo(`+${playersArray[collisionTarget].maxChargesPerCapacitor}`, this.pearColours[this.pearType]);
                        }

                            playersArray[collisionTarget].charges = playersArray[collisionTarget].charges + playersArray[collisionTarget].maxChargesPerCapacitor;

                            if(playersArray[collisionTarget].charges > playersArray[collisionTarget].maxChargesPerCapacitor * playersArray[collisionTarget].numberOfCapacitors){

                                playersArray[collisionTarget].charges = playersArray[collisionTarget].maxChargesPerCapacitor * playersArray[collisionTarget].numberOfCapacitors;
                            }
                            
                        break;
                    }
                    
                    this.collisioned = true;//must be set to false when reset at the ceiling

                    this.isLive = false;
                }
               
            }
            else{

                this.originY = ceilingY;

                this.ceilingCounter = randomUnsignedIntIntervaled(this.ceilingCounterInterval[0], this.ceilingCounterInterval[1]);

                this.floorCounter = randomUnsignedIntIntervaled(this.floorCounterInterval[0], this.floorCounterInterval[1]);


                if(!this.collisioned){

                    if(!theGremlin.isLive && theGremlin.currentPears < theGremlin.unleashPears){

                        switch(this.pearType){

                            case 0:

                                theGremlin.currentPears = theGremlin.currentPears + 1;

                            break;

                            case 1:

                                theGremlin.currentPears = theGremlin.currentPears + this.gremlinSuperHealthPears;

                            break;

                            case 4:

                                theGremlin.currentPears = theGremlin.currentPears + 1;

                            break;

                            case 5:

                                theGremlin.currentPears = theGremlin.currentPears + this.gremlinSuperChargePears;

                            break;
                        }

                        if(theGremlin.currentPears > theGremlin.unleashPears){theGremlin.currentPears = theGremlin.unleashPears}

                        if(theGremlin.currentPears === theGremlin.unleashPears){

                            theGremlin.isLive = true;

                            theGremlin.currentPears = 0;

                            console.log(`The Gremlin is live! with speed pears in this amount: ${theGremlin.currentSpeedPears}`);
                        }
                    }

                    if(theGremlin.currentSpeedPears < theGremlin.maxSpeedPears){

                        switch(this.pearType){

                            case 2:

                                theGremlin.currentSpeedPears = theGremlin.currentSpeedPears + 1;

                            break;

                            case 3:

                                theGremlin.currentSpeedPears = theGremlin.currentSpeedPears + this.gremlinSuperStaminaPears;

                            break;
                        }

                        if(theGremlin.currentSpeedPears > theGremlin.maxSpeedPears){theGremlin.currentSpeedPears = theGremlin.maxSpeedPears}
                    }
                    
                }

                this.pearType = randomWeightedInt(this.pearTypesAndWeights);

                if(this.collisioned){ this.collisioned = false}

                if(!this.isLive && this.type != 8){

                    this.isLive = true;
                }
                else if(this.type === 8){

                    this.isLive = false;
                }
            }

        }

        if(this.pearType === 6 || this.pearType === 7){
        
            if(this.ceilingCounter === 0 && this.originY < floorY - this.height){

                if(this.speed < this.speedMax){
                    
                    this.speed = this.speed + this.acceleration;
                    
                    if(this.speed > this.speedMax){

                        this.speed = this.speedMax;
                    }
                }
                
                this.originY = this.originY + this.speed * deltaTimeStamp / 1000;
            }

            if(this.originY > floorY - this.height){

                this.originY = floorY - this.height;
            }

            if(this.originY === floorY - this.height){

                this.speed = 0;
                
                this.floorCounter = this.floorCounter - deltaTimeStamp;

                if(this.floorCounter < 0){
                
                this.floorCounter = 0;
                }
            }

            collisionsRegistry = [];

            for(let i = 0; i < playersArray.length; i++){

                if(playersArray[i].isAlive && this.isLive){

                    if(completeRectCollisionCheck([[this.originX,this.originY], [this.originX + this.width, this.originY], [this.originX + this.width, this.originY + this.height], [this.originX, this.originY + this.height]],
                        [[avatarsArray[i].originX, avatarsArray[i].originY], [avatarsArray[i].originX + avatarsArray[i].width, avatarsArray[i].originY], [avatarsArray[i].originX + avatarsArray[i].width, avatarsArray[i].originY + avatarsArray[i].height]
                    , [avatarsArray[i].originX, avatarsArray[i].originY + avatarsArray[i].height]])){

                        collisionsRegistry.push(i);
                    }
                }
            }
            
            if(collisionsRegistry.length != 0){

                let collisionTarget = collisionsRegistry[randomArrayPosition(collisionsRegistry)];

                //playsoundhit here
                playOneHit(playerSoundsArray[collisionTarget][3], audioContext, playersSubmixArray[collisionTarget].hitGain);

                switch(this.pearType){
                    
                    case 6:
                        
                        if(this.originY < floorY - this.height){

                            infoDisplaysArray[collisionTarget].injectInfo(`-${Math.floor(boulderMalus)}`, this.pearColours[0]);

                            //collision with falling boulder inflicts full boulderMalus
                            playersArray[collisionTarget].health = playersArray[collisionTarget].health - boulderMalus;

                            if(playersArray[collisionTarget].health < 0){

                                playersArray[collisionTarget].health = 0;
                            }

                            playersArray[collisionTarget].counterStaggering = Math.max(staggeringMaxTime * 1000, playersArray[collisionTarget].counterStaggering);


                        }
                        else if(this.originY === floorY - this.height){
                            //a boulder standing on the floor behaves like a lateral wall with regards to the damage and staggering time inflicted to a player in case of a collision
                            playersArray[collisionTarget].counterStaggering = Math.max(Math.abs(playersArray[collisionTarget].speed) * staggeringMaxTime * 1000 / playersArray[collisionTarget].speedMax, playersArray[collisionTarget].counterStaggering);

                            playersArray[collisionTarget].health = playersArray[collisionTarget].health - Math.abs(playersArray[collisionTarget].speed) * damageReference / playersArray[collisionTarget].speedMax;

                            infoDisplaysArray[collisionTarget].injectInfo(`-${Math.floor(Math.abs(playersArray[collisionTarget].speed) * damageReference / playersArray[collisionTarget].speedMax)}`, this.pearColours[0]);

                            if(playersArray[collisionTarget].health < 0){

                                playersArray[collisionTarget].health = 0;
                            }
                        }
                        
                    break;

                    case 7:

                        playersArray[collisionTarget].health = 0;

                    break;
                }

                if(playersArray[collisionTarget].health === 0){

                    playersArray[collisionTarget].isAlive = false;

                    console.log("player loops array [collisionTarget].length:");
                    console.log(playerLoopsArray[collisionTarget].length);

                    //stop killed player curently looping sounds
                    for(let i = 0; i < playerLoopsArray[collisionTarget].length; i++){

                        if(playerLoopsArray[collisionTarget][i] != null){
                            
                            playerLoopsArray[collisionTarget][i].stop();
                        }
                    }
                }

                this.isLive = false;
            }

            if(this.floorCounter === 0){

                this.originY = ceilingY;

                this.ceilingCounter = randomUnsignedIntIntervaled(this.ceilingCounterInterval[0], this.ceilingCounterInterval[1]);

                this.floorCounter = randomUnsignedIntIntervaled(this.floorCounterInterval[0], this.floorCounterInterval[1]);

                this.pearType = randomWeightedInt(this.pearTypesAndWeights);

                if(!this.isLive && this.type != 8){

                    this.isLive = true;
                }
                else if(this.type === 8){

                    this.isLive = false;
                }
            }
        }
    }

    draw(){

        if(this.isLive === true){

            switch(this.pearType){

                case 0:

                    this.ctx.fillStyle = `rgb(${this.pearColours[0]})`;

                    this.ctx.beginPath();
                    this.ctx.arc(this.originX + this.width / 2, this.originY + this.height / 2, this.width / 2, 0, 2 * Math.PI);
                    this.ctx.fill();

                break;

                case 1:

                    this.ctx.fillStyle = `rgb(${this.pearColours[1]})`;

                    this.ctx.beginPath();
                    this.ctx.arc(this.originX + this.width / 2, this.originY + this.height / 2, this.width / 2, 0, 2 * Math.PI);
                    this.ctx.fill();
                    
                    this.ctx.fillStyle = this.superPearColour;

                    this.ctx.beginPath();
                    this.ctx.arc(this.originX + this.width / 2, this.originY + this.height / 2, this.width / this.superPearIndicatorRadiusMultiplier, 0, 2 * Math.PI);
                    this.ctx.fill();

                break;

                case 2:

                    this.ctx.fillStyle = `rgb(${this.pearColours[2]})`;

                    this.ctx.beginPath();
                    this.ctx.arc(this.originX + this.width / 2, this.originY + this.height / 2, this.width / 2, 0, 2 * Math.PI);
                    this.ctx.fill();
                    
                break;

                case 3:

                    this.ctx.fillStyle = `rgb(${this.pearColours[3]})`;

                    this.ctx.beginPath();
                    this.ctx.arc(this.originX + this.width / 2, this.originY + this.height / 2, this.width / 2, 0, 2 * Math.PI);
                    this.ctx.fill();
                    
                    this.ctx.fillStyle = this.superPearColour;

                    this.ctx.beginPath();
                    this.ctx.arc(this.originX + this.width / 2, this.originY + this.height / 2, this.width / this.superPearIndicatorRadiusMultiplier, 0, 2 * Math.PI);
                    this.ctx.fill();
                    
                break;

                case 4:

                    this.ctx.fillStyle = `rgb(${this.pearColours[4]})`;

                    this.ctx.beginPath();
                    this.ctx.arc(this.originX + this.width / 2, this.originY + this.height / 2, this.width / 2, 0, 2 * Math.PI);
                    this.ctx.fill();

                break;

                case 5:

                    this.ctx.fillStyle = `rgb(${this.pearColours[5]})`;

                    this.ctx.beginPath();
                    this.ctx.arc(this.originX + this.width / 2, this.originY + this.height / 2, this.width / 2, 0, 2 * Math.PI);
                    this.ctx.fill();
                    
                    this.ctx.fillStyle = this.superPearColour;

                    this.ctx.beginPath();
                    this.ctx.arc(this.originX + this.width / 2, this.originY + this.height / 2, this.width / this.superPearIndicatorRadiusMultiplier, 0, 2 * Math.PI);
                    this.ctx.fill();

                break;

                case 6:

                    this.ctx.fillStyle = `rgb(${this.pearColours[6]})`;

                    this.ctx.fillRect(this.originX, this.originY, this.width, this.height);

                break;

                case 7:

                    this.ctx.fillStyle = `rgb(${this.pearColours[6]})`;

                    this.ctx.fillRect(this.originX, this.originY, this.width, this.height);

                    this.ctx.fillStyle = this.superPearColour;

                    this.ctx.beginPath();
                    this.ctx.arc(this.originX + this.width / 2, this.originY + this.height / 2, this.width / this.superPearIndicatorRadiusMultiplier, 0, 2 * Math.PI);
                    this.ctx.fill();
                    
                break;
            }
        }
    }
}

export {Pear};