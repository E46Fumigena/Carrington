class Mine{

        constructor(originX, originY, width, height, coreOffset, type, playerIndex, lineWidth , primed){
            
            this.originX = originX;
            this.originY = originY;
            this.width = width;
            this.height = height;
            this.type = type;
            this.playerIndex = playerIndex;
            this.lineWidth = lineWidth;
            this.coreOffset = coreOffset;
            this.primed = primed;
    
        }


        draw(playersColours, ctx){

            if(this.primed){

                let colour = `rgb(${playersColours[this.playerIndex]})`;

                ctx.strokeStyle = colour;

                ctx.lineWidth = this.lineWidth; 

                ctx.beginPath();

                ctx.moveTo(this.originX + this.coreOffset , this.originY + this.coreOffset);

                ctx.lineTo(this.originX + this.width - this.coreOffset, this.originY + this.coreOffset);

                ctx.lineTo(this.originX + this.width - this.coreOffset , this.originY + this.height - this.coreOffset);

                ctx.lineTo(this.originX + this.coreOffset , this.originY + this.height - this.coreOffset);

                ctx.lineTo(this.originX + this.coreOffset , this.originY + this.coreOffset);

                ctx.stroke();

                ctx.beginPath();

                ctx.moveTo(this.originX , this.originY);

                ctx.lineTo(this.originX + this.width , this.originY + this.height);

                ctx.stroke();

                ctx.beginPath();

                ctx.moveTo(this.originX + this.width , this.originY);

                ctx.lineTo(this.originX , this.originY + this.height);

                ctx.stroke();
            }


        }







}
export {Mine};