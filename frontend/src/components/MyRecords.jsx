import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Camera, MapPin, Receipt, PenTool, X } from 'lucide-react';

export default function MyRecords({ prefilled, clearPrefilled }) {
  const [records, setRecords] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(!!prefilled);
  
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    mood: prefilled?.mood || '😊',
    food_name: prefilled?.foodName || '',
    restaurant_name: '',
    cost: '',
    review_text: '',
    map_link: ''
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    if (prefilled) {
      setFormData(prev => ({ ...prev, mood: prefilled.mood, food_name: prefilled.foodName }));
      setIsFormOpen(true);
    }
  }, [prefilled]);

  const fetchRecords = async () => {
    try {
      const res = await axios.get('/api/records');
      setRecords(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (photoFile) {
        data.append('photo', photoFile);
      }
      
      await axios.post('/api/records', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setIsFormOpen(false);
      fetchRecords();
      clearPrefilled();
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        mood: '😊',
        food_name: '',
        restaurant_name: '',
        cost: '',
        review_text: '',
        map_link: ''
      });
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (err) {
      console.error(err);
      alert('저장 실패!');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-gray-800">나의 먹기록</h2>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-bold shadow-md transition-colors"
        >
          {isFormOpen ? '목록으로' : '새 기록'}
        </button>
      </div>

      {isFormOpen ? (
        <form onSubmit={handleSubmit} className="glass-panel p-5 animate-fade-in-up space-y-4">
          <div className="flex gap-4 mb-2">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 mb-1">날짜</label>
              <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full bg-orange-50 border border-orange-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div className="w-24">
              <label className="block text-xs font-bold text-gray-500 mb-1">기분</label>
              <select name="mood" value={formData.mood} onChange={handleChange} className="w-full bg-orange-50 border border-orange-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-center text-xl">
                {['😡','😊','😢','😴','🤒','🥳','🤔'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">음식 이름</label>
            <input type="text" name="food_name" required placeholder="예: 마라탕" value={formData.food_name} onChange={handleChange} className="w-full bg-orange-50 border border-orange-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 mb-1"><MapPin className="inline w-3 h-3" /> 식당</label>
              <input type="text" name="restaurant_name" required placeholder="식당 이름" value={formData.restaurant_name} onChange={handleChange} className="w-full bg-orange-50 border border-orange-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 mb-1"><Receipt className="inline w-3 h-3" /> 금액</label>
              <input type="number" name="cost" required placeholder="0" value={formData.cost} onChange={handleChange} className="w-full bg-orange-50 border border-orange-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1"><PenTool className="inline w-3 h-3" /> 후기</label>
            <textarea name="review_text" rows="3" required placeholder="너무 맛있었어요!" value={formData.review_text} onChange={handleChange} className="w-full bg-orange-50 border border-orange-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">지도 링크 (선택)</label>
            <input type="url" name="map_link" placeholder="네이버/카카오맵 주소" value={formData.map_link} onChange={handleChange} className="w-full bg-orange-50 border border-orange-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div className="pt-2">
            <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
            {photoPreview ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-inner">
                <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { setPhotoPreview(null); setPhotoFile(null); }} className="absolute text-white bg-black/50 rounded-full p-1 top-2 right-2 backdrop-blur-md">
                  <X size={20} />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full py-4 border-2 border-dashed border-orange-200 rounded-xl flex flex-col items-center justify-center text-orange-400 hover:bg-orange-50 transition-colors">
                <Camera size={28} className="mb-2" />
                <span className="font-bold text-sm">사진 추가하기</span>
              </button>
            )}
          </div>

          <button type="submit" disabled={saving} className="w-full py-4 mt-4 bg-orange-500 text-white font-black rounded-xl shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:bg-orange-600 transition-colors">
            {saving ? '저장 중...' : '기록 저장하기'}
          </button>
        </form>
      ) : (
        <div className="space-y-4 pb-12">
          {records.length === 0 ? (
            <div className="text-center py-20 text-gray-400 font-medium">아직 기록이 없어요. <br/> 첫 끼니를 기록해 볼까요?</div>
          ) : (
            records.map(record => (
              <div key={record.id} className="glass-panel overflow-hidden animate-fade-in-up">
                {record.photo_url && (
                  <div className="h-48 w-full bg-gray-100">
                    <img src={record.photo_url} alt={record.food_name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4 relative">
                  <div className="absolute -top-6 right-4 text-4xl bg-white rounded-full p-1 shadow-md">{record.mood}</div>
                  <div className="flex gap-2 text-xs text-orange-500 font-bold mb-1">
                    <span>{record.date}</span>
                    <span>•</span>
                    <span>{record.restaurant_name}</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-800 mb-2">{record.food_name}</h3>
                  <p className="text-gray-600 text-sm mb-3">"{record.review_text}"</p>
                  
                  <div className="flex justify-between items-center bg-orange-50 p-3 rounded-xl border border-orange-100">
                    <span className="text-xs text-gray-500">결제 금액</span>
                    <span className="font-bold text-orange-600">{(record.cost).toLocaleString()}원</span>
                  </div>
                  
                  {record.map_link && (
                    <a href={record.map_link} target="_blank" rel="noreferrer" className="block mt-3 text-center py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors">
                      지도 보기
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
