import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
const publicDir = path.join(process.cwd(), 'public');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    console.log('Starting video processing request...');
    
    const formData = await request.formData();
    
    const screenFile = formData.get('screen') as File;
    const faceFile = formData.get('face') as File;
    const bgFile = formData.get('bg') as File;
    const bgColor = (formData.get('color') as string) || '#000000';
    const format = (formData.get('format') as string) || 'both'; // 'short', 'long', or 'both'

    console.log('Files received:', {
      screenFile: screenFile?.name,
      faceFile: faceFile?.name,
      bgFile: bgFile?.name,
      bgColor,
      format
    });

    if (!screenFile || !faceFile || !bgFile) {
      console.error('Missing required files');
      return NextResponse.json(
        { error: 'Missing required files' },
        { status: 400 }
      );
    }

    // Save uploaded files
    const timestamp = Date.now();
    const screenPath = path.join(uploadsDir, `screen_${timestamp}.mp4`);
    const facePath = path.join(uploadsDir, `face_${timestamp}.mp4`);
    const bgPath = path.join(uploadsDir, `bg_${timestamp}.jpg`);

    console.log('Saving uploaded files...');
    
    const screenBuffer = Buffer.from(await screenFile.arrayBuffer());
    const faceBuffer = Buffer.from(await faceFile.arrayBuffer());
    const bgBuffer = Buffer.from(await bgFile.arrayBuffer());

    fs.writeFileSync(screenPath, screenBuffer);
    fs.writeFileSync(facePath, faceBuffer);
    fs.writeFileSync(bgPath, bgBuffer);

    console.log('Files saved successfully');

    const results: { shortForm?: string; longForm?: string } = {};

    // Process Short Form Video (Instagram Reels - 1080x1920)
    if (format === 'short' || format === 'both') {
      console.log('Processing short form video...');
      const shortFormPath = path.join(publicDir, `short_form_${timestamp}.mp4`);
      
      await new Promise<void>((resolve, reject) => {
        ffmpeg()
          .input(screenPath)
          .outputOptions([
            '-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2',
            '-c:v', 'libx264',
            '-preset', 'ultrafast',
            '-crf', '23'
          ])
          .save(shortFormPath)
          .on('start', (commandLine) => {
            console.log('FFmpeg command for short form:', commandLine);
          })
          .on('progress', (progress) => {
            console.log('Short form progress:', progress);
          })
          .on('end', () => {
            console.log('Short form video processing completed');
            results.shortForm = `/short_form_${path.basename(shortFormPath)}`;
            resolve();
          })
          .on('error', (err) => {
            console.error('Short form video error:', err);
            reject(err);
          });
      });
    }

    // Process Long Form Video (YouTube - 1920x1080)
    if (format === 'long' || format === 'both') {
      console.log('Processing long form video...');
      const longFormPath = path.join(publicDir, `long_form_${timestamp}.mp4`);
      
      await new Promise<void>((resolve, reject) => {
        ffmpeg()
          .input(screenPath)
          .outputOptions([
            '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2',
            '-c:v', 'libx264',
            '-preset', 'ultrafast',
            '-crf', '23'
          ])
          .save(longFormPath)
          .on('start', (commandLine) => {
            console.log('FFmpeg command for long form:', commandLine);
          })
          .on('progress', (progress) => {
            console.log('Long form progress:', progress);
          })
          .on('end', () => {
            console.log('Long form video processing completed');
            results.longForm = `/long_form_${path.basename(longFormPath)}`;
            resolve();
          })
          .on('error', (err) => {
            console.error('Long form video error:', err);
            reject(err);
          });
      });
    }

    // Clean up uploaded files
    try {
      fs.unlinkSync(screenPath);
      fs.unlinkSync(facePath);
      fs.unlinkSync(bgPath);
      console.log('Uploaded files cleaned up');
    } catch (error) {
      console.warn('Failed to clean up uploaded files:', error);
    }

    console.log('Video processing completed successfully:', results);

    return NextResponse.json({
      success: true,
      ...results
    });

  } catch (error) {
    console.error('Video processing error:', error);
    return NextResponse.json(
      { error: 'Video processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 