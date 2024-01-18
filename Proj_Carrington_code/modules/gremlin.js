import {randomSignedIntIntervaled, randomWeightedInt, completeRectCollisionCheck, randomUnsignedIntIntervaled,rectangleCollisionCheck} from "./calc.js";
import {playOneHit, playPlayerLoop} from "../logic.js";

class Gremlin{

    constructor(originX, originY, width, height, slumberColour, liveColour, unleashPears, currentPears, currentSpeedPears,
        speedMax, currentSpeed, maxDischarges, currentDischarges, dischargeDamage, dischargeRange, currentDischargeRadius, timeBetweenDischarges, gremlinPrimeDischargeTime, isLive, lifeCounter, lifeCounterMax,
        gremlinMaxSpeedPears){

        this.originX = originX;
        this.originY = originY;
        this.width = width;
        this.height = height;
        this.slumberColour = slumberColour;
        this.liveColour = liveColour;
        this.unleashPears = unleashPears;
        this.currentPears = currentPears;
        this.currentSpeedPears = currentSpeedPears;
        this.speedMax = speedMax;
        this.currentSpeed = currentSpeed;
        this.maxDischarges = maxDischarges;
        this.currentDischarges = currentDischarges;
        this.dischargeDamage = dischargeDamage;
        this.dischargeRange = dischargeRange;
        this.currentDischargeRadius = currentDischargeRadius;
        this.timeBetweenDischarges = timeBetweenDischarges;
        this.gremlinPrimeDischargeTime = gremlinPrimeDischargeTime * 1000;
        this.isLive = isLive;
        this.lifeCounter = lifeCounter * 1000;
        this.lifeCounterMax = lifeCounterMax * 1000;
        this.maxSpeedPears = gremlinMaxSpeedPears;


    }

    objectiveX = null;

    previousModulo = 0;

    update(deltaTimeStamp, gremlinDischarge, floorY, soundExplosion, audioContext, explosionsChannelsArray){

        if(this.isLive){

            if(this.currentSpeed === 0){

                this.objectiveX = randomUnsignedIntIntervaled(0 + this.width / 2, window.innerWidth - this.width / 2);

                this.currentSpeed = (this.speedMax * deltaTimeStamp / 1000)* this.currentSpeedPears / this.maxSpeedPears;
            }

            //console.log(`modulo: ${this.lifeCounter % (this.lifeCounterMax / this.maxDischarges)}`);

            if(!(this.lifeCounter % (this.lifeCounterMax / this.maxDischarges) > this.lifeCounterMax / this.maxDischarges - this.gremlinPrimeDischargeTime)){

                if(this.objectiveX < this.originX){

                    this.originX = this.originX - this.currentSpeed;
    
                    if(this.objectiveX > this.originX){
    
                        this.originX = this.objectiveX;
                    }
                }
                if(this.objectiveX > this.originX){
    
                    this.originX = this.originX + this.currentSpeed;
    
                    if(this.objectiveX < this.originX){
    
                        this.originX = this.objectiveX;
                    }                
                }

                if(this.originX === this.objectiveX){

                    this.objectiveX = randomUnsignedIntIntervaled(0 + this.width / 2, window.innerWidth - this.width / 2);
                }
            }

            if(this.previousModulo > this.lifeCounter % (this.lifeCounterMax / this.maxDischarges)){

                //console.log("BLOOOOPE!!!");

                gremlinDischarge.isLive = true;

                gremlinDischarge.originX = this.originX + this.width / 2;

                gremlinDischarge.originY = floorY;

                playOneHit(soundExplosion, audioContext, explosionsChannelsArray[4].explosionPanner);

                //console.log(gremlinDischarge);
            }

            if(this.lifeCounter > this.lifeCounterMax){

                //console.log(`life counter: ${this.lifeCounter}`);

                //console.log(`deltaTimeStamp: ${deltaTimeStamp}`);

                this.currentSpeedPears = 0;

                this.isLive = false;

                this.originX = (window.innerWidth - this.width) / 2;

                this.lifeCounter = 0;

                this.currentSpeed = 0;
            }

            this.previousModulo = this.lifeCounter % (this.lifeCounterMax / this.maxDischarges);

            this.lifeCounter = this.lifeCounter + deltaTimeStamp;

            this.currentSpeed = (this.speedMax * deltaTimeStamp / 1000)* this.currentSpeedPears / this.maxSpeedPears;
 
        }
    }

    draw(ctx){

        ctx.strokeStyle = "black";

        ctx.lineWidth = this.height;

        ctx.beginPath();

        ctx.moveTo(0, this.originY + this.height / 2);

        ctx.lineTo(window.innerWidth, this.originY + this.height / 2);

        ctx.stroke();

        if(!this.isLive){

            ctx.fillStyle = `${this.slumberColour}`;

            ctx.strokeStyle = "green";

            ctx.beginPath();

            ctx.moveTo(this.originX, this.originY + this.height / 2);

            ctx.lineTo(this.originX - ((this.unleashPears - this.currentPears) * (window.innerWidth - this.width)/2) / this.unleashPears, this.originY + this.height / 2);

            ctx.moveTo(this.originX + this.width, this.originY + this.height / 2);

            ctx.lineTo(this.originX + this.width + ((this.unleashPears - this.currentPears) * (window.innerWidth - this.width)/2) / this.unleashPears, this.originY + this.height / 2);

            ctx.stroke();
        }
        else{

            ctx.fillStyle = `${this.liveColour}`;
        }

        ctx.fillRect(this.originX, this.originY, this.width, this.height);

        //console.log(`accumulated pears: ${this.currentPears}`);
    }
}

export{Gremlin};