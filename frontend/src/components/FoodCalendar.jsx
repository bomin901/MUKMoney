import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, TrendingUp, Award } from 'lucide-react';

export default function FoodCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({ daily: {}, monthly_total_cost: 0, most_eaten_food: null });
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchCalendarData(currentDate);
  }, [currentDate]);

  const fetchCalendarData = async (date) => {
    try {
      const res = await axios.get(`/api/calendar?year=${date.getFullYear()}&month=${date.getMonth() + 1}`);
      setCalendarData(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const selectedDayData = selectedDate ? calendarData.daily[format(selectedDate, 'yyyy-MM-dd')] : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-4 flex flex-col items-center justify-center text-center">
          <TrendingUp className="text-orange-500 mb-1" />
          <span className="text-xs text-gray-500 font-bold">이번 달 식비</span>
          <span className="text-lg font-black text-gray-800">{calendarData.monthly_total_cost.toLocaleString()}원</span>
        </div>
        <div className="glass-panel p-4 flex flex-col items-center justify-center text-center">
          <Award className="text-orange-500 mb-1" />
          <span className="text-xs text-gray-500 font-bold">최애 메뉴</span>
          <span className="text-lg font-black text-gray-800 truncate w-full px-2" title={calendarData.most_eaten_food || '없음'}>
            {calendarData.most_eaten_food || '없음'}
          </span>
        </div>
      </div>

      <div className="glass-panel p-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="p-2 hover:bg-orange-100 rounded-full text-orange-600 transition-colors">
            <ChevronLeft />
          </button>
          <h2 className="text-lg font-bold text-gray-800">{format(currentDate, 'yyyy년 MM월')}</h2>
          <button onClick={nextMonth} className="p-2 hover:bg-orange-100 rounded-full text-orange-600 transition-colors">
            <ChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-gray-400">
          {['일', '월', '화', '수', '목', '금', '토'].map(day => <div key={day}>{day}</div>)}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="h-12"></div>
          ))}
          
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const hasData = calendarData.daily[dateStr];
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`flex flex-col items-center justify-center h-12 rounded-xl text-sm transition-all ${
                  isSelected ? 'bg-orange-500 text-white shadow-md' : 
                  hasData ? 'bg-orange-100 text-orange-800 font-bold hover:bg-orange-200' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{format(day, 'd')}</span>
                {hasData && hasData.moods[0] && (
                  <span className="text-[10px] mt-1">{hasData.moods[0]}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="glass-panel p-5 animate-fade-in-up">
          <h3 className="font-bold text-gray-800 border-b border-orange-100 pb-2 mb-3">
            {format(selectedDate, 'M월 d일')} 기록
          </h3>
          {selectedDayData ? (
            <div className="space-y-4">
              {selectedDayData.foods.map((food, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedDayData.moods[idx]}</span>
                    <span className="font-bold text-gray-700">{food}</span>
                  </div>
                  <span className="font-medium text-orange-600 font-black">
                    ✓ 완료
                  </span>
                </div>
              ))}
              <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between font-black text-gray-800">
                <span>총 지출</span>
                <span className="text-orange-500">{selectedDayData.cost.toLocaleString()}원</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">이 날은 기록이 없어요 🥲</p>
          )}
        </div>
      )}
    </div>
  );
}
