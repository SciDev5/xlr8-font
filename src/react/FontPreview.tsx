import React, { useId, useState } from 'react'
import { type FontGen } from '../font/FontGen'

export function FontPreview ({ font }: { font: FontGen }): JSX.Element {
  const id = useId()
  const [underlined, setUnderlined] = useState(false)

  return (
    <div>
      <label htmlFor={id}>underline: <input type='checkbox' id={id} checked={underlined} onChange={e => {
        setUnderlined(e.currentTarget.checked)
      }} /></label>
      <textarea
        style={{
          display: 'block',
          height: 'calc(100vh - 3em)',
          width: '70vw',
          fontFamily: `'${font.fontFamily}'`,
          fontSize: '2em',
          padding: '1em',
          textDecoration: underlined ? 'underline' : 'unset',
        }}
        defaultValue={`
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
      />
    </div>
  )
}
