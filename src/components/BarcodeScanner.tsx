import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  placeholder?: string;
}

const BarcodeScanner = ({
  onScan,
  placeholder = "Введите штрихкод",
}: BarcodeScannerProps) => {
  const [barcode, setBarcode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcode.trim()) {
      onScan(barcode.trim());
      setBarcode("");
    }
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
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={!barcode.trim()}>
            <Icon name="Search" className="w-4 h-4 mr-2" />
            Найти ключ
          </Button>
        </form>

        <div className="mt-4 pt-4 border-t">
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
      </CardContent>
    </Card>
  );
};

export default BarcodeScanner;
