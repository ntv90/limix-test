import { _decorator, Component, game, instantiate, Label, Layout, math, Node, Prefab, Size, UITransform } from 'cc';
import { CardModel } from './Model/Card';
import { Item } from './Item';
import { CARD_STATUS, GAME_ITEMS, GAME_SIZE, STORAGE_KEY_OPENED as STORAGE_KEY_OPENED, STORAGE_KEY_DATA, STORAGE_KEY_SCORE } from './GameConst';
import { CLocalStorage } from './CLocalStorage';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property(Layout)
    gameLayout: Layout = null;

    @property(Prefab)
    item: Prefab = null;

    @property(Label)
    opened: Label = null;

    @property(Label)
    score:Label = null;

    @property(Node)
    menuNode: Node = null;

    @property(Node)
    gameNode: Node = null;

    @property(Node)
    gameOver: Node = null;

    @property(Node)
    btnContinue: Node = null;

    openedCount: number = 0;
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

        // Check saved data
        this.loadedData = CLocalStorage.gI().getItem(STORAGE_KEY_DATA);
        if(this.loadedData != null && this.loadedData != undefined){
            this.btnContinue.active = true;
        }else{
            this.btnContinue.active = false;
        }
    }

   //#region Event handle 

    onClickItem(event){
        let itemComp = event.target.getComponent(Item);
        if(itemComp){
            if(itemComp == this.currentCard) return;
            if(itemComp.card.state == CARD_STATUS.FACE_DOWN){
                itemComp.Open();
                if(this.currentCard == null){
                    this.currentCard = itemComp;
                }else{
                    if(this.currentCard.card.id == itemComp.card.id){
                        itemComp.Win();
                        this.currentCard.Win();
                        this.scoreCount++;
                        this.score.string = "Score: " + this.scoreCount*100;
                        
                        //check win
                        if( this.scoreCount*2 == this.listCard.length){
                            this.onGameOver();
                            return;
                        }
                    }else{
                        itemComp.Lose();
                        this.currentCard.Lose();
                    }
                    this.currentCard = null;
                    this.openedCount++;
                    this.opened.string = "Opened: " + this.openedCount
                }
                CLocalStorage.gI().saveItem(STORAGE_KEY_DATA, this.listCard);
                CLocalStorage.gI().saveItem(STORAGE_KEY_OPENED, this.openedCount);
                CLocalStorage.gI().saveItem(STORAGE_KEY_SCORE, this.scoreCount);
            }
        }
    }

    onClickLoadgame(){
        SoundManager.gI().playClick();
        this.loadSavedGame();
    }

    onClickNewgame(event, data){
        SoundManager.gI().playClick();
        let size = parseInt(data);
        this.menuNode.active = false;
        this.initNewGame(size);
        this.gameNode.active = true;
    }

    onClickPlayAgain(){
        SoundManager.gI().playClick();
        this.gameOver.active = false;
        this.initNewGame(this.gameSize);
        this.gameNode.active = true;
    }

    onClickOpenMenu(){
        SoundManager.gI().playClick();
        this.gameOver.active = false;
        this.gameNode.active = false;
        this.menuNode.active = true;
    }

    //#endregion Event handle

    //#region game logic
    private loadSavedGame(){
        this.gameLayout.node.removeAllChildren();
        this.listCard = this.loadedData;
        this.gameSize = Math.sqrt(this.listCard.length);
        this.currentCard = null;
        this.openedCount = parseInt(CLocalStorage.gI().getItem(STORAGE_KEY_OPENED));
        this.scoreCount = parseInt(CLocalStorage.gI().getItem(STORAGE_KEY_SCORE));
        this.score.string = "Score: " + this.scoreCount*100;
        this.opened.string = "Opened: " + this.openedCount
        
        this.createItems(true);

        this.menuNode.active = false;
        this.gameNode.active = true;
    }

    private initNewGame(gamesize){
        this.gameSize = gamesize;
        this.listCard = [];
        this.currentCard = null;
        this.openedCount = 0;
        this.scoreCount = 0;
        this.score.string = "Score: " + this.scoreCount*100;
        this.opened.string = "Opened: " + this.openedCount
        CLocalStorage.gI().deleteItem(STORAGE_KEY_DATA);
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
        this.gameLayout.node.removeAllChildren();
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

            //get current card when load data
            if(isLoaded && this.listCard[i].state == CARD_STATUS.FACE_UP){
                this.currentCard = itemComp;
            }
            newItem.on(Node.EventType.TOUCH_END, self.onClickItem.bind(self));
        }
    }
    onGameOver(){
        this.gameOver.active = true;
        this.btnContinue.active = false;
        CLocalStorage.gI().deleteItem(STORAGE_KEY_DATA);
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

    //#endregion game logic
}


