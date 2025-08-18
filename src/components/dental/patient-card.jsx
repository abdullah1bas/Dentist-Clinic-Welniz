import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, MessageCircle, Calendar, Eye, User } from "lucide-react"
import { useDentalStore } from "@/stores/dental-store"
import { useNavigate } from "react-router-dom"

export function PatientCard({ patient }) {
  const { setSelectedPatient, setIsDialogOpen } = useDentalStore();
  const navigate = useNavigate();

  const handleCall = () => {
    window.open(`tel:${patient.phone}`)
  }

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?phone=2${patient.phone}&text&type=phone_number&app_absent=0`)
  }

  const handleViewDetails = () => {
    setSelectedPatient(patient)
    setIsDialogOpen(true)
  }

  const getStatusColor = (status) => {
    return status === "مستمرة" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        {/* Header with image and basic info */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative">
            {patient.profileImage ? (
              <img
                src={patient.profileImage || "/placeholder.svg"}
                alt={patient.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                <User className="w-8 h-8 text-blue-600" />
              </div>
            )}
            <Badge className={`absolute -top-1 -right-1 text-xs ${getStatusColor(patient.status)}`}>
              {patient.status}
            </Badge>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate">{patient.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{patient.phone}</p>
            <Badge variant="outline" className="text-xs">
              {patient.category}
            </Badge>
          </div>
        </div>

        {/* Patient details */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>العمر:</span>
            <span>{patient.age} سنة</span>
          </div>
          <div className="flex justify-between">
            <span>المهنة:</span>
            <span className="truncate max-w-24">{patient.occupation}</span>
          </div>
          <div className="flex justify-between">
            <span>المبلغ المتبقي:</span>
            <span className="font-medium text-red-600">
              {patient.remainingAmount} {patient.currency}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCall}
            className="flex-1 hover:bg-green-50 hover:border-green-300 bg-transparent"
          >
            <Phone className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleWhatsApp}
            className="flex-1 hover:bg-green-50 hover:border-green-300 bg-transparent"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>

          <Button onClick={() => navigate('/appointments')} size="sm" variant="outline" className="flex-1 hover:bg-blue-50 hover:border-blue-300 bg-transparent">
            <Calendar className="w-4 h-4" />
          </Button>

          <Button size="sm" onClick={handleViewDetails} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
