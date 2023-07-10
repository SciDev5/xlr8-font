import { Vec2 } from '../util/Vec2'
import { FontGen, GlyphGen } from './FontGen'

/** Shorthand for `Vec2` */
function v (x: number, y: number): Vec2 {
  return new Vec2(x, y)
}

const X = { L: 128, R: 1024 - 128, C: 512 } as const
const Y = { L: 0, H: 2048 - 512, C: 1024 - 256, CL: 256 + 128, CH: 1024 + 128, S1: -256 - 128, S2: -1024 + 256 }
const Indent = 256
const Q = (X.C - X.L) / 2
export function generateFont (weight: number): FontGen {
  const R = weight / 2
  const f = new FontGen()
  function add (glyph: GlyphGen): void {
    f.glyphs.set(glyph.char, glyph)
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
      v(X.R, Y.H - R),
    ], [
      v(X.R, Y.L),
      v(X.R, Y.C - Indent),
      v(X.R - Indent, Y.C),
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
      v(X.C - Indent, Y.H - R),
      v(X.C + Indent, Y.H - R),
      v(X.C, Y.H - Indent),
      v(X.C, Y.L),
    ],
    [
      v(X.C - Indent, Y.L + R),
      v(X.C + Indent, Y.L + R),
    ],
  ], weight))

  add(new GlyphGen('J', [
    [
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
      v(X.C, Y.H - Indent),
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
      v(X.R - R, Y.C + Indent),
      v(X.R - Indent, Y.C),
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
      v(X.L, Y.C),
      v(X.R, Y.L),
    ],
  ], weight))

  add(new GlyphGen('b', [
    [
      v(X.L, Y.H),
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
      v(X.R, Y.CL),
      v(X.C, Y.C),
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
      v(X.L, Y.CL),
      v(X.C, Y.C),
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
      v(Q + X.L, Y.L),
      v(Q + X.L, Y.CH),
      v(Q + X.C, Y.H),
    ],
    [
      v(Q + X.L + R * 3, Y.C),
      v(Q + X.C + R, Y.C),
    ],
  ], weight))

  add(new GlyphGen('g', [
    [
      v(X.L + R, Y.L),
      v(X.L + R, Y.C),
      v(X.R - R, Y.C),
      v(X.R - R, Y.L),
      v(X.C, Y.S1),
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
      v(X.C - Indent, Y.C),
      v(X.C + Indent, Y.C),
      v(X.C, Y.C - Indent + R),
      v(X.C, Y.L),
    ],
    [
      v(X.C - Indent, Y.L + R),
      v(X.C + Indent, Y.L + R),
    ],
  ], weight))

  add(new GlyphGen('j', [
    [
      v(X.C - Indent, Y.C),
      v(X.C + Indent, Y.C),
      v(X.C, Y.C - Indent + R),
      v(X.C, Y.L + Indent),
      v(X.C - Indent, Y.L),
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
  add(new GlyphGen('l', [ // mono
    [
      v(X.C - 1.5 * Indent, Y.H),
      v(X.C, Y.H),
      v(X.C, Y.L),
    ],
    [
      v(X.C - 1.5 * Indent, Y.L + R),
      v(X.C + 1.5 * Indent, Y.L + R),
    ],
  ], weight))

  add(new GlyphGen('m', [
    [
      v(X.L, Y.L),
      v(X.L, Y.C),
      v(X.C, Y.CL),
    ],
    [
      v(X.C, Y.C),
      v(X.R, Y.CL),
      v(X.R, Y.L),
    ],
  ], weight))

  add(new GlyphGen('n', [
    [
      v(X.L, Y.L),
      v(X.L, Y.C),
    ],
    [
      v(X.L, Y.C - R),
      v(X.C, Y.C - R),
      v(X.R, Y.CL),
      v(X.R, Y.L),
    ],
  ], weight))

  add(new GlyphGen('o', [
    [
      v(X.L + R, Y.L),
      v(X.L + R, Y.C - R),
      v(X.R - R, Y.C - R),
      v(X.R - R, Y.L + R),
      v(X.L + R, Y.L + R),
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
      v(X.L, Y.CH),
      v(X.C - R * 3, Y.CH),
    ],
    [
      v(X.C, Y.CH),
      v(X.R, Y.CH),
    ],
  ], weight))

  add(new GlyphGen('u', [
    [
      v(X.L + R, Y.C),
      v(X.L + R, Y.L + R),
      v(X.R - Indent - 4 * R, Y.L + R),
      v(X.R - 3 * R, Y.L + R + Indent),
    ],
    [
      v(X.R - R, Y.C),
      v(X.R - R, Y.L),
    ],
  ], weight))

  add(new GlyphGen('v', [
    [
      v(X.L + R, Y.C),
      v(X.L + R, Y.L + R),
      v(X.L + R + Indent, Y.L + R),
      v(X.R, Y.C),
    ],
  ], weight))

  add(new GlyphGen('w', [
    [
      v(X.L, Y.C),
      v(X.L, Y.L),
      v(X.C, Y.CL),
    ],
    [
      v(X.C, Y.L),
      v(X.R, Y.CL),
      v(X.R, Y.C),
    ],
  ], weight))

  add(new GlyphGen('x', [
    [
      v(X.L, Y.L),
      v(X.R, Y.C),
    ],
    [
      v(X.R, Y.L),
      v(X.C, Y.CL),
    ],
    [
      v(X.L, Y.C),
      v(X.C - R * 2, Y.CL + R * 2 * ((Y.C - Y.L) / (X.R - X.L))),
    ],
  ], weight))

  add(new GlyphGen('y', [
    [
      v(X.L, Y.L),
      v(X.R, Y.C),
    ],
    [
      v(X.L, Y.C),
      v(X.C - R * 2, Y.CL + R * 2 * ((Y.C - Y.L) / (X.R - X.L))),
    ],
  ], weight))

  add(new GlyphGen('z', [
    [
      v(X.L, Y.C - R),
      v(X.R, Y.C - R),
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

  return f
}
