import { useState, useEffect } from 'react';
import axios from 'axios';
import Onboarding from './components/Onboarding';
import Navbar from './components/Navbar';
import FoodRecommendation from './components/FoodRecommendation';
import FoodCalendar from './components/FoodCalendar';
import MyRecords from './components/MyRecords';

function App() {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('추천');
  const [prefilledRecord, setPrefilledRecord] = useState(null);

  useEffect(() => {
    axios.get('/api/preferences')
      .then(res => {
        const data = res.data;
        if (data.disliked_foods.length === 0 && data.allergies.length === 0 && data.favorite_foods.length === 0 && data.spice_level === "normal") {
          setPreferences(null);
        } else {
          setPreferences(data);
        }
      })
      .catch(err => {
        console.error("Error fetching preferences", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-orange-50 text-orange-500 text-lg font-bold">로딩중...</div>;
  }

  if (!preferences) {
    return <Onboarding onComplete={(data) => setPreferences(data)} />;
  }

  const navigateToRecord = (foodName, mood) => {
    setPrefilledRecord({ foodName, mood });
    setActiveTab('기록');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-orange-50 shadow-2xl relative pb-20 overflow-x-hidden">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 px-5 py-4 border-b border-orange-100">
        <h1 className="text-2xl font-black text-orange-500 tracking-tighter">MUKMoney 🍳</h1>
      </header>

      <main className="p-4 animate-fade-in-up">
        {activeTab === '추천' && <FoodRecommendation onGoRecord={navigateToRecord} />}
        {activeTab === '달력' && <FoodCalendar />}
        {activeTab === '기록' && (
          <MyRecords 
            prefilled={prefilledRecord} 
            clearPrefilled={() => setPrefilledRecord(null)} 
          />
        )}
      </main>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
