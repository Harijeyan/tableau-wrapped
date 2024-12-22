'use client';

import { useRef } from 'react';
import { TableauStats } from '@/types';
import { FaUsers, FaUser, FaEye, FaStar } from 'react-icons/fa';
import html2canvas from 'html2canvas';

interface BentoGridProps {
  stats: TableauStats;
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

const getLegacyBadge = (joinDate: number | null) => {
  console.log('joinDate value:', joinDate);
  
  if (joinDate === null || joinDate === undefined || joinDate === 0) {
    return {
      badge: "Legacy Creator 🏆",
      description: "Part of Tableau&apos;s history since the early days",
      class: "legacy-member"
    };
  }
  return null;
};

export default function BentoGrid({ stats }: BentoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (gridRef.current) {
      try {
        // Wait for everything to load
        await document.fonts.ready;
        await Promise.all([...document.fonts].map(font => font.load()));
        await Promise.all([...document.images].map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }));

        // Create temporary container
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        document.body.appendChild(tempContainer);

        // Clone and preserve exact styles
        const clone = gridRef.current.cloneNode(true) as HTMLElement;
        clone.style.width = '606px';
        clone.style.height = '550px';
        clone.style.transform = 'none';
        clone.style.padding = '24px'; // Ensure consistent padding
        tempContainer.appendChild(clone);

        // Force all text styles to be computed
        const textElements = clone.getElementsByTagName('*');
        for (const el of textElements) {
          if (el instanceof HTMLElement) {
            el.style.lineHeight = window.getComputedStyle(el).lineHeight;
            el.style.margin = window.getComputedStyle(el).margin;
            el.style.padding = window.getComputedStyle(el).padding;
          }
        }

        // Capture with exact dimensions
        const canvas = await html2canvas(clone, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#FFFFFF',
          width: 606,
          height: 550,
          logging: false,
          onclone: (doc) => {
            const element = doc.getElementById('bento-grid');
            if (element) {
              element.style.width = '606px';
              element.style.height = '550px';
            }
          }
        });

