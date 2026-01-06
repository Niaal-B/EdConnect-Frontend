const WorldMap = () => {
  return (
    <div className="relative w-full h-full min-h-[280px] sm:min-h-[300px] flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Animated background circle - hidden on very small screens */}
        <div className="absolute inset-0 flex items-center justify-center hidden xs:flex">
          <div className="w-full h-full max-w-[280px] max-h-[280px] sm:max-w-md sm:max-h-md rounded-full bg-bridgeblue-50/30 blur-2xl animate-pulse-light"></div>
        </div>
        
        {/* Image with animation */}
        <div className="relative z-10 transform transition-transform duration-700 hover:scale-110 active:scale-100">
          <img 
            src="/bridge_icon%202.png" 
            alt="World Icon" 
            className="w-full h-full max-w-[240px] max-h-[240px] xs:max-w-[280px] xs:max-h-[280px] sm:max-w-md sm:max-h-md object-contain drop-shadow-2xl animate-float"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
