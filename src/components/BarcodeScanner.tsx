import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { BrowserMultiFormatReader } from "@zxing/library";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  placeholder?: string;
}

const BarcodeScanner = ({
  onScan,
  placeholder = "Введите штрихкод",
}: BarcodeScannerProps) => {
  const [barcode, setBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader>();

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcode.trim()) {
      onScan(barcode.trim());
      setBarcode("");
    }
  };

  const startScanning = async () => {
    setError("");
    setIsScanning(true);

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput",
      );

      if (videoDevices.length === 0) {
        throw new Error("Камера не найдена");
      }

      const codeReader = codeReaderRef.current!;

      await codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        (result, error) => {
          if (result) {
            const scannedCode = result.getText();
            setBarcode(scannedCode);
            onScan(scannedCode);
            stopScanning();
          }
        },
      );
    } catch (err) {
      setError("Ошибка доступа к камере: " + (err as Error).message);
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    setIsScanning(false);
  };

  const handleQuickScan = (demoBarcode: string) => {
    setBarcode(demoBarcode);
    onScan(demoBarcode);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="ScanLine" className="w-5 h-5" />
          Сканер штрихкода
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="barcode">Штрихкод</Label>
            <Input
              id="barcode"
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder={placeholder}
              autoFocus={!isScanning}
            />
          </div>
          <Button type="submit" className="w-full" disabled={!barcode.trim()}>
            <Icon name="Search" className="w-4 h-4 mr-2" />
            Найти ключ
          </Button>
        </form>

        <div className="mt-4 pt-4 border-t space-y-4">
          <div className="flex gap-2">
            {!isScanning ? (
              <Button onClick={startScanning} variant="outline">
                <Icon name="Camera" className="w-4 h-4 mr-2" />
                Сканировать камерой
              </Button>
            ) : (
              <Button onClick={stopScanning} variant="outline">
                <Icon name="StopCircle" className="w-4 h-4 mr-2" />
                Остановить сканирование
              </Button>
            )}
          </div>

          {isScanning && (
            <div className="space-y-2">
              <video
                ref={videoRef}
                className="w-full max-w-sm mx-auto rounded border"
                style={{ maxHeight: "200px" }}
              />
              <p className="text-sm text-center text-gray-600">
                Наведите камеру на штрихкод
              </p>
            </div>
          )}

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <Label className="text-sm text-gray-600">Быстрый тест:</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickScan("123456789")}
              >
                Офис 101
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickScan("987654321")}
              >
                Склад А
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarcodeScanner;
