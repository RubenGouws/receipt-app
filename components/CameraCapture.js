import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, CameraOff, Power } from './Icons.js';

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  const startCamera = useCallback(async () => {
    setError(null);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    const startStream = async (constraints) => {
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
        if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
        }
    };

    try {
      await startStream({ video: { facingMode: 'environment' } });
    } catch (err) {
      console.warn('Could not get environment camera, trying default camera.', err);
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
    startCamera();
    return () => {
      stopCamera();
    };
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
    React.createElement('div', { className: "flex flex-col items-center" },
      React.createElement('div', { className: "w-full max-w-md bg-slate-900 rounded-lg overflow-hidden shadow-lg relative" },
        stream ? (
          React.createElement('video', { ref: videoRef, autoPlay: true, playsInline: true, className: "w-full h-auto" })
        ) : (
          React.createElement('div', { className: "w-full h-64 flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-700" },
            React.createElement(CameraOff, { className: "text-slate-500 mb-4", size: 48 }),
            React.createElement('p', { className: "text-slate-600 dark:text-slate-300" }, "Camera is off"),
            error && React.createElement('p', { className: "text-red-500 text-sm mt-2 text-center px-4" }, error)
          )
        )
      ),
      React.createElement('canvas', { ref: canvasRef, className: "hidden" }),
      React.createElement('div', { className: "mt-4 flex space-x-4" },
        stream ? (
          React.createElement(React.Fragment, null,
            React.createElement('button', { onClick: handleCapture, className: "px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 flex items-center gap-2" },
              React.createElement(Camera, null), " Scan Receipt"
            ),
            React.createElement('button', { onClick: stopCamera, className: "p-3 bg-red-600 text-white rounded-full font-bold shadow-lg hover:bg-red-700 flex items-center gap-2" },
              React.createElement(Power, null)
            )
          )
        ) : (
          React.createElement('button', { onClick: startCamera, className: "px-6 py-3 bg-green-600 text-white rounded-lg font-bold shadow-lg hover:bg-green-700 flex items-center gap-2" },
            React.createElement(Camera, null), " Start Camera"
          )
        )
      )
    )
  );
};

export default CameraCapture;