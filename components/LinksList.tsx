"use client";

import { FaGithub, FaLinkedin, FaTwitter, FaBehance, FaDribbble, FaGlobe, FaExternalLinkAlt } from "react-icons/fa";

interface LinksListProps {
  links: { label: string; url: string }[];
}

export function LinksList({ links }: LinksListProps) {
  // Early return for invalid or empty links
  if (!links || !Array.isArray(links) || links.length === 0) {
    return null;
  }

  const getIcon = (label: string | undefined | null) => {
    // Handle undefined, null, or empty labels
    if (!label || typeof label !== 'string' || label.trim() === '') {
      return <FaExternalLinkAlt size={18} />;
    }
    
    try {
      const lower = label.toLowerCase();
      
      if (lower.includes('github')) return <FaGithub size={20} />;
      if (lower.includes('linkedin')) return <FaLinkedin size={20} />;
      if (lower.includes('twitter')) return <FaTwitter size={20} />;
      if (lower.includes('behance')) return <FaBehance size={20} />;
      if (lower.includes('dribbble')) return <FaDribbble size={20} />;
      if (lower.includes('portfolio') || lower.includes('website')) return <FaGlobe size={20} />;
      
      return <FaExternalLinkAlt size={18} />;
    } catch (error) {
      console.warn('Error processing label in getIcon:', error);
      return <FaExternalLinkAlt size={18} />;
    }
  };

  // Filter out invalid links with comprehensive validation
  const validLinks = links.filter(link => {
    try {
      return (
        link && 
        typeof link === 'object' && 
        link.url && 
        typeof link.url === 'string' &&
        link.url.trim() !== '' &&
        (link.url.startsWith('http') || link.url.startsWith('mailto:') || link.url.includes('.'))
      );
    } catch (error) {
      console.warn('Error validating link:', error);
      return false;
    }
  });

  if (validLinks.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 print:hidden">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">External Links</h3>
      <div className="flex flex-wrap gap-4">
        {validLinks.map((link, index) => {
          // Additional safety check for each link
          if (!link || !link.url) return null;
          
          const safeLabel = link.label && typeof link.label === 'string' && link.label.trim() !== '' 
            ? link.label.trim() 
            : 'External Link';
          
          return (
            <a
              key={`link-${index}-${link.url}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <span className="text-blue-600 group-hover:text-blue-700 transition-colors">
                {getIcon(link.label)}
              </span>
              <span className="text-gray-700 group-hover:text-gray-900 font-medium transition-colors">
                {safeLabel}
              </span>
              <FaExternalLinkAlt size={12} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            </a>
          );
        })}
      </div>
    </section>
  );
} 