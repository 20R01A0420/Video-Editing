
"use client";

import React from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Card } from './ui/card';

interface VerticalPreviewProps {
  screenRecSrc: string | null;
  faceRecSrc: string | null;
  bgImgSrc: string | null;
  bgColor: string;
  isComplete?: boolean;
  isProcessing?: boolean;
}

// Scaled down dimensions for preview (original / 4)
const PREVIEW_WIDTH = 270; // 1080 / 4
const PREVIEW_HEIGHT = 480; // 1920 / 4

const VerticalPreview: React.FC<VerticalPreviewProps> = ({ 
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
        borderRadius: '20px',
      }}
    >
      {isProcessing && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
          <Loader2 className="animate-spin h-10 w-10 text-primary-foreground" />
          <p className="text-primary-foreground mt-2">Generating...</p>
        </div>
      )}
      
      {/* Background Image Layer */}
      <div 
        className="absolute bg-cover bg-center"
        style={{
          width: `${1016 / 4}px`, // 254px
          height: `${802 / 4}px`, // 200.5px
          top: `${1118 / 4}px`, // 279.5px
          left: `${(PREVIEW_WIDTH - 1016/4) / 2}px`, // (270 - 254)/2 = 8px
          borderTopLeftRadius: `${116 / 4}px`, // 29px
          borderTopRightRadius: `${116 / 4}px`, // 29px
        }}
      >
        {bgImgSrc ? (
          <Image src={bgImgSrc} alt="Background" layout="fill" objectFit="cover" className='rounded-t-[29px]' data-ai-hint="abstract texture" />
        ) : (
          <div className="w-full h-full bg-muted/20 rounded-t-[29px]"></div>
        )}
      </div>

      {/* Face Recording Layer */}
      <div 
        className="absolute"
        style={{
          width: `${1080 / 4}px`, // 270px
          height: `${939 / 4}px`, // 234.75px
          top: `${981 / 4}px`, // 245.25px
          left: 0,
          borderTopLeftRadius: `${116 / 4}px`, // 29px
          borderTopRightRadius: `${116 / 4}px`, // 29px,
          overflow: 'hidden'
        }}
      >
        {faceRecSrc ? (
          <video key={faceRecSrc} src={faceRecSrc} muted autoPlay loop playsInline className="w-full h-full object-cover" />
        ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/10">
                <p className="text-xs text-muted-foreground">Face Recording</p>
            </div>
        )}
      </div>

       {/* Screen Recording Layer */}
       <div 
        className="absolute"
        style={{
          width: `${1080 / 4}px`, // 270px
          height: `${669 / 4}px`, // 167.25px
          top: `${211 / 4}px`, // 52.75px
          left: 0,
          borderRadius: `${54 / 4}px`, // 13.5px
          overflow: 'hidden',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}
      >
        {screenRecSrc ? (
           (isComplete && !isProcessing) ? (
            <div className="w-full h-full flex items-center justify-center bg-green-500/20">
               <video key={screenRecSrc} src={screenRecSrc} muted autoPlay loop playsInline className="w-full h-full object-cover" />
            </div>
           ) : (
            <video key={screenRecSrc} src={screenRecSrc} muted autoPlay loop playsInline className="w-full h-full object-cover" />
           )
        ) : (
           <div className="w-full h-full flex items-center justify-center bg-muted/40">
                <p className="text-xs text-muted-foreground">Screen Recording</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default VerticalPreview;
