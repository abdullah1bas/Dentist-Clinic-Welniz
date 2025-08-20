import { create } from "zustand"

export const useConstantsStore = create(() => ({
  categories: ["علاج تحفظي", "علاج جذور", "تقويم أسنان", "جراحة فم", "تركيبات"],
  doctors: ["د. محمد صادق", "د. سارة محمود", "د. أحمد علي"],
  expenseTypes: ["مواد العيادة", "أدوات طبية", "مختبر", "أشعة", "استشارة", "أخرى"],
  paymentMethods: ["كاش", "كارت", "تحويل بنكي", "شيك"],
  currencies: ["EGP", "USD"],
  exchangeRate: 50,
}))
