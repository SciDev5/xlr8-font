import React, { useEffect, useState } from 'react'
import { type FontGen } from './font/FontGen'
import { GlyphEditor } from './react/GlyphEditor'
import { generateFontXLR8 } from './font/xlr8-font'
import { FontPreview } from './react/FontPreview'

function recalculate (fontGen: FontGen): void {
  fontGen.compile()
  fontGen.updateFontFace()
}

const fontToEdit = generateFontXLR8(125, 400)
// const fontToEdit = generateFontXLR8(50, 100)
// const fontToEdit = generateFontXLR8(75, 200)
// const fontToEdit = generateFontXLR8(175, 700)
// const fontToEdit = generateFontXLR8(200, 900)

function App (): JSX.Element {
  useEffect(() => {
    recalculate(fontToEdit)
  }, [])

  const [editingGlyph, setEditingGlyph] = useState('a')
  const [editingGlyphValid, setEditingGlyphValid] = useState(editingGlyph)

  return (
    <div className="App" style={{ fontFamily: 'monospace', display: 'flex', flexDirection: 'row' }}>
      <FontPreview font={fontToEdit} />
      <div style={{ flex: '0.5 1' }}>
        <button onClick={() => {
          const filename = prompt('file name?')
          if (filename != null) {
            fontToEdit.download(filename)
          }
        }}>download font</button>
        <input value={editingGlyph} onChange={e => {
          if (e.currentTarget.value.length <= 1) setEditingGlyph(e.currentTarget.value)
          if (e.currentTarget.value.length === 1) setEditingGlyphValid(e.currentTarget.value)
        }} />
        <GlyphEditor font={fontToEdit} editingGlyph={editingGlyphValid} onChange={() => { recalculate(fontToEdit) }} />
      </div>
    </div>
  )
}

export default App
