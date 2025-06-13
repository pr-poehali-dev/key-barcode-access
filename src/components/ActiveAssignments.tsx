import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import type { KeyAssignment, Key, User } from "@/types";

interface ActiveAssignmentsProps {
  assignments: KeyAssignment[];
  keys: Key[];
  users: User[];
  onReturn: (assignmentId: string) => void;
}

const ActiveAssignments = ({
  assignments,
  keys,
  users,
  onReturn,
}: ActiveAssignmentsProps) => {
  const getKeyName = (keyId: string) => {
    return keys.find((k) => k.id === keyId)?.name || "Неизвестный ключ";
  };

  const getUserName = (userId: string) => {
    return (
      users.find((u) => u.id === userId)?.name || "Неизвестный пользователь"
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("ru-RU");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Clock" className="w-5 h-5" />
          Активные выдачи ({assignments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {assignments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Icon
              name="CheckCircle"
              className="w-12 h-12 mx-auto mb-2 text-gray-300"
            />
            <p>Все ключи возвращены</p>
          </div>
        ) : (
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary">
                      {getKeyName(assignment.keyId)}
                    </Badge>
                    <Icon name="ArrowRight" className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">
                      {getUserName(assignment.userId)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Выдан: {formatDate(assignment.assignedAt)}
                  </p>
                  {assignment.notes && (
                    <p className="text-sm text-gray-500 mt-1">
                      {assignment.notes}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReturn(assignment.id)}
                  className="ml-4"
                >
                  <Icon name="RotateCcw" className="w-4 h-4 mr-1" />
                  Вернуть
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveAssignments;
