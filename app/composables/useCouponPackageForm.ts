import type {
  ChildPattern,
  DeliveryMode,
  PackageMode,
  PatternItem
} from '~/types/coupon-package'

export function useCouponPackageForm() {
  const toast = useToast()

  const packageName = ref('Summer Package 1000')
  const totalValue = ref(1000)
  const description = ref('สิทธิ์รวม 1,000 บาท — ลูกค้าเลือกแบ่งเป็น Child Pattern ตามที่กำหนด')

  const patterns = ref<ChildPattern[]>([
    {
      id: '1',
      name: 'รูปแบบที่ 1',
      items: [{ couponValue: 1000, quantity: 1 }]
    },
    {
      id: '2',
      name: 'รูปแบบที่ 2',
      items: [{ couponValue: 500, quantity: 2 }]
    },
    {
      id: '3',
      name: 'รูปแบบที่ 3',
      items: [
        { couponValue: 100, quantity: 5 },
        { couponValue: 500, quantity: 1 }
      ]
    }
  ])

  const couponOptions = [
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
    { label: '500', value: 500 },
    { label: '1000', value: 1000 }
  ]

  const packageMode = ref<PackageMode>('with_child')

  const packageModeOptions = [
    {
      value: 'with_child' as const,
      label: 'ส่งแบบมี Child Patterns',
      description: 'แอดมินกำหนดรูปแบบการแบ่งไว้ล่วงหน้า ลูกค้าเลือกได้เฉพาะรูปแบบที่ตั้งไว้'
    },
    {
      value: 'fixed_no_child' as const,
      label: 'ส่งแบบ Fixed (ไม่มี Child)',
      description: 'ส่งมูลค่าคงที่ไปเลย เช่น 1,000 บาท — ลูกค้าไปเลือกแบ่งเองทีหลัง (ไม่ต้องสร้าง Pattern)'
    }
  ]

  const deliveryMode = ref<DeliveryMode | undefined>(undefined)

  const deliveryOptions = [
    {
      value: 'everyone' as const,
      label: '1. ส่งทุกคน',
      description: 'มอบ Gift Card ให้ผู้ใช้งานทั้งหมดในระบบ'
    },
    {
      value: 'selected' as const,
      label: '2. ส่งเฉพาะบางคน',
      description: 'เลือกผู้รับรายบุคคลจากรายชื่อ'
    },
    {
      value: 'member_tier' as const,
      label: '3. ส่งให้เมมเบอร์ตามระดับ',
      description: 'เลือกตามระดับสมาชิก เช่น Bronze, Silver, Gold'
    }
  ]

  const mockUsers = [
    { label: 'สมชาย ใจดี (somchai@example.com)', value: 'u1' },
    { label: 'สมหญิง รักดี (somying@example.com)', value: 'u2' },
    { label: 'วิชัย พาณิชย์ (wichai@example.com)', value: 'u3' },
    { label: 'นภา สุขใจ (napa@example.com)', value: 'u4' },
    { label: 'อารี มีสุข (aree@example.com)', value: 'u5' }
  ]

  const selectedUserIds = ref<string[]>([])

  const memberTiers = [
    { label: 'Bronze', value: 'bronze', description: 'สมาชิกระดับบรอนซ์' },
    { label: 'Silver', value: 'silver', description: 'สมาชิกระดับซิลเวอร์' },
    { label: 'Gold', value: 'gold', description: 'สมาชิกระดับโกลด์' }
  ]

  const selectedTiers = ref<string[]>([])

  const isPatternModalOpen = ref(false)
  const isDeleteModalOpen = ref(false)
  const editingPatternId = ref<string | null>(null)
  const deleteTargetId = ref<string | null>(null)

  const draftName = ref('')
  const draftItems = ref<PatternItem[]>([
    { couponValue: 100, quantity: 1 }
  ])

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US').format(value)

  const itemTotal = (item: PatternItem) => item.couponValue * item.quantity

  const patternTotal = (pattern: ChildPattern) =>
    pattern.items.reduce((sum, item) => sum + itemTotal(item), 0)

  const draftTotal = computed(() =>
    draftItems.value.reduce((sum, item) => sum + itemTotal(item), 0)
  )

  const draftMatchesParent = computed(
    () => draftTotal.value === Number(totalValue.value)
  )

  const projectedTotal = computed(() => Number(totalValue.value) || 0)

  const numberOfPatterns = computed(() => patterns.value.length)

  const hasParentValue = computed(() => Number(totalValue.value) > 0)
  const hasPatterns = computed(() => patterns.value.length > 0)
  const allPatternsMatchParent = computed(() =>
    patterns.value.length > 0
    && patterns.value.every(pattern => patternTotal(pattern) === Number(totalValue.value))
  )

  const isFixedNoChild = computed(() => packageMode.value === 'fixed_no_child')
  const isWithChild = computed(() => packageMode.value === 'with_child')

  const patternsReady = computed(() => {
    if (isFixedNoChild.value) {
      return true
    }

    return hasPatterns.value && allPatternsMatchParent.value
  })

  const hasDeliveryTarget = computed(() => {
    if (!deliveryMode.value) {
      return false
    }

    if (deliveryMode.value === 'everyone') {
      return true
    }

    if (deliveryMode.value === 'selected') {
      return selectedUserIds.value.length > 0
    }

    return selectedTiers.value.length > 0
  })

  const deliverySummary = computed(() => {
    if (deliveryMode.value === 'everyone') {
      return 'ส่งให้ทุกคนในระบบ'
    }

    if (deliveryMode.value === 'selected') {
      return `ส่งเฉพาะ ${selectedUserIds.value.length} คนที่เลือก`
    }

    if (deliveryMode.value === 'member_tier') {
      const labels = memberTiers
        .filter(tier => selectedTiers.value.includes(tier.value))
        .map(tier => tier.label)

      return labels.length
        ? `ส่งให้เมมเบอร์: ${labels.join(', ')}`
        : 'ยังไม่ได้เลือกระดับสมาชิก'
    }

    return 'ยังไม่ได้เลือกวิธีส่ง'
  })

  const packageModeSummary = computed(() =>
    isFixedNoChild.value
      ? `Fixed ${formatNumber(projectedTotal.value)} THB — ไม่มี Child (ลูกค้าแบ่งเอง)`
      : 'มี Child Patterns ให้ลูกค้าเลือก'
  )

  const canSavePackage = computed(
    () =>
      !!packageName.value.trim()
      && hasParentValue.value
      && patternsReady.value
      && hasDeliveryTarget.value
  )

  const isEditingPattern = computed(() => editingPatternId.value !== null)

  const deleteTarget = computed(() =>
    patterns.value.find(pattern => pattern.id === deleteTargetId.value) ?? null
  )

  function resetDraft() {
    draftName.value = `รูปแบบที่ ${patterns.value.length + 1}`
    draftItems.value = [{ couponValue: 100, quantity: 1 }]
    editingPatternId.value = null
  }

  function openAddPattern() {
    resetDraft()
    isPatternModalOpen.value = true
  }

  function openEditPattern(pattern: ChildPattern) {
    editingPatternId.value = pattern.id
    draftName.value = pattern.name
    draftItems.value = pattern.items.map(item => ({
      couponValue: item.couponValue,
      quantity: item.quantity
    }))
    isPatternModalOpen.value = true
  }

  function addDraftRow() {
    draftItems.value.push({ couponValue: 100, quantity: 1 })
  }

  function removeDraftRow(index: number) {
    if (draftItems.value.length === 1) {
      return
    }

    draftItems.value.splice(index, 1)
  }

  function closePatternModal() {
    isPatternModalOpen.value = false
    editingPatternId.value = null
  }

  function savePattern() {
    if (!draftName.value.trim()) {
      toast.add({
        title: 'ต้องระบุชื่อรูปแบบ',
        color: 'warning',
        icon: 'i-lucide-alert-triangle'
      })
      return
    }

    if (draftItems.value.some(item => !item.quantity || item.quantity < 1)) {
      toast.add({
        title: 'จำนวนไม่ถูกต้อง',
        description: 'แต่ละแถวต้องมีจำนวนอย่างน้อย 1 ใบ',
        color: 'warning',
        icon: 'i-lucide-alert-triangle'
      })
      return
    }

    const payload: ChildPattern = {
      id: editingPatternId.value ?? String(Date.now()),
      name: draftName.value.trim(),
      items: draftItems.value.map(item => ({
        couponValue: Number(item.couponValue),
        quantity: Number(item.quantity)
      }))
    }

    if (editingPatternId.value) {
      const index = patterns.value.findIndex(
        pattern => pattern.id === editingPatternId.value
      )

      if (index !== -1) {
        patterns.value[index] = payload
      }

      toast.add({
        title: 'อัปเดตรูปแบบแล้ว',
        description: `อัปเดต ${payload.name} เรียบร้อย`,
        color: 'success',
        icon: 'i-lucide-check'
      })
    } else {
      patterns.value.push(payload)

      toast.add({
        title: 'เพิ่มรูปแบบแล้ว',
        description: `เพิ่ม ${payload.name} เข้าแพ็กเกจแล้ว`,
        color: 'success',
        icon: 'i-lucide-plus'
      })
    }

    closePatternModal()
  }

  function openDeletePattern(id: string) {
    deleteTargetId.value = id
    isDeleteModalOpen.value = true
  }

  function closeDeleteModal() {
    isDeleteModalOpen.value = false
    deleteTargetId.value = null
  }

  function confirmDeletePattern() {
    const target = deleteTarget.value

    if (!target) {
      closeDeleteModal()
      return
    }

    patterns.value = patterns.value.filter(pattern => pattern.id !== target.id)

    toast.add({
      title: 'ลบรูปแบบแล้ว',
      description: `ลบ ${target.name} ออกแล้ว`,
      color: 'warning',
      icon: 'i-lucide-trash-2'
    })

    closeDeleteModal()
  }

  function onPackageModeChange(mode?: PackageMode) {
    if (mode === 'fixed_no_child') {
      description.value
        = 'ส่งมูลค่าคงที่ให้ลูกค้า — ลูกค้าเลือกแบ่งคูปองเองทีหลัง (ไม่สร้าง Child Pattern)'
    } else {
      description.value
        = 'สิทธิ์รวม — ลูกค้าเลือกแบ่งเป็น Child Pattern ตามที่แอดมินกำหนดไว้'
    }
  }

  function onDeliveryModeChange(mode?: DeliveryMode) {
    if (mode !== 'selected') {
      selectedUserIds.value = []
    }

    if (mode !== 'member_tier') {
      selectedTiers.value = []
    }
  }

  function cancelPackage() {
    toast.add({
      title: 'Cancelled',
      description: 'Changes were discarded (mock).',
      color: 'neutral',
      icon: 'i-lucide-x'
    })
  }

  function savePackage() {
    if (!canSavePackage.value) {
      toast.add({
        title: 'Cannot save package',
        description: isFixedNoChild.value
          ? 'กรุณาตั้งมูลค่า Fixed และวิธีส่ง Gift Card ให้ครบ'
          : 'กรุณาตั้ง Parent, Child Patterns และวิธีส่ง Gift Card ให้ครบ',
        color: 'warning',
        icon: 'i-lucide-alert-triangle'
      })
      return
    }

    toast.add({
      title: 'Package saved & Gift Card queued',
      description: `${packageName.value} — ${packageModeSummary.value} | ${deliverySummary.value} (demo mock)`,
      color: 'success',
      icon: 'i-lucide-gift'
    })
  }

  return {
    packageName,
    totalValue,
    description,
    patterns,
    couponOptions,
    packageMode,
    packageModeOptions,
    deliveryMode,
    deliveryOptions,
    mockUsers,
    selectedUserIds,
    memberTiers,
    selectedTiers,
    isPatternModalOpen,
    isDeleteModalOpen,
    draftName,
    draftItems,
    formatNumber,
    itemTotal,
    patternTotal,
    draftTotal,
    draftMatchesParent,
    projectedTotal,
    numberOfPatterns,
    hasParentValue,
    hasPatterns,
    allPatternsMatchParent,
    isFixedNoChild,
    isWithChild,
    hasDeliveryTarget,
    deliverySummary,
    packageModeSummary,
    canSavePackage,
    isEditingPattern,
    deleteTarget,
    openAddPattern,
    openEditPattern,
    addDraftRow,
    removeDraftRow,
    closePatternModal,
    savePattern,
    openDeletePattern,
    closeDeleteModal,
    confirmDeletePattern,
    onPackageModeChange,
    onDeliveryModeChange,
    cancelPackage,
    savePackage
  }
}
