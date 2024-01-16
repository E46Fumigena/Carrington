import {randomSignedIntIntervaled, randomWeightedInt} from "./calc.js";

class Player{

    constructor(maxHealth, maxStamina, maxChargesPerCapacitor, numberOfCapacitors, health, stamina, charges, isAlive, gamepadIndex, playerColour, speedMax, speed, acceleration, deceleration, counterStaggering, lanceLeftCounter, lanceRightCounter, totalDischargingCapsLeft, totalDischargingCapsRight){

        this.gamepadIndex = gamepadIndex;
        this.playerColour = playerColour;
        this.maxHealth = maxHealth;
        this.maxStamina = maxStamina;
        this.maxChargesPerCapacitor = maxChargesPerCapacitor;
        this.numberOfCapacitors = numberOfCapacitors;
        this.speedMax = speedMax;
        this.acceleration = acceleration;
        this.deceleration = deceleration;
        this.isAlive = isAlive;
        
        this.health = health;
        this.stamina = stamina;
        this.charges = charges;
        this.speed = speed;

        this.counterStaggering = counterStaggering;
        this.lanceLeftCounter = lanceLeftCounter;
        this.lanceRightCounter = lanceRightCounter;
        this.totalDischargingCapsLeft = totalDischargingCapsLeft;
        this.totalDischargingCapsRight = totalDischargingCapsRight;

    }

    indexTargetsLeft(currentPlayerIndex, avatarsArray, playersArray, lanceLength, avatarWidth){

        let targetsIndexArray = [];

        for(let i = 0; i < avatarsArray.length; i++){

            if(playersArray[i].isAlive && i != currentPlayerIndex){

                if(avatarsArray[i].originX > avatarsArray[currentPlayerIndex].originX - lanceLength - avatarWidth && avatarsArray[i].originX < avatarsArray[currentPlayerIndex].originX - avatarWidth){

                    if(targetsIndexArray.length === 0){

                        targetsIndexArray.push(i);
                    }
                    else{

                        if(avatarsArray[i].originX > avatarsArray[targetsIndexArray[targetsIndexArray.length -1]].originX){

                            targetsIndexArray = [];

                            targetsIndexArray.push(i);
                        }
                        else if(avatarsArray[i].originX === avatarsArray[targetsIndexArray[targetsIndexArray.length -1]].originX){

                            targetsIndexArray.push(i);
                        }
                    }
                }
            }
        }

        return(targetsIndexArray);
    }

    indexTargetsRight(currentPlayerIndex, avatarsArray, playersArray, lanceLength, avatarWidth){

        let targetsIndexArray = [];

        for(let i = 0; i < avatarsArray.length; i++){

            if(playersArray[i].isAlive && i != currentPlayerIndex){

                if(avatarsArray[i].originX < avatarsArray[currentPlayerIndex].originX + lanceLength + avatarWidth && avatarsArray[i].originX > avatarsArray[currentPlayerIndex].originX + avatarWidth){

                    if(targetsIndexArray.length === 0){

                        targetsIndexArray.push(i);
                    }
                    else{

                        if(avatarsArray[i].originX < avatarsArray[targetsIndexArray[targetsIndexArray.length -1]].originX){

                            targetsIndexArray = [];

                            targetsIndexArray.push(i);
                        }
                        else if(avatarsArray[i].originX === avatarsArray[targetsIndexArray[targetsIndexArray.length -1]].originX){

                            targetsIndexArray.push(i);
                        }
                    }
                }
            }
        }

        return(targetsIndexArray);
    }    
}


class Meter{

    constructor(originY, mainHeight, playerIdBandHeightMultiplier, playerIdBandWidthMultiplier, itemMarginMultiplier,capacitorSeparatorMultiplier, ctx, playerIndex, playerColour, alphaChannel, numberOfCapacitors, maxHealth, maxStamina, maxChargesPerCapacitor){

        this.originY = originY;
        this.mainHeight = mainHeight;
        this.playerIdBandHeightMultiplier = playerIdBandHeightMultiplier;
        this.itemMarginMultiplier = itemMarginMultiplier;
        this.capacitorSeparatorMultiplier = capacitorSeparatorMultiplier;
        this.playerIdBandWidthMultiplier = playerIdBandWidthMultiplier;
        this.ctx = ctx;
        this.playerIndex = playerIndex;
        this.playerColour = `rgba(${playerColour},${alphaChannel}`;

        this.numberOfCapacitors = numberOfCapacitors;
        this.maxChargesPerCapacitor = maxChargesPerCapacitor;
        this.maxHealth = maxHealth;
        this.maxStamina = maxStamina;
    }

