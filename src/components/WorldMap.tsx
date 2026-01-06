const WorldMap = () => {
  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Animated background circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full max-w-md max-h-md rounded-full bg-bridgeblue-50/30 blur-2xl animate-pulse-light"></div>
        </div>
        
        {/* Image with animation */}
        <div className="relative z-10 transform transition-transform duration-700 hover:scale-110">
          <img 
            src="/bridge_icon%202.png" 
            alt="World Icon" 
            className="w-full h-full max-w-md max-h-md object-contain drop-shadow-2xl animate-float"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
