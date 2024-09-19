import { _decorator, Component, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StorageManager')
export class CLocalStorage extends Component {
    public static instance: CLocalStorage = null;
    public static gI() {
        if (this.instance == null) {
            this.instance = new CLocalStorage();
        }
        return this.instance;
    }
    saveItem(key, item) {
        sys.localStorage.setItem(key, JSON.stringify(item));
    }
    getItem(key) {
        return JSON.parse(sys.localStorage.getItem(key));
    }
    deleteItem(key) {
        sys.localStorage.removeItem(key);
    }
}


