export type PatternItem = {
  couponValue: number
  quantity: number
}

export type ChildPattern = {
  id: string
  name: string
  items: PatternItem[]
}

export type PackageMode = 'with_child' | 'fixed_no_child'
export type DeliveryMode = 'everyone' | 'selected' | 'member_tier'
