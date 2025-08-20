import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Receipt, Eye } from "lucide-react"
import { ExpenseDialog } from "../expense-dialog"

export function ExpensesSection({ selectedPatient }) {
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)

  const handleAddExpense = () => {
    setSelectedExpense(null)
    setIsExpenseDialogOpen(true)
  }

  const handleViewExpense = (expense) => {
    setSelectedExpense(expense)
    setIsExpenseDialogOpen(true)
  }

  const printReceipt = () => {
    if (!selectedPatient?.expenses || selectedPatient.expenses.length === 0) return

    const printWindow = window.open("", "_blank")
    const currentDate = new Date().toLocaleDateString("ar-EG")
    const totalExpenses = selectedPatient.expenses.reduce((sum, exp) => sum + exp.amount, 0)

    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>إيصال المصروفات</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .patient-info { margin-bottom: 20px; background: #f5f5f5; padding: 15px; border-radius: 5px; }
            .expenses-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .expenses-table th, .expenses-table td { border: 1px solid #ddd; padding: 10px; text-align: right; }
            .expenses-table th { background: #f0f0f0; font-weight: bold; }
            .total { text-align: left; font-size: 18px; font-weight: bold; margin-top: 20px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>إيصال مصروفات الحالة</h1>
            <p>التاريخ: ${currentDate}</p>
          </div>
          
          <div class="patient-info">
            <h2>بيانات المريض</h2>
            <p><strong>الاسم:</strong> ${selectedPatient.name}</p>
            <p><strong>رقم الحالة:</strong> ${selectedPatient.id}</p>
            <p><strong>الهاتف:</strong> ${selectedPatient.phone}</p>
          </div>

          <table class="expenses-table">
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>النوع</th>
                <th>الوصف</th>
                <th>المبلغ</th>
                <th>العملة</th>
              </tr>
            </thead>
            <tbody>
              ${selectedPatient.expenses
                .map(
                  (expense) => `
                <tr>
                  <td>${expense.date}</td>
                  <td>${expense.type}</td>
                  <td>${expense.description}</td>
                  <td>${expense.amount}</td>
                  <td>${expense.currency}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>

          <div class="total">
            <p>إجمالي المصروفات: ${totalExpenses} جنيه</p>
          </div>

          <div class="footer">
            <p>تم إنشاء هذا الإيصال بواسطة نظام إدارة عيادة الأسنان</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              مصروفات الحالة
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={printReceipt}
                variant="outline"
                className="bg-orange-50 hover:bg-orange-100 border-orange-200"
                disabled={!selectedPatient?.expenses || selectedPatient.expenses.length === 0}
              >
                <Receipt className="w-4 h-4 mr-2" />
                طباعة الإيصال
              </Button>
              <Button onClick={handleAddExpense} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                إضافة مصروف
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Expenses Table */}
      {selectedPatient?.expenses && selectedPatient.expenses.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">الوصف</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">العملة</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedPatient.expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{expense.type}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{expense.description}</TableCell>
                    <TableCell className="font-medium">{expense.amount}</TableCell>
                    <TableCell>
                      <Badge variant={expense.currency === "USD" ? "default" : "secondary"}>
                        {expense.currency === "USD" ? "دولار" : "جنيه"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewExpense(expense)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Summary */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="font-medium">إجمالي المصروفات:</span>
                <span className="font-bold text-lg">
                  {selectedPatient.expenses.reduce((sum, exp) => sum + exp.amount, 0)} جنيه
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مصروفات</h3>
            <p className="text-gray-600 mb-4">لم يتم إضافة أي مصروفات لهذه الحالة بعد</p>
            <Button onClick={handleAddExpense} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              إضافة أول مصروف
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Expense Dialog */}
      <ExpenseDialog
        isOpen={isExpenseDialogOpen}
        onClose={() => setIsExpenseDialogOpen(false)}
        selectedPatient={selectedPatient}
        selectedExpense={selectedExpense}
      />
    </div>
  )
}
