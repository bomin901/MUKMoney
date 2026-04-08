import { useState } from 'react';
import axios from 'axios';
import { Heart, AlertTriangle, Flame } from 'lucide-react';

const COMMON_FOODS = ['오이', '가지', '고수', '민트초코', '마라', '굴', '콩', '해산물', '견과류', '유제품', '밀가루', '계란'];

export default function Onboarding({ onComplete }) {
  const [disliked, setDisliked] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [spiceLevel, setSpiceLevel] = useState('normal');
  const [saving, setSaving] = useState(false);

  const toggleItem = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const data = {
      disliked_foods: disliked,
      allergies,
      favorite_foods: favorites,
      spice_level: spiceLevel
    };
    try {
      await axios.post('/api/preferences', data);
      onComplete(data);
    } catch (e) {
      console.error(e);
      alert('저장 실패!');
    }
    setSaving(false);
  };

  const MultiSelectSection = ({ title, icon, list, setList }) => (
    <div className="mb-6">
      <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-700">
        {icon} {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {COMMON_FOODS.map(food => (
          <button
            key={food}
            onClick={() => toggleItem(list, setList, food)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              list.includes(food) 
                ? 'bg-orange-500 text-white shadow-md transform scale-105' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-orange-50'
            }`}
          >
            {food}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-orange-50 p-6 flex flex-col max-w-md mx-auto animate-fade-in-up">
      <div className="text-center mt-10 mb-8">
        <h1 className="text-3xl font-black text-orange-500 mb-2">환영합니다! 👋</h1>
        <p className="text-gray-600">더 나은 추천을 위해 입맛을 알려주세요.</p>
      </div>

      <div className="glass-panel p-5 mb-8 overflow-y-auto flex-1">
        <MultiSelectSection 
          title="못 먹는 음식" 
          icon={<AlertTriangle className="text-yellow-500 w-5 h-5"/>} 
          list={disliked} 
          setList={setDisliked} 
        />
        
        <MultiSelectSection 
          title="알러지" 
          icon={<AlertTriangle className="text-red-500 w-5 h-5"/>} 
          list={allergies} 
          setList={setAllergies} 
        />

        <MultiSelectSection 
          title="좋아하는 음식" 
          icon={<Heart className="text-pink-500 w-5 h-5"/>} 
          list={favorites} 
          setList={setFavorites} 
        />

        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-700">
            <Flame className="text-orange-500 w-5 h-5"/> 맵기 취향
          </h3>
          <div className="flex gap-2">
            {['순한맛', '보통맛', '매운맛'].map(level => {
              const val = level === '순한맛' ? 'mild' : level === '보통맛' ? 'normal' : 'spicy';
              return (
                <button
                  key={val}
                  onClick={() => setSpiceLevel(val)}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    spiceLevel === val 
                      ? 'bg-orange-500 text-white shadow-md' 
                      : 'bg-white text-gray-600 border border-orange-100'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-transform active:scale-95 disabled:opacity-70"
      >
        {saving ? '저장 중...' : '시작하기'}
      </button>
    </div>
  );
}
