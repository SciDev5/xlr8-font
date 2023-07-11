import React, { useId, useState } from 'react'
import { setFontBlob } from './fontloader'
import { type FontGen } from './font/FontGen'
import { GlyphEditor } from './font/GlyphEditor'
import { Font } from 'fonteditor-core'
import { generateFontXLR8 } from './font/xlr8-font'

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

const fontToEdit = generateFontXLR8(128)
// const fontToEdit = generateFont(50)
// const fontToEdit = generateFont(200)
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
      <p
        style={{ whiteSpace: 'pre', fontFamily: 'urlFont', fontSize: 40, padding: '1em', textDecoration: underlined ? 'underline' : 'unset' }}
        contentEditable
        spellCheck={false}
      >
        {`
> IGNITION IN 3...
2...
1...
!! LAUNCH !!
-------------------
  hello world
-------------------
ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz
\`'"~!?@#$%^&*()[]{}-+=_|\\/<>.,;:
ÑÇÁÄÉËÍÏÓÖÚÜ
ñçáäéëíïóöúü
Éí (combiners)
___________________
teleportation
Object@3FD03E7A
for (let i = 0; i < 10; i++) {
  console.log(":3c")
}
::::::::::::
@SciDev ~/usr/desktop>
  cat ./XLR8-mono.ttf
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
