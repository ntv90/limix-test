import { _decorator, Component, game, instantiate, Layout, math, Node, Prefab, Size, UITransform } from 'cc';
import { CardModel } from './Model/Card';
import { Item } from './Item';
import { CARD_STATUS, GAME_ITEMS, GAME_SIZE } from './GameConst';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property(Layout)
    gameLayout: Layout = null;

    @property(Prefab)
    item: Prefab = null;

    listCard: CardModel[] = [];

    currentCard:Item = null;

    layoutSize;

    protected onLoad(): void {
        this.layoutSize = this.gameLayout.node.getComponent(UITransform).width;
        this.initGame(GAME_SIZE);
    }

    public initGame(gamesize){
        this.listCard = [];
        this.currentCard = null;
        let totalItem = gamesize*gamesize;
        //ex gamesize = 6 total = 36
        for(let i = 0; i < totalItem/2; i++){
            let cardID = i%GAME_ITEMS;
            let card = new CardModel(cardID);
            this.listCard.push(card);
            this.listCard.push(card);
        }

        console.log(this.listCard);
        this.listCard = this.suffleCards(this.listCard);
        console.log(this.listCard);

        //Setup layout size
        let itemSize = (this.layoutSize - (20*gamesize))/gamesize;
        this.gameLayout.cellSize = new Size(itemSize, itemSize);

        const self = this;
        //init prefab
        for(let i = 0; i < this.listCard.length; i++){
            let newItem = instantiate(this.item);
            let itemComp = newItem.getComponent(Item);
            itemComp.Init(this.listCard[i]);
            itemComp.card.index = i;
            this.gameLayout.node.addChild(newItem);
            itemComp.AddToBoard();
            newItem.on(Node.EventType.TOUCH_END, self.onClickItem.bind(self));
        }
    }



    onClickItem(event){
        let itemComp = event.target.getComponent(Item);
        if(itemComp){
            if(itemComp.card.state == CARD_STATUS.FACE_DOWN){
                itemComp.Open();
                if(this.currentCard == null){
                    this.currentCard = itemComp;
                }else{
                    if(this.currentCard.card.id == itemComp.card.id){
                        itemComp.Win();
                        this.currentCard.Win();
                    }else{
                        itemComp.Lose();
                        this.currentCard.Lose();
                    }
                    this.currentCard = null;
                }
            }
        }
    }

    suffleCards(cards:Array<any>){
        const shuffledCards = [...cards];

        // arr index
        const indices = Array.from({ length: shuffledCards.length }, (_, i) => i);

        // random
        for (let i = shuffledCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        // shuffle
        return indices.map(index => shuffledCards[index]);
    }
}


