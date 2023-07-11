import { type TTF } from 'fonteditor-core'
import { Vec2 } from '../util/Vec2'
import { SVGPath as SVGPathString } from '../util/svg'
import { outlinePolyline } from '../util/polyline'
import { EM_SIZE } from './FontGen'

export class GlyphGen {
  constructor (
    readonly char: string,
    public path: Vec2[][] = [],
    readonly weight: number,
  ) { }

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
    console.log(this.path.map(path => outlinePolyline(path, this.weight),
    ))

    return this.path.map(path => outlinePolyline(path, this.weight),
    )
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
