import { Shield, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Description */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="bg-blue-600 p-1 rounded">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Blockchain Supply Chain
              </p>
              <p className="text-xs text-gray-500">
                Secure • Transparent • Traceable
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <a 
              href="#" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Documentation
            </a>
            <a 
              href="#" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Support
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a 
              href="#" 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500">
            © 2024 Blockchain Supply Chain Management. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

