import {
    _decorator,
    Canvas,
    Component,
    director,
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
        const defaultRatio = 1080/1920;
        const cv = director.getScene().getComponentInChildren(Canvas);
        const size = screen.windowSize;
        if (size.width / size.height > defaultRatio) {
            view.setResolutionPolicy(ResolutionPolicy.FIXED_HEIGHT);
          } else {
            view.setResolutionPolicy(ResolutionPolicy.FIXED_WIDTH);
          }
    }
}
