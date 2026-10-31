import React from 'react';
import { type NavSectionId } from '../data/portfolioData';

interface ScrollCraftHudProps {
  activeSection?: NavSectionId;
  darkMode?: boolean;
  onNavigate?: (sectionId: NavSectionId) => void;
}

export const ScrollCraftHud: React.FC<ScrollCraftHudProps> = () => {
  return (
    <>
      {/* Top 2px Scroll-Craft Progress Ribbon driven by scrollcraft.js */}
      <div data-sc-progress aria-hidden="true" />

      {/* Atmospheric Studio Grain Layer from scrollcraft.css */}
      <div className="sc-grain" aria-hidden="true" />
    </>
  );
};
