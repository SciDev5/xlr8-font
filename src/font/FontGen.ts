import { type TTF } from 'fonteditor-core'
import { type Vec2 } from '../util/Vec2'

export class FontGen {
  readonly glyphs = new Map<string, GlyphGen>()
}

export class GlyphGen {
  constructor (
    readonly char: string,
    readonly path: Vec2[] = [],
  ) {}

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

  private get contours (): TTF.Point[][] {
    return [
      [
        ...this.path.map(v => ({ ...v, onCurve: true })),
        ...this.path.reverse().map(v => ({ x: v.x + 100, y: v.y, onCurve: true })),
      ],
    ]
  }

  toGlyph (): TTF.Glyph {
    const { contours, unicode } = this
    const xs = contours.flat().map(v => v.x)
    const ys = contours.flat().map(v => v.y)

    return {
      advanceWidth: 2048,
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
