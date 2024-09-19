import { _decorator, Component, game, instantiate, Label, Layout, math, Node, Prefab, Size, UITransform } from 'cc';
import { CardModel } from './Model/Card';
import { Item } from './Item';
import { CARD_STATUS, GAME_ITEMS, GAME_SIZE, STORAGE_KEY_DATA } from './GameConst';
import { CLocalStorage } from './CLocalStorage';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property(Layout)
    gameLayout: Layout = null;

    @property(Prefab)
    item: Prefab = null;

    @property(Label)
    clicked: Label = null;

    @property(Label)
    score:Label = null;

    @property(Node)
    menuNode: Node = null;

    @property(Node)
    gameNode: Node = null;

    @property(Node)
    btnContinue: Node = null;

    clickCount: number = 0;
    scoreCount: number = 0;

    listCard: CardModel[] = [];

    currentCard:Item = null;

    layoutSize;
    gameSize = 0;
    loadedData = null;

    protected onLoad(): void {
        this.menuNode.active = true;
        this.gameNode.active = false;
        this.layoutSize = this.gameLayout.node.getComponent(UITransform).width;
        this.loadedData = CLocalStorage.gI().getItem(STORAGE_KEY_DATA);
        this.initNewGame(6);
    }

    private loadSavedGame(){
        this.gameLayout.node.removeAllChildren();
    }

    private initNewGame(gamesize){
        this.gameLayout.node.removeAllChildren();
        this.gameSize = gamesize;
        this.listCard = [];
        this.currentCard = null;
        this.clickCount = 0;
        this.scoreCount = 0;
        let totalItem = gamesize*gamesize;
        //ex gamesize = 6 total = 36
        for(let i = 0; i < totalItem/2; i++){
            let cardID = i%GAME_ITEMS;
            let card = new CardModel(cardID);
            this.listCard.push(card);
            let card2 = new CardModel(cardID);
            this.listCard.push(card2);
        }

        this.listCard = this.suffleCards(this.listCard);
        this.createItems(false);
    }

    createItems(isLoaded){
        //Setup layout size
        let itemSize = (this.layoutSize - (20*this.gameSize))/this.gameSize;
        this.gameLayout.cellSize = new Size(itemSize, itemSize);
        const self = this;
        //init prefab
        for(let i = 0; i < this.listCard.length; i++){
            let newItem = instantiate(this.item);
            let itemComp = newItem.getComponent(Item);
            itemComp.Init(this.listCard[i]);
            this.gameLayout.node.addChild(newItem);
            itemComp.AddToBoard(isLoaded);
            newItem.on(Node.EventType.TOUCH_END, self.onClickItem.bind(self));
        }
    }


   //#region Event handle 

    onClickItem(event){
        let itemComp = event.target.getComponent(Item);
        if(itemComp){
            if(itemComp.card.state == CARD_STATUS.FACE_DOWN){
                itemComp.Open();
                this.clickCount++;
                this.clicked.string = "Clicked: " + this.clickCount
                if(this.currentCard == null){
                    this.currentCard = itemComp;
                }else{
                    if(this.currentCard.card.id == itemComp.card.id){
                        itemComp.Win();
                        this.currentCard.Win();
                        this.scoreCount+=100;
                        this.score.string = "Score: " + this.scoreCount;
                    }else{
                        itemComp.Lose();
                        this.currentCard.Lose();
                    }
                    this.currentCard = null;
                }
                CLocalStorage.gI().saveItem(STORAGE_KEY_DATA, this.listCard);
            }
        }
    }

    onClickLoadgame(){

    }

    onClickNewgame(event, data){
        CLocalStorage.gI().deleteItem(STORAGE_KEY_DATA);
        let size = parseInt(data);
        this.menuNode.active = false;
        this.initNewGame(size);
        this.gameNode.active = true;
    }

    //#endregion Event handle

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


