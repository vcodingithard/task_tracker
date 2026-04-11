import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-900 text-slate-300 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-8">

          {/* Left: Branding */}
          <div>
            <h2 className="text-xl font-bold text-white">Health AI</h2>
            <p className="text-sm text-slate-400 mt-2">
              AI-powered healthcare insights for smarter living.
            </p>
            <p className="text-xs mt-3 text-slate-500">
              📍 Mangalore, Karnataka
            </p>
          </div>

          {/* Middle: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-white transition">Home</a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-white transition">Dashboard</a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition">About</a>
              </li>
            </ul>
          </div>

          {/* Right: Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Contact</h3>
            <div className="space-y-2 text-sm">
              <p>📧 vivekshenoy6763@gmail.com</p>
              <p>91+9901177522</p>
              <div className="flex gap-4 mt-2">
                <a 
                  href="https://github.com/vcodingithard" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  GitHub
                </a>

                <a 
                  href="https://www.linkedin.com/in/vivek-shenoy-55b20b319/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {currentYear} Vivek Shenoy</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;