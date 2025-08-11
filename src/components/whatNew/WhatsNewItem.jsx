import React from 'react'
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Calendar, Pin } from "lucide-react"

function WhatsNewItem({ title, description, date, videoThumbnail, videoUrl, isNew = false }) {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <Card className="bg-slate-800 border-slate-700 p-4 sm:p-6 mb-6 overflow-hidden">
      <div className="flex flex-col gap-6 items-start">
        {/* Video Thumbnail Section */}
        <div className="relative group cursor-pointer w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`
            relative overflow-hidden rounded-lg transition-all duration-300 ease-in-out
            ${isHovered && "w-full scale-110 shadow-2xl"}
          `}
          >
            <video
              src={videoThumbnail || "https://randomuser.me/api/portraits/men/75.jpg"}
              controls
              poster='https://randomuser.me/api/portraits/men/75.jpg'
              autoPlay
              loop
              muted
              alt="Video Thumbnail"
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div
              className={`
              absolute inset-0 bg-black transition-opacity duration-300
              ${isHovered ? "bg-opacity-30" : "bg-opacity-50"}
            `}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`
                  bg-red-600 rounded-full p-3 transition-all duration-300
                  ${isHovered ? "scale-110 bg-red-500" : "scale-100"}
                `}
                >
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
            </div>

            {/* Hover Effect Border */}
            <div
              className={`
              absolute inset-0 border-2 border-red-500 rounded-lg transition-opacity duration-300
              ${isHovered ? "opacity-100" : "opacity-0"}
            `}
            />
          </div>

          {/* Video Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            5:30
          </div>
        </div>


        {/* Content Section */}
        <div className="flex-1 max-w-[600px] space-y-4">
          {/* Header with Icon and Date */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Pin className="w-5 h-5 text-red-500 transform rotate-45" />
              <h3 className="text-sm sm:text-xl font-semibold text-white">{title}</h3>
              {isNew && (
                <Badge variant="destructive" className="bg-red-600 hover:bg-red-700">
                  جديد
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-xs sm:text-sm">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">{description}</p>

          {/* Action Button */}
          <Button
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-md transition-all duration-200 transform hover:scale-105"
            onClick={() => window.open(videoUrl, "_blank")}
          >
            <Play className="w-4 h-4 mr-2" />
            مشاهدة على يوتيوب
          </Button>
        </div>

      </div>
    </Card>
  )
}

export default WhatsNewItem;