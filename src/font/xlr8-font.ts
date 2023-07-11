import { Vec2 } from '../util/Vec2'
import { FontGen, GlyphGen } from './FontGen'

/** Shorthand for `Vec2` */
function v (x: number, y: number): Vec2 {
  return new Vec2(x, y)
}

const X = { L: 128, R: 1024 - 128, C: 512 } as const
const Y = { L: 0, H: 2048 - 512, C: 1024 - 256, CL: 256 + 128, CH: 1024 + 128, S0: -128 - 64, S1: -256 - 128, S2: -512 }
const Indent = 256
const Q = (X.C - X.L) / 2
/** The generate the glyphs for the font I am now calling XLR8. */
export function generateFontXLR8 (weight: number): FontGen {
  const R = weight / 2
  const f = new FontGen()
  function add (glyph: GlyphGen): void {
    f.glyphs.set(glyph.char, glyph)
  }
  enum DiactriticLocation {
    Above,
    Below,
  }
  function addDiacritic (glyph: GlyphGen, autoMerge: Array<[string, string]>, loc: DiactriticLocation = DiactriticLocation.Above): void {
    add(glyph)
    for (const [from, to] of autoMerge) {
      const fromGlyph = f.glyphs.get(from)
      if (fromGlyph == null) {
        throw new Error(`diactritic '◌${glyph.char}' merge with '${from}', but it's missing (check order)`)
      }
      const offY = ({
        [DiactriticLocation.Above]: () => Math.max(...fromGlyph.path.flat().map(v => v.y)) + Q,
        [DiactriticLocation.Below]: () => Math.min(...fromGlyph.path.flat().map(v => v.y)),
      } satisfies { [k in DiactriticLocation]: () => number })[loc]()
      add(new GlyphGen(to, [
        ...fromGlyph.path,
        ...glyph.path.map(c => c.map(v => v.add(new Vec2(0, offY)))),
      ], glyph.weight))
    }
  }
  add(new GlyphGen('\x00', [], 0))

  // add(new GlyphGen(' ', [[ // Dot space
  //   v(X.C - R, Y.C),
  //   v(X.C + R, Y.C),
  // ]], weight))

  add(new GlyphGen(' ', [], weight))

  add(new GlyphGen('A', [[
    v(X.L, Y.L),
    v(X.L, Y.H),
    v(X.R, Y.L),
  ]], weight))

  add(new GlyphGen('B', [[
    v(X.L, Y.L),
    v(X.L, Y.H - R),
    v(X.R, Y.H - R),
    v(X.R, Y.C + Indent),
    v(X.R - Indent, Y.C),
    v(X.R, Y.C - Indent),
    v(X.R, Y.L + R),
    v(X.L, Y.L + R),
  ]], weight))

  add(new GlyphGen('C', [[
    v(X.R, Y.L + R),
    v(X.L, Y.L + R),
    v(X.L, Y.H - R - Indent),
    v(X.L + Indent, Y.H - R),
    v(X.R, Y.H - R),
  ]], weight))

  add(new GlyphGen('D', [[
    v(X.L, Y.L),
    v(X.L, Y.H - R),
    v(X.L + R * 4, Y.H - R),
    v(X.R, Y.C),
    v(X.R, Y.L + R),
    v(X.L, Y.L + R),
  ]], weight))

  // add(new GlyphGen('E', [ // Split E (3 lines)
  //   [
  //     v(X.L, Y.L + R),
  //     v(X.R, Y.L + R),
  //   ], [
  //     v(X.L, Y.C),
  //     v(X.R, Y.C),
  //   ], [
  //     v(X.L, Y.H - R),
  //     v(X.R, Y.H - R),
  //   ],
  // ], weight))

  add(new GlyphGen('E', [ // Joined E
    [
      v(X.R, Y.L + R),
      v(X.L, Y.L + R),
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
    ], [
      v(X.L + R * 3, Y.C),
      v(X.R, Y.C),
    ],
  ], weight))

  add(new GlyphGen('F', [
    [
      v(X.L, Y.L),
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
    ], [
      v(X.L + R * 3, Y.C),
      v(X.R, Y.C),
    ],
  ], weight))

  add(new GlyphGen('G', [
    [
      v(X.R, Y.CL + R),
      v(X.C, Y.L + R),
      v(X.L, Y.L + R),
      v(X.L, Y.H - R),
      v(X.R + R, Y.H - R),
    ], [
      v(X.R, Y.L),
      // v(X.R, Y.C - Indent),
      // v(X.R - Indent, Y.C),
      v(X.R, Y.C),
    ],
  ], weight))

  add(new GlyphGen('H', [
    [
      v(X.L, Y.L),
      v(X.L, Y.H),
    ],
    [
      v(X.L + R * 3, Y.C),
      v(X.R - Indent, Y.C),
      v(X.R, Y.C - Indent),
      v(X.R, Y.L),
    ],
    [
      v(X.R, Y.H),
      v(X.R, Y.L),
    ],
  ], weight))

  add(new GlyphGen('I', [
    [
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
      v(X.C, Y.CH),
      v(X.C, Y.L),
    ],
    [
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
    ],
  ], weight))

  add(new GlyphGen('J', [
    [
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
      v(X.C, Y.CH),
      v(X.C, Y.L + Indent),
      v(X.C - Indent, Y.L),
    ],
  ], weight))

  add(new GlyphGen('K', [
    [
      v(X.L, Y.L),
      v(X.L, Y.H),
    ],
    [
      v(X.R, Y.H),
      v(X.L + R * 3, Y.C + Indent),
      v(X.L + R * 3, Y.C),
      v(X.C, Y.C),
      v(X.R, Y.L),
    ],
  ], weight))

  add(new GlyphGen('L', [
    [
      v(X.L, Y.H),
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
    ],
  ], weight))

  add(new GlyphGen('M', [
    [
      v(X.L, Y.L),
      v(X.L, Y.H),
      v(X.C, Y.CH),
    ],
    [
      v(X.C, Y.H),
      v(X.R, Y.CH),
      v(X.R, Y.L),
    ],
  ], weight))

  add(new GlyphGen('N', [
    [
      v(X.L, Y.L),
      v(X.L, Y.H),
      v(X.R, Y.L),
      v(X.R, Y.H),
    ],
  ], weight))

  add(new GlyphGen('O', [
    [
      v(X.L, Y.L),
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
      v(X.R, Y.L + R),
      v(X.L, Y.L + R),
    ],
  ], weight))

  add(new GlyphGen('P', [
    [
      v(X.L, Y.L),
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
      v(X.R, Y.CH),
      v(X.C, Y.C),
    ],
  ], weight))

  add(new GlyphGen('Q', [
    [
      v(X.L, Y.L),
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
      v(X.R, Y.CL + R),
      v(X.C, Y.L + R),
      v(X.L, Y.L + R),
    ],
    [
      v(X.C, Y.C),
      v(X.R, Y.L),
    ],
  ], weight))

  add(new GlyphGen('R', [
    [
      v(X.L, Y.L),
      v(X.L, Y.H - R),
      v(X.R - R, Y.H - R),
      v(X.R - R, Y.C + Indent * 1.5),
      v(X.R - Indent * 1.5, Y.C),
      v(X.R, Y.L),
    ],
  ], weight))

  add(new GlyphGen('S', [
    [
      v(X.R, Y.H - R),
      v(X.L, Y.H - R),
      v(X.L, Y.C),
      v(X.R - R, Y.C),
      v(X.R - R, Y.L + R + Indent * 1.5),
      v(X.R - R - Indent * 1.5, Y.L + R),
      v(X.L, Y.L + R),
    ],
  ], weight))

  add(new GlyphGen('T', [
    [
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
      v(X.C, Y.CH),
      v(X.C, Y.L),
    ],
  ], weight))

  add(new GlyphGen('U', [
    [
      v(X.L, Y.H),
      v(X.L, Y.L + R),
      v(X.R - Indent - 3 * R, Y.L + R),
      v(X.R - 2 * R, Y.L + R + Indent),
    ],
    [
      v(X.R, Y.H),
      v(X.R, Y.L),
    ],
  ], weight))

  add(new GlyphGen('V', [
    [
      v(X.L + R, Y.H),
      v(X.L + R, Y.L + R),
      v(X.L + R + Indent, Y.L + R),
      v(X.R, Y.H),
    ],
  ], weight))

  add(new GlyphGen('W', [
    [
      v(X.L, Y.H),
      v(X.L, Y.L),
      v(X.C, Y.CL),
    ],
    [
      v(X.C, Y.L),
      v(X.R, Y.CL),
      v(X.R, Y.H),
    ],
  ], weight))

  add(new GlyphGen('X', [
    [
      v(X.L, Y.L),
      v(X.R, Y.H),
    ],
    [
      v(X.R, Y.L),
      v(X.C, Y.C),
    ],
    [
      v(X.L, Y.H),
      v(X.C - R * 2, Y.C + R * 2 * ((Y.H - Y.L) / (X.R - X.L))),
    ],
  ], weight))

  add(new GlyphGen('Y', [
    [
      v(X.L, Y.L),
      v(X.R, Y.H),
    ],
    [
      v(X.L, Y.H),
      v(X.C - R * 2, Y.C + R * 2 * ((Y.H - Y.L) / (X.R - X.L))),
    ],
  ], weight))

  add(new GlyphGen('Z', [
    [
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
    ],
  ], weight))

  add(new GlyphGen('a', [
    [
      v(X.L, Y.L),
      v(X.L, Y.C + R),
      v(X.R, Y.L),
    ],
  ], weight))

  add(new GlyphGen('b', [
    [
      v(X.L, Y.H),
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
      v(X.R, Y.CL + R),
      v(X.C, Y.C + R),
    ],
  ], weight))

  add(new GlyphGen('c', [
    [
      v(X.R, Y.C),
      v(X.L, Y.C),
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
    ],
  ], weight))

  add(new GlyphGen('d', [
    [
      v(X.R, Y.H),
      v(X.R, Y.L + R),
      v(X.L, Y.L + R),
      v(X.L, Y.CL + R),
      v(X.C, Y.C + R),
    ],
  ], weight))

  add(new GlyphGen('e', [
    [
      v(X.L, Y.C),
      v(X.R, Y.C),
    ],
    [
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
    ],
    [
      v(X.L, Y.CL + R / 2),
      v(X.R, Y.CL + R / 2),
    ],
  ], weight))

  add(new GlyphGen('f', [
    [
      v(X.C - Q + R, Y.L),
      v(X.C - Q + R, Y.CH),
      v(X.R - Q + R, Y.H),
    ],
    [
      v(X.C - Q + R + R * 3, Y.C),
      v(X.R - Q + R, Y.C),
    ],
    [
      v(X.L, Y.C),
      v(X.C - Q + R, Y.C),
    ],
  ], weight))

  add(new GlyphGen('g', [
    [
      v(X.L + R, Y.L),
      v(X.L + R, Y.C),
      v(X.R - R, Y.C),
      v(X.R - R, Y.L),
      v(X.L, Y.S2),
    ],
  ], weight))

  add(new GlyphGen('h', [
    [
      v(X.L, Y.L),
      v(X.L, Y.H),
    ],
    [
      v(X.L + R * 3, Y.C),
      v(X.R - Indent, Y.C),
      v(X.R, Y.C - Indent),
      v(X.R, Y.L),
    ],
  ], weight))

  add(new GlyphGen('i', [
    [
      v(X.L, Y.C),
      v(X.R, Y.C),
      v(X.C, Y.CL + R),
      v(X.C, Y.L),
    ],
    [
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
    ],
  ], weight))

  add(new GlyphGen('j', [
    [
      v(X.L, Y.C),
      v(X.R, Y.C),
      v(X.C, Y.CL + R),
      v(X.C, Y.S1 + Indent),
      v(X.C - Indent, Y.S1),
    ],
  ], weight))

  add(new GlyphGen('k', [
    [
      v(X.L, Y.L),
      v(X.L, Y.H),
    ],
    [
      v(X.R - R * 2, Y.C),
      v(X.C, Y.CL + R * 2),
    ],
    [
      v(X.L, Y.C - R * 2),
      v(X.R - R * 2, Y.L),
    ],
  ], weight))

  // add(new GlyphGen('l', [
  //   [
  //     v(X.C - Q, Y.H),
  //     v(X.C - Q, Y.L + Indent),
  //     v(X.C - Q + Indent, Y.L),
  //   ],
  // ], weight))
  //   add(new GlyphGen('l', [ // mono
  //   [
  //     v(X.C - 1.5 * Indent, Y.H - R),
  //     v(X.C, Y.H - R),
  //     v(X.C, Y.L + Indent + R),
  //     v(X.C + Indent, Y.L + R),
  //     v(X.R, Y.L + R),
  //   ],
  // ], weight))
  add(new GlyphGen('l', [ // smol
    [
      v(X.L, Y.C + R),
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
    ],
  ], weight))

  add(new GlyphGen('m', [
    [
      v(X.L, Y.L),
      v(X.L, Y.C + R),
      v(X.C, Y.CL + R),
    ],
    [
      v(X.C, Y.C + R),
      v(X.R, Y.CL + R),
      v(X.R, Y.L),
    ],
  ], weight))

  add(new GlyphGen('n', [
    [
      v(X.L, Y.L),
      v(X.L, Y.C + R),
    ],
    [
      v(X.L, Y.C),
      v(X.C, Y.C),
      v(X.R, Y.CL),
      v(X.R, Y.L),
    ],
  ], weight))

  add(new GlyphGen('o', [
    [
      v(X.L + R / 2, Y.L),
      v(X.L + R / 2, Y.C),
      v(X.R - R / 2, Y.C),
      v(X.R - R / 2, Y.L + R),
      v(X.L + R / 2, Y.L + R),
    ],
  ], weight))

  add(new GlyphGen('p', [
    [
      v(X.L + R, Y.S1),
      v(X.L + R, Y.C),
      v(X.R - R, Y.C),
      v(X.R - R, Y.CL),
      v(X.C, Y.L),
    ],
  ], weight))
  add(new GlyphGen('q', [
    [
      v(X.R - R + Indent, Y.S1),
      v(X.R - R, Y.S1 + Indent),
      v(X.R - R, Y.C),
      v(X.L + R, Y.C),
      v(X.L + R, Y.CL),
      v(X.C, Y.L),
    ],
  ], weight))

  add(new GlyphGen('r', [
    [
      v(X.L + R, Y.L),
      v(X.L + R, Y.C + R),
    ],
    [
      v(X.L, Y.C - Indent),
      v(X.R, Y.C),
    ],
  ], weight))

  add(new GlyphGen('s', [
    [
      v(X.L, Y.L + R),
      v(X.R - R, Y.L + R),
      v(X.R - R, Y.CL + R / 2),
      v(X.L + R, Y.CL + R / 2),
      v(X.L + R, Y.C),
      v(X.R, Y.C),
    ],
  ], weight))

  add(new GlyphGen('t', [
    [
      v(X.C, Y.L),
      v(X.C, Y.H),
    ],
    [
      v(X.L, Y.C),
      v(X.C - R * 3, Y.C),
    ],
    [
      v(X.C, Y.C),
      v(X.R, Y.C),
    ],
  ], weight))

  add(new GlyphGen('u', [
    [
      v(X.L + R, Y.C + R),
      v(X.L + R, Y.L + R),
      v(X.R - Indent - 4 * R, Y.L + R),
      v(X.R - 3 * R, Y.L + R + Indent),
    ],
    [
      v(X.R - R, Y.C + R),
      v(X.R - R, Y.L),
    ],
  ], weight))

  add(new GlyphGen('v', [
    [
      v(X.L + R, Y.C + R),
      v(X.L + R, Y.L + R),
      v(X.L + R + Indent, Y.L + R),
      v(X.R, Y.C + R),
    ],
  ], weight))

  add(new GlyphGen('w', [
    [
      v(X.L, Y.C + R),
      v(X.L, Y.L),
      v(X.C, Y.CL),
    ],
    [
      v(X.C, Y.L),
      v(X.R, Y.CL),
      v(X.R, Y.C + R),
    ],
  ], weight))

  add(new GlyphGen('x', [
    [
      v(X.L, Y.L),
      v(X.R, Y.C + R),
    ],
    [
      v(X.R, Y.L),
      v(X.C, Y.CL + R / 2),
    ],
    [
      v(X.L, Y.C + R),
      v(X.C - R * 2, Y.CL + R / 2 + R * 2 * ((Y.C - Y.L + R) / (X.R - X.L + R))),
    ],
  ], weight))

  add(new GlyphGen('y', [
    [
      v(X.L, Y.L),
      v(X.R, Y.C + R),
    ],
    [
      v(X.L, Y.C + R),
      v(X.C - R * 2, Y.CL + R / 2 + R * 2 * ((Y.C - Y.L + R) / (X.R - X.L + R))),
    ],
  ], weight))

  add(new GlyphGen('z', [
    [
      v(X.L, Y.C),
      v(X.R, Y.C),
    ],
    [
      v(X.R, Y.C - R * 3),
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
    ],
  ], weight))

  add(new GlyphGen('0', [
    [
      v(X.L, Y.L),
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
      v(X.R, Y.L + R),
      v(X.L, Y.L + R),
    ],
    [
      v(X.L + R * 3, Y.C - Indent / 2),
      v(X.R - R * 3, Y.C + Indent / 2),
    ],
  ], weight))

  add(new GlyphGen('1', [
    [
      v(Q + X.L, Y.CH),
      v(Q + X.C, Y.H),
      v(Q + X.C, Y.L + R),
      v(Q + X.L, Y.L + R),
    ],
  ], weight))

  add(new GlyphGen('2', [
    [
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
      v(X.R, Y.CH),
      v(X.L, Y.CL),
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
    ],
  ], weight))

  add(new GlyphGen('3', [
    [
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),

      v(X.R, Y.C + Indent),
      v(X.R - Indent, Y.C),
      v(X.R, Y.C - Indent),

      v(X.R, Y.L + R),
      v(X.L, Y.L + R),
    ],
  ], weight))

  add(new GlyphGen('4', [
    [
      v(X.R, Y.H),
      v(X.C, Y.L),
    ],
    [
      v(X.L, Y.H),
      v(X.L, Y.C),
      v(X.C, Y.C),
    ],
  ], weight))

  add(new GlyphGen('5', [
    [
      v(X.R, Y.H - R),
      v(X.L, Y.H - R),
      v(X.L, Y.C),
      v(X.R - R, Y.C),
      v(X.R - R, Y.C - R * 1),
      v(X.L, Y.L + R),
    ],
  ], weight))

  add(new GlyphGen('6', [
    [
      v(X.R + R, Y.H - R),
      v(X.L, Y.H - R),
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
      v(X.R, Y.CL),
      v(X.L + R * 3, Y.C),
    ],
  ], weight))

  add(new GlyphGen('7', [
    [
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
      v(X.L, Y.L),
    ],
    [
      v(X.L, Y.C),
      v(X.C, Y.C),
    ],
  ], weight))

  add(new GlyphGen('8', [
    [
      v(X.C - R * 2, Y.C + R * 2),
      v(X.L, Y.CH),
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
      v(X.R, Y.CH),
      v(X.L, Y.CL),
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
      v(X.R, Y.CL),
      v(X.C + R * 2, Y.C - R * 2),
    ],
  ], weight))

  add(new GlyphGen('9', [
    [
      v(X.C - R * 1.5, Y.C),
      v(X.L + R, Y.C),
      v(X.L + R, Y.H - R),
      v(X.R, Y.H - R),
      v(X.R, Y.H - R * 3),
      v(X.L + Q, Y.L),
    ],
  ], weight))

  add(new GlyphGen('`', [
    [
      v(X.C - Indent, Y.H),
      v(X.C, Y.CH),
    ],
  ], weight))

  add(new GlyphGen('~', [
    [
      v(X.L, (Y.C + Y.CL) / 2 - Q * 0.75),
      v(X.C - Q * 3 / 4, (Y.C + Y.CL) / 2 + Q * 0.75),
      v(X.C + Q * 3 / 4, (Y.C + Y.CL) / 2 - Q * 0.75),
      v(X.R, (Y.C + Y.CL) / 2 + Q * 0.75),
    ],
  ], weight))

  add(new GlyphGen('!', [
    [
      v(X.C, Y.L + R * 3),
      v(X.C, Y.L),
    ],
    [
      v(X.C, Y.L + R * 6),
      v(X.C, Y.H),
    ],
  ], weight))

  add(new GlyphGen('?', [
    [
      v(X.C - Q / 2, Y.L + R * 3),
      v(X.C - Q / 2, Y.L),
    ],
    [
      v(X.C - Q / 2, Y.L + R * 6),
      v(X.C - Q / 2, Y.C - R * 2),
      v(X.R - Q / 2, Y.CH - R * 4),
      v(X.R - Q / 2, Y.H - R),
      v(X.L, Y.H - R),
    ],
  ], weight))

  add(new GlyphGen('@', [
    [
      v(X.L + Indent, Y.S0),
      v(X.L, Y.S0 + Indent),
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
      v(X.R, Y.L + Q),
      v(X.C, Y.CH),
      v(X.C, Y.L + Q),
    ],
  ], weight))

  add(new GlyphGen('#', [
    [
      v(X.L - R, Y.C + Q),
      v(X.R + R, Y.C + Q),
    ],
    [
      v(X.L - R, Y.C - Q),
      v(X.R + R, Y.C - Q),
    ],
    [
      v(X.C - Q + R, Y.H),
      v(X.C - Q - R, Y.L),
    ],
    [
      v(X.C + Q + R, Y.H),
      v(X.C + Q - R, Y.L),
    ],
  ], weight))

  add(new GlyphGen('$', [
    [
      v(X.R, Y.H - R),
      v(X.L + R, Y.H - R),
      v(X.L + R, Y.C),
      v(X.R - R, Y.C),
      v(X.R - R, Y.L + R + Indent * 1.5),
      v(X.R - R - Indent * 1.5, Y.L + R),
      v(X.L, Y.L + R),
    ],
    [
      v(X.C + Q, Y.H + Q),
      v(X.C - Q, Y.L - Q),
    ],
  ], weight))

  add(new GlyphGen('%', [
    [
      v(X.L - R, Y.L + (Indent * Math.SQRT2 - R / 2)),
      v(X.R + R, Y.H - (Indent * Math.SQRT2 - R / 2)),
    ],
    [
      v(X.L, Y.H - R),
      v(X.L + Indent * 2, Y.H - R),
      v(X.L + Indent * 2, Y.H - R - Indent),
      v(X.L + Indent, Y.H - R - Indent * 2),
      v(X.L, Y.H - R - Indent * 2),
      v(X.L, Y.H),
    ],
    [
      v(X.R, Y.L + R),
      v(X.R - Indent * 2, Y.L + R),
      v(X.R - Indent * 2, Y.L + R + Indent),
      v(X.R - Indent, Y.L + R + Indent * 2),
      v(X.R, Y.L + R + Indent * 2),
      v(X.R, Y.L),
    ],
  ], weight))

  add(new GlyphGen('^', [
    [
      v(X.L, Y.CH - Q),
      v(X.C, Y.H),
      v(X.R, Y.CH - Q),
    ],
  ], weight))

  add(new GlyphGen('&', [
    [
      v(X.L, Y.C - R),
      v(X.L, Y.L + R),
      v(X.C, Y.L + R),
      v(X.R, Y.C),
    ],
    [
      v(X.R, Y.L),
      v(X.L, Y.CH),
      v(X.L, Y.H - R),
      v(X.R - R, Y.H - R),
      v(X.R - R, Y.CH),
      v(X.C + R, Y.C + R * (Y.H - Y.L) / (X.R - X.L)),
    ],
  ], weight))

  add(new GlyphGen('*', [
    [
      v(X.L + Q / 2, Y.C + Q / 4 * 3),
      v(X.R - Q / 2, Y.H - Q / 4 * 3),
    ],
    [
      v(X.R - Q / 2, Y.C + Q / 4 * 3),
      v(X.L + Q / 2, Y.H - Q / 4 * 3),
    ],
    [
      v(X.C, Y.C),
      v(X.C, Y.H),
    ],
  ], weight))

  add(new GlyphGen('-', [
    [
      v(X.L, (Y.C + Y.CL) / 2),
      v(X.R, (Y.C + Y.CL) / 2),
    ],
  ], weight))

  add(new GlyphGen('_', [
    [
      v(0, Y.L + R),
      v(1024, Y.L + R),
    ],
  ], weight))

  add(new GlyphGen('=', [
    [
      v(X.L, Y.C),
      v(X.R, Y.C),
    ],
    [
      v(X.L, Y.CL),
      v(X.R, Y.CL),
    ],
  ], weight))

  add(new GlyphGen('+', [
    [
      v(X.L, (Y.C + Y.CL) / 2),
      v(X.R, (Y.C + Y.CL) / 2),
    ],
    [
      v(X.C, Y.L + Q / 2 + R),
      v(X.C, Y.CH - Q / 2 - R),
    ],
  ], weight))

  add(new GlyphGen('(', [
    [
      v(X.C + Indent / 2, Y.H),
      v(X.C - Indent / 2, Y.H - Indent),
      v(X.C - Indent / 2, Y.S0 + Indent),
      v(X.C + Indent / 2, Y.S0),
    ],
  ], weight))

  add(new GlyphGen(')', [
    [
      v(X.C - Indent / 2, Y.H),
      v(X.C + Indent / 2, Y.H - Indent),
      v(X.C + Indent / 2, Y.S0 + Indent),
      v(X.C - Indent / 2, Y.S0),
    ],
  ], weight))

  add(new GlyphGen('[', [
    [
      v(X.C + Indent / 2, Y.H - R),
      v(X.C - Indent / 2, Y.H - R),
      v(X.C - Indent / 2, Y.S0 + R),
      v(X.C + Indent / 2, Y.S0 + R),
    ],
  ], weight))

  add(new GlyphGen(']', [
    [
      v(X.C - Indent / 2, Y.H - R),
      v(X.C + Indent / 2, Y.H - R),
      v(X.C + Indent / 2, Y.S0 + R),
      v(X.C - Indent / 2, Y.S0 + R),
    ],
  ], weight))

  add(new GlyphGen('{', [
    [
      v(X.C + Indent, Y.H),
      v(X.C, Y.H - Indent),

      v(X.C, Y.C - Q / 2 + Indent),
      v(X.C - Indent, Y.C - Q / 2),
      v(X.C, Y.C - Q / 2 - Indent),

      v(X.C, Y.S0 + Indent),
      v(X.C + Indent, Y.S0),
    ],
  ], weight))

  add(new GlyphGen('}', [
    [
      v(X.C - Indent, Y.H),
      v(X.C, Y.H - Indent),

      v(X.C, Y.C - Q / 2 + Indent),
      v(X.C + Indent, Y.C - Q / 2),
      v(X.C, Y.C - Q / 2 - Indent),

      v(X.C, Y.S0 + Indent),
      v(X.C - Indent, Y.S0),
    ],
  ], weight))

  add(new GlyphGen('|', [
    [
      v(X.C, Y.H),
      v(X.C, Y.S0),
    ],
  ], weight))

  add(new GlyphGen('/', [
    [
      v(X.R, Y.H),
      v(X.L, Y.S0),
    ],
  ], weight))

  add(new GlyphGen('\\', [
    [
      v(X.L, Y.H),
      v(X.R, Y.S0),
    ],
  ], weight))

  add(new GlyphGen(',', [
    [
      v(X.C, Y.L + R * 3),
      v(X.C, Y.L),
      v(X.C - R * 2, Y.L - R * 3),
    ],
  ], weight))

  add(new GlyphGen('.', [
    [
      v(X.C, Y.L + R * 3),
      v(X.C, Y.L),
    ],
  ], weight))

  add(new GlyphGen('<', [
    [
      v(X.R, Y.L + Q / 2 + R),
      v(X.L, (Y.L + Y.CH) / 2),
      v(X.R, Y.CH - Q / 2 - R),
    ],
  ], weight))

  add(new GlyphGen('>', [
    [
      v(X.L, Y.L + Q / 2 + R),
      v(X.R, (Y.L + Y.CH) / 2),
      v(X.L, Y.CH - Q / 2 - R),
    ],
  ], weight))

  add(new GlyphGen(':', [
    [
      v(X.C, Y.L + R * 3),
      v(X.C, Y.L),
    ],
    [
      v(X.C, Y.C + R),
      v(X.C, Y.C - R * 2),
    ],
  ], weight))

  add(new GlyphGen(';', [
    [
      v(X.C, Y.L + R * 3),
      v(X.C, Y.L),
      v(X.C - R * 2, Y.L - R * 3),
    ],
    [
      v(X.C, Y.C + R),
      v(X.C, Y.C - R * 2),
    ],
  ], weight))

  add(new GlyphGen('"', [
    [
      v(X.C - R * 2, Y.H),
      v(X.C - R * 2, Y.CH - R * 2),
    ],
    [
      v(X.C + R * 2, Y.H),
      v(X.C + R * 2, Y.CH - R * 2),
    ],
  ], weight))

  add(new GlyphGen("'", [
    [
      v(X.C, Y.H),
      v(X.C, Y.CH - R * 2),
    ],
  ], weight))

  addDiacritic(new GlyphGen('\u0301', [
    [
      v(X.C - Q, Y.L),
      v(X.C + Q, Y.CL),
    ],
  ], weight), [
    ['a', 'á'],
    ['e', 'é'],
    ['o', 'ó'],
    ['u', 'ú'],
    ['A', 'Á'],
    ['E', 'É'],
    ['O', 'Ó'],
    ['U', 'Ú'],
  ])
  addDiacritic(new GlyphGen('\u0308', [
    [
      v(X.C - R * 3, Y.L),
      v(X.C - R * 3, Y.L + R * 4),
    ],
    [
      v(X.C + R * 3, Y.L),
      v(X.C + R * 3, Y.L + R * 4),
    ],
  ], weight), [
    ['a', 'ä'],
    ['e', 'ë'],
    ['i', 'ï'],
    ['o', 'ö'],
    ['u', 'ü'],
    ['A', 'Ä'],
    ['E', 'Ë'],
    ['I', 'Ï'],
    ['O', 'Ö'],
    ['U', 'Ü'],
  ])

  add(new GlyphGen('í', [
    [
      v(X.C - R * 2, Y.C),
      v(X.R - R * 2, Y.CH - R),
    ],
    [
      v(X.R, Y.C),
      v(X.C, Y.CL + R),
      v(X.C, Y.L),
    ],
    [
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
    ],
  ], weight))

  add(new GlyphGen('Í', [
    [
      v(X.C - R * 2, Y.H),
      v(X.R - R * 2, Y.H + 2 * Q - R),
    ],
    [
      v(X.R, Y.H - R),
      v(X.C, Y.CH),
      v(X.C, Y.L),
    ],
    [
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
    ],
  ], weight))

  addDiacritic(new GlyphGen('\u0303', [
    [
      v(X.L, Y.L),
      v(X.C - Q * 3 / 4, Y.L + Q * 1.25),
      v(X.C + Q * 3 / 4, Y.L),
      v(X.R, Y.L + Q * 1.25),
    ],
  ], weight), [
    ['n', 'ñ'],
    ['N', 'Ñ'],
  ])

  addDiacritic(new GlyphGen('\u0327', [
    [
      v(X.C - Q + R, Y.L),
      v(X.C - Q + R, Y.S0),
      v(X.C + Q, Y.S0),
      v(X.C - Q, Y.S1),
    ],
  ], weight), [
    ['c', 'ç'],
    ['C', 'Ç'],
  ], DiactriticLocation.Below)

  return f
}
