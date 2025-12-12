import React from 'react';

const BuildSitesHeader = ({ title, highlight, description }) => {
  return (
    <div className="w-full bg-[#F5F5F7] py-16 px-6 pt-28">
      <div className="max-w-[1400px] mx-auto text-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black tracking-tight leading-[0.9] mb-6">
          {title}{' '}
          <span className="bg-[#0055FF] ">
            {highlight}
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default BuildSitesHeader;