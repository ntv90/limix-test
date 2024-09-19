import {
    _decorator,
    Component,
    ResolutionPolicy,
    screen,
    view,
} from "cc";
const { ccclass, property } = _decorator;
@ccclass("AutoCanvasSize")
export class AutoCanvasSize extends Component {
    start() {
        this.setupCanvas();
        screen.on("window-resize", () => { this.setupCanvas()});
    }

    private setupCanvas() {
        const defaultRatio = 1280/720;
        const size = screen.windowSize;
        if (size.width / size.height > defaultRatio) {
            view.setResolutionPolicy(ResolutionPolicy.FIXED_HEIGHT);
          } else {
            view.setResolutionPolicy(ResolutionPolicy.FIXED_WIDTH);
          }
    }
}
