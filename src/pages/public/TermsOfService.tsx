import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useSEO } from '../../hooks/useSEO';

const TermsOfService: React.FC = () => {
  const [siteName, setSiteName] = useState('Spiritual Journey');

  useSEO({
    title: 'Terms of Service',
    description: 'Terms of Service and conditions of use.',
    url: '/terms',
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
        <h1 className="text-4xl font-serif text-primary-text mb-8">Terms of Service</h1>
        
        <div className="prose prose-brown max-w-none font-sans text-secondary-dark/80">
          <p className="lead text-lg mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-serif text-primary-main mt-8 mb-4">1. Agreement to Terms</h2>
          <p className="mb-4">
            By accessing or using {siteName}, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>

          <h2 className="text-2xl font-serif text-primary-main mt-8 mb-4">2. Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily download one copy of the materials (information or software) on {siteName} for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">modify or copy the materials;</li>
            <li className="mb-2">use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li className="mb-2">attempt to decompile or reverse engineer any software contained on the website;</li>
            <li className="mb-2">remove any copyright or other proprietary notations from the materials; or</li>
            <li className="mb-2">transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>

          <h2 className="text-2xl font-serif text-primary-main mt-8 mb-4">3. Disclaimer</h2>
          <p className="mb-4">
            The materials on {siteName} are provided on an 'as is' basis. {siteName} makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2 className="text-2xl font-serif text-primary-main mt-8 mb-4">4. Limitations</h2>
          <p className="mb-4">
            In no event shall {siteName} or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on {siteName}, even if {siteName} or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>

          <h2 className="text-2xl font-serif text-primary-main mt-8 mb-4">5. Governing Law</h2>
          <p className="mb-4">
            These terms and conditions are governed by and construed in accordance with the laws, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
