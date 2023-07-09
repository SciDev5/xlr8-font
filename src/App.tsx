import { Font } from 'fonteditor-core'
import React, { useId, useState } from 'react'
import { setFontBlob } from './fontloader'

async function recalculate (): Promise<void> {
  const buf = await fetch('http://localhost:3000/roboto.ttf').then(async v => await v.arrayBuffer())

  const r = Font.create(buf, { type: 'ttf' }).get()
  const f = Font.create()
  console.log('OS/2 - Roboto', r['OS/2'])

  f.set({
    version: r.version,
    searchRange: r.searchRange,
    entrySelector: r.entrySelector,
    numTables: r.numTables,
    rangeShift: r.rangeShift,
    head: {
      checkSumAdjustment: 0,
      created: Date.now(), // NOT AUTO
      modified: Date.now(), // NOT AUTO
      flags: 0b0000_0000_0001_1001, // NOT AUTO
      fontDirectionHint: 2, // Should be 2
      fontRevision: 0,
      glyphDataFormat: 0,
      indexToLocFormat: 0,
      lowestRecPPEM: 9, // NOT AUTO
      macStyle: 0,
      magickNumber: 0,
      unitsPerE: 0, // faulty
      unitsPerEm: 2048, // NOT AUTO
      version: 1,
      xMax: 0,
      xMin: 0,
      yMax: 0,
      yMin: 0,
    },
    cmap: {},
    glyf: r.glyf,
    hhea: {
      version: 1,
      metricDataFormat: 0,
      ascent: 1900, // 1900,  // NOT AUTO (but apple specific so I don't care lmao)
      descent: -500, // -500,  // NOT AUTO (but apple specific so I don't care lmao)
      lineGap: 0, // NOT AUTO (legacy)
      caretOffset: 0,
      caretSlopeRise: 1,
      caretSlopeRun: 0,

      advanceWidthMax: NaN,
      minLeftSideBearing: NaN,
      minRightSideBearing: NaN,
      numOfLongHorMetrics: NaN,
      reserved0: 0,
      reserved1: 0,
      reserved2: 0,
      reserved3: 0,
      xMaxExtent: NaN, // does not seem to be necessary, but not auto generated
    },
    maxp: {
      version: 1, // NOT AUTO
      maxZones: 1, // NOT AUTO
      maxComponentDepth: 0,
      maxComponentElements: 0,
      maxCompositeContours: 0,
      maxCompositePoints: 0,
      maxContours: 0,
      maxFunctionDefs: 0,
      maxPoints: 0,
      maxSizeOfInstructions: 0,
      maxStackElements: 0,
      maxStorage: 0,
      maxTwilightPoints: 0,
      numGlyphs: 0,
    },
    name: { // NOT AUTO
      fontFamily: 'something',
      fontSubFamily: 'regular',
      uniqueSubFamily: 'something-regular',
      version: '0.0.0',
      copyright: 'me ig',
      fullName: 'something but full name',
      postScriptName: 'something-regular',
    },
    post: {
      format: 3,
      isFixedPitch: 0,
      italicAngle: 0,
      maxMemType1: 0, // im hoping this isn't important
      maxMemType42: 0,
      minMemType1: 0,
      minMemType42: 0,
      underlinePosition: 0, // ignord
      underlineThickness: 100, // NOT AUTO

      postoints: NaN, // what the hell
    },
    'OS/2': { // All NOT AUTO, but it seems to work anyway ¯\_(ツ)_/¯
      achVendID: 'LMAO', // NOT AUTO
      ulCodePageRange1: 0,
      ulCodePageRange2: 0,
      sxHeight: 0,
      sCapHeight: 0,
      usDefaultChar: 0,
      usBreakChar: 0,
      usMaxContext: 0,
      version: 0,
      xAvgCharWidth: 0,
      usWeightClass: 0,
      usWidthClass: 0,
      fsType: 0,
      ySubscriptXSize: 0,
      ySubscriptYSize: 0,
      ySubscriptXOffset: 0,
      ySubscriptYOffset: 0,
      ySuperscriptXSize: 0,
      ySuperscriptYSize: 0,
      ySuperscriptXOffset: 0,
      ySuperscriptYOffset: 0,
      yStrikeoutSize: 0,
      yStrikeoutPosition: 0,
      sFamilyClass: 0,
      bFamilyType: 0,
      bSerifStyle: 0,
      bWeight: 0,
      bProportion: 0,
      bContrast: 0,
      bStrokeVariation: 0,
      bArmStyle: 0,
      bLetterform: 0,
      bMidline: 0,
      bXHeight: 0,
      ulUnicodeRange1: 0,
      ulUnicodeRange2: 0,
      ulUnicodeRange3: 0,
      ulUnicodeRange4: 0,
      fsSelection: 0,
      usFirstCharIndex: 0,
      usLastCharIndex: 0,
      sTypoAscender: 0,
      sTypoDescender: 0,
      sTypoLineGap: 0,
      usWinAscent: 0,
      usWinDescent: 0,
    },
  })

  let fontBuffer = f.write({ toBuffer: true, type: 'ttf' }) as ArrayBuffer
  fontBuffer = Font.create(fontBuffer, { type: 'ttf' }).write({ toBuffer: true, type: 'ttf' }) as ArrayBuffer

  const reco = Font.create(fontBuffer, { type: 'ttf' }).get()
  console.log('reformatted', reco)
  // @ts-expect-error dont care
  console.log('mismatches', Object.keys(reco['OS/2']).filter(k => reco['OS/2'][k] !== r['OS/2'][k]).map(k => [reco['OS/2'][k], r['OS/2'][k]]))

  setFontBlob(new Blob([fontBuffer], { type: 'font/ttf' }))
}

function App (): JSX.Element {
  recalculate().catch(e => { throw e })

  const id = useId()
  const [underlined, setUnderlined] = useState(false)

  return (
    <div className="App" style={{ fontFamily: 'monospace' }}>
      <button onClick={() => {
        recalculate().catch(e => { throw e })
      }}>recalculate</button>
      <p style={{ whiteSpace: 'pre', fontFamily: 'urlFont', padding: '1em', textDecoration: underlined ? 'underline' : 'unset' }}>
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
    </div>
  )
}

export default App
