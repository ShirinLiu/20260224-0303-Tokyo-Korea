import React, { useState } from 'react';
import { FLIGHT_INFO, ACCOMMODATION } from '../constants';
import { Plane, Hotel, AlertCircle, Calculator, Phone, CreditCard } from 'lucide-react';

export const ToolsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'budget'>('info');
  const [expenses, setExpenses] = useState([
    { id: 1, item: '機票 (預估)', cost: 12000 },
    { id: 2, item: 'JR Pass / 新幹線', cost: 6000 },
    { id: 3, item: '住宿 (7晚)', cost: 15000 },
  ]);
  const [newItem, setNewItem] = useState('');
  const [newCost, setNewCost] = useState('');

  const addExpense = () => {
    if (newItem && newCost) {
      setExpenses([...expenses, { id: Date.now(), item: newItem, cost: parseInt(newCost) }]);
      setNewItem('');
      setNewCost('');
    }
  };

  const total = expenses.reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto">
      
      {/* Tab Switcher */}
      <div className="flex bg-stone-200 p-1 rounded-xl mb-6">
        <button 
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'info' ? 'bg-white shadow-sm text-sumi' : 'text-stone-500'}`}
        >
          行程資訊
        </button>
        <button 
          onClick={() => setActiveTab('budget')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'budget' ? 'bg-white shadow-sm text-sumi' : 'text-stone-500'}`}
        >
          記帳/預算
        </button>
      </div>

      {activeTab === 'info' ? (
        <div className="space-y-6">
          {/* Flights */}
          <section>
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Plane size={16} /> 航班資訊
            </h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-stone-100">
              {FLIGHT_INFO.map((f, i) => (
                <div key={i} className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-sumi">{f.route}</div>
                    <div className="text-xs text-stone-500">{f.time}</div>
                  </div>
                  <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded text-xs font-mono">{f.no}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Accommodation */}
          <section>
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Hotel size={16} /> 住宿資訊
            </h3>
            <div className="space-y-3">
              {ACCOMMODATION.map((h, i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sumi text-sm">{h.name}</h4>
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{h.dates}</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-2 flex items-start gap-1">
                     <span className="min-w-fit">📍</span> {h.address}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Emergency */}
          <section>
             <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertCircle size={16} /> 緊急聯絡
            </h3>
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
               <div className="flex items-center gap-3 mb-2">
                 <Phone size={18} className="text-rose-600" />
                 <div>
                   <div className="text-sm font-bold text-rose-800">日本救護車/火警: 119</div>
                   <div className="text-xs text-rose-600">警察局: 110</div>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <Phone size={18} className="text-rose-600" />
                 <div>
                   <div className="text-sm font-bold text-rose-800">韓國緊急專線: 119</div>
                   <div className="text-xs text-rose-600">外國人旅遊諮詢: 1330</div>
                 </div>
               </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-4">
           {/* Budget Summary */}
           <div className="bg-sumi text-washi p-6 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-stone-400 text-sm mb-1">總預算花費 (TWD)</div>
                <div className="text-3xl font-bold font-mono tracking-tight">${total.toLocaleString()}</div>
              </div>
              <Calculator className="absolute right-[-10px] bottom-[-10px] text-stone-700 opacity-20 w-32 h-32" />
           </div>

           {/* Add Item */}
           <div className="bg-white p-4 rounded-xl shadow-sm">
             <div className="flex gap-2 mb-2">
               <input 
                 type="text" 
                 placeholder="項目 (e.g. 晚餐)" 
                 value={newItem}
                 onChange={(e) => setNewItem(e.target.value)}
                 className="flex-1 bg-stone-50 border-none rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
               />
               <input 
                 type="number" 
                 placeholder="$" 
                 value={newCost}
                 onChange={(e) => setNewCost(e.target.value)}
                 className="w-20 bg-stone-50 border-none rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
               />
             </div>
             <button 
               onClick={addExpense}
               className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold active:scale-95 transition-transform"
             >
               新增支出
             </button>
           </div>

           {/* List */}
           <div className="bg-white rounded-xl shadow-sm overflow-hidden">
             {expenses.map((e) => (
               <div key={e.id} className="flex justify-between items-center p-4 border-b border-stone-100 last:border-0">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                     <CreditCard size={14} className="text-stone-500" />
                   </div>
                   <span className="text-sm font-medium text-stone-700">{e.item}</span>
                 </div>
                 <span className="font-mono text-stone-900 font-bold">${e.cost.toLocaleString()}</span>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};