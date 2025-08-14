
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, CameraOff, Power } from './Icons';

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setError(null);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    const startStream = async (constraints: MediaStreamConstraints) => {
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
        if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
        }
    };

    try {
      // First, try to get the environment camera, which is better for receipts
      await startStream({ video: { facingMode: 'environment' } });
    } catch (err) {
      console.warn('Could not get environment camera, trying default camera.', err);
      // If that fails (e.g., on a laptop), try to get any camera
      try {
        await startStream({ video: true });
      } catch (finalErr) {
        console.error("Error accessing camera:", finalErr);
        let message = "Could not access the camera. Please check your browser permissions.";
        if (finalErr instanceof Error) {
            if (finalErr.name === "NotAllowedError") {
                message = "Camera access was denied. Please enable it in your browser settings to use this feature.";
            } else if (finalErr.name === "NotFoundError") {
                message = "No camera found on this device. Please ensure a camera is connected and enabled.";
            }
        }
        setError(message);
      }
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);
  
  useEffect(() => {
    // Automatically start camera on mount
    startCamera();
    // Stop camera on unmount
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64Data = dataUrl.split(',')[1];
        onCapture(base64Data);
        stopCamera();
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md bg-slate-900 rounded-lg overflow-hidden shadow-lg relative">
        {stream ? (
          <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
        ) : (
          <div className="w-full h-64 flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-700">
            <CameraOff className="text-slate-500 mb-4" size={48} />
            <p className="text-slate-600 dark:text-slate-300">Camera is off</p>
            {error && <p className="text-red-500 text-sm mt-2 text-center px-4">{error}</p>}
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="mt-4 flex space-x-4">
        {stream ? (
          <>
            <button onClick={handleCapture} className="px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 flex items-center gap-2">
              <Camera/> Scan Receipt
            </button>
            <button onClick={stopCamera} className="p-3 bg-red-600 text-white rounded-full font-bold shadow-lg hover:bg-red-700 flex items-center gap-2">
              <Power/>
            </button>
          </>
        ) : (
          <button onClick={startCamera} className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold shadow-lg hover:bg-green-700 flex items-center gap-2">
            <Camera/> Start Camera
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
