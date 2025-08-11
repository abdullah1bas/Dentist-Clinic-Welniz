import WhatsNewItem from '@/components/whatNew/WhatsNewItem'
import React from 'react'

const newsItems = [
  {
    title: "فيديو توضيحي جديد!",
    description:
      "أحياناً قد تحتاج إلى مراجعة سريعة حول كيفية استخدام ميزة معينة في البرنامج، أو ربما تعليمات حول ميزة مضافة حديثاً. هذا الفيديو التوضيحي الجديد سيأخذك في رحلة عبر كل قسم من أقسام البرنامج بالتفصيل.",
    date: "2025-03-27",
    videoThumbnail: "https://randomuser.me/api/portraits/men/75.jpg",
    videoUrl: "https://www.youtube.com/watch?v=2vkA4qo-LaM",
    isNew: true,
  },
  {
    title: "تحديث نظام إدارة المواعيد",
    description:
      "تم تحسين نظام إدارة المواعيد ليصبح أكثر سهولة وفعالية. يمكنك الآن جدولة المواعيد بشكل أسرع مع إمكانية إرسال تذكيرات تلقائية للمرضى عبر الرسائل النصية والبريد الإلكتروني.",
    date: "2025-03-20",
    videoThumbnail: "/appointment-system-interface.png",
    videoUrl: "https://youtube.com/watch?v=example2",
    isNew: true,
  },
  {
    title: "ميزة التقارير المالية الجديدة",
    description:
      "أضفنا نظام تقارير مالية شامل يساعدك في تتبع الإيرادات والمصروفات بشكل تفصيلي. يمكنك الآن إنشاء تقارير شهرية وسنوية مع رسوم بيانية تفاعلية لفهم أداء العيادة بشكل أفضل.",
    date: "2025-03-15",
    videoThumbnail: "/financial-reports-dashboard.png",
    videoUrl: "https://youtube.com/watch?v=example3",
  },
  {
    title: "تحسينات على واجهة المستخدم",
    description:
      "قمنا بتحديث التصميم العام للتطبيق ليصبح أكثر حداثة وسهولة في الاستخدام. التصميم الجديد يدعم الوضع المظلم والفاتح مع تحسينات في سرعة التحميل والاستجابة على جميع الأجهزة.",
    date: "2025-03-10",
    videoThumbnail: "/modern-dental-app.png",
    videoUrl: "https://youtube.com/watch?v=example4",
  },
]

export default function WhatsNewPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">ما الجديد؟</h1>
          <p className="text-black text-lg max-w-2xl mx-auto">
            اكتشف أحدث الميزات والتحديثات في تطبيق إدارة عيادة الأسنان
          </p>
        </div>

        {/* News Items */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item, index) => (
            <WhatsNewItem
              key={index}
              title={item.title}
              description={item.description}
              date={item.date}
              videoThumbnail={item.videoThumbnail}
              videoUrl={item.videoUrl}
              isNew={item.isNew}
            />
          ))}
        </div>

        {/* Load More Button */}
        {/* <div className="text-center mt-12">
          <button className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-lg transition-colors duration-200">
            تحميل المزيد
          </button>
        </div> */}
      </div>
    </div>
  )
}
