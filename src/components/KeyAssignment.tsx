import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";
import type { Key, User } from "@/types";

interface KeyAssignmentProps {
  selectedKey: Key | null;
  users: User[];
  onAssign: (keyId: string, userId: string, notes?: string) => void;
  onClear: () => void;
}

const KeyAssignment = ({
  selectedKey,
  users,
  onAssign,
  onClear,
}: KeyAssignmentProps) => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [notes, setNotes] = useState("");

  const handleAssign = () => {
    if (selectedKey && selectedUserId) {
      onAssign(selectedKey.id, selectedUserId, notes);
      setSelectedUserId("");
      setNotes("");
      onClear();
    }
  };

  if (!selectedKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="UserCheck" className="w-5 h-5" />
            Выдача ключа
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Icon name="Info" className="w-4 h-4" />
            <AlertDescription>
              Сначала отсканируйте штрихкод ключа
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!selectedKey.isAvailable) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="UserCheck" className="w-5 h-5" />
            Выдача ключа
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <Icon name="AlertTriangle" className="w-4 h-4" />
            <AlertDescription>
              Ключ "{selectedKey.name}" уже выдан
            </AlertDescription>
          </Alert>
          <Button variant="outline" onClick={onClear} className="mt-4">
            Выбрать другой ключ
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="UserCheck" className="w-5 h-5" />
          Выдача ключа
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900">{selectedKey.name}</h3>
          <p className="text-sm text-blue-700">{selectedKey.description}</p>
          <p className="text-xs text-blue-600">
            Штрихкод: {selectedKey.barcode}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="user">Выберите сотрудника</Label>
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите сотрудника" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} ({user.department})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Примечания (необязательно)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Дополнительная информация..."
            rows={2}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleAssign}
            disabled={!selectedUserId}
            className="flex-1"
          >
            <Icon name="Check" className="w-4 h-4 mr-2" />
            Выдать ключ
          </Button>
          <Button variant="outline" onClick={onClear}>
            Отмена
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeyAssignment;
