class PlayerSubmix{

    constructor(audioContext, channelIndex, leftOutput, rightOutput){

        this.audioContext = audioContext;

        this.moveGain = audioContext.createGain();

        this.lanceGain = audioContext.createGain();

        this.lanceContactGain = audioContext.createGain();

        this.hitGain = audioContext.createGain();

        this.bonusReceivedGain = audioContext.createGain();

        this.playerMixer = audioContext.createChannelMerger();

        this.playerPanner = audioContext.createStereoPanner();

        this.outputGain = audioContext.createGain();

        this.pannerSplitter = audioContext.createChannelSplitter(2);

        this.leftOutput = leftOutput;

        this.rightOutput = rightOutput;

        //audio routing:
        this.moveGain.connect(this.playerMixer, 0, 0);

        this.lanceGain.connect(this.playerMixer, 0, 0);

        this.lanceContactGain.connect(this.playerMixer, 0, 0);

        this.hitGain.connect(this.playerMixer, 0, 0);

        this.bonusReceivedGain.connect(this.playerMixer, 0, 0);

        this.playerMixer.connect(this.outputGain);

        this.outputGain.connect(this.playerPanner);

        this.playerPanner.connect(this.pannerSplitter);

        this.pannerSplitter.connect(this.leftOutput, 0, channelIndex);//goes into generalLeftMixer; must point to specific generalLeftMixer input channel!!!!

        this.pannerSplitter.connect(this.rightOutput, 1, channelIndex);//goes into generalLeftMixer; must point to specific generalLeftMixer input channel!!!!

        //console.log(channelIndex);
    }

    //gain values domain: [0, 1]
    //gains should always be set immediately after submix object creation
    setMoveGain(gainValue){

        this.moveGain.gain.setValueAtTime(gainValue, this.audioContext.currentTime);
    }

    setLanceGain(gainValue){

        this.lanceGain.gain.setValueAtTime(gainValue, this.audioContext.currentTime);
    }

    setLanceContactGain(gainValue){

        this.lanceContactGain.gain.setValueAtTime(gainValue, this.audioContext.currentTime);
    }

    setOutputGain(gainValue){

        this.outputGain.gain.setValueAtTime(gainValue, this.audioContext.currentTime);
    }

    //pan values domain: [0, 1]; 0 hardpan left, +1 hardpan right, 0.5 center - but only here?
    setPlayerPan(playerX){

        let panValue = playerX / window.innerWidth;

        //console.log(panValue);

        this.playerPanner.pan.setValueAtTime(panValue, this.audioContext.currentTime);
    }
}


class PearChannel{

    constructor(audioContext, pearIndex, leftOutput, rightOutput){

        this.audioContext = audioContext;

        this.pearPanner = audioContext.createStereoPanner();

        this.pannerSplitter = audioContext.createChannelSplitter();

        this.leftOutput = leftOutput;

        this.rightOutput = rightOutput;

        //audio routing:
        this.pearPanner.connect(this.pannerSplitter);

        this.pannerSplitter.connect(this.leftOutput, 0, pearIndex);//goes into pearsSubmix -> pearsMixerLeft; must point to specific pearsMixerLeft input channel!!!!

        this.pannerSplitter.connect(this.rightOutput, 1, pearIndex);//goes into pearsSubmix -> pearsMixerRight; must point to specific pearsMixerRight input channel!!!!
    }

    setPearPan(pearX){

        let panValue = playerX / window.innerWidth;
        
        this.pearPanner.pan.setValueAtTime(panValue, this.audioContext.currentTime);
    }
}


class PearSubmix{

    constructor(audioContext, channelsNumber, channelIndex, leftOutput, rightOutput){

        this.audioContext = audioContext;

        this.pearsMixerLeft = audioContext.createChannelMerger(channelsNumber);

        this.pearsMixerRight = audioContext.createChannelMerger(channelsNumber);

        this.pearsGainLeft = audioContext.createGain();

        this.pearsGainRight = audioContext.createGain();

        this.pearsMixerLeftPanner = audioContext.createStereoPanner();

        this.pearsMixerRightPanner = audioContext.createStereoPanner();

        this.leftOutput = leftOutput;

        this.rightOutput = rightOutput;

        //audio routing:
        this.pearsMixerLeft.connect(this.pearsGainLeft);

        this.pearsMixerRight.connect(this.pearsGainRight);

        this.pearsGainLeft.connect(this.pearsMixerLeftPanner);

        this.pearsGainRight.connect(this.pearsMixerRightPanner);

        this.pearsMixerLeftPanner.connect(this.leftOutput, 0, channelIndex);//goes into generalMixerLeft; must point to specific generalMixerLeft input channel!!!!

        this.pearsMixerRightPanner.connect(this.rightOutput, 1, channelIndex);//goes into generalMixerRight; must point to specific generalMixerRight input channel!!!!
    }