    draw(originX, mainWidth, health, stamina, charges){

        let playerIdBandHeight = this.mainHeight / this.playerIdBandHeightMultiplier;
        let itemMargin = window.innerWidth / this.itemMarginMultiplier;
        let healthStaminaMeterWidth = mainWidth / 3 - 2 * itemMargin;
        let healthStaminaMeterHeight = this.mainHeight - 2 * itemMargin - playerIdBandHeight;
        let capacitorSeparator = window.innerWidth / this.capacitorSeparatorMultiplier;
        let capacitorWidth = (healthStaminaMeterWidth - (this.numberOfCapacitors - 1) * capacitorSeparator) / this.numberOfCapacitors;
        

        //draw player colour ID band:
        this.ctx.strokeStyle = this.playerColour;
        this.ctx.lineWidth = playerIdBandHeight;

        this.ctx.beginPath();
        this.ctx.moveTo(originX, this.originY + this.mainHeight - playerIdBandHeight / 2);
        this.ctx.lineTo(originX + mainWidth, this.originY + this.mainHeight - playerIdBandHeight / 2);
        this.ctx.stroke();

        
        this.ctx.lineWidth = healthStaminaMeterHeight;

        //draw health meter background
        this.ctx.strokeStyle = "palegreen";
        this.ctx.beginPath();
        this.ctx.moveTo(originX + itemMargin, this.originY + itemMargin + healthStaminaMeterHeight / 2);
        this.ctx.lineTo(originX + itemMargin + healthStaminaMeterWidth, this.originY + itemMargin + healthStaminaMeterHeight / 2);
        this.ctx.stroke();


        //draw stamina meter background
        this.ctx.strokeStyle = "paleturquoise";
        this.ctx.beginPath();
        this.ctx.moveTo(originX + mainWidth / 3 + itemMargin, this.originY + itemMargin + healthStaminaMeterHeight / 2);
        this.ctx.lineTo(originX + 2 * mainWidth / 3 - itemMargin, this.originY + itemMargin + healthStaminaMeterHeight / 2);
        this.ctx.stroke();

        //draw capacitors background
        this.ctx.strokeStyle = "mistyrose";
        this.ctx.beginPath();
        for(let i = 0; i < this.numberOfCapacitors; i++){

            this.ctx.moveTo(originX + 2 * mainWidth / 3 + itemMargin + i * (capacitorWidth + capacitorSeparator), this.originY + itemMargin + healthStaminaMeterHeight / 2);
            this.ctx.lineTo(originX + 2 * mainWidth / 3 + itemMargin + i * (capacitorWidth + capacitorSeparator) + capacitorWidth, this.originY + itemMargin + healthStaminaMeterHeight / 2);
        }
        this.ctx.stroke();

        //draw health
        let healthWidth = health * healthStaminaMeterWidth / this.maxHealth;
        
        this.ctx.strokeStyle = "forestgreen";
        this.ctx.beginPath();
        this.ctx.moveTo(originX + itemMargin, this.originY + itemMargin + healthStaminaMeterHeight / 2);
        this.ctx.lineTo(originX + itemMargin + healthWidth, this.originY + itemMargin + healthStaminaMeterHeight / 2);
        this.ctx.stroke();

        //draw stamina
        let staminaWidth = stamina * healthStaminaMeterWidth / this.maxStamina;

        this.ctx.strokeStyle = "dodgerblue";
        this.ctx.beginPath();
        this.ctx.moveTo(originX + mainWidth / 3 + itemMargin, this.originY + itemMargin + healthStaminaMeterHeight / 2);
        this.ctx.lineTo(originX + mainWidth / 3 + itemMargin + staminaWidth, this.originY + itemMargin + healthStaminaMeterHeight / 2);
        this.ctx.stroke();

        //draw charges        
        let chargeWidth = capacitorWidth / this.maxChargesPerCapacitor;
        let k = 0;
        let n = 0;

        this.ctx.strokeStyle = "crimson";
        this.ctx.beginPath();
        for(let i = 0; i < charges; i++){

            if(k != this.maxChargesPerCapacitor){
                
                k++;
            }
            else{

                k = 1;
                n++;
            }
            this.ctx.moveTo(originX + 2 * mainWidth / 3 + itemMargin + i * chargeWidth + n * capacitorSeparator, this.originY + itemMargin + healthStaminaMeterHeight / 2);
        
            this.ctx.lineTo(originX + 2 * mainWidth / 3 + itemMargin + i * chargeWidth + n * capacitorSeparator + chargeWidth, this.originY + itemMargin + healthStaminaMeterHeight / 2);
        }
        this.ctx.stroke();
    }
}


class Avatar{
    
