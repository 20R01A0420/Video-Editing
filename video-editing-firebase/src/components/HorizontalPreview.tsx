
"use client";

import React from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface HorizontalPreviewProps {
  screenRecSrc: string | null;
  faceRecSrc: string | null;
  bgImgSrc: string | null;
  bgColor: string;
  isComplete?: boolean;
  isProcessing?: boolean;
}

const PREVIEW_WIDTH = 480; // 1920 / 4
const PREVIEW_HEIGHT = 270; // 1080 / 4

const HorizontalPreview: React.FC<HorizontalPreviewProps> = ({ 
  screenRecSrc, 
  faceRecSrc, 
  bgImgSrc, 
  bgColor,
  isComplete,
  isProcessing
}) => {

  const showOverlay = isProcessing || isComplete;

  return (
    <div
      className="relative shadow-lg overflow-hidden flex items-center justify-center"
      style={{
        width: `${PREVIEW_WIDTH}px`,
        height: `${PREVIEW_HEIGHT}px`,
        backgroundColor: bgColor,
        borderRadius: '12px',
      }}
    >
      {isProcessing && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
          <Loader2 className="animate-spin h-10 w-10 text-primary-foreground" />
          <p className="text-primary-foreground mt-2">Generating...</p>
        </div>
      )}

      {/* Main Screen Recording */}
      <div className="w-full h-full flex items-center justify-center">
        {screenRecSrc ? (
            (isComplete && !isProcessing) ? (
              <div className="w-full h-full flex items-center justify-center bg-green-500/20">
                 <video key={screenRecSrc} src={screenRecSrc} muted autoPlay loop playsInline className="w-full h-full object-contain" />
              </div>
             ) : (
              <video key={screenRecSrc} src={screenRecSrc} muted autoPlay loop playsInline className="w-full h-full object-contain" />
             )
        ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/10">
                <p className="text-sm text-muted-foreground">Screen Recording Area</p>
            </div>
        )}
      </div>

      {/* Picture-in-Picture Face Recording */}
      <div 
        className="absolute border-2 border-white/50 shadow-xl overflow-hidden rounded-lg bg-black"
        style={{
          width: `${365 / 4}px`, // 91.25px
          height: `${206 / 4}px`, // 51.5px
          bottom: `${28 / 4}px`, // 7px
          right: `${25 / 4}px`, // 6.25px
        }}
      >
        {/* Static image as PiP background */}
        {bgImgSrc && (
            <Image src={bgImgSrc} alt="PiP Background" layout="fill" objectFit="cover" className="opacity-50" data-ai-hint="abstract pattern" />
        )}
        
        {/* Face video on top */}
        <div className="absolute inset-0 w-full h-full">
            {faceRecSrc ? (
                <video key={faceRecSrc} src={faceRecSrc} muted autoPlay loop playsInline className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/20">
                    <p className="text-[8px] text-center text-muted-foreground">Face Cam</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default HorizontalPreview;
