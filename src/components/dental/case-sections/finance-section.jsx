import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Plus, Trash2 } from "lucide-react"
import { useDentalStore } from "@/stores/dental-store"

export function FinanceSection({ formData, updateFormData, selectedPatient }) {
  const { addPayment, exchangeRate, paymentMethods, currencies } = useDentalStore()
  const [newPayment, setNewPayment] = useState({
    amount: "",
    currency: "EGP",
    date: new Date().toISOString().split("T")[0],
    method: "كاش",
    description: "",
  })

  const [currencyToggle, setCurrencyToggle] = useState("EGP")

  const handleAddPayment = () => {
    if (!newPayment.amount || !selectedPatient) return

    const payment = {
      ...newPayment,
      amount: Number.parseFloat(newPayment.amount),
    }

    addPayment(selectedPatient.id, payment)

    // Reset form
    setNewPayment({
      amount: "",
      currency: "EGP",
      date: new Date().toISOString().split("T")[0],
      method: "كاش",
      description: "",
    })
  }

  const removePayment = (paymentId) => {
    // This would need to be implemented in the store
    console.log("Remove payment:", paymentId)
  }

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount
    if (fromCurrency === "USD" && toCurrency === "EGP") return amount * exchangeRate
    if (fromCurrency === "EGP" && toCurrency === "USD") return amount / exchangeRate
    return amount
  }

  const getTotalPaid = (currency) => {
    if (!selectedPatient?.payments) return 0
    return selectedPatient.payments.reduce((sum, payment) => {
      const convertedAmount = convertCurrency(payment.amount, payment.currency, currency)
      return sum + convertedAmount
    }, 0)
  }

  const getRemainingAmount = (currency) => {
    const totalAmount = convertCurrency(Number.parseFloat(formData.totalAmount) || 0, formData.currency, currency)
    const paidAmount = getTotalPaid(currency)
    return totalAmount - paidAmount
  }

  return (
    <div className="space-y-6">
      {/* Treatment Cost */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            تكلفة العلاج
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="totalAmount">المبلغ الإجمالي</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) => updateFormData("totalAmount", e.target.value)}
                    placeholder="0"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label>العملة</Label>
                  <div className="flex border rounded-md">
                    <Button
                      type="button"
                      variant={formData.currency === "EGP" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => updateFormData("currency", "EGP")}
                      className="rounded-r-none"
                    >
                      جنيه
                    </Button>
                    <Button
                      type="button"
                      variant={formData.currency === "USD" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => updateFormData("currency", "USD")}
                      className="rounded-l-none"
                    >
                      دولار
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatmentDescription">وصف العلاج</Label>
                <Textarea
                  id="treatmentDescription"
                  value={formData.treatmentDescription}
                  onChange={(e) => updateFormData("treatmentDescription", e.target.value)}
                  placeholder="* تشخيص الحالة&#10;* كشف عام&#10;* علاج تحفظي..."
                  className="min-h-[120px] bg-white font-mono"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">ملخص مالي</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>سعر الصرف:</span>
                    <span>1$ = {exchangeRate} جنيه</span>
                  </div>
                  <div className="flex justify-between">
                    <span>إجمالي المدفوع (جنيه):</span>
                    <span className="font-medium">{getTotalPaid("EGP").toFixed(2)} جنيه</span>
                  </div>
                  <div className="flex justify-between">
                    <span>إجمالي المدفوع (دولار):</span>
                    <span className="font-medium">${getTotalPaid("USD").toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>المتبقي ({formData.currency}):</span>
                      <span className="text-red-600">
                        {getRemainingAmount(formData.currency).toFixed(2)} {formData.currency === "USD" ? "$" : "جنيه"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            إضافة دفعة جديدة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <Label>المبلغ</Label>
              <Input
                type="number"
                value={newPayment.amount}
                onChange={(e) => setNewPayment((prev) => ({ ...prev, amount: e.target.value }))}
                placeholder="0"
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label>العملة</Label>
              <Select
                value={newPayment.currency}
                onValueChange={(value) => setNewPayment((prev) => ({ ...prev, currency: value }))}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency === "USD" ? "دولار" : "جنيه"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>التاريخ</Label>
              <Input
                type="date"
                value={newPayment.date}
                onChange={(e) => setNewPayment((prev) => ({ ...prev, date: e.target.value }))}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label>طريقة الدفع</Label>
              <Select
                value={newPayment.method}
                onValueChange={(value) => setNewPayment((prev) => ({ ...prev, method: value }))}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAddPayment} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              إضافة
            </Button>
          </div>

          <div className="mt-4 space-y-2">
            <Label>وصف الدفعة</Label>
            <Input
              value={newPayment.description}
              onChange={(e) => setNewPayment((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="وصف الدفعة..."
              className="bg-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payments History */}
      {selectedPatient?.payments && selectedPatient.payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>سجل الدفعات</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">العملة</TableHead>
                  <TableHead className="text-right">الطريقة</TableHead>
                  <TableHead className="text-right">الوصف</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedPatient.payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell className="font-medium">{payment.amount}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.currency === "USD" ? "دولار" : "جنيه"}</Badge>
                    </TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePayment(payment.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
