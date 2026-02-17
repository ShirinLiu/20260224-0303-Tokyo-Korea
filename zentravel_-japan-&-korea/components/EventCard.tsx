import React, { useState, useRef } from 'react';
import { ItineraryItem, EventType, Tag } from '../types';
import { Plane, Train, MapPin, BedDouble, Navigation, ShoppingBag, Utensils, AlertTriangle, Receipt, Ticket, ChevronDown, ChevronUp, Image as ImageIcon, Camera, Plus, QrCode, Sparkles, ChefHat, Info, Trash2, X } from 'lucide-react';

interface EventCardProps {
  item: ItineraryItem;
  onUpdate: (updatedItem: ItineraryItem) => void;
}

// Utility to compress image to prevent localStorage overflow
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // Limit width to 800px
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Export as JPEG with 0.7 quality
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

const TagBadge: React.FC<{ tag: Tag }> = ({ tag }) => {
  const styles = {
    food: "bg-orange-100 text-orange-700 border-orange-200",
    shopping: "bg-rose-100 text-rose-700 border-rose-200",
    reservation: "bg-blue-100 text-blue-700 border-blue-200 font-mono font-bold",
    alert: "bg-red-100 text-red-700 border-red-200 font-bold",
    info: "bg-stone-100 text-stone-600 border-stone-200",
  };
  
  const icons = {
    food: <Utensils size={10} />,
    shopping: <ShoppingBag size={10} />,
    reservation: <Receipt size={10} />,
    alert: <AlertTriangle size={10} />,
    info: null
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border ${styles[tag.type] || styles.info}`}>
      {icons[tag.type]}
      {tag.label}
    </span>
  );
};

// --- New Component: AI Guide Recommendation (Text Only) ---
const GuideRecommendation: React.FC<{ guide: NonNullable<ItineraryItem['guideRecommendation']> }> = ({ guide }) => {
  return (
    <div className="mt-4 mb-2 animate-in fade-in slide-in-from-top-2">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl overflow-hidden border border-orange-100 shadow-sm">
        
        {/* Header */}
        <div className="px-3 py-2 border-b border-orange-100/50 flex items-center gap-2">
           <Sparkles size={14} className="text-amber-500 fill-amber-500" />
           <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">AI Guide Recommends</span>
        </div>

        <div className="p-3">
           <div className="mb-3">
             <div className="flex items-center gap-1 text-[10px] text-orange-400 font-bold uppercase mb-0.5">
                <ChefHat size={12} /> Must Order
             </div>
             <div className="text-sm font-bold text-stone-800 leading-tight">
                {guide.mustOrder}
             </div>
           </div>
           
           <div>
             <div className="flex items-center gap-1 text-[10px] text-orange-400 font-bold uppercase mb-0.5">
                <Info size={12} /> Insider Tips
             </div>
             <div className="text-xs text-stone-600 leading-relaxed">
                {guide.tips}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- New Component: Digital Ticket / Voucher View ---
const DigitalVoucher: React.FC<{ item: ItineraryItem }> = ({ item }) => {
  // Extract critical info from tags and notes
  const resTag = item.tags?.find(t => t.type === 'reservation' || t.label.includes('Res') || t.label.includes('PIN') || t.label.includes('訂房'));
  const seatTag = item.tags?.find(t => t.label.includes('座位') || t.label.includes('Seat'));
  const foodTag = item.tags?.find(t => t.type === 'food' && (t.label.includes('壽喜燒') || t.label.includes('Course') || t.label.includes('生日')));
  
  const hasInfo = resTag || seatTag || item.code || foodTag;

  if (!hasInfo) return null;

  return (
    <div className="mt-4 pt-4 border-t border-dashed border-stone-300 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 shadow-inner relative overflow-hidden">
        {/* Decorative Circle Cutouts */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-r border-stone-200"></div>
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-l border-stone-200"></div>

        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4 flex items-center justify-between">
           <span className="flex items-center gap-2"><Receipt size={14} /> Confirmation Details</span>
           <span className="text-[9px] bg-stone-200 px-1.5 py-0.5 rounded text-stone-500">CONFIRMED</span>
        </h4>
        
        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
          {item.code && (
             <div className="col-span-1">
               <div className="text-[9px] text-stone-500 uppercase tracking-wide">Flight / Train No.</div>
               <div className="text-base font-bold text-sumi font-mono">{item.code}</div>
             </div>
          )}
          
          {resTag && (
             <div className="col-span-1">
               <div className="text-[9px] text-stone-500 uppercase tracking-wide">Booking Reference</div>
               <div className="text-base font-bold text-indigo-600 font-mono break-all">{resTag.label.replace(/Res:|PIN:|訂房代號:/gi, '').trim()}</div>
             </div>
          )}

          {seatTag && (
             <div className="col-span-2 bg-white p-2 rounded border border-stone-100">
               <div className="text-[9px] text-stone-500 uppercase tracking-wide mb-1">Assigned Seat / Room</div>
               <div className="text-sm font-bold text-sumi flex items-center gap-2">
                 <Ticket size={14} className="text-amber-500" />
                 {seatTag.label}
               </div>
             </div>
          )}
          
          {foodTag && (
             <div className="col-span-2 bg-white p-2 rounded border border-stone-100">
               <div className="text-[9px] text-stone-500 uppercase tracking-wide mb-1">Course / Menu</div>
               <div className="text-sm font-bold text-sumi flex items-center gap-2">
                 <Utensils size={14} className="text-orange-500" />
                 {foodTag.label}
               </div>
             </div>
          )}
        </div>

        {/* Barcode simulation */}
        <div className="mt-5 pt-4 border-t border-stone-200 flex items-center justify-between gap-4">
           <div className="h-10 flex-1 bg-stone-200 rounded flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 flex gap-0.5 justify-center opacity-40">
                 {[...Array(60)].map((_,i) => (
                   <div key={i} className={`bg-black h-full`} style={{width: Math.random() > 0.5 ? '2px' : '1px'}}></div>
                 ))}
              </div>
           </div>
           <QrCode size={40} className="text-stone-800 opacity-80" />
        </div>
      </div>
    </div>
  );
};

export const EventCard: React.FC<EventCardProps> = ({ item, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openMap = (loc: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loc)}&travelmode=driving`, '_blank');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const base64 = await compressImage(file);
        const updatedAttachments = [...(item.attachments || []), base64];
        onUpdate({ ...item, attachments: updatedAttachments });
      } catch (err) {
        console.error("Image upload error", err);
        alert("圖片處理失敗");
      } finally {
        setIsUploading(false);
      }
    }
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveAttachment = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedAttachments = item.attachments?.filter((_, index) => index !== indexToRemove);
    onUpdate({ ...item, attachments: updatedAttachments });
  };

  const triggerFileUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // --- Attachment Component (Full Width Images with Delete) ---
  const AttachmentSection = () => {
    return (
      <div onClick={(e) => e.stopPropagation()} className="mt-4 mb-2 animate-in fade-in">
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageUpload} 
        />
        
        <div className="flex items-center justify-between mb-2">
            <h5 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                <ImageIcon size={12} /> My Documents & Photos
            </h5>
        </div>

        <div className="space-y-3">
            {/* Existing Images */}
            {item.attachments?.map((url, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden shadow-sm border border-stone-200 bg-stone-100 flex items-center justify-center min-h-[100px]">
                    <img 
                      src={url} 
                      alt="Attachment" 
                      className="w-full h-auto object-contain" 
                      style={{ maxHeight: '500px' }}
                      onError={(e) => {
                        // Fallback handling if local image is missing
                        // We simply hide the image or show a placeholder styled div
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        // Add a visible text message next to it in DOM if needed, 
                        // but for now, hiding broken images keeps the UI clean.
                        // Or we can set a placeholder:
                        // target.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                        // target.style.display = 'block';
                      }}
                    />
                    
                    {/* Fallback Text (Only visible if img is hidden by onError/CSS) */}
                    <div className="absolute inset-0 -z-10 flex items-center justify-center text-stone-400 text-xs">
                       Image not found
                    </div>

                    {/* Delete Button Overlay */}
                    <button 
                      onClick={(e) => handleRemoveAttachment(i, e)}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-red-500/80 backdrop-blur-md text-white p-1.5 rounded-full transition-colors shadow-sm opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                </div>
            ))}

            {/* Add New Photo Button Area */}
            <button 
              onClick={triggerFileUpload}
              disabled={isUploading}
              className="w-full py-3 border-2 border-dashed border-stone-200 rounded-xl flex items-center justify-center gap-2 text-stone-400 hover:text-stone-600 hover:border-stone-300 hover:bg-stone-50 transition-all disabled:opacity-50"
            >
              {isUploading ? (
                  <span className="text-xs font-bold animate-pulse">處理中...</span>
              ) : (
                  <>
                      <Camera size={16} />
                      <span className="text-xs font-bold">新增照片 / 上傳憑證</span>
                  </>
              )}
            </button>
        </div>
      </div>
    );
  };

  // --- Transport Card Design (Flight/Train) ---
  if (item.type === EventType.FLIGHT || item.type === EventType.TRAIN) {
    return (
      <div 
        onClick={toggleExpand}
        className={`relative mb-4 bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden group transition-all cursor-pointer ${isExpanded ? 'ring-2 ring-indigo-100' : ''}`}
      >
        {/* Top: Ticket Header */}
        <div className={`px-4 py-3 flex justify-between items-center ${item.type === EventType.FLIGHT ? 'bg-sky-50' : 'bg-emerald-50'} border-b border-stone-100`}>
           <div className="flex items-center gap-2">
             {item.type === EventType.FLIGHT ? <Plane size={16} className="text-sky-600" /> : <Train size={16} className="text-emerald-600" />}
             <span className="font-bold text-sumi text-sm">{item.code || item.title}</span>
           </div>
           
           <div className="flex gap-2">
             <button 
                onClick={triggerFileUpload}
                className="p-1.5 rounded-full bg-white/50 hover:bg-white text-stone-500 transition-all"
             >
                <Plus size={14} />
             </button>
             {/* Icon indicator if attachments exist but collapsed */}
             {item.attachments && item.attachments.length > 0 && !isExpanded && (
                <div className="p-1.5 rounded-full bg-indigo-50 text-indigo-500">
                  <ImageIcon size={14} />
                </div>
             )}
             <ChevronDown size={16} className={`text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
           </div>
        </div>

        {/* Middle: Route & Time */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center min-w-[60px]">
               <div className="text-xl font-bold text-sumi">{item.startTime}</div>
               <div className="text-[10px] text-stone-400 font-medium truncate max-w-[80px]">{item.startLocation?.split(' ')[0]}</div>
            </div>
            
            <div className="flex-1 flex flex-col items-center px-4">
               <div className="text-[10px] text-stone-400 mb-1">{item.title}</div>
               <div className="w-full h-[1px] bg-stone-300 relative">
                 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-stone-300"></div>
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-stone-300"></div>
                 <Plane size={12} className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-stone-300 ${item.type === EventType.FLIGHT ? '' : 'hidden'}`} />
               </div>
               <div className="text-[10px] text-stone-400 mt-1">{item.endTime ? '直達' : '出發'}</div>
            </div>

            <div className="text-center min-w-[60px]">
               <div className="text-xl font-bold text-sumi">{item.endTime || '--:--'}</div>
               <div className="text-[10px] text-stone-400 font-medium truncate max-w-[80px]">{item.endLocation?.split(' ')[0]}</div>
            </div>
          </div>

          {/* Tags Row */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
               {item.tags.map((tag, i) => <TagBadge key={i} tag={tag} />)}
            </div>
          )}

          {/* Render Full Images ONLY when expanded */}
          {isExpanded && <AttachmentSection />}
          
          {isExpanded && <DigitalVoucher item={item} />}

          {/* Detailed Walking Guide Toggle */}
          {(item.detailedWalkingGuide || item.walkingRoute) && isExpanded && (
             <div className="mt-3 animate-in fade-in slide-in-from-top-1">
               <button 
                 onClick={(e) => { e.stopPropagation(); setShowGuide(!showGuide); }}
                 className="w-full flex justify-between items-center bg-stone-50 p-2 rounded-lg text-xs text-stone-600 font-medium"
               >
                 <span className="flex items-center gap-1">🚶 前往搭乘位置</span>
                 {showGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
               </button>
               {showGuide && (
                 <div className="bg-stone-50 px-3 pb-3 pt-1 rounded-b-lg border-t border-stone-100">
                    {item.walkingRoute && <div className="text-xs text-stone-500 mb-2">{item.walkingRoute}</div>}
                    {item.detailedWalkingGuide?.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-2 text-xs text-stone-600 mb-1.5 last:mb-0">
                        <div className="min-w-[16px] h-[16px] rounded-full bg-white border border-stone-200 flex items-center justify-center text-[9px] font-bold text-stone-400">{idx + 1}</div>
                        <span>{step}</span>
                      </div>
                    ))}
                    {item.detailedWalkingGuide?.mapImage && (
                      <div className="mt-2 rounded-lg overflow-hidden border border-stone-200">
                         <img src={item.detailedWalkingGuide.mapImage} alt="Map" className="w-full h-auto object-cover opacity-90" />
                      </div>
                    )}
                 </div>
               )}
             </div>
          )}
        </div>

        {/* Action Buttons */}
        {isExpanded && (
            <div className="grid grid-cols-2 border-t border-stone-100 animate-in fade-in">
            <button 
                onClick={(e) => openMap(item.startLocation || '', e)}
                className="py-3 text-xs font-bold text-ai flex items-center justify-center gap-1 hover:bg-stone-50"
            >
                <Navigation size={14} />
                導航起點
            </button>
            <button 
                onClick={(e) => openMap(item.endLocation || '', e)}
                className="py-3 text-xs font-bold text-ai flex items-center justify-center gap-1 border-l border-stone-100 hover:bg-stone-50"
            >
                <Navigation size={14} />
                導航終點
            </button>
            </div>
        )}
      </div>
    );
  }

  // --- Stay Card Design ---
  if (item.type === EventType.STAY) {
    return (
      <div 
        onClick={toggleExpand}
        className={`relative mb-4 bg-white rounded-2xl shadow-sm border-l-4 border-l-indigo-400 overflow-hidden cursor-pointer transition-all ${isExpanded ? 'ring-2 ring-indigo-100' : ''}`}
      >
        <div className="p-4">
           <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold mb-1 uppercase tracking-wider">
                <BedDouble size={14} /> Check-in / Stay
              </div>
              <div className="flex gap-2">
                 <button 
                    onClick={triggerFileUpload}
                    className="p-1.5 rounded-full bg-white/50 hover:bg-stone-100 text-stone-500 transition-all"
                 >
                    <Plus size={14} />
                 </button>
                 {item.attachments && item.attachments.length > 0 && !isExpanded && (
                    <div className="text-stone-400"><ImageIcon size={16} /></div>
                 )}
                 <ChevronDown size={16} className={`text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
           </div>
           
           <h3 className="text-lg font-bold text-sumi mb-1">{item.notes?.split('入住 ')[1]?.split(',')[0] || item.title}</h3>
           <p className="text-xs text-stone-500 mb-3 flex items-start gap-1">
             <MapPin size={12} className="mt-0.5" />
             {item.startLocation || item.endLocation}
           </p>

           {/* Tags */}
           {item.tags && (
             <div className="flex flex-wrap gap-1 mb-3">
               {item.tags.map((tag, i) => <TagBadge key={i} tag={tag} />)}
             </div>
           )}

           {isExpanded && <AttachmentSection />}
           {isExpanded && <DigitalVoucher item={item} />}

           {/* Walking Guide */}
           {item.walkingRoute && (
             <div className="bg-indigo-50 p-2 rounded-lg text-xs text-indigo-800 flex items-start gap-2 mb-3 mt-3">
               <span className="font-bold min-w-fit">🚶 路線:</span>
               {item.walkingRoute}
             </div>
           )}

           {isExpanded && (
                <button 
                    onClick={(e) => openMap(item.startLocation || item.endLocation || '', e)}
                    className="w-full py-2 bg-sumi text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform mt-2"
                >
                    <Navigation size={14} />
                    開始導航
                </button>
           )}
        </div>
      </div>
    );
  }

  // --- General Activity/Shopping Card ---
  return (
    <div 
        onClick={toggleExpand}
        className={`relative mb-4 bg-white rounded-2xl shadow-sm border-l-4 border-l-rose-300 p-4 cursor-pointer transition-all ${isExpanded ? 'ring-2 ring-rose-100' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-xs text-stone-400 font-medium mb-1 flex items-center gap-1">
             {item.type === EventType.SHOPPING ? <ShoppingBag size={12} /> : <MapPin size={12} />}
             {item.startTime || 'Free Time'}
          </div>
          <h3 className="text-lg font-bold text-sumi">{item.title}</h3>
        </div>
        <div className="flex gap-2">
             <button 
                onClick={triggerFileUpload}
                className="p-1.5 rounded-full bg-white/50 hover:bg-stone-100 text-stone-500 transition-all"
             >
                <Plus size={14} />
             </button>
             {item.attachments && item.attachments.length > 0 && !isExpanded && (
                <div className="p-1.5 rounded-full bg-rose-50 text-rose-500">
                  <ImageIcon size={14} />
                </div>
             )}
             <ChevronDown size={16} className={`text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      <div className="text-sm text-stone-600 mb-3 leading-relaxed">
        {item.notes}
      </div>

      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {item.tags.map((tag, i) => <TagBadge key={i} tag={tag} />)}
        </div>
      )}

      {/* Guide Recommendation Section */}
      {isExpanded && item.guideRecommendation && (
         <GuideRecommendation guide={item.guideRecommendation} />
      )}

      {isExpanded && <AttachmentSection />}
      {isExpanded && <DigitalVoucher item={item} />}

      {item.startLocation && isExpanded && (
        <button 
          onClick={(e) => openMap(item.startLocation!, e)}
          className="w-full py-2 border border-stone-200 text-sumi rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-stone-50 active:scale-95 transition-transform mt-3"
        >
          <Navigation size={14} />
          導航前往
        </button>
      )}
    </div>
  );
};