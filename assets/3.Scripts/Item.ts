import { _decorator, Component, Label, Node, Sprite, SpriteFrame, Tween, tween, v3 } from 'cc';
import { CARD_STATUS } from './GameConst';
import { CardModel } from './Model/Card';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {
    @property([SpriteFrame])
    listCard: SpriteFrame[] = [];
    @property(SpriteFrame)
    faceDownSprite: SpriteFrame = null;
    @property(Sprite)
    cardImage: Sprite = null;
    @property(Label)
    stt: Label = null;

    public card: CardModel;

    public Init(_card: CardModel){
        this.card = _card;
        this.cardImage.spriteFrame = this.faceDownSprite;
        //this.cardImage.spriteFrame = this.listCard[this.card.id];
        this.node.scale = v3(0,0,0);
        this.stt.string = "" +_card.state;
        
    }

    public AddToBoard(isLoadData){
        if(isLoadData){
            if(this.card.state == CARD_STATUS.FACE_UP){
                this.cardImage.spriteFrame = this.listCard[this.card.id];
            }else if(this.card.state == CARD_STATUS.REMOVED){
                this.node.scale = v3(0,0,1);
            }
        }else{
            tween(this.node).to(0.2, {scale: v3(1,1,1)}).start();
        }
    }

    public Open(){
        Tween.stopAllByTarget(this);
        this.card.state = CARD_STATUS.FACE_UP;
        this.stt.string = "FACE UP";
        SoundManager.gI().playClick();
        tween(this.node).to(0.2, {scale: v3(0,1,1)})
            .call( () => {
                this.cardImage.spriteFrame = this.listCard[this.card.id];
            })
            .to(0.2, {scale: v3(1,1,1)})
        .start();
    }

    public Win(){
        Tween.stopAllByTarget(this);
        this.card.state = CARD_STATUS.REMOVED;
        this.stt.string = "REMOVED";
        SoundManager.gI().playCorrect();
        tween(this.node)
            .delay(0.4)
            .to(0.2, {scale: v3(1.1,1.1,1)})
            .delay(0.1)
            .to(0.1, {scale: v3(0,0,1)})
        .start();
    }

    public Lose(){
        Tween.stopAllByTarget(this);
        tween(this.node)
            .delay(0.4)
            .call( () => {
                SoundManager.gI().playWrong();
            })
            .to(0.1, {angle: 7})
            .to(0.1, {angle: 0})
            .to(0.1, {angle: -7})
            .to(0.1, {angle: 0})
            .to(0.2, {scale: v3(0,1,1)})
            .call( () => {
                this.cardImage.spriteFrame = this.faceDownSprite;
            })
            .to(0.1, {scale: v3(1,1,1)})
            .call( () => {
                this.card.state = CARD_STATUS.FACE_DOWN;
                this.stt.string = "FACE DOWN";
            })
        .start();
    }
}


