import React, { useState, useEffect } from "react";

function DynamicIsland() {
  return (
    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-full z-[60] flex items-center justify-between px-3.5 shadow-md pointer-events-none">
      <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 ring-1 ring-neutral-700" />
      <div className="relative w-3 h-3 rounded-full bg-neutral-950 ring-1 ring-neutral-800">
        <div className="absolute inset-[3px] rounded-full bg-[#0b1f2a]" />
        <div className="absolute top-[3px] left-[3px] w-[3px] h-[3px] rounded-full bg-sky-300/80" />
      </div>
    </div>
  );
}

export default function IPhoneFrame({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  if (isMobile) {
    // Native full-screen mobile experience — no device frame
    return (
      <div className="relative h-[100dvh] w-full overflow-hidden bg-white">
        <DynamicIsland />
        {children}
      </div>
    );
  }

  // Desktop: realistic iPhone 17 Pro device frame
  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-neutral-300 via-neutral-200 to-neutral-400 flex items-center justify-center p-4 sm:p-12">
      <div className="relative w-[min(430px,94vw)] h-[min(920px,94dvh)] rounded-[4rem] p-[7px] bg-gradient-to-b from-neutral-200 via-neutral-400 to-neutral-600 shadow-[0_40px_120px_rgba(0,0,0,0.55),0_0_0_2px_rgba(255,255,255,0.5)_inset]">
        <div className="absolute inset-0 rounded-[4rem] ring-2 ring-white/50 pointer-events-none" />
        <div className="absolute inset-0 rounded-[4rem] ring-1 ring-inset ring-black/25 pointer-events-none" />

        <div className="absolute inset-[7px] rounded-[3.5rem] bg-black p-[13px]">
          <div className="relative w-full h-full rounded-[2.7rem] overflow-hidden bg-white">
            <DynamicIsland />
            {children}
          </div>
        </div>

        {/* Left side — Action button + Volume up + Volume down */}
        <div className="absolute -left-[7px] top-[100px] w-[7px] h-8 rounded-l-md bg-gradient-to-b from-neutral-300 to-neutral-500" />
        <div className="absolute -left-[7px] top-[170px] w-[7px] h-14 rounded-l-md bg-gradient-to-b from-neutral-300 to-neutral-500" />
        <div className="absolute -left-[7px] top-[245px] w-[7px] h-14 rounded-l-md bg-gradient-to-b from-neutral-300 to-neutral-500" />

        {/* Right side — Camera Control + Power */}
        <div className="absolute -right-[7px] top-[185px] w-[7px] h-10 rounded-r-md bg-gradient-to-b from-neutral-300 to-neutral-500" />
        <div className="absolute -right-[7px] top-[270px] w-[7px] h-20 rounded-r-md bg-gradient-to-b from-neutral-300 to-neutral-500" />
      </div>
    </div>
  );
}