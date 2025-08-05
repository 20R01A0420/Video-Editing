'use client';

import { useVideoStore } from '@/store/videoStore';
import { Play, Image, Video } from 'lucide-react';

export function VideoPreview() {
  const { screenRecording, faceRecording, backgroundImage, shortFormVideo, longFormVideo } = useVideoStore();

  const hasUploads = screenRecording || faceRecording || backgroundImage;
  const hasProcessedVideos = shortFormVideo || longFormVideo;

  if (!hasUploads && !hasProcessedVideos) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Preview
        </h2>
        <div className="text-center text-gray-500 py-8">
          <Video className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Upload files to see previews</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Preview
      </h2>

      <div className="space-y-6">
        {/* Uploaded Files Preview */}
        {hasUploads && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Uploaded Files
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {screenRecording && (
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <video
                    src={screenRecording.url}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white drop-shadow" />
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Screen Recording
                  </div>
                </div>
              )}

              {faceRecording && (
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <video
                    src={faceRecording.url}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white drop-shadow" />
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Face Recording
                  </div>
                </div>
              )}

              {backgroundImage && (
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={backgroundImage.url}
                    alt="Background"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Background
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Processed Videos Preview */}
        {hasProcessedVideos && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Processed Videos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shortFormVideo && (
                <div className="relative aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
                  <video
                    src={shortFormVideo.url}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white drop-shadow" />
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Short Form (Reels)
                  </div>
                </div>
              )}

              {longFormVideo && (
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <video
                    src={longFormVideo.url}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white drop-shadow" />
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Long Form (YouTube)
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 