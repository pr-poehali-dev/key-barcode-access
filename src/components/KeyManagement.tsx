import { useState } from "react";
import BarcodeScanner from "./BarcodeScanner";
import KeyAssignment from "./KeyAssignment";
import ActiveAssignments from "./ActiveAssignments";
import AdminPanel from "./AdminPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { useKeyManagement } from "@/hooks/useKeyManagement";
import type { Key } from "@/types";

interface KeyManagementProps {
  onLogout: () => void;
}

const KeyManagement = ({ onLogout }: KeyManagementProps) => {
  const {
    keys,
    users,
    assignments,
    addKey,
    addUser,
    assignKey,
    returnKey,
    getKeyByBarcode,
    getActiveAssignments,
  } = useKeyManagement();

  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const activeAssignments = getActiveAssignments();

  const handleBarcodeScan = (barcode: string) => {
    const key = getKeyByBarcode(barcode);
    if (key) {
      setSelectedKey(key);
    } else {
      alert("Ключ с таким штрихкодом не найден");
    }
  };

  const handleKeyAssign = (keyId: string, userId: string, notes?: string) => {
    assignKey(keyId, userId, notes);
    setSelectedKey(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <Tabs defaultValue="scanner" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scanner" className="flex items-center gap-2">
              <Icon name="ScanLine" className="w-4 h-4" />
              Выдача ключей
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Icon name="Settings" className="w-4 h-4" />
              Администрирование
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scanner" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <BarcodeScanner onScan={handleBarcodeScan} />
                <KeyAssignment
                  selectedKey={selectedKey}
                  users={users}
                  onAssign={handleKeyAssign}
                  onClear={() => setSelectedKey(null)}
                />
              </div>
              <div>
                <ActiveAssignments
                  assignments={activeAssignments}
                  keys={keys}
                  users={users}
                  onReturn={returnKey}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admin">
            <AdminPanel
              keys={keys}
              users={users}
              onAddKey={addKey}
              onAddUser={addUser}
              onLogout={onLogout}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KeyManagement;
