import {playOneHit, playPlayerLoop} from "../logic.js";

class Explosion{

    constructor(maxRadius, originX, originY, damage, speed, isLive, currentRadius, lineWidthMultiplier){

        this.maxRadius = maxRadius;
        this.originX = originX;
        this.originY = originY;
        this.damage = damage;
        this.speed = speed;
        this.isLive = isLive;
        this.currentRadius = currentRadius;
        this.lineWidthMultiplier = lineWidthMultiplier;
    }
    
    update(deltaTimeStamp, avatarsArray, playersArray, minesArray, explosionsArray, floorY, infoDisplaysArray, pearColours, playerSoundsArray, playersSubmixArray, audioContext, playerLoopsArray, soundExplosion, explosionsChannelsArray){

        if(this.isLive){

            this.currentRadius = this.currentRadius + this.speed * deltaTimeStamp/1000;

            //console.log(`current radius: ${this.currentRadius}`);
            if(this.currentRadius >= this.maxRadius){

                this.isLive = false;
                this.currentRadius = 1;
            }

            for(let i = 0; i < avatarsArray.length; i++){

                if(playersArray[i].isAlive){

                    if(Math.abs(this.originX - (avatarsArray[i].originX + avatarsArray[i].width / 2)) < this.currentRadius 
                        && Math.abs(this.originX - (avatarsArray[i].originX + avatarsArray[i].width / 2)) >= this.currentRadius - this.speed * deltaTimeStamp/1000){

                        let x = this.currentRadius / this.maxRadius * 100;

                        if(Math.random() * 100 <= 100 - x){

                            //playsoundhit here
                            playOneHit(playerSoundsArray[i][3], audioContext, playersSubmixArray[i].hitGain);

                            playersArray[i].health = playersArray[i].health - this.damage;

                            infoDisplaysArray[i].injectInfo(`-${this.damage}`, pearColours[0]);

                            if(playersArray[i].health <= 0){

                                playersArray[i].isAlive = false;
                                //stop killed player current loop sounds
                                for(let j = 0; j < playerLoopsArray[i].length; j++){

                                    if(playerLoopsArray[i][j] != null){
                                        
                                        playerLoopsArray[i][j].stop();
                                    }
                                }
                            }
                        }
                    }
                }
            }

            for(let i = 0; i < minesArray.length; i++){

                if(minesArray[i].primed){

                    if(Math.abs(this.originX - (minesArray[i].originX + minesArray[i].width / 2)) < this.currentRadius
                        && Math.abs(this.originX - (minesArray[i].originX + minesArray[i].width / 2)) >= this.currentRadius - this.speed * deltaTimeStamp/1000){

                        let x = this.currentRadius / this.maxRadius * 100;

                        if(Math.random() * 100 <= 100 - x){

                            playOneHit(soundExplosion, audioContext, explosionsChannelsArray[i].explosionPanner);

                            minesArray[i].primed = false;

                            explosionsArray[i].isLive = true;

                            explosionsArray[i].originX = minesArray[i].originX + minesArray[i].width/2;

                            explosionsArray[i].originY = floorY;
                        }
                    }                    
                }
            }
        }
    }

    draw(playerColour, ctx, deltaTimeStamp){


        if(this.isLive){

            ctx.strokeStyle = `rgb(${playerColour})`;

            ctx.lineWidth = this.speed * deltaTimeStamp/1000 * this.lineWidthMultiplier;

            ctx.beginPath();
            ctx.arc(this.originX, this.originY, this.currentRadius - this.speed * deltaTimeStamp/1000/2 , 0, 2 * Math.PI );
            ctx.stroke();
        }
    }
}



class GremlinDischarge{

    constructor(maxRadius, originX, originY, gremlinDamageInterval, speed, isLive, currentRadius, lineWidthMultiplier, hitProbability){

        this.maxRadius = maxRadius;
        this.originX = originX;
        this.originY = originY;
        this.damageInterval = gremlinDamageInterval;
        this.speed = speed;
        this.isLive = isLive;
        this.currentRadius = currentRadius;
        this.lineWidthMultiplier = lineWidthMultiplier;
        this.hitProbability = hitProbability;
    }
    
    update(deltaTimeStamp, avatarsArray, playersArray, minesArray, explosionsArray, floorY, infoDisplaysArray, pearColours, playerSoundsArray, playersSubmixArray, audioContext, playerLoopsArray, soundExplosion, explosionsChannelsArray){

        if(this.isLive){

            this.currentRadius = this.currentRadius + this.speed * deltaTimeStamp/1000;

            //console.log(`current radius: ${this.currentRadius}`);
            if(this.currentRadius >= this.maxRadius){

                this.isLive = false;
                this.currentRadius = 1;
            }

            for(let i = 0; i < avatarsArray.length; i++){

                if(playersArray[i].isAlive){

                    if(Math.abs(this.originX - (avatarsArray[i].originX + avatarsArray[i].width / 2)) < this.currentRadius 
                        && Math.abs(this.originX - (avatarsArray[i].originX + avatarsArray[i].width / 2)) >= this.currentRadius - this.speed * deltaTimeStamp/1000){


                        let currentDamage = Math.floor(this.damageInterval[0] + this.currentRadius * (this.damageInterval[1] - this.damageInterval[0]) / (this.maxRadius));

                        if(Math.random() * 100 <= this.hitProbability){

                            //playsoundhit here
                            playOneHit(playerSoundsArray[i][3], audioContext, playersSubmixArray[i].hitGain);

                            playersArray[i].health = playersArray[i].health - currentDamage;

                            infoDisplaysArray[i].injectInfo(`-${currentDamage}`, pearColours[0]);

                            if(playersArray[i].health <= 0){

                                playersArray[i].isAlive = false;

                                //stop killed player current loop sounds
                                for(let j = 0; j < playerLoopsArray[i].length; j++){

                                    if(playerLoopsArray[i][j] != null){
                                        
                                        playerLoopsArray[i][j].stop();
                                    }
                                }
                            }
                        }
                    }
                }
            }

            for(let i = 0; i < minesArray.length; i++){

                if(minesArray[i].primed){

                    if(Math.abs(this.originX - (minesArray[i].originX + minesArray[i].width / 2)) < this.currentRadius
                        && Math.abs(this.originX - (minesArray[i].originX + minesArray[i].width / 2)) >= this.currentRadius - this.speed * deltaTimeStamp/1000){

                        if(Math.random() * 100 <= this.hitProbability){

                            playOneHit(soundExplosion, audioContext, explosionsChannelsArray[i].explosionPanner);

                            minesArray[i].primed = false;

                            explosionsArray[i].isLive = true;

                            explosionsArray[i].originX = minesArray[i].originX + minesArray[i].width/2;

                            explosionsArray[i].originY = floorY;
                        }
                    }                    
                }
            }
        }
    }

    draw(gremlinDischargeColour, ctx, deltaTimeStamp){


        if(this.isLive){

            ctx.strokeStyle = `rgb(${gremlinDischargeColour})`;

            ctx.lineWidth = this.speed * deltaTimeStamp/1000 * this.lineWidthMultiplier;

            ctx.beginPath();
            ctx.arc(this.originX, this.originY, this.currentRadius - this.speed * deltaTimeStamp/1000/2 , 0, 2 * Math.PI );
            ctx.stroke();
        }
    }
}


export{Explosion, GremlinDischarge};