const styleTag = document.createElement('style')
document.head.appendChild(styleTag)
const downloadTag = document.createElement('a')
downloadTag.download = 'download.ttf'
downloadTag.innerText = 'download'
document.body.appendChild(downloadTag)

export function setFontUrl (url: string): void {
  downloadTag.href = url
  styleTag.innerText = `
body {
  color: #0000ff;
}
@font-face {
    font-family: urlFont;
    src: url('${url}');
}
`.trim()
}
export function setFontBlob (blob: Blob): void {
  setFontUrl(URL.createObjectURL(blob))
}