        // Cleanup
        document.body.removeChild(tempContainer);

        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = `tableau-wrapped-${stats.profile.name}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div 
        ref={gridRef}
        className="bg-white w-full sm:w-[606px] p-4 sm:p-6 rounded-xl"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-black font-bold text-[14px] sm:text-[16px] mb-2 sm:mb-0">
            {stats.profile.name.split(' ')[0]}&apos;s Tableau Public Journey
          </h1>
          <img 
            src="/images/tableau-public-logo.png" 
            alt="Tableau Public" 
            className="w-[80px] sm:w-[96px] h-auto object-contain" 
          />
        </div>

        {/* First Row - Profile Cards */}
        <div className="grid grid-cols-2 sm:flex gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Profile Image */}
          <div className="w-full sm:w-[124px] h-[124px] bg-[#F0F0F0] rounded-xl flex-shrink-0">
            <img 
              src={`/api/proxy?url=${encodeURIComponent(stats.profile.avatarUrl)}`}
              alt="Profile"
              className="w-full h-full rounded-xl object-cover"
              width={124}
              height={124}
            />
          </div>

          {/* Profile Info */}
          <div className="w-full sm:w-[170px] h-[124px] bg-[#F0F0F0] rounded-xl p-4 flex-shrink-0">
            <div className="h-full flex flex-col justify-between">
              <p className="text-[10px] font-medium text-black">Hello,</p>
              <h2 className="text-[14px] font-semibold text-black" style={{ minHeight: '42px' }}>
                {stats.profile.name}
              </h2>
              <p className="text-[10px] font-medium text-[#5C5C5C] line-clamp-2">
                {stats.profile.title}
              </p>
            </div>
          </div>

          {/* Time Info Card */}
          <div className="col-span-2 sm:col-span-1 w-full bg-[#F0F0F0] rounded-xl p-4 h-[124px]">
            <div className="h-full flex flex-col justify-between">
              {getLegacyBadge(stats.profile.joinDate) ? (
                <>
                  <p className="text-[10px] font-medium text-black">You&apos;re publishing Workbooks as a</p>
                  <h2 className="text-[14px] font-semibold text-black">
                    {getLegacyBadge(stats.profile.joinDate)?.badge}
                  </h2>
                  <p className="text-[10px] font-medium text-[#5C5C5C]">
                    {getLegacyBadge(stats.profile.joinDate)?.description}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[10px] font-medium text-black">You&apos;re publishing Workbooks since,</p>
                  <h2 className="text-[14px] font-semibold text-black">
                    {stats.stats.yearsOnPlatform} years, {stats.stats.monthsOnPlatform} months and {stats.stats.daysOnPlatform} days
                  </h2>
                  <p className="text-[10px] font-medium text-[#5C5C5C]">It&apos;s a journey of perseverance</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards - Reorganized for mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {/* Row 1 on mobile, part of first row on desktop */}
          <div className="bg-[#F0F0F0] rounded-xl p-4">
            {/* Workbooks Card */}
            <img 
              src="/images/twbx-thumb.png" 
              alt="Workbooks" 
              className="w-[28px] h-[28px] mb-2" 
            />
            <div className="space-y-1">
              <p className="text-[10px] font-medium text-black">You&apos;ve published</p>
              <h2 className="text-[14px] font-semibold text-black">{formatNumber(stats.stats.totalWorkbooks)}</h2>
              <p className="text-[10px] font-medium text-[#5C5C5C]">Tableau Workbooks</p>
            </div>
          </div>
          <div className="bg-[#F0F0F0] rounded-xl p-4">
            {/* Followers Card */}
            <FaUsers className="text-[28px] text-[#28d979] mb-2" />
            <div className="space-y-1">
              <p className="text-[10px] font-medium text-black">You&apos;re an inspiration to</p>
              <h2 className="text-[14px] font-semibold text-black">{formatNumber(stats.profile.totalFollowers)}</h2>
              <p className="text-[10px] font-medium text-[#5C5C5C]">people who follow you</p>
            </div>
          </div>

          {/* Row 2 on mobile, spans across rows on desktop */}
          <div className="bg-[#F0F0F0] rounded-xl p-4 sm:order-3">
            {/* Following Card */}
            <FaUser className="text-[28px] text-[#28d979] mb-2" />
            <div className="space-y-1">
              <p className="text-[10px] font-medium text-black">You follow</p>
              <h2 className="text-[14px] font-semibold text-black">{formatNumber(stats.profile.totalFollowing)}</h2>
              <p className="text-[10px] font-medium text-[#5C5C5C]">people who inspire you</p>
            </div>
          </div>
          <div className="bg-[#F0F0F0] rounded-xl p-4 sm:order-4">
            {/* Views Card */}
            <FaEye className="text-[28px] text-[#28d979] mb-2" />
            <div className="space-y-1">
              <p className="text-[10px] font-medium text-black">You&apos;ve accumulated</p>
              <h2 className="text-[14px] font-semibold text-black">{formatNumber(stats.stats.totalViews)}</h2>
              <p className="text-[10px] font-medium text-[#5C5C5C]">views on your workbooks</p>
            </div>
          </div>

          {/* Row 3 on mobile, part of last row on desktop */}
          <div className="bg-[#F0F0F0] rounded-xl p-4 sm:order-5">
            {/* Favorites Card */}
            <FaStar className="text-[28px] text-[#28d979] mb-2" />
            <div className="space-y-1">
              <p className="text-[10px] font-medium text-black">Your workbooks have</p>
              <h2 className="text-[14px] font-semibold text-black">{formatNumber(stats.stats.totalFavorites)}</h2>
              <p className="text-[10px] font-medium text-[#5C5C5C]">favorites from users</p>
            </div>
          </div>
          <div className="bg-black rounded-xl p-4 text-white sm:order-6">
            {/* Black Footer Card */}
            <div className="h-full flex flex-col justify-between">
              <h3 className="font-semibold text-[12px]">#TableauWrapped</h3>
              <p className="text-[10px] font-medium text-[#DDDDDD]">Created by: Hari Jeyan</p>
              <p className="text-[10px] font-medium text-[#DDDDDD]">Generated on: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="mt-6 w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Download Image
      </button>
    </div>
  );
}

