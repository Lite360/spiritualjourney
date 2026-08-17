import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useSEO } from '../../hooks/useSEO';

const PrivacyPolicy: React.FC = () => {
  const [siteName, setSiteName] = useState('Spiritual Journey');

  useSEO({
    title: 'Privacy Policy',
    description: 'Privacy Policy for our users.',
    url: '/privacy',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('site_name').limit(1).single();
      if (data?.site_name) setSiteName(data.site_name);
    };
    fetchSettings();
  }, []);

  return (
    <div className="bg-primary-bg min-h-screen pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-serif text-primary-text mb-8">Privacy Policy</h1>
        
        <div className="prose prose-brown max-w-none font-sans text-secondary-dark/80">
          <p className="lead text-lg mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-serif text-primary-main mt-8 mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to {siteName}. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
          </p>

          <h2 className="text-2xl font-serif text-primary-main mt-8 mb-4">2. The Data We Collect About You</h2>
          <p className="mb-4">
            Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2"><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li className="mb-2"><strong>Contact Data</strong> includes email address and telephone numbers.</li>
            <li className="mb-2"><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
          </ul>

          <h2 className="text-2xl font-serif text-primary-main mt-8 mb-4">3. How We Use Your Personal Data</h2>
          <p className="mb-4">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li className="mb-2">Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li className="mb-2">Where we need to comply with a legal obligation.</li>
          </ul>

          <h2 className="text-2xl font-serif text-primary-main mt-8 mb-4">4. Data Security</h2>
          <p className="mb-4">
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
          </p>

          <h2 className="text-2xl font-serif text-primary-main mt-8 mb-4">5. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this privacy policy or our privacy practices, please contact us via our Contact page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
