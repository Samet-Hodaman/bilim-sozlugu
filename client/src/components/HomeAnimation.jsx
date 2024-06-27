import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export default function HomeAnimation() {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="flex w-3/4 justify-center items-center min-h-60 relative">
      <div className='m-4'>
        <motion.img
          className="flex w-16 h-auto md:w-20"
          src="./LogoBall.png"
          alt="Logo"
          drag
          dragConstraints={containerRef}
          dragElastic={0.1}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        />
      </div>
    </div>
  );
}
