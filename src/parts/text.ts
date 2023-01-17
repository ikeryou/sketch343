import vt from '../glsl/text.vert';
import fg from '../glsl/text.frag';
import { Mesh } from 'three/src/objects/Mesh';
import { Color } from 'three/src/math/Color';
import { Vector2 } from 'three/src/math/Vector2';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial';
import { MyObject3D } from "../webgl/myObject3D";
import { TexLoader } from '../webgl/texLoader';
import { Conf } from '../core/conf';
import { Func } from '../core/func';
import { MousePointer } from '../core/mousePointer';
import { Util } from '../libs/util';

export class Text extends MyObject3D {

  private _mesh: Mesh;
  private _scale: number = 1;
  private _noise: Vector2 = new Vector2(Util.instance.range(1), Util.instance.range(1));

  constructor(opt: {id: number, color: Color, useMask: boolean, scale: number}) {
    super();

    this._noise.x = opt.id;
    this._scale = opt.scale;

    const tex = TexLoader.instance.get(Conf.instance.PATH_IMG + 'tex-text.png');

    this._mesh = new Mesh(
      new PlaneGeometry(1, 1),
      new ShaderMaterial({
        vertexShader:vt,
        fragmentShader:fg,
        transparent:true,
        depthTest:false,
        uniforms:{
          useMask:{value:!opt.useMask},
          t:{value:tex},
          c:{value:opt.color},
          ma:{value:new Vector2(0, 0)},
          mb:{value:new Vector2(0.5, 1)},
          mc:{value:new Vector2(0.75, 0)},
          line:{value:0.25},
          time:{value:0},
        }
      })
    )
    this.add(this._mesh);
  }

  public setMask(p1: Vector2, p2: Vector2, p3: Vector2):void {
    const uni = this._getUni(this._mesh);
    uni.ma.value.copy(p1);
    uni.mb.value.copy(p2);
    uni.mc.value.copy(p3);
  }

  protected _update():void {
    super._update();

    let s = Math.max(Func.instance.sw(), Func.instance.sh()) * 0.5;
    s *= this._scale;

    this._mesh.scale.set(s, s, 1);

    const mx = MousePointer.instance.easeNormal.x;
    const my = MousePointer.instance.easeNormal.y;

    const center = new Vector2(
      0.5,
      0.5,
    );
    const rangeA = 0.5;
    const rangeB = 0.5;

    this.setMask(
      new Vector2(
        center.x + mx * rangeA,
        center.y + Util.instance.map(my, rangeB, -rangeB, -1, 1)
      ),
      new Vector2(
        center.x - 0.5 + mx * rangeA,
        center.y - 0.5 + Util.instance.map(my, 0, rangeB, -1, 1)
      ),
      new Vector2(
        center.x + 0.5 + mx * rangeA,
        center.y - 0.5 + Util.instance.map(my, rangeB, 0, -1, 1)
      ),
    );

    this.position.x = s * 1 * mx * 0.2;
    this.position.y = s * 1 * my * 0.1;

    const uni = this._getUni(this._mesh);
    uni.time.value += 0.1;
  }
}