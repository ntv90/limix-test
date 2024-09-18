import { _decorator, Component, Node } from 'cc';
import { CARD_STATUS } from '../GameConst';
const { ccclass, property } = _decorator;

@ccclass('CardModel')
export class CardModel{
    public index: number = 0;
    public id: number = 0;
    public state: CARD_STATUS = CARD_STATUS.FACE_DOWN;
    constructor(_id:number){
        this.id = _id;
        this.state = CARD_STATUS.FACE_DOWN; 
    }
}


