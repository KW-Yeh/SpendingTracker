'use client';

import { Modal } from '@/components/Modal';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  onClose: () => void;
}

export const QRScanner = ({ onClose }: Props) => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const handledRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);

  const stopCamera = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const handleResult = useCallback(
    (raw: string) => {
      if (handledRef.current) return;
      handledRef.current = true;

      try {
        // ponytail: new URL() handles both full URLs and relative paths
        const url = new URL(raw, location.origin);
        const match = url.pathname.match(/^\/group\/invite\/(\d+)\/?$/);
        if (!match) {
          setError('無效的 QR Code，請掃描帳本邀請碼');
          handledRef.current = false;
          return;
        }
        stopCamera();
        onClose();
        router.push(`/group/invite/${match[1]}`);
      } catch {
        setError('無法辨識的 QR Code');
        handledRef.current = false;
      }
    },
    [router, onClose, stopCamera],
  );

  useEffect(() => {
    let cancelled = false;
    handledRef.current = false;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current!;
        video.srcObject = stream;
        await video.play();
        setLoading(false);

        const { default: jsQR } = await import('jsqr');
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;

        intervalRef.current = setInterval(() => {
          if (video.readyState < 2 || cancelled) return;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const result = jsQR(imageData.data, imageData.width, imageData.height);
          if (result) handleResult(result.data);
        }, 150);
      } catch (err) {
        if (cancelled) return;
        const name = (err as DOMException).name;
        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
          setError('請允許相機權限後重試');
        } else if (name === 'NotFoundError') {
          setError('找不到相機裝置');
        } else if (name === 'NotReadableError') {
          setError('相機被其他應用程式佔用，請關閉後重試');
        } else {
          setError('無法開啟相機，請重試');
        }
        setLoading(false);
      }
    };

    start();
    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [handleResult, stopCamera, retryKey]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setRetryKey((k) => k + 1);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <Modal
      defaultOpen={true}
      onClose={handleClose}
      className="flex w-full flex-col self-end sm:max-w-96 sm:self-center sm:rounded-xl"
      title="掃描 QR Code 加入帳本"
    >
      <div className="flex flex-col items-center gap-4">
        {error ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <p className="text-center text-sm text-red-400">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="btn-secondary min-h-10 px-4 text-sm"
            >
              重試
            </button>
          </div>
        ) : (
          <div className="relative w-full">
            {loading && (
              <div className="flex h-48 w-full items-center justify-center text-sm text-gray-400">
                開啟相機中...
              </div>
            )}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`aspect-square w-full rounded-lg bg-black object-cover ${loading ? 'hidden' : ''}`}
            />
            {/* ponytail: canvas is offscreen, only used for jsQR image sampling */}
            <canvas ref={canvasRef} className="hidden" />
            {!loading && (
              <div className="border-primary-500 pointer-events-none absolute inset-8 rounded-lg border-2" />
            )}
          </div>
        )}
        {!error && (
          <p className="text-xs text-gray-400">將 QR Code 對準框內</p>
        )}
      </div>
    </Modal>
  );
};
