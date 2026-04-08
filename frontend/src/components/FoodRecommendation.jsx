import { useState } from 'react';
import axios from 'axios';
import { Sparkles, RefreshCw, PenTool } from 'lucide-react';

const MOODS = [
  { emoji: '😡', label: '스트레스' },
  { emoji: '😊', label: '기분좋음' },
  { emoji: '😢', label: '우울' },
  { emoji: '😴', label: '피곤' },
  { emoji: '🤒', label: '아픔' },
  { emoji: '🥳', label: '신남' },
  { emoji: '🤔', label: '고민중' },
];

export default function FoodRecommendation({ onGoRecord }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecommendation = async (moodId) => {
    setLoading(true);
    try {
      const moodLabel = MOODS.find(m => m.emoji === moodId)?.emoji || moodId;
      const res = await axios.post('/api/recommend', { mood: moodLabel });
      setRecommendation(res.data);
      setSelectedMood(moodId);
    } catch (e) {
      console.error(e);
      alert('추천을 가져오는데 실패했습니다.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
          <Sparkles className="text-orange-500" />
          지금 기분이 어때요?
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {MOODS.map(mood => (
            <button
              key={mood.emoji}
              onClick={() => fetchRecommendation(mood.emoji)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ${
                selectedMood === mood.emoji 
                  ? 'bg-orange-500 text-white shadow-lg transform scale-105' 
                  : 'bg-white hover:bg-orange-50 text-gray-600 border border-orange-100'
              }`}
            >
              <span className="text-3xl mb-1">{mood.emoji}</span>
              <span className="text-xs font-semibold whitespace-nowrap">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center py-10">
          <div className="animate-spin text-5xl mb-4 text-orange-500">🍽️</div>
          <p className="text-gray-500 font-medium animate-pulse">맛있는 레시피를 찾고 있어요...</p>
        </div>
      )}

      {recommendation && !loading && (
        <div className="glass-panel overflow-hidden animate-fade-in-up">
          <div className="relative h-48 bg-orange-100">
            {recommendation.image_url ? (
              <img src={recommendation.image_url} alt="food" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl">🍲</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <span className="inline-block px-3 py-1 bg-white/30 backdrop-blur-sm rounded-full text-white text-xs font-bold mb-2">
                Ai 추천
              </span>
              <h3 className="text-white text-2xl font-black drop-shadow-md">{recommendation.food_name}</h3>
            </div>
          </div>
          
          <div className="p-5">
            <p className="text-gray-700 font-medium italic mb-6">"{recommendation.reason}"</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => fetchRecommendation(selectedMood)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold rounded-xl transition-colors"
              >
                <RefreshCw size={18} /> 다시 추천
              </button>
              <button 
                onClick={() => onGoRecord(recommendation.food_name, selectedMood)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition-colors"
              >
                <PenTool size={18} /> 먹으러 갈래요
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
