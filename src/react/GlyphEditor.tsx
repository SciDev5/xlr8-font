import React, { useState, useEffect } from 'react'
import { type FontGen, EM_SIZE } from '../font/FontGen'
import { type GlyphGen } from '../font/GlyphGen'
import { Vec2 } from '../util/Vec2'

export function GlyphEditor ({ font, onChange, editingGlyph }: { font: FontGen, onChange: () => void, editingGlyph: string }): JSX.Element {
  const [path, setPath] = useState<Vec2[][] | null>(font.glyphs.get(editingGlyph)?.path ?? null)

  useEffect(() => {
    setPath(font.glyphs.get(editingGlyph)?.path ?? null)
  }, [font, editingGlyph])

  const glyph = font.glyphs.get(editingGlyph)

  return (<div>
    glyph {editingGlyph}<br/>
    {(path != null && glyph != null)
      ? (<GlyphPathEditor
        path={path}
        glyph={glyph}
        onPathChange={(newPath) => {
          setPath(newPath)
          if (glyph != null) {
            glyph.path = newPath
          }
          onChange()
        }}
      />)
      : (<>
        no glyph to edit
      </>)
    }
  </div>)
}

function GlyphPathEditor ({ path, glyph, onPathChange }: { path: Vec2[][], glyph: GlyphGen, onPathChange: (path: Vec2[][]) => void }): JSX.Element {
  return (<div>
    <svg width={300} height={400}>
      <path
        fill='#004477'
        d={glyph.getContourSVGPath({ pos: new Vec2(25, 100), height: 200 })}
      />
      <line
        x1={0}
        x2={300}
        y1={100}
        y2={100}
        stroke='#00ffff77'
      />
      <line
        x1={0}
        x2={300}
        y1={300}
        y2={300}
        stroke='#00ffff77'
      />
      <line
        x1={25}
        x2={25}
        y1={0}
        y2={400}
        stroke='#ff00ff77'
      />
      <line
        x1={25}
        x2={25}
        y1={0}
        y2={400}
        stroke='#ff00ff77'
      />
      <line
        x1={25 + glyph.advanceWidth / EM_SIZE * 200}
        x2={25 + glyph.advanceWidth / EM_SIZE * 200}
        y1={0}
        y2={400}
        stroke='#ff000077'
      />
    </svg>
  </div>)
}
