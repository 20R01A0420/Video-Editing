'use client';

import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { ColorPicker } from './ColorPicker';
import { ProcessingStatus } from './ProcessingStatus';
import { VideoPreview } from './VideoPreview';
import { DownloadSection } from './DownloadSection';
import { useVideoStore } from '@/store/videoStore';
import { VideoProcessor } from '@/utils/VideoProcessor';
import { ProcessedVideo } from '@/store/videoStore';

export function VideoEditor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<'short' | 'long' | null>(null);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  
  const {
    screenRecording,
    faceRecording,
    backgroundImage,
    backgroundColor,
    shortFormVideo,
    longFormVideo,
    setShortFormVideo,
    setLongFormVideo,
  } = useVideoStore();

  const canGenerate = screenRecording && faceRecording && backgroundImage;

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setIsProcessing(true);
    setProcessingStep('short');
    setProgress(0);

    try {
      // Create FormData for API request
      const formData = new FormData();
      formData.append('screen', screenRecording.file);
      formData.append('face', faceRecording.file);
      formData.append('bg', backgroundImage.file);
      formData.append('color', backgroundColor);
      formData.append('format', 'both');

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 1000);

      // Call the API endpoint
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Create ProcessedVideo objects from the API response
        if (result.shortForm) {
          const shortFormVideo: ProcessedVideo = {
            url: result.shortForm,
            name: 'short_form_video.mp4',
            size: 0, // Will be updated when file is fetched
            format: 'short'
          };
          setShortFormVideo(shortFormVideo);
        }

        if (result.longForm) {
          const longFormVideo: ProcessedVideo = {
            url: result.longForm,
            name: 'long_form_video.mp4',
            size: 0, // Will be updated when file is fetched
            format: 'long'
          };
          setLongFormVideo(longFormVideo);
        }
      } else {
        throw new Error(result.error || 'Video processing failed');
      }
    } catch (error) {
      console.error('Error processing videos:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error processing videos: ${errorMessage}. Please try again.`);
    } finally {
      setIsProcessing(false);
      setProcessingStep(null);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Input Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Upload Your Content
            </h2>
            
            <div className="space-y-6">
              <FileUpload
                label="Screen Recording"
                description="Upload your screen recording video (max 30GB)"
                accept="video/*"
                onFileSelect={(file) => useVideoStore.getState().setScreenRecording(file)}
                selectedFile={screenRecording}
              />

              <FileUpload
                label="Face Recording (Background Removed)"
                description="Upload your face recording with background removed (max 30GB)"
                accept="video/*"
                onFileSelect={(file) => useVideoStore.getState().setFaceRecording(file)}
                selectedFile={faceRecording}
              />

              <FileUpload
                label="Background Image"
                description="Upload a static background image"
                accept="image/*"
                onFileSelect={(file) => useVideoStore.getState().setBackgroundImage(file)}
                selectedFile={backgroundImage}
              />

              <ColorPicker
                label="Background Color"
                color={backgroundColor}
                onChange={(color) => useVideoStore.getState().setBackgroundColor(color)}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!canGenerate || isProcessing}
              className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Generate Videos'}
            </button>
          </div>

          {isProcessing && (
            <ProcessingStatus
              step={processingStep}
              progress={progress}
              estimatedTime={estimatedTime}
            />
          )}
        </div>

        {/* Right Column - Preview and Download */}
        <div className="space-y-6">
          <VideoPreview />
          
          {(shortFormVideo || longFormVideo) && (
            <DownloadSection
              shortFormVideo={shortFormVideo}
              longFormVideo={longFormVideo}
            />
          )}
        </div>
      </div>
    </div>
  );
} 