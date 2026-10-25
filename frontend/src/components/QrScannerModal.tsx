import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1';

interface QrScannerModalProps {
  open: boolean;
  onClose: () => void;
  onScan: (codigo: string, ambiente: string) => void;
}

export function QrScannerModal({ open, onClose, onScan }: QrScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const onCloseRef = useRef(onClose);
  const onScanRef = useRef(onScan);
  const [errorCam, setErrorCam] = useState<string | null>(null);
  const [detectando, setDetectando] = useState(false);

  onCloseRef.current = onClose;
  onScanRef.current = onScan;

  useEffect(() => {
    if (!open) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      setErrorCam(null);
      setDetectando(false);
      return;
    }

    let cancelado = false;
    setErrorCam(null);
    setDetectando(false);

    async function abrir() {
      try {
        if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
          throw new Error('INSEGURO');
        }
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          });
        } catch (e) {
          if ((e as Error)?.name === 'OverconstrainedError') {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          } else {
            throw e;
          }
        }
        if (cancelado) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }

        intervalRef.current = window.setInterval(() => {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code?.data) {
            window.clearInterval(intervalRef.current!);
            intervalRef.current = null;
            setDetectando(true);
            fetch(`${API_URL}/mesas/by-qr?codigo=${encodeURIComponent(code.data)}`)
              .then(async (res) => {
                if (!res.ok) throw new Error('QR_INVALIDO');
                const body = await res.json();
                onScanRef.current(String(body.id), typeof body?.ambiente === 'string' ? body.ambiente : '');
              })
              .catch(() => {
                setErrorCam('QR inválido. Escanea el QR pegado en tu mesa.');
                setDetectando(false);
                setTimeout(() => {
                  if (!cancelado && intervalRef.current === null) {
                    intervalRef.current = window.setInterval(() => {
                      const v = videoRef.current;
                      const c = canvasRef.current;
                      if (!v || !c || v.readyState !== v.HAVE_ENOUGH_DATA) return;
                      const cx = c.getContext('2d');
                      if (!cx) return;
                      c.width = v.videoWidth;
                      c.height = v.videoHeight;
                      cx.drawImage(v, 0, 0, c.width, c.height);
                      const imgData = cx.getImageData(0, 0, c.width, c.height);
                      const cd = jsQR(imgData.data, imgData.width, imgData.height);
                      if (cd?.data) {
                        window.clearInterval(intervalRef.current!);
                        intervalRef.current = null;
                        setDetectando(true);
                        fetch(`${API_URL}/mesas/by-qr?codigo=${encodeURIComponent(cd.data)}`)
                          .then(async (r) => {
                            if (!r.ok) throw new Error('QR_INVALIDO');
                              const b = await r.json();
                              onScanRef.current(String(b.id), typeof b?.ambiente === 'string' ? b.ambiente : '');
                          })
                          .catch(() => {
                            setErrorCam('QR inválido. Escanea el QR pegado en tu mesa.');
                            setDetectando(false);
                          });
                      }
                    }, 400);
                  }
                }, 2000);
              });
          }
        }, 400);
      } catch (e) {
        if (cancelado) return;
        const nombre = (e as Error)?.name ?? '';
        const codigo = (e as Error)?.message ?? '';
        if (codigo === 'INSEGURO') {
          setErrorCam('No se pudo abrir la cámara aquí (se requiere HTTPS o localhost). Usa la cámara de tu celular apuntando al QR.');
        } else if (nombre === 'NotAllowedError') {
          setErrorCam('Permiso de cámara denegado. Actívalo en el navegador para escanear.');
        } else if (nombre === 'NotFoundError' || nombre === 'OverconstrainedError') {
          setErrorCam('No se encontró cámara disponible en este dispositivo.');
        } else {
          setErrorCam('No se pudo abrir la cámara en este momento.');
        }
      }
    }

    void abrir();

    function alEscape(ev: KeyboardEvent) {
      if (ev.key === 'Escape') onCloseRef.current();
    }
    window.addEventListener('keydown', alEscape);
    return () => {
      cancelado = true;
      window.removeEventListener('keydown', alEscape);
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cámara para escanear QR"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={() => onCloseRef.current()}
    >
      <div
        className="w-full max-w-sm space-y-3 rounded-2xl bg-[#1e0a08] p-4 shadow-2xl ring-1 ring-[#d97707]/40"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-white uppercase">
            <span className="material-symbols-outlined text-base text-[#F2C94C]">qr_code_scanner</span>
            Apunta al QR de tu mesa
          </p>
          <button
            type="button"
            autoFocus
            aria-label="Cerrar cámara"
            onClick={() => onCloseRef.current()}
            className="rounded-lg p-1.5 text-white/80 outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {errorCam ? (
          <div className="space-y-3">
            <p aria-live="polite" className="rounded-xl bg-black/30 px-3 py-3 text-xs leading-relaxed text-[#ffdcc3]">
              {errorCam}
            </p>
            <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#F2C94C] px-4 py-3 text-xs font-bold tracking-wider text-[#7F1518] uppercase">
              <span className="material-symbols-outlined text-base">photo_camera</span>
              O toma foto del QR
              <input type="file" accept="image/*" capture="environment" className="hidden" />
            </label>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="aspect-[3/4] w-full rounded-xl bg-black object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}

        {!errorCam && !detectando && (
          <p className="text-center text-[11px] text-[#e4beb9]/70">
            Apunta al QR de tu mesa — se detecta automáticamente.
          </p>
        )}
        {detectando && (
          <p className="text-center text-[11px] text-[#F2C94C] font-bold">
            QR detectado, validando…
          </p>
        )}

        {!errorCam && (
          <button
            type="button"
            onClick={() => onCloseRef.current()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F2C94C] px-4 py-3 text-xs font-bold tracking-wider text-[#7F1518] uppercase"
          >
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
}