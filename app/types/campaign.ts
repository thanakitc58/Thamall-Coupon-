export type QuotaLimits = {
  perCampaign: number
  perDay: number
  perUser: number
}

export type CampaignStatus = 'Active' | 'Draft' | 'Inactive'

export type CouponItem = {
  id: string
  name: string
  description: string
  image: string
  inheritQuota: boolean
  quota: QuotaLimits
}

export type CouponGroup = {
  id: string
  name: string
  description: string
  chooseCount: number
  coupons: CouponItem[]
  inheritCampaignQuota: boolean
  quota: QuotaLimits
}

export type Campaign = {
  name: string
  description: string
  startDate: string
  endDate: string
  status: CampaignStatus
  quota: QuotaLimits
}

export function emptyQuota(): QuotaLimits {
  return { perCampaign: 0, perDay: 0, perUser: 0 }
}

export function cloneQuota(quota: QuotaLimits): QuotaLimits {
  return { ...quota }
}

export function capQuotaToParent(quota: QuotaLimits, parent: QuotaLimits): QuotaLimits {
  return {
    perCampaign: Math.min(quota.perCampaign, parent.perCampaign),
    perDay: Math.min(quota.perDay, parent.perDay),
    perUser: Math.min(quota.perUser, parent.perUser)
  }
}

export function createId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

export const COUPON_IMAGE_POOL = [
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80&h=80&fit=crop'
]
