import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager extends Component {
    @property(AudioSource)
    bgmSource:AudioSource = null;
    @property(AudioSource)
    effectSource:AudioSource = null;

    @property(AudioClip)
    bgm:AudioClip = null;
    @property(AudioClip)
    click:AudioClip = null;
    @property(AudioClip)
    correct:AudioClip = null;
    @property(AudioClip)
    wrong:AudioClip = null;

    private static instance: SoundManager = null;

    protected onLoad(): void {
        SoundManager.instance = this;
    }

    static gI(): SoundManager {
        return this.instance;
    };

    public playClick(){
        this.effectSource.playOneShot(this.click);
    }
    public playCorrect(){
        this.effectSource.playOneShot(this.correct);
    }
    public playWrong(){
        this.effectSource.playOneShot(this.wrong);
    }
}


