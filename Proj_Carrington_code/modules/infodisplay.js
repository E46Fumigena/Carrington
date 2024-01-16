 class InfoDisplay{

    constructor(index, originX, originY, width, baseMargin, topMargin, lateralMargin, fontType, numberOfCharacters, maxCounter, alphaSustainTime, ctx, fontSize){

        this.index = index;

        this.originX = originX;
        this.originY = originY;

        this.width = width;
        this.baseMargin = baseMargin;
        this.topMargin = topMargin;
        this.lateralMargin = lateralMargin;

        this.fontType = fontType;
        this.numberOfCharacters = numberOfCharacters;

        this.maxCounter = maxCounter * 1000;
        this.alphaSustainTime = alphaSustainTime * 1000;

        this.ctx = ctx;

        this.fontSize = fontSize;
    }


    infosArray = ["", "", ""];

    countersArray = [0, 0, 0];

    coloursArray = ["255, 255, 255", "255, 255, 255", "255, 255, 255"];

    
    injectInfo(infoText, textColour){

        this.infosArray[2] = this.infosArray[1];

        this.infosArray[1] = this.infosArray[0];

        this.infosArray[0] = infoText;


        this.countersArray[2] = this.countersArray[1];

        this.countersArray[1] = this.countersArray[0];

        this.countersArray[0] = this.maxCounter;


        this.coloursArray[2] = this.coloursArray[1];

        this.coloursArray[1] = this.coloursArray[0];

        this.coloursArray[0] = textColour;

        console.log(this.infosArray);

        console.log(this.coloursArray);

        console.log(this.countersArray);

        console.log(this.index);

        console.log(this.fontSize);
    }


    update(deltaTimeStamp, avatarsArray, playersArray){

        if(playersArray[this.index].isAlive){

            this.originX = avatarsArray[this.index].originX + avatarsArray[this.index].width / 2;

            for(let i = 0; i < this.countersArray.length; i++){

                if(this.countersArray[i] != 0){

                    this.countersArray[i] = this.countersArray[i] - deltaTimeStamp;

                    if(this.countersArray[i] < 0){

                        this.countersArray[i] = 0;
                    }
                }
            }
        }
    }


    draw(){

        this.ctx.font = `bold ${this.fontSize}px ${this.fontType}`;

        this.ctx.textBaseline = "alphabetic";

        this.ctx.textAlign = "center";

        let cellHeight = this.baseMargin + this.topMargin + this.ctx.measureText("M").width;

        let firstBaseY = this.originY - this.baseMargin;

        for(let i = 0; i < this.countersArray.length; i++){

            if(this.countersArray[i] > 0){

                if(this.countersArray[i] < this.maxCounter - this.alphaSustainTime){

                    let currentAlpha = this.countersArray[i] / (this.maxCounter - this.alphaSustainTime);

                    this.ctx.fillStyle = `rgba(${this.coloursArray[i]}, ${currentAlpha})`;//!!!!!!!!!!!!!!!!!reformat colours to rgb expression!!!!!!!!!!!!!
                }
                else{

                    this.ctx.fillStyle = `rgb(${this.coloursArray[i]})`;
                }

                this.ctx.fillText(this.infosArray[i], this.originX, firstBaseY - i * cellHeight);
            }
        }
    }
 }

 export {InfoDisplay};