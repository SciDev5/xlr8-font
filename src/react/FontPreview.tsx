import React, { useId, useState } from 'react'
import { type FontGen } from '../font/FontGen'

export function FontPreview ({ font }: { font: FontGen }): JSX.Element {
  const idU = useId()
  const idS = useId()
  const [underlined, setUnderlined] = useState(false)
  const [useSpellcheck, setUseSpellcheck] = useState(true)

  return (
    <div>
      <label htmlFor={idU}>{'underline: '}<input type='checkbox' id={idU} checked={underlined} onChange={e => {
        setUnderlined(e.currentTarget.checked)
      }} />{' '}</label>
      {'- '}
      <label htmlFor={idS}>{'spellcheck: '}<input type='checkbox' id={idS} checked={useSpellcheck} onChange={e => {
        setUseSpellcheck(e.currentTarget.checked)
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
        spellCheck={useSpellcheck}
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




::::::::::::
Language Test Plates

spanish / french - español / français
-------------------------------------
aáä / AÁÄ
eéë / EÉË
iíï / IÍÏ
oóö / OÓÖ
uúü / UÚÜ
ñÑ ¿¡

chinese (pinyin) - zhōngwén (pīnyīn)
------------------------------------
aeiouü / AEIOUÜ
āēīōūǖ / ĀĒĪŌŪǕ
áéíóúǘ / ÁÉÍÓÚǗ
ǎěǐǒǔǚ / ǍĚǏǑǓǙ
àèìòùǜ / ÀÈÌÒÙǛ

vietnamese - tiếng việt
-----------------------
đ      / Đ
aàáạãả / AÀÁẠÃẢ
ăằắặẵẳ / ĂẰẮẶẴẲ
âầấậẫẩ / ÂẦẤẬẪẨ
eèéẹẽẻ / EÈÉẸẼẺ
êềếệễể / ÊỀẾỆỄỂ
iìíịĩỉ / IÌÍỊĨỈ
oòóọõỏ / OÒÓỌÕỎ
ôồốộỗổ / ÔỒỐỘỖỔ
ơờớợỡở / ƠỜỚỢỠỞ
uùúụũủ / UÙÚỤŨỦ
ưừứựữử / ƯỪỨỰỮỬ
yỳýỵỹỷ / YỲÝỴỸỶ
        `.trim()}
      />
    </div>
  )
}
