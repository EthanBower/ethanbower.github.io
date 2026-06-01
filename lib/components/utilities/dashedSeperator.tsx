export default function DashedSeparator() {
  return (
    <div className="relative flex items-center justify-center w-full h-6 overflow-hidden">    
      <div 
        className="w-full h-[2px] flex"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
        }}
      >
        <div 
          className="w-1/2 h-full scale-x-[-1]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='2'%3E%3Crect x='2' y='0' width='14' height='2' rx='1' ry='1' fill='%239ca3af' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '24px 2px',
            backgroundPosition: 'right center',
            animation: 'flow-right 2s linear infinite'
          }}
        />
                <div 
          className="w-1/2 h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='2'%3E%3Crect x='2' y='0' width='14' height='2' rx='1' ry='1' fill='%239ca3af' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '24px 2px',
            backgroundPosition: 'left center',
            animation: 'flow-right 2s linear infinite'
          }}
        />
      </div>
    </div>
  );
}