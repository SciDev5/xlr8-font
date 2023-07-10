import { Vec2 } from './Vec2'

export class Line {
  constructor (readonly p0: Vec2, readonly p1: Vec2) {}

  static intersection (a: Line, b: Line): Vec2 {
    const x1 = a.p0.x
    const x2 = a.p1.x
    const x3 = b.p0.x
    const x4 = b.p1.x
    const y1 = a.p0.y
    const y2 = a.p1.y
    const y3 = b.p0.y
    const y4 = b.p1.y
    const x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4))
    const y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4))
    return new Vec2(x, y)
  }

  tangent (): Vec2 {
    return this.p1.sub(this.p0).normalize()
  }

  normal (): Vec2 {
    const { x, y } = this.tangent()
    return new Vec2(-y, x)
  }

  withEndpointProjectedOnto (other: Line, replaceWhich: 0 | 1): Line {
    const intersection = Line.intersection(this, other)
    return replaceWhich === 1
      ? new Line(this.p0, intersection)
      : new Line(intersection, this.p1)
  }

  shiftedAlongNormal (amt: number): Line {
    const off = this.normal().scale(amt)
    return new Line(this.p0.add(off), this.p1.add(off))
  }

  reversed (): Line {
    return new Line(this.p1, this.p0)
  }
}
