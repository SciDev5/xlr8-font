import { Font, type FontEditor } from 'fonteditor-core'
import { type GlyphGen } from './GlyphGen'

export const EM_SIZE = 2048

export class FontGen {
  constructor (
    readonly displayName: string,
    readonly fontFamily: string,
    readonly fontVariant: string,
    readonly version: string,
    readonly fontWeight: number,
  ) {}

  readonly glyphs = new Map<string, GlyphGen>()

  compile (): FontEditor.Font {
    const font = new Font()

    font.set({
      version: 0.0,
      searchRange: 0,
      entrySelector: 0,
      numTables: 0,
      rangeShift: 0,
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
        unitsPerEm: EM_SIZE, // NOT AUTO
        version: 1,
        xMax: 0,
        xMin: 0,
        yMax: 0,
        yMin: 0,
      },
      cmap: {},
      glyf: [...this.glyphs.values()].map(v => v.toGlyph()),
      hhea: {
        version: 1,
        metricDataFormat: 0,
        ascent: 1900, // NOT AUTO (but apple specific so I don't care lmao)
        descent: -500, // NOT AUTO (but apple specific so I don't care lmao)
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
        fontFamily: this.fontFamily,
        fontSubFamily: this.fontVariant,
        uniqueSubFamily: `${this.fontFamily}-${this.fontVariant}`,
        version: this.version,
        copyright: 'for copyright information, see <TODO>',
        fullName: this.displayName,
        postScriptName: `${this.fontFamily}-${this.fontVariant}`,
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
      'OS/2': { // FIXME This is probably why it doesn't work
        achVendID: 'LMAO',
        ulCodePageRange1: 536871327,
        ulCodePageRange2: 0,
        sxHeight: 1082,
        sCapHeight: 1456,
        usDefaultChar: 32,
        usBreakChar: 32,
        usMaxContext: 3,
        version: 3,
        xAvgCharWidth: 1158,
        usWeightClass: 400,
        usWidthClass: 5,
        fsType: 0,
        ySubscriptXSize: 1434,
        ySubscriptYSize: 1331,
        ySubscriptXOffset: 0,
        ySubscriptYOffset: 287,
        ySuperscriptXSize: 1434,
        ySuperscriptYSize: 1331,
        ySuperscriptXOffset: 0,
        ySuperscriptYOffset: 977,
        yStrikeoutSize: 102,
        yStrikeoutPosition: 512,
        sFamilyClass: 0,
        bFamilyType: 2,
        bSerifStyle: 0,
        bWeight: 0,
        bProportion: 0,
        bContrast: 0,
        bStrokeVariation: 0,
        bArmStyle: 0,
        bLetterform: 0,
        bMidline: 0,
        bXHeight: 0,
        ulUnicodeRange1: 3758097151,
        ulUnicodeRange2: 1342185563,
        ulUnicodeRange3: 32,
        ulUnicodeRange4: 0,
        fsSelection: 64,
        usFirstCharIndex: 0,
        usLastCharIndex: 65533,
        sTypoAscender: 1536,
        sTypoDescender: -512,
        sTypoLineGap: 102,
        usWinAscent: 1946,
        usWinDescent: 512,
      },
    })

    if (this.ttfObjectURL != null) {
      URL.revokeObjectURL(this.ttfObjectURL)
    }
    this.ttfObjectURL = URL.createObjectURL(new Blob([font.write({ type: 'ttf', toBuffer: true })], { type: 'font/ttf' }))

    return font
  }

  private ttfObjectURL?: string
  private readonly ownedStyleElement = (() => {
    const elt = document.createElement('style')
    document.head.appendChild(elt)
    return elt
  })()

  updateFontFace (): void {
    if (this.ttfObjectURL != null) {
      this.ownedStyleElement.innerText = `
@font-face {
    font-family: ${this.fontFamily};
    font-weight: ${this.fontWeight};
    src: url('${this.ttfObjectURL}');
}
  `.trim()
    }
  }

  download (fileName: string): void {
    if (this.ttfObjectURL != null) {
      const downloadLink = document.createElement('a')
      downloadLink.download = fileName.trim() + (fileName.trim().endsWith('.ttf') ? '' : '.ttf')
      downloadLink.href = this.ttfObjectURL
      document.body.appendChild(downloadLink)
      downloadLink.click()
      downloadLink.remove()
    }
  }
}
