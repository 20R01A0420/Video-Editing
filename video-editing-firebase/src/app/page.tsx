
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import FileInput from '@/components/FileInput';
import ColorPicker from '@/components/ColorPicker';
import VerticalPreview from '@/components/VerticalPreview';
import HorizontalPreview from '@/components/HorizontalPreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription as UICardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Download, Film, MonitorPlay, UserSquare, Image as ImageIcon, Palette, Rocket } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';


type ProcessingStatus = 'idle' | 'processing' | 'complete';

export default function Home() {
  const [screenRecording, setScreenRecording] = useState<File | null>(null);
  const [faceRecording, setFaceRecording] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('#000000');
  
  const [screenRecUrl, setScreenRecUrl] = useState<string | null>(null);
  const [faceRecUrl, setFaceRecUrl] = useState<string | null>(null);
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);

  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [verticalProgress, setVerticalProgress] = useState(0);
  const [horizontalProgress, setHorizontalProgress] = useState(0);
  
  const [isGenerationComplete, setIsGenerationComplete] = useState<boolean>(false);

  const { toast } = useToast();

  const areInputsReady = useMemo(() => {
    return !!screenRecording && !!faceRecording && !!backgroundImage;
  }, [screenRecording, faceRecording, backgroundImage]);

  useEffect(() => {
    if (screenRecording) setScreenRecUrl(URL.createObjectURL(screenRecording));
    else setScreenRecUrl(null);
  }, [screenRecording]);

  useEffect(() => {
    if (faceRecording) setFaceRecUrl(URL.createObjectURL(faceRecording));
    else setFaceRecUrl(null);
  }, [faceRecording]);

  useEffect(() => {
    if (backgroundImage) setBgImageUrl(URL.createObjectURL(backgroundImage));
    else setBgImageUrl(null);
  }, [backgroundImage]);

  const handleGenerate = async () => {
    if (!areInputsReady) return;
    setStatus('processing');
    setVerticalProgress(0);
    setHorizontalProgress(0);
    setIsGenerationComplete(false);

    // Simulate video generation
    const progressInterval = setInterval(() => {
      setVerticalProgress(p => Math.min(p + 10, 100));
      setHorizontalProgress(p => Math.min(p + 10, 100));
    }, 500);

    setTimeout(() => {
        clearInterval(progressInterval);
        setVerticalProgress(100);
        setHorizontalProgress(100);
        setIsGenerationComplete(true);
        setStatus('complete');
        toast({
            title: "Simulation Complete!",
            description: "Video previews are ready. In a real application, you could now download the generated videos.",
        });
    }, 5000);
  };


  const handleDownload = (fileToDownload: File | null, url: string | null) => {
    if (!url || !fileToDownload) {
      toast({
        title: "File Not Found",
        description: "The source file is missing.",
        variant: "destructive"
      });
      return;
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = `source_${fileToDownload.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-3">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film size={24} className="text-primary" />
                  <span>Create Your Video</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FileInput id="screen-recording" label="Screen Recording" onFileChange={setScreenRecording} file={screenRecording} icon={<MonitorPlay className="text-primary/80"/>} description="Target: up to 1GB. Scalable to 30GB." />
                <FileInput id="face-recording" label="Face Recording (BG Removed)" onFileChange={setFaceRecording} file={faceRecording} icon={<UserSquare className="text-primary/80" />} description="Target: up to 1GB. Scalable to 30GB." />
                <FileInput id="background-image" label="Static Background Image" onFileChange={setBackgroundImage} file={backgroundImage} icon={<ImageIcon className="text-primary/80"/>} description="Static background image." />
                <ColorPicker label="Background Color" color={backgroundColor} onChange={setBackgroundColor} icon={<Palette className="text-primary/80"/>} />
                
                <Separator />
                
                <Button onClick={handleGenerate} disabled={!areInputsReady || status === 'processing'} className="w-full">
                  <Rocket className="mr-2" />
                  {status === 'processing' ? 'Generating...' : 'Generate Videos'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview & Processing Section */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <Card>
                    <CardHeader><CardTitle>Vertical Reel Preview</CardTitle></CardHeader>
                    <CardContent className="flex justify-center items-center">
                        <VerticalPreview 
                            screenRecSrc={screenRecUrl}
                            faceRecSrc={faceRecUrl}
                            bgImgSrc={bgImageUrl}
                            bgColor={backgroundColor}
                            isComplete={isGenerationComplete}
                            isProcessing={status === 'processing'}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Horizontal Video Preview</CardTitle></CardHeader>
                    <CardContent className="flex justify-center items-center">
                        <HorizontalPreview
                            screenRecSrc={screenRecUrl}
                            faceRecSrc={faceRecUrl}
                            bgImgSrc={bgImageUrl}
                            bgColor={backgroundColor}
                            isComplete={isGenerationComplete}
                            isProcessing={status === 'processing'}
                        />
                    </CardContent>
                </Card>
            </div>
            
            {status !== 'idle' && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Processing Status</CardTitle>
                   {status === 'complete' && (
                      <UICardDescription className="pt-2">
                          This is a visual simulation. The previews above show how the final videos would look. In a real application, the download buttons below would provide the fully rendered video files.
                      </UICardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className='flex justify-between items-center'>
                      <label htmlFor="vertical-progress">Vertical Reel</label>
                       <span className='text-sm font-medium text-muted-foreground'>{verticalProgress}%</span>
                    </div>
                    <Progress id="vertical-progress" value={verticalProgress} className="w-full [&>div]:bg-accent" />
                    <Button 
                        onClick={() => handleDownload(screenRecording, screenRecUrl)}
                        disabled={!isGenerationComplete} 
                        className="mt-2"
                        variant="outline"
                    >
                        <Download size={16} className="mr-2" />
                        Download Short Form
                    </Button>
                  </div>
                  <div className="space-y-2">
                     <div className='flex justify-between items-center'>
                      <label htmlFor="horizontal-progress">Horizontal Video</label>
                      <span className='text-sm font-medium text-muted-foreground'>{horizontalProgress}%</span>
                    </div>
                    <Progress id="horizontal-progress" value={horizontalProgress} className="w-full [&>div]:bg-accent" />
                     <Button 
                        onClick={() => handleDownload(faceRecording, faceRecUrl)}
                        disabled={!isGenerationComplete} 
                        className="mt-2"
                        variant="outline"
                    >
                        <Download size={16} className="mr-2" />
                        Download Long Form
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
