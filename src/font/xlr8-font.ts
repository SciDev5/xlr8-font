import { Vec2 } from '../util/Vec2'
import { FontGen } from './FontGen'
import { DiactriticLocation, GlyphGen } from './GlyphGen'

/** Shorthand for `Vec2` */
function v (x: number, y: number): Vec2 {
  return new Vec2(x, y)
}

const X = { L: 128, R: 1024 - 128, C: 512 } as const
const Y = { L: 0, H: 2048 - 512, C: 1024 - 256, CL: 256 + 128, CH: 1024 + 128, S0: -128 - 64, S1: -256 - 128, S2: -512 }
const Indent = 256
const Q = (X.C - X.L) / 2

const B = { cap: [Y.L, Y.H], low: [Y.L, Y.C], none: [NaN, NaN], auto: null } as const

/** The generate the glyphs for the font I am now calling XLR8. */
export function generateFontXLR8 (stroke: number, weight: number): FontGen {
  const R = stroke / 2
  const f = new FontGen('XLR8', 'XLR8', 'Regular', '0.0', weight)
  function add (glyph: GlyphGen): void {
    if (glyph.char.length !== 1) {
      console.warn(`autoMergeDiacritics using combiners, "${glyph.char}". may not work.`)
    }
    f.glyphs.set(glyph.char, glyph)
  }

  function autoMergeDiacritic (
    [diacritic, loc]: [GlyphGen, DiactriticLocation],
    merges: Record<string, string>,
    autoUppercase: boolean = true,
  ): void {
    for (const [from, to] of (
      autoUppercase
        ? Object.entries(merges).flatMap(([k, v]) => [
          [k.toLowerCase(), v.toLowerCase()],
          [k.toUpperCase(), v.toUpperCase()],
        ])
        : Object.entries(merges)
    )) {
      const fromGlyph = f.glyphs.get(from)
      if (fromGlyph == null) {
        throw new Error(`diactritic '◌${diacritic.char}' merge with '${from}', but it's missing (check order)`)
      }
      add(fromGlyph.withDiacritic({ Q, stroke }, to, diacritic, loc))
    }
  }
  function autoMergeDiacriticMulti (
    [dia0, loc0]: [GlyphGen, DiactriticLocation],
    subCalls: Array<[[GlyphGen, DiactriticLocation], Record<string, string>]>,
    autoUppercase: boolean = true,
  ): void {
    for (const call of subCalls) {
      const [[dia1, loc1], merges] = call
      if (loc1 === DiactriticLocation.AboveAttatch || loc1 === DiactriticLocation.BelowAttatch) {
        console.warn("attatching diacritic following non-attatching doesn't make sense")
      }
      for (const [from, to] of (
        autoUppercase
          ? Object.entries(merges).flatMap(([k, v]) => [
            [k.toLowerCase(), v.toLowerCase()],
            [k.toUpperCase(), v.toUpperCase()],
          ])
          : Object.entries(merges)
      )) {
        const fromGlyph = f.glyphs.get(from)
        if (fromGlyph == null) {
          throw new Error(`diactritic '◌${dia0.char + dia1.char}' merge with '${from}', but it's missing (check order)`)
        }
        add(fromGlyph
          .withDiacritic({ Q, stroke }, '<INTERMEDIATE>', dia0, loc0)
          .withDiacritic({ Q, stroke }, to, dia1, loc1),
        )
      }
    }
  }

  function addDiacritic (glyph: GlyphGen, loc: DiactriticLocation = DiactriticLocation.Above): [GlyphGen, DiactriticLocation] {
    add(glyph)
    return [glyph, loc]
  }

  add(new GlyphGen('\x00', [], 0, B.none))

  // add(new GlyphGen(' ', [[ // Dot space
  //   v(X.C - R, Y.C),
  //   v(X.C + R, Y.C),
  // ]], weight))

  add(new GlyphGen(' ', [], stroke, B.none))

  add(new GlyphGen('A', [[
    v(X.L, Y.L),
    v(X.L, Y.H),
    v(X.R, Y.L),
  ]], stroke, B.cap))

  add(new GlyphGen('B', [[
    v(X.L, Y.L),
    v(X.L, Y.H - R),
    v(X.R, Y.H - R),
    v(X.R, Y.C + Indent),
    v(X.R - Indent, Y.C),
    v(X.R, Y.C - Indent),
    v(X.R, Y.L + R),
    v(X.L, Y.L + R),
  ]], stroke, B.cap))

  add(new GlyphGen('C', [[
    v(X.R, Y.L + R),
    v(X.L, Y.L + R),
    v(X.L, Y.H - R - Indent),
    v(X.L + Indent, Y.H - R),
    v(X.R, Y.H - R),
  ]], stroke, B.cap))

  add(new GlyphGen('D', [[
    v(X.L, Y.L),
    v(X.L, Y.H - R),
    v(X.L + R * 4, Y.H - R),
    v(X.R, Y.C),
    v(X.R, Y.L + R),
    v(X.L, Y.L + R),
  ]], stroke, B.cap))

  add(new GlyphGen('Đ', [
    [
      v(X.L, Y.L),
      v(X.L, Y.H - R),
      v(X.L + R * 4, Y.H - R),
      v(X.R, Y.C),
      v(X.R, Y.L + R),
      v(X.L, Y.L + R),
    ],
    [
      v(X.L, Y.C),
      v(X.C, Y.C),
    ],
  ], stroke, B.cap))

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
  // ], weight, B.cap))

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
  ], stroke, B.cap))

  add(new GlyphGen('F', [
    [
      v(X.L, Y.L),
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
    ], [
      v(X.L + R * 3, Y.C),
      v(X.R, Y.C),
    ],
  ], stroke, B.cap))

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
  ], stroke, B.cap))

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
  ], stroke, B.cap))

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
  ], stroke, B.cap))

  add(new GlyphGen('J', [
    [
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
      v(X.C, Y.CH),
      v(X.C, Y.L + Indent),
      v(X.C - Indent, Y.L),
    ],
  ], stroke, B.cap))

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
  ], stroke, B.cap))

  add(new GlyphGen('L', [
    [
      v(X.L, Y.H),
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
    ],
  ], stroke, B.cap))

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
  ], stroke, B.cap))

  add(new GlyphGen('N', [
    [
      v(X.L, Y.L),
      v(X.L, Y.H),
      v(X.R, Y.L),
      v(X.R, Y.H),
    ],
  ], stroke, B.cap))

  add(new GlyphGen('O', [
    [
      v(X.L, Y.L),
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
      v(X.R, Y.L + R),
      v(X.L, Y.L + R),
    ],
  ], stroke, B.cap))
  add(new GlyphGen('Ơ', [
    [
      v(X.L, Y.L),
      v(X.L, Y.H - R),
      v(X.R - Indent, Y.H - R),
      v(X.R, Y.H - R - Indent),
      v(X.R, Y.L + R),
      v(X.L, Y.L + R),
    ],
    [
      v(X.R - Indent - R * 2, Y.H - R),
      v(X.R - R, Y.H - R),
      v(X.R + R, Y.H + R),
      v(X.R + R, Y.H + R * 3),
    ],
  ], stroke, B.cap))

  add(new GlyphGen('P', [
    [
      v(X.L, Y.L),
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
      v(X.R, Y.CH),
      v(X.C, Y.C),
    ],
  ], stroke, B.cap))

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
  ], stroke, B.cap))

  add(new GlyphGen('R', [
    [
      v(X.L, Y.L),
      v(X.L, Y.H - R),
      v(X.R - R, Y.H - R),
      v(X.R - R, Y.C + Indent * 1.5),
      v(X.R - Indent * 1.5, Y.C),
      v(X.R, Y.L),
    ],
  ], stroke, B.cap))

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
  ], stroke, B.cap))

  add(new GlyphGen('T', [
    [
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
      v(X.C, Y.CH),
      v(X.C, Y.L),
    ],
  ], stroke, B.cap))

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
  ], stroke, B.cap))

  add(new GlyphGen('Ư', [
    [
      v(X.L, Y.H),
      v(X.L, Y.L + R),
      v(X.R - Indent - 3 * R, Y.L + R),
      v(X.R - 2 * R, Y.L + R + Indent),
    ],
    [
      v(X.R, Y.L),
      v(X.R, Y.H),
    ],
    [
      v(X.R, Y.H - R * 3),
      v(X.R, Y.H - R * 2),
      v(X.R + R * 3, Y.H + R),
      v(X.R + R * 3, Y.H + R * 3),
    ],
  ], stroke, B.cap))

  add(new GlyphGen('V', [
    [
      v(X.L + R, Y.H),
      v(X.L + R, Y.L + R),
      v(X.L + R + Indent, Y.L + R),
      v(X.R, Y.H),
    ],
  ], stroke, B.cap))

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
  ], stroke, B.cap))

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
  ], stroke, B.cap))

  add(new GlyphGen('Y', [
    [
      v(X.L, Y.L),
      v(X.R, Y.H),
    ],
    [
      v(X.L, Y.H),
      v(X.C - R * 2, Y.C + R * 2 * ((Y.H - Y.L) / (X.R - X.L))),
    ],
  ], stroke, B.cap))

  add(new GlyphGen('Z', [
    [
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
    ],
  ], stroke, B.cap))

  add(new GlyphGen('a', [
    [
      v(X.L, Y.L),
      v(X.L, Y.C + R),
      v(X.R, Y.L),
    ],
  ], stroke, B.low))

  add(new GlyphGen('b', [
    [
      v(X.L, Y.H),
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
      v(X.R, Y.CL + R),
      v(X.C, Y.C + R),
    ],
  ], stroke, B.cap))

  add(new GlyphGen('c', [
    [
      v(X.R, Y.C),
      v(X.L, Y.C),
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
    ],
  ], stroke, B.low))

  add(new GlyphGen('d', [
    [
      v(X.R, Y.H),
      v(X.R, Y.L + R),
      v(X.L, Y.L + R),
      v(X.L, Y.CL + R),
      v(X.C, Y.C + R),
    ],
  ], stroke, B.cap))

  add(new GlyphGen('đ', [
    [
      v(X.R, Y.H),
      v(X.R, Y.L + R),
      v(X.L, Y.L + R),
      v(X.L, Y.CL + R),
      v(X.C, Y.C + R),
    ],
    [
      v(X.C - Q, Y.CH),
      v(X.R, Y.CH),
    ],
  ], stroke, B.cap))

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
  ], stroke, B.low))

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
  ], stroke, B.cap))

  add(new GlyphGen('g', [
    [
      v(X.L + R, Y.L),
      v(X.L + R, Y.C),
      v(X.R - R, Y.C),
      v(X.R - R, Y.L),
      v(X.L, Y.S2),
    ],
  ], stroke, B.low))

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
  ], stroke, B.cap))

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
  ], stroke, B.low))

  add(new GlyphGen('j', [
    [
      v(X.L, Y.C),
      v(X.R, Y.C),
      v(X.C, Y.CL + R),
      v(X.C, Y.S1 + Indent),
      v(X.C - Indent, Y.S1),
    ],
  ], stroke, B.low))

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
  ], stroke, B.cap))

  // add(new GlyphGen('l', [
  //   [
  //     v(X.C - Q, Y.H),
  //     v(X.C - Q, Y.L + Indent),
  //     v(X.C - Q + Indent, Y.L),
  //   ],
  // ], weight, B.cap))
  //   add(new GlyphGen('l', [ // mono
  //   [
  //     v(X.C - 1.5 * Indent, Y.H - R),
  //     v(X.C, Y.H - R),
  //     v(X.C, Y.L + Indent + R),
  //     v(X.C + Indent, Y.L + R),
  //     v(X.R, Y.L + R),
  //   ],
  // ], weight, B.cap))
  add(new GlyphGen('l', [ // smol
    [
      v(X.L, Y.C + R),
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
    ],
  ], stroke, B.low))

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
  ], stroke, B.low))

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
  ], stroke, B.low))

  add(new GlyphGen('o', [
    [
      v(X.L + R / 2, Y.L),
      v(X.L + R / 2, Y.C),
      v(X.R - R / 2, Y.C),
      v(X.R - R / 2, Y.L + R),
      v(X.L + R / 2, Y.L + R),
    ],
  ], stroke, B.low))

  add(new GlyphGen('ơ', [
    [
      v(X.L + R / 2, Y.L),
      v(X.L + R / 2, Y.C),
      v(X.R - R / 2 - Indent, Y.C),
      v(X.R - R / 2, Y.C - Indent),
      v(X.R - R / 2, Y.L + R),
      v(X.L + R / 2, Y.L + R),
    ],
    [
      v(X.R - Indent - R * 2, Y.C),
      v(X.R - R, Y.C),
      v(X.R + R, Y.C + R * 2),
      v(X.R + R, Y.C + R * 4),
    ],
  ], stroke, B.low))

  add(new GlyphGen('p', [
    [
      v(X.L + R, Y.S1),
      v(X.L + R, Y.C),
      v(X.R - R, Y.C),
      v(X.R - R, Y.CL),
      v(X.C, Y.L),
    ],
  ], stroke, B.low))
  add(new GlyphGen('q', [
    [
      v(X.R - R + Indent, Y.S1),
      v(X.R - R, Y.S1 + Indent),
      v(X.R - R, Y.C),
      v(X.L + R, Y.C),
      v(X.L + R, Y.CL),
      v(X.C, Y.L),
    ],
  ], stroke, B.low))

  add(new GlyphGen('r', [
    [
      v(X.L + R, Y.L),
      v(X.L + R, Y.C + R),
    ],
    [
      v(X.L, Y.C - Indent),
      v(X.R, Y.C),
    ],
  ], stroke, B.low))

  add(new GlyphGen('s', [
    [
      v(X.L, Y.L + R),
      v(X.R - R, Y.L + R),
      v(X.R - R, Y.CL + R / 2),
      v(X.L + R, Y.CL + R / 2),
      v(X.L + R, Y.C),
      v(X.R, Y.C),
    ],
  ], stroke, B.low))

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
  ], stroke, B.cap))

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
  ], stroke, B.low))
  add(new GlyphGen('ư', [
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
    [
      v(X.R - R, Y.C - R * 3),
      v(X.R - R, Y.C - R * 2),
      v(X.R + R * 2, Y.C + R),
      v(X.R + R * 2, Y.C + R * 3),
    ],
  ], stroke, B.low))

  add(new GlyphGen('v', [
    [
      v(X.L + R, Y.C + R),
      v(X.L + R, Y.L + R),
      v(X.L + R + Indent, Y.L + R),
      v(X.R, Y.C + R),
    ],
  ], stroke, B.low))

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
  ], stroke, B.low))

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
  ], stroke, B.low))

  add(new GlyphGen('y', [
    [
      v(X.L, Y.L),
      v(X.R, Y.C + R),
    ],
    [
      v(X.L, Y.C + R),
      v(X.C - R * 2, Y.CL + R / 2 + R * 2 * ((Y.C - Y.L + R) / (X.R - X.L + R))),
    ],
  ], stroke, B.low))

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
  ], stroke, B.low))

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
  ], stroke, B.cap))

  add(new GlyphGen('1', [
    [
      v(Q + X.L, Y.CH),
      v(Q + X.C, Y.H),
      v(Q + X.C, Y.L + R),
      v(Q + X.L, Y.L + R),
    ],
  ], stroke, B.cap))

  add(new GlyphGen('2', [
    [
      v(X.L, Y.H - R),
      v(X.R, Y.H - R),
      v(X.R, Y.CH),
      v(X.L, Y.CL),
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
    ],
  ], stroke, B.cap))

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
  ], stroke, B.cap))

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
  ], stroke, B.cap))

  add(new GlyphGen('5', [
    [
      v(X.R, Y.H - R),
      v(X.L, Y.H - R),
      v(X.L, Y.C),
      v(X.R - R, Y.C),
      v(X.R - R, Y.C - R * 1),
      v(X.L, Y.L + R),
    ],
  ], stroke, B.cap))

  add(new GlyphGen('6', [
    [
      v(X.R + R, Y.H - R),
      v(X.L, Y.H - R),
      v(X.L, Y.L + R),
      v(X.R, Y.L + R),
      v(X.R, Y.CL),
      v(X.L + R * 3, Y.C),
    ],
  ], stroke, B.cap))

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
  ], stroke, B.cap))

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
  ], stroke, B.cap))

  add(new GlyphGen('9', [
    [
      v(X.C - R * 1.5, Y.C),
      v(X.L + R, Y.C),
      v(X.L + R, Y.H - R),
      v(X.R, Y.H - R),
      v(X.R, Y.H - R * 3),
      v(X.L + Q, Y.L),
    ],
  ], stroke, B.cap))

  add(new GlyphGen('`', [
    [
      v(X.C - Indent, Y.H),
      v(X.C, Y.CH),
    ],
  ], stroke, B.auto))

  add(new GlyphGen('~', [
    [
      v(X.L, (Y.C + Y.CL) / 2 - Q * 0.75),
      v(X.C - Q * 3 / 4, (Y.C + Y.CL) / 2 + Q * 0.75),
      v(X.C + Q * 3 / 4, (Y.C + Y.CL) / 2 - Q * 0.75),
      v(X.R, (Y.C + Y.CL) / 2 + Q * 0.75),
    ],
  ], stroke, B.auto))

  add(new GlyphGen('!', [
    [
      v(X.C, Y.L + R * 3),
      v(X.C, Y.L),
    ],
    [
      v(X.C, Y.L + R * 6),
      v(X.C, Y.H),
    ],
  ], stroke, B.cap))

  add(new GlyphGen('¡', [
    [
      v(X.C, Y.H - R * 3),
      v(X.C, Y.H),
    ],
    [
      v(X.C, Y.H - R * 6),
      v(X.C, Y.L),
    ],
  ], stroke, B.cap))

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
  ], stroke, B.cap))
  add(new GlyphGen('¿', [
    [
      v(X.C + Q / 2, Y.H - R * 3),
      v(X.C + Q / 2, Y.H),
    ],
    [
      v(X.C + Q / 2, Y.H - R * 6),
      v(X.C + Q / 2, Y.C + R * 2),
      v(X.L + Q / 2, Y.CL + R * 4),
      v(X.L + Q / 2, Y.L + R),
      v(X.R, Y.L + R),
    ],

  ], stroke, B.cap))
  add(new GlyphGen('·', [
    [
      v(X.C - R, Y.C),
      v(X.C + R, Y.C),
    ],
  ], stroke, B.auto))

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
  ], stroke, B.cap))

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
  ], stroke, B.cap))

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
  ], stroke, B.cap))

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
  ], stroke, B.cap))

  add(new GlyphGen('^', [
    [
      v(X.L, Y.CH - Q),
      v(X.C, Y.H),
      v(X.R, Y.CH - Q),
    ],
  ], stroke, B.auto))

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
  ], stroke, B.cap))

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
  ], stroke, B.auto))

  add(new GlyphGen('-', [
    [
      v(X.L, (Y.C + Y.CL) / 2),
      v(X.R, (Y.C + Y.CL) / 2),
    ],
  ], stroke, B.auto))

  add(new GlyphGen('_', [
    [
      v(0, Y.L + R),
      v(1024, Y.L + R),
    ],
  ], stroke, B.auto))

  add(new GlyphGen('=', [
    [
      v(X.L, Y.C),
      v(X.R, Y.C),
    ],
    [
      v(X.L, Y.CL),
      v(X.R, Y.CL),
    ],
  ], stroke, B.auto))

  add(new GlyphGen('+', [
    [
      v(X.L, (Y.C + Y.CL) / 2),
      v(X.R, (Y.C + Y.CL) / 2),
    ],
    [
      v(X.C, Y.L + Q / 2 + R),
      v(X.C, Y.CH - Q / 2 - R),
    ],
  ], stroke, B.auto))

  add(new GlyphGen('(', [
    [
      v(X.C + Indent / 2, Y.H),
      v(X.C - Indent / 2, Y.H - Indent),
      v(X.C - Indent / 2, Y.S0 + Indent),
      v(X.C + Indent / 2, Y.S0),
    ],
  ], stroke, B.cap))

  add(new GlyphGen(')', [
    [
      v(X.C - Indent / 2, Y.H),
      v(X.C + Indent / 2, Y.H - Indent),
      v(X.C + Indent / 2, Y.S0 + Indent),
      v(X.C - Indent / 2, Y.S0),
    ],
  ], stroke, B.cap))

  add(new GlyphGen('[', [
    [
      v(X.C + Indent / 2, Y.H - R),
      v(X.C - Indent / 2, Y.H - R),
      v(X.C - Indent / 2, Y.S0 + R),
      v(X.C + Indent / 2, Y.S0 + R),
    ],
  ], stroke, B.cap))

  add(new GlyphGen(']', [
    [
      v(X.C - Indent / 2, Y.H - R),
      v(X.C + Indent / 2, Y.H - R),
      v(X.C + Indent / 2, Y.S0 + R),
      v(X.C - Indent / 2, Y.S0 + R),
    ],
  ], stroke, B.cap))

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
  ], stroke, B.cap))

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
  ], stroke, B.cap))

  add(new GlyphGen('|', [
    [
      v(X.C, Y.H),
      v(X.C, Y.S0),
    ],
  ], stroke, B.cap))

  add(new GlyphGen('/', [
    [
      v(X.R, Y.H),
      v(X.L, Y.S0),
    ],
  ], stroke, B.cap))

  add(new GlyphGen('\\', [
    [
      v(X.L, Y.H),
      v(X.R, Y.S0),
    ],
  ], stroke, B.cap))

  add(new GlyphGen(',', [
    [
      v(X.C, Y.L + R * 3),
      v(X.C, Y.L),
      v(X.C - R * 2, Y.L - R * 3),
    ],
  ], stroke, B.auto))

  add(new GlyphGen('.', [
    [
      v(X.C, Y.L + R * 3),
      v(X.C, Y.L),
    ],
  ], stroke, B.auto))

  add(new GlyphGen('<', [
    [
      v(X.R, Y.L + Q / 2 + R),
      v(X.L, (Y.L + Y.CH) / 2),
      v(X.R, Y.CH - Q / 2 - R),
    ],
  ], stroke, B.auto))

  add(new GlyphGen('>', [
    [
      v(X.L, Y.L + Q / 2 + R),
      v(X.R, (Y.L + Y.CH) / 2),
      v(X.L, Y.CH - Q / 2 - R),
    ],
  ], stroke, B.auto))

  add(new GlyphGen(':', [
    [
      v(X.C, Y.L + R * 3),
      v(X.C, Y.L),
    ],
    [
      v(X.C, Y.C + R),
      v(X.C, Y.C - R * 2),
    ],
  ], stroke, B.auto))

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
  ], stroke, B.auto))

  add(new GlyphGen('"', [
    [
      v(X.C - R * 2, Y.H),
      v(X.C - R * 2, Y.CH - R * 2),
    ],
    [
      v(X.C + R * 2, Y.H),
      v(X.C + R * 2, Y.CH - R * 2),
    ],
  ], stroke, B.cap))

  add(new GlyphGen("'", [
    [
      v(X.C, Y.H),
      v(X.C, Y.CH - R * 2),
    ],
  ], stroke, B.cap))

  const diaRisingAccent = addDiacritic(new GlyphGen('\u0301', [
    [
      v(X.C - Q, Y.L),
      v(X.C + Q, Y.CL),
    ],
  ], stroke, B.auto))
  autoMergeDiacritic(diaRisingAccent, {
    a: 'á',
    e: 'é',
    o: 'ó',
    u: 'ú',
    y: 'ý',
    ơ: 'ớ',
    ư: 'ứ',
  })
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
  ], stroke, B.low))
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
  ], stroke, B.cap))

  const diaFallingAccent = addDiacritic(new GlyphGen('\u0301', [
    [
      v(X.C - Q, Y.CL),
      v(X.C + Q, Y.L),
    ],
  ], stroke, B.auto))
  autoMergeDiacritic(diaFallingAccent, {
    a: 'à',
    e: 'è',
    i: 'ì',
    o: 'ò',
    u: 'ù',
    y: 'ỳ',
    ơ: 'ờ',
    ư: 'ừ',
  })

  const diaMacron = addDiacritic(new GlyphGen('\u0304', [
    [
      v(X.L, (Y.L + Y.CL) / 2),
      v(X.R, (Y.L + Y.CL) / 2),
    ],
  ], stroke, B.auto))
  autoMergeDiacritic(diaMacron, {
    a: 'ā',
    e: 'ē',
    i: 'ī',
    o: 'ō',
    u: 'ū',
  })

  const dia2Dots = addDiacritic(new GlyphGen('\u0308', [
    [
      v(X.C - R * 3, Y.L),
      v(X.C - R * 3, Y.L + R * 4),
    ],
    [
      v(X.C + R * 3, Y.L),
      v(X.C + R * 3, Y.L + R * 4),
    ],
  ], stroke, B.auto))
  autoMergeDiacritic(dia2Dots, {
    a: 'ä',
    e: 'ë',
    i: 'ï',
    o: 'ö',
    u: 'ü',
  })

  const diaCircumflex = addDiacritic(new GlyphGen('\u0302', [
    [
      v(X.C - Q, Y.L),
      v(X.C, Y.L + Q),
      v(X.C + Q, Y.L),
    ],
  ], stroke, B.auto))
  autoMergeDiacritic(diaCircumflex, {
    a: 'â',
    e: 'ê',
    i: 'î',
    o: 'ô',
    u: 'û',
  })

  const diaCaron = addDiacritic(new GlyphGen('\u030C', [
    [
      v(X.C - Q, Y.L + Q),
      v(X.C, Y.L),
      v(X.C + Q, Y.L + Q),
    ],
  ], stroke, B.auto))
  autoMergeDiacritic(diaCaron, {
    a: 'ǎ',
    e: 'ě',
    i: 'ǐ',
    o: 'ǒ',
    u: 'ǔ',
  })

  const diaBreve = addDiacritic(new GlyphGen('\u0306', [
    [
      v(X.C - Q, Y.L + Q),
      v(X.C - Q * 0.65, Y.L),
      v(X.C + Q * 0.65, Y.L),
      v(X.C + Q, Y.L + Q),
    ],
  ], stroke, B.auto))
  autoMergeDiacritic(diaBreve, {
    a: 'ă',
    e: 'ĕ',
    i: 'ĭ',
    o: 'ŏ',
    u: 'ŭ',
  })

  const diaTilde = addDiacritic(new GlyphGen('\u0303', [
    [
      v(X.L, Y.L),
      v(X.C - Q * 3 / 4, Y.L + Q * 1.25),
      v(X.C + Q * 3 / 4, Y.L),
      v(X.R, Y.L + Q * 1.25),
    ],
  ], stroke, B.auto))
  autoMergeDiacritic(diaTilde, {
    n: 'ñ',
    a: 'ã',
    e: 'ẽ',
    i: 'ĩ',
    o: 'õ',
    ơ: 'ỡ',
    u: 'ũ',
    ư: 'ữ',
    y: 'ỹ',
  })

  const diaCedilla = addDiacritic(new GlyphGen('\u0327', [
    [
      v(X.C - Q + R, Y.L),
      v(X.C - Q + R, Y.S0),
      v(X.C + Q, Y.S0),
      v(X.C - Q, Y.S1),
    ],
  ], stroke, B.auto), DiactriticLocation.BelowAttatch)
  autoMergeDiacritic(diaCedilla, {
    c: 'ç',
  })

  const diaDotBelow = addDiacritic(new GlyphGen('\u0323', [
    [
      v(X.C, -Y.L),
      v(X.C, -Y.L - R * 3),
    ],
  ], stroke, B.auto), DiactriticLocation.Below)
  autoMergeDiacritic(diaDotBelow, {
    a: 'ạ',
    e: 'ẹ',
    i: 'ị',
    o: 'ọ',
    ơ: 'ợ',
    u: 'ụ',
    ư: 'ự',
    y: 'ỵ',
  })

  const diaHookAbove = addDiacritic(new GlyphGen('\u0309', [
    [
      v(X.C, Y.L),
      v(X.C + Q, Y.CL - R),
      v(X.C - R, Y.CL - R),
    ],
  ], stroke, B.auto))
  autoMergeDiacritic(diaHookAbove, {
    a: 'ả',
    e: 'ẻ',
    i: 'ỉ',
    o: 'ỏ',
    ơ: 'ở',
    u: 'ủ',
    ư: 'ử',
    y: 'ỷ',
  })

  autoMergeDiacriticMulti(dia2Dots, [
    [diaMacron, {
      u: 'ǖ',
    }],
    [diaRisingAccent, {
      u: 'ǘ',
    }],
    [diaCaron, {
      u: 'ǚ',
    }],
    [diaFallingAccent, {
      u: 'ǜ',
    }],
  ])

  autoMergeDiacriticMulti(diaCircumflex, [
    [diaRisingAccent, {
      a: 'ấ',
      e: 'ế',
      o: 'ố',
    }],
    [diaFallingAccent, {
      a: 'ầ',
      e: 'ề',
      o: 'ồ',
    }],
    [diaDotBelow, {
      a: 'ậ',
      e: 'ệ',
      o: 'ộ',
    }],
    [diaTilde, {
      a: 'ẫ',
      e: 'ễ',
      o: 'ỗ',
    }],
    [diaHookAbove, {
      a: 'ẩ',
      e: 'ể',
      o: 'ổ',
    }],
  ])
  autoMergeDiacriticMulti(diaBreve, [
    [diaRisingAccent, {
      a: 'ắ',
    }],
    [diaFallingAccent, {
      a: 'ằ',
    }],
    [diaDotBelow, {
      a: 'ặ',
    }],
    [diaTilde, {
      a: 'ẵ',
    }],
    [diaHookAbove, {
      a: 'ẳ',
    }],
  ])

  return f
}
