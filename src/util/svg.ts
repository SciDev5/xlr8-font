import { type Vec2 } from './Vec2'

export const SVGPath = {
  polyLine (points: Vec2[]): string {
    const parts: string[] = []
    for (let i = 0; i < points.length; i++) {
      const { x, y } = points[i]
      parts.push(`${i > 0 ? 'L' : 'M'} ${x} ${y}`)
    }
    return parts.join(' ')
  },
}
