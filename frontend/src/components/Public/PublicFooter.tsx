import React from "react";
import { Link } from "react-router-dom";
import { CloudIcon } from "@heroicons/react/24/solid";

const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-[#192A51] py-8 px-6 border-t border-blue-900/30">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <CloudIcon className="h-8 w-8 text-purple-500" />
              <span className="text-white text-xl font-bold">CloudBoi</span>
            </Link>
            <p className="text-gray-400">
              Your cloud infrastructure solution for powerful, flexible computing resources.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/use-cases" className="text-gray-400 hover:text-white transition-colors">Use Cases</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/documentation" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link to="/support" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/legal" className="text-gray-400 hover:text-white transition-colors">Legal</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-900/30 mt-8 pt-4 text-center text-gray-400">
          <p>© {new Date().getFullYear()} CloudBoi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
