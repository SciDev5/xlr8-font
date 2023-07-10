import React, { useId, useState } from 'react'
import { setFontBlob } from './fontloader'
import { type FontGen } from './font/FontGen'
import { GlyphEditor } from './font/GlyphEditor'
import { Font } from 'fonteditor-core'
import { generateFont } from './font/myfont'

function r (): void {
  (async () => {
    const buf = await fetch('http://localhost:3000/roboto.ttf').then(async v => await v.arrayBuffer())

    const r = Font.create(buf, { type: 'ttf' }).get()
    console.log('OS/2 - Roboto', r['OS/2'])
  })().catch(e => { throw e })
}

function recalculate (fontGen: FontGen): void {
  const font = Font.create(fontGen.compile().write({ type: 'ttf', toBuffer: true }) as ArrayBuffer, { type: 'ttf' })

  console.log(font.get())

  const buf = font.write({ type: 'ttf', toBuffer: true }) as ArrayBuffer

  // new Uint8Array(buf)[12] = 0 // invalidate the OS/2 table

  setFontBlob(new Blob([buf], { type: 'font/ttf' }))
}

const fontToEdit = generateFont(150)
function App (): JSX.Element {
  recalculate(fontToEdit)
  r()

  const id = useId()
  const [underlined, setUnderlined] = useState(false)

  return (
    <div className="App" style={{ fontFamily: 'monospace' }}>
      {/* <button onClick={() => {
        recalculate(fontToEdit)
      }}>recalculate</button> */}
      <p style={{ whiteSpace: 'pre', fontFamily: 'urlFont', fontSize: 40, padding: '1em', textDecoration: underlined ? 'underline' : 'unset' }}>
        {`
abcdefghijklmnopqrstuvwxyz
ABCDEFGHIJKLMNOPQRSTUVWXYZ
0123456789
!@#$%^&*(){}[]\`\\/|~?.,<>=+-_ñÑçÇ :;'"
        `.trim()}
      </p>
      <label htmlFor={id}>underline: <input type='checkbox' id={id} checked={underlined} onChange={e => {
        setUnderlined(e.currentTarget.checked)
      }}/></label>
      <GlyphEditor font={fontToEdit} editingGlyph='K' onChange={() => { recalculate(fontToEdit) }}/>
    </div>
  )
}

export default App
