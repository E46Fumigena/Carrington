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
    
    update(deltaTimeStamp){

        if(this.isLive){

            this.currentRadius = this.currentRadius + this.speed * deltaTimeStamp/1000;
            if(this.currentRadius >= this.maxRadius){

                this.isLive = false;
                this.currentRadius = 1;
            }
        }
    }





    draw(playerColour, ctx){


        if(this.isLive){

            ctx.strokeStyle = `rgb(${playerColour})`;

            ctx.lineWidth = this.speed;

            ctx.beginPath();
            ctx.arc(this.originX, this.originY, this.currentRadius - this.speed/2 , 0, 2 * Math.PI );
            ctx.stroke();
        }
    }








}


export{Explosion};