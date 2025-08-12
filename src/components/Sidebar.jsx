import { useState } from "react";
import { CalendarCheck, LogOut, Globe, Menu, Sparkles, ClipboardList, Scissors, DollarSign, FileText, ScrollText, ArrowRightToLine, ArrowLeftToLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const navItems = [
  { label: "Notes", icon: <ScrollText size={20} />, to: "/notes" },
  { label: "What`s New", icon: <Sparkles size={20} />, to: "/whats-new" },
  { label: "Status Sheet", icon: <ClipboardList size={20} />, to: "/" },
  { label: "Appointments", icon: <CalendarCheck size={20} />, to: "/appointments" },
  { label: "Expenses", icon: <Scissors size={20} />, to: "/expenses" },
  { label: "Income", icon: <DollarSign size={20} />, to: "/income" },
  { label: "Prescriptions", icon: <FileText size={20} />, to: "/prescriptions" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileImg, setProfileImg] = useState("https://randomuser.me/api/portraits/men/75.jpg");
  const [lang, setLang] = useState("en");
  const pathname = useLocation().pathname;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImg(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const handleChangeLang = () => setLang(lang === "en" ? "ar" : "en");

  return (
    <aside
      className={cn(
        "flex h-screen flex-col justify-between bg-background text-white transition-all duration-300 shadow-lg",
        isOpen ? "w-40 fixed z-50" : "w-16"
      )}
    >
      <div>
        {/* Top bar */}
        <div className="flex flex-col items-center justify-center gap-2 p-1">
          
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                  {isOpen ? <ArrowLeftToLine size={20} /> : <ArrowRightToLine size={20} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{isOpen ? 'Close' : 'Open'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <label htmlFor="upload-image" className="cursor-pointer">
                  <div className="w-10 h-10 overflow-hidden rounded-full border-2 border-white">
                    <img src={profileImg} alt="Profile" className="object-cover w-full h-full" />
                  </div>
                </label>
              </TooltipTrigger>
              {!isOpen && (
                <TooltipContent side="right">
                  <p>MohSadq</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          <input type="file" id="upload-image" className="hidden" accept="image/*" onChange={handleImageChange} />

          {isOpen && <span className="text-lg font-semibold">MohSadq</span>}
          
        </div>

        {/* Navigation */}
        <nav className="flex flex-col justify-center mt-4 space-y-1 px-2">
          {navItems.map((item, index) => (
            <Link
              to={item.to}
              key={index}
              className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-hover-icon ${item.to === pathname && 'bg-hover-icon'} transition-colors`}
            >
              {!isOpen ? (
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>{item.icon}</TooltipTrigger>
                    <TooltipContent side="right" className="bg-muted">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <>
                  {item.icon}
                  <span>{item.label}</span>
                </>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Logout */}
      <div className="p-3 border-t border-white/20">
        {/* Language Switch */}
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="group flex items-center gap-3 w-full mt-2 rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-[#354f52]"
                onClick={handleChangeLang}
              >
                <Globe size={20} />
                {isOpen && <span>{lang}</span>}
              </button>
            </TooltipTrigger>
            {!isOpen && (
              <TooltipContent side="right">
                <p>{lang}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="group flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                <LogOut size={20} />
                {isOpen && <span>تسجيل الخروج</span>}
              </button>
            </TooltipTrigger>
            {!isOpen && (
              <TooltipContent side="right">
                <p>تسجيل الخروج</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

    </aside>
  );
}
