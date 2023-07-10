export class Vec2 {
  constructor (public x: number, public y: number) {}

  add (other: Vec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y)
  }

  sub (other: Vec2): Vec2 {
    return new Vec2(this.x - other.x, this.y - other.y)
  }

  addSelf (other: Vec2): this {
    this.x += other.x
    this.y += other.y
    return this
  }

  subSelf (other: Vec2): void {
    this.x -= other.x
    this.y -= other.y
  }

  scale (scalar: number): Vec2 {
    return new Vec2(this.x * scalar, this.y * scalar)
  }

  scaleSelf (scalar: number): this {
    this.x *= scalar
    this.y *= scalar
    return this
  }

  dot (other: Vec2): number {
    return this.x * other.x + this.y * other.y
  }

  magnitude (): number {
    return Math.sqrt(this.magSq())
  }

  magSq (): number {
    return this.x * this.x + this.y * this.y
  }

  normalize (): Vec2 {
    const magnitude = this.magnitude()
    if (magnitude !== 0) {
      return new Vec2(this.x / magnitude, this.y / magnitude)
    } else {
      return new Vec2(0, 0)
    }
  }

  normalizeSelf (): this {
    const magnitude = this.magnitude()
    if (magnitude !== 0) {
      this.x /= magnitude
      this.y /= magnitude
    }
    return this
  }

  copy (): Vec2 {
    return new Vec2(this.x, this.y)
  }

  copyFrom (from: Vec2): this {
    this.x = from.x
    this.y = from.y
    return this
  }

  static zero (): Vec2 {
    return new Vec2(0, 0)
  }
}
