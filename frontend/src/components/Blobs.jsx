import React from 'react';

const Blobs = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      {/* Additional subtle accent blobs */}
      <div className="absolute top-[20%] right-[10%] w-[300px] height-[300px] bg-gold-500/5 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-[30%] left-[15%] w-[400px] height-[400px] bg-gold-600/5 blur-[150px] rounded-full"></div>
    </div>
  );
};

export default Blobs;
