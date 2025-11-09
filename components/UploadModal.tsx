
import React, { useState, useRef, useEffect } from 'react';
import TextIcon from './icons/TextIcon';
import UploadIcon from './icons/UploadIcon';
import CameraIcon from './icons/CameraIcon';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (topic: string, level: string, image?: { data: string, mimeType: string }) => void;
  isLoading: boolean;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to convert blob to base64"));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onGenerate, isLoading }) => {
  const [activeTab, setActiveTab] = useState('text');
  const [text, setText] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (activeTab !== 'camera') {
      stopCamera();
    }
  }, [activeTab]);

  useEffect(() => {
    if (isOpen) {
      // Reset state on open
      setText('');
      setLevel('Beginner');
      setImageFile(null);
      setImageDataUrl(null);
      setActiveTab('text');
    } else {
      stopCamera();
    }
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Camera access was denied. Please enable it in your browser settings.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImageDataUrl(dataUrl);
      stopCamera();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleGenerate = async () => {
    let imagePayload;
    if (imageDataUrl) {
      const base64Data = imageDataUrl.split(',')[1];
      const mimeType = imageDataUrl.match(/:(.*?);/)?.[1] || 'image/jpeg';
      imagePayload = { data: base64Data, mimeType };
    }
    
    // Use "content analysis" as topic if text is empty for image-only generation
    const topic = text.trim() || 'the content in this image';
    onGenerate(topic, level, imagePayload);
  };
  
  const isGenerateDisabled = isLoading || (activeTab === 'text' && !text.trim()) || (activeTab !== 'text' && !imageDataUrl);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-100/70 dark:bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-semibold font-heading text-sky-500 dark:text-sky-400">Create from Content</h2>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </header>
        
        <div className="border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            <nav className="flex gap-4 px-6">
                <button onClick={() => setActiveTab('text')} className={`flex items-center gap-2 py-3 font-semibold transition-colors ${activeTab === 'text' ? 'text-sky-500 dark:text-sky-400 border-b-2 border-sky-500 dark:border-sky-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}>
                    <TextIcon className="w-5 h-5" /> Text
                </button>
                <button onClick={() => setActiveTab('upload')} className={`flex items-center gap-2 py-3 font-semibold transition-colors ${activeTab === 'upload' ? 'text-sky-500 dark:text-sky-400 border-b-2 border-sky-500 dark:border-sky-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}>
                    <UploadIcon className="w-5 h-5" /> Upload
                </button>
                <button onClick={() => setActiveTab('camera')} className={`flex items-center gap-2 py-3 font-semibold transition-colors ${activeTab === 'camera' ? 'text-sky-500 dark:text-sky-400 border-b-2 border-sky-500 dark:border-sky-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}>
                    <CameraIcon className="w-5 h-5" /> Camera
                </button>
            </nav>
        </div>

        <div className="p-6 overflow-y-auto flex-grow space-y-4">
            {activeTab !== 'camera' && (
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1" htmlFor="content-topic">Topic / Subject (optional for images)</label>
                    <input id="content-topic" type="text" value={text} onChange={e => setText(e.target.value)} placeholder="e.g., 'Cell Biology', 'JavaScript Promises'" className="w-full p-3 bg-slate-100 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-slate-800 dark:text-slate-100" />
                </div>
            )}
            
            {activeTab === 'text' && (
                <div>
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Paste additional text</h3>
                    <textarea 
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Paste an article, notes, or any text here to generate a learning path..."
                        className="w-full h-48 p-3 bg-slate-100 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-slate-800 dark:text-slate-100"
                    />
                </div>
            )}
            {activeTab === 'upload' && (
                 <div>
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-100/50 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-sky-500 dark:hover:border-sky-500 transition-all rounded-lg flex flex-col items-center justify-center p-8 text-center">
                        {imageDataUrl ? (
                            <img src={imageDataUrl} alt="Preview" className="max-h-48 rounded-md" />
                        ) : (
                            <>
                                <UploadIcon className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-2" />
                                <span className="font-semibold text-slate-700 dark:text-slate-200">Click to upload an image</span>
                                <span className="text-sm text-slate-400 dark:text-slate-500">PNG, JPG, or GIF</span>
                            </>
                        )}
                    </label>
                    <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </div>
            )}
            {activeTab === 'camera' && (
                <div className="space-y-4">
                    <div className="bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden relative w-full aspect-video flex items-center justify-center">
                        <video ref={videoRef} autoPlay playsInline className={`${isCameraOn ? 'block' : 'hidden'} w-full h-full object-cover`}></video>
                        <canvas ref={canvasRef} className="hidden"></canvas>
                        {imageDataUrl && !isCameraOn && <img src={imageDataUrl} alt="Captured" className="w-full h-full object-contain" />}
                        {!isCameraOn && !imageDataUrl && <CameraIcon className="w-16 h-16 text-slate-300 dark:text-slate-500" />}
                    </div>
                    <div className="flex justify-center gap-4">
                        {!isCameraOn && !imageDataUrl && <button onClick={startCamera} className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-2 px-5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Start Camera</button>}
                        {isCameraOn && <button onClick={handleCapture} className="bg-sky-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-sky-500 transition-colors">Capture</button>}
                        {imageDataUrl && !isCameraOn && <button onClick={startCamera} className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-2 px-5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Retake</button>}
                    </div>
                </div>
            )}
        </div>

        <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end items-center gap-4 flex-shrink-0">
             <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="p-3 bg-slate-100 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-slate-800 dark:text-slate-100"
                disabled={isLoading}
                >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
            </select>
            <button onClick={onClose} className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2 px-5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Cancel</button>
            <button onClick={handleGenerate} disabled={isGenerateDisabled} className="bg-sky-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-sky-500 transition-colors disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed">
              {isLoading ? 'Generating...' : 'Generate Path'}
            </button>
        </footer>
      </div>
    </div>
  );
};

export default UploadModal;