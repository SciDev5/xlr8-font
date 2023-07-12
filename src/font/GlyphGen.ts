import { type TTF } from 'fonteditor-core'
import { Vec2 } from '../util/Vec2'
import { SVGPath as SVGPathString } from '../util/svg'
import { outlinePolyline } from '../util/polyline'
import { EM_SIZE } from './FontGen'

export enum DiactriticLocation {
  Above,
  AboveAttatch,
  BelowAttatch,
  Below,
}

export class GlyphGen {
  readonly bounds: readonly [number, number]
  constructor (
    readonly char: string,
    public path: Vec2[][] = [],
    readonly weight: number,
    bounds: readonly [number, number] | null, // null is `auto`
  ) {
    this.bounds = bounds ?? (() => {
      const c = this.vecContours.flat().map(v => v.y)
      return [Math.min(...c), Math.max(...c)] as const
    })()
  }

  withDiacritic ({ Q, stroke }: { Q: number, stroke: number }, toChar: string, diacritic: GlyphGen, loc: DiactriticLocation): GlyphGen {
    const offY = ({
      [DiactriticLocation.AboveAttatch]: () => this.bounds[1],
      [DiactriticLocation.Above]: () => this.bounds[1] + Q,
      [DiactriticLocation.BelowAttatch]: () => this.bounds[0],
      [DiactriticLocation.Below]: () => this.bounds[0] - Q,
    } satisfies { [k in DiactriticLocation]: () => number })[loc]()

    const bounds = ({
      [DiactriticLocation.AboveAttatch]: () => [this.bounds[0], this.bounds[1] + diacritic.bounds[1]],
      [DiactriticLocation.Above]: () => [this.bounds[0], this.bounds[1] + diacritic.bounds[1]],
      [DiactriticLocation.BelowAttatch]: () => [this.bounds[0] + diacritic.bounds[0], this.bounds[1]],
      [DiactriticLocation.Below]: () => [this.bounds[0] + diacritic.bounds[0], this.bounds[1]],
    } satisfies { [k in DiactriticLocation]: () => [number, number] })[loc]()

    return new GlyphGen(
      toChar,
      [
        ...this.path,
        ...diacritic.path.map(c => c.map(v => v.add(new Vec2(0, offY)))),
      ],
      stroke,
      bounds,
    )
  }

  get unicode (): number[] {
    const unicode: number[] = []
    let unicodeChar: number
    let i = 0
    while (!isNaN(unicodeChar = this.char.charCodeAt(i))) {
      unicode.push(unicodeChar)
      i++
    }
    return unicode
  }

  private get vecContours (): Vec2[][] {
    // console.log(this.path.map(path => outlinePolyline(path, this.weight)))
    return this.path.map(path => outlinePolyline(path, this.weight))
  }

  readonly advanceWidth = 1024

  private get contours (): TTF.Point[][] {
    return this.vecContours
      .filter(contour => contour.length > 0)
      .map(v => v.map(({ x, y }) => ({ x, y, onCurve: true })))
  }

  getContourSVGPath (emBox: { pos: Vec2, height: number }): string {
    const { vecContours } = this
    return (
      vecContours.map(contour => SVGPathString.polyLine(
        contour.map(p => {
          const { x, y } = p.scale(1 / EM_SIZE)
          return (new Vec2(x, 1 - y)).scaleSelf(emBox.height).addSelf(emBox.pos)
        }),
      ),
      ).join(' ')
    )
  }

  toGlyph (): TTF.Glyph {
    const { contours, unicode, advanceWidth } = this
    const xs = contours.flat().map(v => v.x)
    const ys = contours.flat().map(v => v.y)

    return {
      advanceWidth,
      leftSideBearing: 0,
      name: this.char,
      unicode,
      contours,
      xMax: Math.max(0, ...xs),
      xMin: Math.min(0, ...xs),
      yMax: Math.max(0, ...ys),
      yMin: Math.min(0, ...ys),
    }
  }
}
