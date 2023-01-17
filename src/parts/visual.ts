import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Update } from '../libs/update';
import { Text } from './text';
import { Util } from '../libs/util';
import { Color } from 'three/src/math/Color';

export class Visual extends Canvas {

  private _con:Object3D;

  constructor(opt: any) {
    super(opt);

    this._con = new Object3D();
    this.mainScene.add(this._con);

    const num = 100;
    for(let i = 0; i < num; i++) {
      // const col = i == num - 1 ? new Color(0xffffff) : new Color(Util.instance.random(0,1), Util.instance.random(0,1), Util.instance.random(0,1));
      const gray = Util.instance.map(i, 0.15, 1, 0, num - 1);
      const col = new Color(gray, gray, gray);

      this._con.add(new Text({
        id: i,
        color: col,
        useMask: true,
        // scale: Util.instance.random(1, 1.2),
        scale: Util.instance.map(i, 0.5, 1, 0, num - 1),
      }));
    }

    this._resize();
  }


  protected _update(): void {
    super._update();

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.render(this.mainScene, this.cameraPers);
  }


  public isNowRenderFrame(): boolean {
    return this.isRender && Update.instance.cnt % 1 == 0
  }


  _resize(): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    this.renderSize.width = w;
    this.renderSize.height = h;

    this._updateOrthCamera(this.cameraOrth, w, h);

    this.cameraPers.fov = 90;
    this._updatePersCamera(this.cameraPers, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();
  }
}