    setPearsGain(gainValue){

        this.pearsGainLeft.gain.setValueAtTime(gainValue, this.audioContext.currentTime);

        this.pearsGainRight.gain.setValueAtTime(gainValue, this.audioContext.currentTime);
    }
    //must be called immediately after creating the pearsSubmix object!!!!!
    setPearSubmixPan(){
        
        this.pearsMixerLeftPanner.pan.setValueAtTime(0, this.audioContext.currentTime);//maybe -1?

        this.pearsMixerRightPanner.pan.setValueAtTime(1, this.audioContext.currentTime);
    }    
}


class MineSubmix{

    constructor(audioContext, channelIndex, leftOutput, rightOutput){

        this.audioContext = audioContext;

        this.mineDropGain = audioContext.createGain();

        this.minePanner = audioContext.createStereoPanner();

        this.pannerSplitter = audioContext.createChannelSplitter();

        this.leftOutput = leftOutput;

        this.rightOutput = rightOutput;

        //audio routing:
        this.mineDropGain.connect(this.minePanner);

        this.minePanner.connect(this.pannerSplitter);
        
        this.pannerSplitter.connect(leftOutput, 0, channelIndex);//goes into generalMixerLeft; must point to specific generalMixerLeft input channel!!!!

        this.pannerSplitter.connect(rightOutput, 1, channelIndex);//goes into generalMixerRight; must point to specific generalMixerRight input channel!!!!
    }

    setMineDropGain(gainValue){

        this.mineDropGain.gain.setValueAtTime(gainValue, this.audioContext.currentTime);
    }    

    setMinePan(mineX){

        let panValue = mineX / window.innerWidth;
        
        this.minePanner.pan.setValueAtTime(panValue, this.audioContext.currentTime);
    }    
}


class GeneralMix{

    constructor(audioContext, channelsNumber){

        this.audioContext = audioContext;

        this.generalMixerLeft = audioContext.createChannelMerger(channelsNumber);

        this.generalMixerRight = audioContext.createChannelMerger(channelsNumber);

        this.generalPannerLeft = audioContext.createStereoPanner();

        this.generalPannerRight = audioContext.createStereoPanner();

        this.generalGainLeft = audioContext.createGain();

        this.generalGainRight = audioContext.createGain();

        this.output = audioContext.destination;

        //audio routing:
        this.generalMixerLeft.connect(this.generalPannerLeft);

        this.generalMixerRight.connect(this.generalPannerRight);

        this.generalPannerLeft.connect(this.generalGainLeft);

        this.generalPannerRight.connect(this.generalGainRight);

        this.generalGainLeft.connect(this.output);

        this.generalGainRight.connect(this.output);
    }

    setGeneralPan(){
        
        this.generalPannerLeft.pan.setValueAtTime(-1, this.audioContext.currentTime);

        this.generalPannerRight.pan.setValueAtTime(1, this.audioContext.currentTime);
    }    

    setGeneralGain(gainValue){

        this.generalGainLeft.gain.setValueAtTime(gainValue, this.audioContext.currentTime);

        this.generalGainRight.gain.setValueAtTime(gainValue, this.audioContext.currentTime);
    }

    //!!!!!!!!! may be in dire need of a compressor node set as general audio limiter if general audio output energy exceeds system dynamic range!!!!!!!!
}

class ExplosionChannel{

    constructor(audioContext, channelIndex, leftOutput, rightOutput){

        this.audioContext = audioContext;

        this.explosionPanner = audioContext.createStereoPanner();

        this.explosionGain = audioContext.createGain();

        this.explosionSplitter = audioContext.createChannelSplitter();

        this.leftOutput = leftOutput;

        this.rightOutput = rightOutput;

        //audio routing:
        this.explosionPanner.connect(this.explosionGain);

        this.explosionGain.connect(this.explosionSplitter);

        this.explosionSplitter.connect(this.leftOutput, 0, channelIndex);//goes into generalMixerLeft; must point to specific generalMixerLeft input channel!!!!

        this.explosionSplitter.connect(this.rightOutput, 1, channelIndex);//goes into generalMixerRight; must point to specific generalMixerRight input channel!!!!
    }

    setExplosionPan(explosionX){

        let panValue = explosionX / window.innerWidth;
        
        this.explosionPanner.pan.setValueAtTime(panValue, this.audioContext.currentTime);
    }
    
    setExplosionGain(gainValue){

        this.explosionGain.gain.setValueAtTime(gainValue, this.audioContext.currentTime);
    } 
}

export{PlayerSubmix, PearChannel, PearSubmix, MineSubmix, GeneralMix, ExplosionChannel};