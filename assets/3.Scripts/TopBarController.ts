import { _decorator, Component, Node, Toggle } from 'cc';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('TopBarController')
export class TopBarController extends Component {
    @property(Toggle)
    music: Toggle = null;

    @property(Toggle)
    sound: Toggle = null;

    onMusicToggle(){
        SoundManager.gI().setMusicVolumn( !this.music.isChecked)
    }

    onSoundToggle(){
        SoundManager.gI().setEffectVolumn( !this.sound.isChecked)
    }
}


