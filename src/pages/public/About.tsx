import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="bg-primary-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="relative w-full aspect-[4/5] rounded-t-full bg-secondary-bg overflow-hidden shadow-lg border-8 border-white">
              {/* Fallback image if no real founder image is available yet */}
              <div className="absolute inset-0 bg-secondary-dark/10 flex items-center justify-center">
                <span className="text-secondary-dark/30 font-serif text-2xl">Ife Dayo</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary-text mb-6">
              Meet Ife Dayo
            </h1>
            <p className="text-xl text-secondary-dark/80 font-serif mb-8 italic">
              "Finding God. Discovering Purpose. Becoming More."
            </p>
            <div className="space-y-6 text-secondary-dark/70 font-sans text-lg">
              <p>
                Ife Dayo is the founder behind Spiritual Journey and a creative storyteller passionate about God's Word, purpose, identity, and personal transformation.
              </p>
              <p>
                What started as a simple desire to share daily reflections has grown into a platform dedicated to helping individuals navigate their faith journey with authenticity and grace.
              </p>
            </div>
            
            <div className="mt-10 flex flex-wrap gap-3">
              {['Instagram', 'YouTube', 'Facebook', 'X (Twitter)'].map((platform) => (
                <a key={platform} href="#" className="flex items-center gap-2 px-4 py-2 bg-secondary-bg text-secondary-dark text-sm font-sans rounded-full hover:bg-accent hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  {platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white px-4 sm:px-6 lg:px-8 border-y border-secondary-bg">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-serif text-primary-text mb-6">Our Mission</h2>
              <p className="text-secondary-dark/70 font-sans leading-relaxed">
                To provide a safe, inspiring space for believers to deepen their relationship with God, understand their true identity, and step confidently into their God-given purpose through biblical teachings and authentic storytelling.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-serif text-primary-text mb-6">Our Vision</h2>
              <p className="text-secondary-dark/70 font-sans leading-relaxed">
                To see a generation awakened to the reality of God's love, living intentionally, and transforming their communities through the power of the Gospel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-secondary-dark text-primary-bg px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-serif mb-6">Ready to start your journey?</h2>
        <p className="text-lg font-sans text-primary-bg/70 mb-10 max-w-2xl mx-auto">
          Explore our latest teachings, join upcoming programs, and become part of a community seeking more of God.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/blog" 
            className="px-8 py-3.5 bg-accent text-white text-base font-medium rounded-full hover:bg-accent/90 transition-colors"
          >
            Read the Blog
          </Link>
          <Link 
            to="/contact" 
            className="px-8 py-3.5 bg-transparent border border-primary-bg/30 text-primary-bg text-base font-medium rounded-full hover:bg-primary-bg/10 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
