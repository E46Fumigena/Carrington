import {randomSignedIntIntervaled, randomWeightedInt, completeRectCollisionCheck, randomUnsignedIntIntervaled,rectangleCollisionCheck} from "./modules/calc.js";

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


        update(avatarsArray , pearsArray){

            let avatarCheck = false;
            let pearCheck = false;

            for(let i = 0 ; i < avatarsArray.length ; i++){

                avatarCheck = completeRectCollisionCheck([[this.originX , this.originY],[this.originX + this.width , this.originY], [this.originX + this.width , this.originY + this.height] , [this.originX,this.originY + this.height]],
                    [[avatarsArray[i].originX , avatarsArray[i].originY],[avatarsArray[i].originX + avatarsArray[i].width , avatarsArray[i].originY], [avatarsArray[i].originX + avatarsArray[i].width , avatarsArray[i].originY + avatarsArray[i].height] , 
                    [avatarsArray[i].originX,avatarsArray[i].originY + avatarsArray[i].height]]);
            }

            for(let i = 0 ; i < pearsArray.length ; i++){

                if(pearsArray[i].pearType == 6 || pearsArray[i].pearType == 7){
                    
                    pearCheck = completeRectCollisionCheck([[this.originX , this.originY],[this.originX + this.width , this.originY], [this.originX + this.width , this.originY + this.height] , [this.originX,this.originY + this.height]],
                        [[pearsArray[i].originX , pearsArray[i].originY],[pearsArray[i].originX + pearsArray[i].width , pearsArray[i].originY], [pearsArray[i].originX + pearsArray[i].width , pearsArray[i].originY + pearsArray[i].height] , 
                        [pearsArray[i].originX,pearsArray[i].originY + pearsArray[i].height]]);
                
                }
            }


            if(avatarCheck || pearCheck){

                this.primed = false;
            }


        }







}
export {Mine};