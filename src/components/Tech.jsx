import React from "react";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const TechCard = ({ technology }) => {
  return (
    <div
      className='w-24 h-24 sm:w-28 sm:h-28 relative flex items-center justify-center cursor-pointer group'
    >
      {/* Outer pulsing radial glow on hover */}
      <div className="absolute inset-2 rounded-full bg-violet-accent/0 group-hover:bg-gradient-to-tr group-hover:from-violet-accent/10 group-hover:to-[#00cea8]/10 group-hover:blur-md transition-all duration-700 scale-95 group-hover:scale-110 pointer-events-none" />

      {/* Main Mandala Circle */}
      <div 
        className='w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-500 transform group-hover:scale-110'
      >
        <img
          src={technology.icon}
          alt={technology.name}
          className='w-full h-full object-contain mandala-rotate-slow'
        />
      </div>

      {/* Premium Elegant Tooltip */}
      <div className="absolute bottom-[-20px] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 transform translate-y-2 group-hover:translate-y-0">
        <span className="bg-[#151030]/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md border border-white/10 shadow-lg tracking-wider whitespace-nowrap">
          {technology.name}
        </span>
      </div>
    </div>
  );
};

const Tech = () => {
  return (
    <div className='flex flex-row flex-wrap justify-center gap-10 sm:gap-12'>
      {technologies.map((technology) => (
        <TechCard key={technology.name} technology={technology} />
      ))}
    </div>
  );
};

export default SectionWrapper(Tech, "");
