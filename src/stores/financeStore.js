import { create } from "zustand"

export const useFinanceStore = create((set, get) => ({
  addPayment: (patients, patientId, payment) => {
    const updated = patients.map((p) => {
      if (p.id === patientId) {
        const newPayments = [...p.payments, { ...payment, id: `PAY${Date.now()}` }]
        const paidAmount = newPayments.reduce((sum, pay) => sum + pay.amount, 0)
        return {
          ...p,
          payments: newPayments,
          paidAmount,
          remainingAmount: p.totalAmount - paidAmount,
        }
      }
      return p
    })
    return updated
  },

  addExpense: (patients, patientId, expense) => {
    return patients.map((p) =>
      p.id === patientId
        ? { ...p, expenses: [...p.expenses, { ...expense, id: `EXP${Date.now()}` }] }
        : p,
    )
  },

  addCaseNote: (patients, patientId, note) => {
    return patients.map((p) =>
      p.id === patientId
        ? { ...p, caseNotes: [...p.caseNotes, { ...note, id: `NOTE${Date.now()}` }] }
        : p,
    )
  },
}))
