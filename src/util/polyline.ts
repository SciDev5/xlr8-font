import { Line } from './Line'
import { Vec2 } from './Vec2'

export function outlinePolyline (points: Vec2[], width: number): Vec2[] {
  if (points.length <= 1) {
    throw new Error('attempt to outline empty polyline')
  }
  const segments = new Array(points.length - 1).fill(0).map((_, i) => (
    new Line(points[i], points[i + 1])
  ))

  const positiveSegments = segments.map(v => v.shiftedAlongNormal(width / 2))
  const negativeSegments = segments.map(v => v.shiftedAlongNormal(-width / 2))

  const positiveStrip = rejoinSegmentStrip(positiveSegments, points, width)
  const negativeStrip = rejoinSegmentStrip(negativeSegments, points, width)

  return [...positiveStrip, ...negativeStrip.reverse()]
}

function rejoinSegmentStrip (segments: Line[], points: Vec2[], width: number): Vec2[] {
  // const radius = width / 2
  const strip: Vec2[] = []

  // strip.push(segments[0].p0)
  strip.push(Line.intersection(
    segments[0],
    new Line(
      points[0],
      points[0].add(
        Math.abs(segments[0].tangent().y) > Math.sqrt(0.4) ? new Vec2(1, 0) : new Vec2(0, 1),
      ),
    ),
  ))

  for (let i = 0; i < segments.length - 1; i++) {
    const p0 = segments[i + 0]
    const p1 = segments[i + 1]
    const isOuterOutlineOfBend = pointIsBetweenChainedSegments(p0, p1, points[i + 1])
    if (isOuterOutlineOfBend) {
      // outer is miter or bevel depending on angle

      // outfacing corner normal. it's name is norman, norm for short. everyone say hi to norm
      // const norm = p0.tangent().add(p1.reversed().tangent()).normalize()

      const p0t = p0.tangent()
      const p1t = p1.tangent().scale(-1)

      const DH = 0.5
      const horizBevelSuitable = Math.abs(p0t.y) > DH && Math.abs(p1t.y) > DH && ((p0t.y > 0) === (p1t.y > 0))
      const DV = Math.sqrt(0.501)
      const vertBevelSuitable = Math.abs(p0t.x) > DV && Math.abs(p1t.x) > DV && ((p0t.x > 0) === (p1t.x > 0))

      if (horizBevelSuitable || vertBevelSuitable) {
        const p = points[i + 1] // .add(norm.scale(radius))
        const limitline = new Line(p, p.add(horizBevelSuitable ? new Vec2(1, 0) : new Vec2(0, 1)))

        strip.push(Line.intersection(p0, limitline))
        strip.push(Line.intersection(p1, limitline))
      } else {
        strip.push(Line.intersection(p0, p1))
      }
    } else {
      // inner is miter
      strip.push(Line.intersection(p0, p1))
    }
  }

  // strip.push(segments[segments.length - 1].p1)
  strip.push(Line.intersection(
    segments[segments.length - 1],
    new Line(points[points.length - 1],
      points[points.length - 1].add(
        Math.abs(segments[segments.length - 1].tangent().y) > Math.sqrt(0.4) ? new Vec2(1, 0) : new Vec2(0, 1),
      ),
    ),
  ))

  return strip
}

/** Returns true if `p` is on the inside of the angle formed by the intersection of `a` and
   * `b` (where `a.p1`, and `b.p0` are near/facing the intersection point)
   */
function pointIsBetweenChainedSegments (a_: Line, b: Line, p: Vec2): boolean {
  // both `p0`s pointing towards intersection, makes math easier
  const a = a_.reversed()

  // points in the direction in between both lines
  const nab = a.tangent().add(b.tangent())
  // line normals
  const za = a.normal()
  const zb = b.normal()

  return (
  // if {a and b}.p0 and nab (inside facing) are on the same side of the line
    p.sub(a.p0).dot(za) * nab.dot(za) > 0 &&
      p.sub(b.p0).dot(zb) * nab.dot(zb) > 0
  )
}

// /**
//  * Angle between `a` and `b` (where `a.p1`, and `b.p0` are near/facing the
//  * intersection point)
//  */
// function angleBetweenChainedSegments (a: Line, b: Line): number {
//   return Math.acos(-a.tangent().dot(b.tangent()))
// }
