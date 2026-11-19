import { motion, useMotionValue, useTransform } from "framer-motion";

export default function ProfileCard({ profile, onSwipe, disabled }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [40, 160], [0, 1]);
  const passOpacity = useTransform(x, [-160, -40], [1, 0]);

  async function handleDragEnd(_, info) {
    if (disabled) return;
    if (info.offset.x > 100) await onSwipe("like");
    else if (info.offset.x < -100) await onSwipe("pass");
  }

  return (
    <motion.div
      drag={disabled ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate }}
      whileTap={{ cursor: "grabbing" }}
      className="relative w-[88vw] max-w-[380px] max-h-[65vh] aspect-[3/4.5] mx-auto bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden select-none touch-pan-y flex flex-col"
    >
     
      <motion.div 
        style={{ opacity: likeOpacity }} 
        className="absolute top-4 left-4 z-20 border-[3px] border-green-500 text-green-500 font-black text-lg px-3 py-1 rounded-lg rotate-[-15deg] bg-white/90 backdrop-blur-sm tracking-widest shadow-lg"
      >
        LIKE
      </motion.div>
      <motion.div 
        style={{ opacity: passOpacity }} 
        className="absolute top-4 right-4 z-20 border-[3px] border-red-500 text-red-500 font-black text-lg px-3 py-1 rounded-lg rotate-[15deg] bg-white/90 backdrop-blur-sm tracking-widest shadow-lg"
      >
        PASS
      </motion.div>

      <div className="relative w-full h-[55%] bg-gray-200 shrink-0">
        <img
          src={profile.photo}
          alt={profile.name}
          draggable={false}
          className="w-full h-full object-cover object-center pointer-events-none"
        />
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h2 className="text-2xl font-bold flex items-baseline gap-2 drop-shadow-md">
            {profile.name} <span className="text-lg font-medium opacity-90">{profile.age}</span>
          </h2>
          <p className="text-xs font-medium flex items-center gap-1 opacity-90 drop-shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {profile.city}
          </p>
        </div>
      </div>

     
      <div className="w-full h-[45%] bg-white p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">About</h3>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
            {profile.bio}
          </p>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Interests</h3>
          <div className="flex flex-wrap gap-1.5 max-h-[50px] overflow-hidden">
            {profile.interests.map(tag => (
              <span key={tag} className="text-[10px] font-semibold bg-pink-50 text-brand-pink border border-pink-100 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}