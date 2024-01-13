class Explosion{

    constructor(maxRadius, originX, originY, damage, speed, isLive, currentRadius){

        this.maxRadius = maxRadius;
        this.originX = originX;
        this.originY = originY;
        this.damage = damage;
        this.speed = speed;
        this.isLive = isLive;
        this.currentRadius = currentRadius;
    }
    
    update(deltaTimeStamp, avatarsArray, playersArray, minesArray, explosionsArray, floorY){

        if(this.isLive){

            this.currentRadius = this.currentRadius + this.speed * deltaTimeStamp/1000;

            console.log(`current radius: ${this.currentRadius}`);
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

                            playersArray[i].health = playersArray[i].health - this.damage;

                            if(playersArray[i].health <= 0){

                                playersArray[i].isAlive = false;
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

            ctx.lineWidth = this.speed * deltaTimeStamp/1000;

            ctx.beginPath();
            ctx.arc(this.originX, this.originY, this.currentRadius - this.speed * deltaTimeStamp/1000/2 , 0, 2 * Math.PI );
            ctx.stroke();
        }
    }








}


export{Explosion};