import { Calendar, Utensils, BookOpen } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: '추천', icon: <Utensils className="w-6 h-6" />, label: '음식추천' },
    { id: '달력', icon: <Calendar className="w-6 h-6" />, label: '먹달력' },
    { id: '기록', icon: <BookOpen className="w-6 h-6" />, label: '나의 기록' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-center z-50">
      <div className="w-full max-w-md bg-white border-t border-gray-200 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)] rounded-t-3xl flex justify-around p-3 pb-safe">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-300 w-20 ${
              activeTab === tab.id 
                ? 'text-orange-500 -translate-y-2' 
                : 'text-gray-400 hover:text-orange-300'
            }`}
          >
            <div className={`p-2 rounded-full mb-1 transition-all ${activeTab === tab.id ? 'bg-orange-100 text-orange-600' : 'bg-transparent'}`}>
              {tab.icon}
            </div>
            <span className="text-[10px] font-bold">{tab.label}</span>
            {activeTab === tab.id && <div className="w-1 h-1 bg-orange-500 rounded-full mt-1"></div>}
          </button>
        ))}
      </div>
    </nav>
  );
}
