import React, { useState, useEffect, useRef } from 'react';
import { EventCard } from './components/EventCard';
import { ToolsView } from './components/ToolsView';
import { INITIAL_ITINERARY, ACCOMMODATION } from './constants';
import { DailyPlan, ItineraryItem } from './types';
import { analyzeItinerary } from './services/geminiService';
import { Map, Briefcase, Settings, CloudSun, Sparkles, CalendarDays, ChevronLeft, ChevronRight, Moon, Sun, Home, MapPin, Trash2, RefreshCw } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'itinerary' | 'tools' | 'settings'>('itinerary');
  
  // Initialize state from localStorage if available, otherwise use default
  const [itinerary, setItinerary] = useState<DailyPlan[]>(() => {
    try {
      const saved = localStorage.getItem('zen_travel_itinerary_v1');
      return saved ? JSON.parse(saved) : INITIAL_ITINERARY;
    } catch (e) {
      console.error("Failed to load itinerary from storage", e);
      return INITIAL_ITINERARY;
    }
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  
  // Day Navigation State
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const daysScrollRef = useRef<HTMLDivElement>(null);

  const activeDay = itinerary[activeDayIndex];

  // Save to localStorage whenever itinerary changes
  useEffect(() => {
    try {
      localStorage.setItem('zen_travel_itinerary_v1', JSON.stringify(itinerary));
    } catch (e) {
      console.error("Storage quota exceeded", e);
      alert("儲存空間已滿，部分圖片可能無法保存。請嘗試刪除一些舊圖片。");
    }
  }, [itinerary]);

  const handleResetData = () => {
    if (window.confirm("確定要重置所有行程資料嗎？您的所有修改和上傳的照片將會消失。")) {
      localStorage.removeItem('zen_travel_itinerary_v1');
      setItinerary(INITIAL_ITINERARY);
      alert("資料已重置為預設值。");
    }
  };

  // Helper to find accommodation for the morning (Start of Day) and night (End of Day)
  const getDailyAccommodation = (dateStr: string) => {
    // Current date object
    const currentYear = 2026; // Based on user data
    const [month, day] = dateStr.split(' ')[0].split('/').map(Number);
    const currentDate = new Date(currentYear, month - 1, day);
    
    // Find where we are sleeping TONIGHT
    // Logic: If current date is within the range [start, end) of a hotel stay.
    // Note: The ACCOMMODATION constant string "2/24 - 2/26" means check-in 24, check-out 26.
    // So nights of 24 and 25 are at that hotel.
    
    const findHotelForDate = (targetDate: Date) => {
      for (const hotel of ACCOMMODATION) {
        const [startStr, endStr] = hotel.dates.split(' - ');
        const [sMonth, sDay] = startStr.split('/').map(Number);
        const [eMonth, eDay] = endStr.split('/').map(Number);
        
        const startDate = new Date(currentYear, sMonth - 1, sDay);
        const endDate = new Date(currentYear, eMonth - 1, eDay);
        
        // Check if targetDate is >= startDate AND < endDate
        if (targetDate >= startDate && targetDate < endDate) {
            return hotel.name;
        }
      }
      return null;
    };

    const nightHotel = findHotelForDate(currentDate);
    
    // Find where we woke up THIS MORNING (i.e., where we slept last night)
    const prevDate = new Date(currentDate);
    prevDate.setDate(currentDate.getDate() - 1);
    const morningHotel = findHotelForDate(prevDate);

    return { morningHotel, nightHotel };
  };

  const { morningHotel, nightHotel } = getDailyAccommodation(activeDay.date);

  // Helper to determine the primary city for the day for weather display
  const getDayLocation = (day: DailyPlan) => {
    const text = JSON.stringify(day.items);
    if (text.includes('首爾') || text.includes('仁川') || text.includes('ICN')) return 'Seoul / Incheon';
    if (text.includes('越後湯澤') || text.includes('滑雪')) return 'Niigata (Snow)';
    if (text.includes('高崎') || text.includes('Gunma')) return 'Gunma';
    if (text.includes('成田') && !text.includes('東京')) return 'Narita';
    if (text.includes('東京') || text.includes('大塚') || text.includes('上野') || text.includes('銀座') || text.includes('新宿')) return 'Tokyo';
    return 'Japan'; // Default
  };

  const currentLocation = getDayLocation(activeDay);

  // Scroll to active day tab when changed
  useEffect(() => {
    if (daysScrollRef.current) {
      const activeTab = daysScrollRef.current.children[activeDayIndex] as HTMLElement;
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeDayIndex]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const newItinerary = await analyzeItinerary(itinerary);
    setItinerary(newItinerary);
    setIsAnalyzing(false);
    setHasAnalyzed(true);
  };

  const handleItemUpdate = (updatedItem: ItineraryItem) => {
    const newItinerary = [...itinerary];
    const day = newItinerary[activeDayIndex];
    // Update the specific item within the active day
    day.items = day.items.map(i => i.id === updatedItem.id ? updatedItem : i);
    setItinerary(newItinerary);
  };

  const nextDay = () => {
    if (activeDayIndex < itinerary.length - 1) setActiveDayIndex(prev => prev + 1);
  };

  const prevDay = () => {
    if (activeDayIndex > 0) setActiveDayIndex(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-washi font-sans text-sumi pb-24 relative overflow-x-hidden">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-washi/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            ZenTravel <span className="text-[10px] bg-sumi text-white px-1.5 py-0.5 rounded uppercase tracking-wider">JP/KR</span>
          </h1>
          {view === 'itinerary' && (
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || hasAnalyzed}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-all ${
                hasAnalyzed ? 'bg-indigo-100 text-indigo-700' : 'bg-sumi text-white shadow-md active:scale-95'
              } ${isAnalyzing ? 'opacity-70 cursor-wait' : ''}`}
            >
              <Sparkles size={12} />
              {isAnalyzing ? '分析中...' : hasAnalyzed ? 'AI 導遊已啟用' : 'AI 導遊'}
            </button>
          )}
        </div>

        {/* Date Tabs (Horizontal Scroll) */}
        {view === 'itinerary' && (
          <div className="relative border-t border-stone-100">
             <div 
               ref={daysScrollRef}
               className="flex overflow-x-auto no-scrollbar px-2 py-2 gap-2 snap-x"
             >
               {itinerary.map((day, idx) => (
                 <button
                   key={idx}
                   onClick={() => setActiveDayIndex(idx)}
                   className={`flex-shrink-0 snap-center flex flex-col items-center justify-center min-w-[4.5rem] py-2 rounded-xl transition-all ${
                     activeDayIndex === idx 
                       ? 'bg-sumi text-white shadow-md scale-105' 
                       : 'bg-white text-stone-400 border border-stone-100'
                   }`}
                 >
                   <span className="text-[10px] font-medium opacity-80">{day.date.split(' ')[0]}</span>
                   <span className="text-sm font-bold">{day.date.split(' ')[1].replace(/[()]/g, '')}</span>
                 </button>
               ))}
             </div>
             {/* Fade gradient on right indicating more content */}
             <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-washi to-transparent pointer-events-none"></div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto">
        {view === 'itinerary' && (
          <div className="p-4 space-y-6">
            
            {/* Weather & Day Info Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-3xl border border-indigo-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <CloudSun size={80} className="text-indigo-400" />
                </div>
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-1 text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">
                          <MapPin size={10} /> {currentLocation}
                        </div>
                        <h2 className="text-2xl font-bold text-sumi">{activeDay.date}</h2>
                      </div>
                      {/* Weather Display */}
                      <div className="flex flex-col items-end">
                         {activeDay.weather ? (
                           <>
                             <div className="flex items-center gap-2 text-indigo-900">
                               <CloudSun size={24} className="text-amber-500" />
                               <span className="text-xl font-bold">{activeDay.weather.split(' ')[1] || '5°C'}</span>
                             </div>
                             <span className="text-xs text-stone-500 font-medium">{activeDay.weather.split(' ')[0] || 'Clear'}</span>
                           </>
                         ) : (
                           <div className="flex flex-col items-end">
                             <div className="text-xs text-stone-400 bg-white/50 px-2 py-1 rounded">
                               {hasAnalyzed ? '無天氣資料' : '等待 AI 分析...'}
                             </div>
                           </div>
                         )}
                      </div>
                   </div>
                   
                   {/* Navigation Arrows for content area */}
                   <div className="flex gap-2 mt-4 pt-4 border-t border-indigo-100/50">
                      <button 
                        onClick={prevDay} 
                        disabled={activeDayIndex === 0}
                        className="flex-1 py-2 flex items-center justify-center gap-1 bg-white rounded-xl text-xs font-bold text-stone-600 shadow-sm disabled:opacity-50 active:scale-95 transition-transform"
                      >
                        <ChevronLeft size={14} /> 前一天
                      </button>
                      <button 
                        onClick={nextDay}
                        disabled={activeDayIndex === itinerary.length - 1}
                        className="flex-1 py-2 flex items-center justify-center gap-1 bg-white rounded-xl text-xs font-bold text-stone-600 shadow-sm disabled:opacity-50 active:scale-95 transition-transform"
                      >
                        後一天 <ChevronRight size={14} />
                      </button>
                   </div>
                </div>
            </div>

            {/* Morning Accommodation Header */}
            {morningHotel && (
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-stone-100">
                    <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                        <Sun size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] text-stone-400 uppercase tracking-wide font-bold">Starting from</div>
                        <div className="text-sm font-bold text-sumi">{morningHotel}</div>
                    </div>
                </div>
            )}

            {/* Timeline Events */}
            <div className="relative border-l-2 border-stone-200 ml-3 pl-6 pb-2 space-y-6">
              {activeDay.items.map((item) => (
                <div key={item.id} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-6 w-3 h-3 rounded-full bg-white border-2 border-stone-300 z-10 shadow-sm"></div>
                  <EventCard item={item} onUpdate={handleItemUpdate} />
                </div>
              ))}
            </div>

            {/* Night Accommodation Footer */}
            {nightHotel ? (
                <div className="flex items-center gap-3 bg-sumi p-4 rounded-xl shadow-sm border border-stone-800 text-white mt-4">
                    <div className="bg-indigo-900 p-2 rounded-full text-indigo-300">
                        <Moon size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] text-stone-400 uppercase tracking-wide font-bold">Staying at</div>
                        <div className="text-sm font-bold text-white">{nightHotel}</div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-4">
                    <div className="inline-block text-[10px] text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
                        End of {activeDay.date}
                    </div>
                </div>
            )}

          </div>
        )}

        {view === 'tools' && <ToolsView />}

        {view === 'settings' && (
          <div className="p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">設定</h2>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm mb-6 text-center">
              <p className="text-sm text-stone-500 mb-2">
                資料儲存狀態
              </p>
              <p className="text-xs text-stone-400 mb-4">
                您的行程與照片已自動儲存在此瀏覽器中。
              </p>
              
              <button 
                onClick={handleResetData}
                className="w-full py-3 bg-stone-100 text-stone-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} /> 重置所有資料
              </button>
            </div>

            <div className="text-center text-xs text-stone-400">
              ZenTravel v1.0.1 &bull; Japan & Korea Edition
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-sumi/90 backdrop-blur-lg text-stone-400 rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl shadow-stone-400/50 z-50">
        <button 
          onClick={() => setView('itinerary')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'itinerary' ? 'text-white' : 'hover:text-stone-200'}`}
        >
          <Map size={20} />
          <span className="text-[10px] font-medium">行程</span>
        </button>
        <button 
          onClick={() => setView('tools')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'tools' ? 'text-white' : 'hover:text-stone-200'}`}
        >
          <Briefcase size={20} />
          <span className="text-[10px] font-medium">工具</span>
        </button>
        <button 
          onClick={() => setView('settings')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'settings' ? 'text-white' : 'hover:text-stone-200'}`}
        >
          <Settings size={20} />
          <span className="text-[10px] font-medium">設定</span>
        </button>
      </nav>
    </div>
  );
}