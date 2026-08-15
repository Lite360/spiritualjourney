import React from 'react';
import { Headphones, PlayCircle, FileText } from 'lucide-react';

export const Teachings: React.FC = () => (
  <div className="bg-primary-bg min-h-screen py-20 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto text-center">
      <div className="inline-flex items-center justify-center p-4 bg-secondary-bg text-accent rounded-full mb-6">
        <PlayCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl md:text-5xl font-serif mb-6 text-primary-text">Teachings</h1>
      <p className="text-lg font-sans text-secondary-dark/80 max-w-2xl mx-auto mb-12">
        A curated collection of video messages and series. We are currently preparing this library.
      </p>
      <div className="bg-white border border-secondary-bg rounded-2xl p-12 shadow-sm max-w-3xl mx-auto">
        <h2 className="text-2xl font-serif mb-4">Coming Soon</h2>
        <p className="font-sans text-secondary-dark/70">
          We are working on bringing you high-quality video teachings. Subscribe to our newsletter to be notified when we launch.
        </p>
      </div>
    </div>
  </div>
);

export const Audio: React.FC = () => (
  <div className="bg-primary-bg min-h-screen py-20 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto text-center">
      <div className="inline-flex items-center justify-center p-4 bg-secondary-bg text-accent rounded-full mb-6">
        <Headphones className="w-8 h-8" />
      </div>
      <h1 className="text-4xl md:text-5xl font-serif mb-6 text-primary-text">Audio Messages & Podcasts</h1>
      <p className="text-lg font-sans text-secondary-dark/80 max-w-2xl mx-auto mb-12">
        Listen to sermons, devotionals, and conversations on the go.
      </p>
      <div className="bg-white border border-secondary-bg rounded-2xl p-12 shadow-sm max-w-3xl mx-auto">
        <h2 className="text-2xl font-serif mb-4">Coming Soon</h2>
        <p className="font-sans text-secondary-dark/70">
          Our audio library is being compiled. Stay tuned!
        </p>
      </div>
    </div>
  </div>
);

export const Resources: React.FC = () => (
  <div className="bg-primary-bg min-h-screen py-20 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto text-center">
      <div className="inline-flex items-center justify-center p-4 bg-secondary-bg text-accent rounded-full mb-6">
        <FileText className="w-8 h-8" />
      </div>
      <h1 className="text-4xl md:text-5xl font-serif mb-6 text-primary-text">Resources</h1>
      <p className="text-lg font-sans text-secondary-dark/80 max-w-2xl mx-auto mb-12">
        Downloadable devotionals, reading plans, and study guides.
      </p>
      <div className="bg-white border border-secondary-bg rounded-2xl p-12 shadow-sm max-w-3xl mx-auto">
        <h2 className="text-2xl font-serif mb-4">Coming Soon</h2>
        <p className="font-sans text-secondary-dark/70">
          We are currently designing helpful resources to aid your spiritual growth. 
        </p>
      </div>
    </div>
  </div>
);