    constructor(originX, originY, width, height, crestsNumber, crestOffsetMultiplier, crestHeightMultiplier, stripesNumber, playerIndex, avatarZ, playerColour, alphaChannel, ctx, lanceLength, lanceOverlapLength, avatarRndYInterval){
 
    this.originX = originX;
    this.originY = originY;
    this.width = width;
    this.height = height;
    this.crestsNumber = crestsNumber;
    this.crestOffsetMultiplier = crestOffsetMultiplier;
    this.crestHeightMultiplier = crestHeightMultiplier;
    this.stripesNumber = stripesNumber;
    this.playerIndex = playerIndex;
    this.avatarZ = avatarZ;
    this.playerColour = playerColour;
    this.alphaChannel = alphaChannel;
    this.ctx = ctx;
    this.lanceLength = lanceLength;
    this.lanceOverlapLength = lanceOverlapLength;
    this.avatarRndYInterval = avatarRndYInterval;
    }

    drawIdentifier() {

        this.ctx.fillStyle = `rgba(${this.playerColour},${this.alphaChannel})`;

        this.ctx.beginPath();
        this.ctx.arc(this.originX + this.width / 2, this.originY - this.width / 2 - this.height / 10, this.width / 2, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    draw(playersArray) {

        const crestIntervals = 2 * this.crestsNumber - 1;
        const crestWidth = this.width / crestIntervals;
        const crestOffset = crestWidth / this.crestOffsetMultiplier;
        const crestHeight = this.height / this.crestHeightMultiplier;
        const stripeHeight = (this.height - (2 * crestHeight)) / (this.stripesNumber * 4);

        let movingOriginY = randomSignedIntIntervaled(this.avatarRndYInterval) + this.originY;

        let currentOriginY = this.originY;

        if(playersArray[this.playerIndex].speed != 0){

            currentOriginY = movingOriginY;
        }

        const topCrestOriginY = currentOriginY;
        const bottomCrestOriginY = currentOriginY + this.height - crestHeight;

        let topLineOriginX = 0;

        this.ctx.strokeStyle = `rgba(${this.playerColour},${this.alphaChannel}`;

        this.ctx.lineWidth = crestWidth;
        //this.ctx.strokeStyle(`rgb(${this.playerColour[0]}, ${this.playerColour[1]}, ${this.playerColour[2]})`);

        for(let i = 0; i < crestIntervals; i++){

            topLineOriginX = this.originX + i * crestWidth + this.ctx.lineWidth / 2;

            if(i === 0 || i === crestIntervals - 1){

                this.ctx.beginPath();
                this.ctx.moveTo(topLineOriginX, topCrestOriginY);
                this.ctx.lineTo(topLineOriginX, topCrestOriginY + crestHeight);
                this.ctx.moveTo(topLineOriginX, bottomCrestOriginY);
                this.ctx.lineTo(topLineOriginX, currentOriginY + this.height);
                this.ctx.stroke();
            }
            else{

                if(i%2 === 0){

                    topLineOriginX = topLineOriginX - this.playerIndex * (crestWidth / this.crestOffsetMultiplier);

                    this.ctx.beginPath();
                    this.ctx.moveTo(topLineOriginX, topCrestOriginY);
                    this.ctx.lineTo(topLineOriginX, topCrestOriginY + crestHeight);
                    this.ctx.moveTo(topLineOriginX, bottomCrestOriginY);
                    this.ctx.lineTo(topLineOriginX, currentOriginY + this.height);
                    this.ctx.stroke();2 * this.crestsNumber - 1
                }
            }
        }

        this.ctx.lineWidth = stripeHeight;

        let topStripeOriginY = currentOriginY + crestHeight + stripeHeight / 2;

        let stripeOriginY = 0;

        

        for(let i = 0; i < this.stripesNumber; i++){

            stripeOriginY = topStripeOriginY + this.playerIndex * stripeHeight + i * stripeHeight * 4;

            this.ctx.beginPath();
            this.ctx.moveTo(this.originX, stripeOriginY);
            this.ctx.lineTo(this.originX + this.width, stripeOriginY);
            this.ctx.stroke();
        }

    }

    drawLance(playersArray, avatarsArray, targetsArrayLeft, targetsArrayRight, lanceXOffsetRange, lanceXOffsetRangeTargeted, lanceYOffsetRange, lanceYOffsetRangeTargeted, lanceHeightMultiplier){

        let crestHeight = this.height / this.crestHeightMultiplier;

        let stripeHeight = (this.height - (2 * crestHeight)) / (this.stripesNumber * 4);

        this.ctx.strokeStyle = `rgba(${this.playerColour},${this.alphaChannel}`;

        let topStripeOriginY = this.originY + crestHeight + stripeHeight / 2;

        let stripeOriginY = 0;

        let xOffset = randomSignedIntIntervaled(lanceXOffsetRange);

        let yOffset = randomSignedIntIntervaled(lanceYOffsetRange);

        let xOffsetTargeted = randomSignedIntIntervaled(lanceXOffsetRangeTargeted);

        let yOffsetTargeted = randomSignedIntIntervaled(lanceYOffsetRangeTargeted);


        //calc current LEFT lance/s length
        if(playersArray[this.playerIndex].lanceLeftCounter > 0){

            let currentLanceLength = 0;

            if(targetsArrayLeft.length > 0){

                currentLanceLength = this.originX - (avatarsArray[targetsArrayLeft[0]].originX + this.width) + this.lanceOverlapLength;
            }
            else{

                currentLanceLength = this.lanceLength;
            }
        
            //draw LEFT lance/s
            for(let i = 0; i < playersArray[this.playerIndex].totalDischargingCapsLeft; i++){

                if(targetsArrayLeft.length > 0){

                    stripeOriginY = topStripeOriginY + this.playerIndex * stripeHeight + i * stripeHeight * 4 + yOffsetTargeted;
                    
                    this.ctx.lineWidth = stripeHeight;
                    this.ctx.strokeStyle = `rgba(${this.playerColour},${this.alphaChannel}`;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.originX + xOffsetTargeted, stripeOriginY);
                    this.ctx.lineTo(this.originX - currentLanceLength + xOffsetTargeted, stripeOriginY);
                    this.ctx.stroke();

                    this.ctx.lineWidth = stripeHeight * lanceHeightMultiplier;
                    this.ctx.strokeStyle = "white";

                    this.ctx.beginPath();
                    this.ctx.moveTo(this.originX + xOffsetTargeted, stripeOriginY - randomSignedIntIntervaled(stripeHeight / 2));
                    this.ctx.lineTo(this.originX - currentLanceLength + xOffsetTargeted, stripeOriginY + randomSignedIntIntervaled(stripeHeight / 2));
                    this.ctx.stroke();
                }
                else{

                    stripeOriginY = topStripeOriginY + this.playerIndex * stripeHeight + i * stripeHeight * 4 + yOffset;
                    
                    this.ctx.lineWidth = stripeHeight;
                    this.ctx.strokeStyle = `rgba(${this.playerColour},${this.alphaChannel}`;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.originX + xOffset, stripeOriginY);
                    this.ctx.lineTo(this.originX - currentLanceLength + xOffset, stripeOriginY);
                    this.ctx.stroke();
                }
            }
        }
        //calc current RIGHT lance/s length
        if(playersArray[this.playerIndex].lanceRightCounter > 0){

            let currentLanceLength = 0;

            if(targetsArrayRight.length > 0){

                currentLanceLength = avatarsArray[targetsArrayRight[0]].originX - this.width - this.originX + this.lanceOverlapLength;
            }
            else{

                currentLanceLength = this.lanceLength;
            }
        
            //draw RIGHT lance/s
            for(let i = 0; i < playersArray[this.playerIndex].totalDischargingCapsRight; i++){

                if(targetsArrayRight.length > 0){

                    stripeOriginY = topStripeOriginY + this.playerIndex * stripeHeight + i * stripeHeight * 4 - yOffsetTargeted;
                    
                    this.ctx.lineWidth = stripeHeight;
                    this.ctx.strokeStyle = `rgba(${this.playerColour},${this.alphaChannel}`;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.originX + this.width - xOffsetTargeted, stripeOriginY);
                    this.ctx.lineTo(this.originX + this.width + currentLanceLength - xOffsetTargeted, stripeOriginY);
                    this.ctx.stroke();

                    this.ctx.lineWidth = stripeHeight * lanceHeightMultiplier;
                    this.ctx.strokeStyle = "white";

                    this.ctx.beginPath();
                    this.ctx.moveTo(this.originX + this.width - xOffsetTargeted, stripeOriginY + randomSignedIntIntervaled(stripeHeight / 2));
                    this.ctx.lineTo(this.originX + this.width + currentLanceLength - xOffsetTargeted, stripeOriginY - randomSignedIntIntervaled(stripeHeight / 2));
                    this.ctx.stroke();

                }
                else{
                    stripeOriginY = topStripeOriginY + this.playerIndex * stripeHeight + i * stripeHeight * 4 - yOffset;

                    this.ctx.strokeStyle = `rgba(${this.playerColour},${this.alphaChannel}`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.originX + this.width - xOffset, stripeOriginY);
                    this.ctx.lineTo(this.originX + this.width + currentLanceLength - xOffset, stripeOriginY);
                    this.ctx.stroke();
                }
            }
        }
    }
}



export {Avatar, Player, Meter};