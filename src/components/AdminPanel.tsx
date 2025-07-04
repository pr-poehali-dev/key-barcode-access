import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Icon from "@/components/ui/icon";
import type { Key, User } from "@/types";

interface AdminPanelProps {
  keys: Key[];
  users: User[];
  onAddKey: (keyData: Omit<Key, "id" | "createdAt">) => void;
  onAddUser: (userData: Omit<User, "id" | "createdAt">) => void;
  onDeleteUser: (userId: string) => void;
  onDeleteKey: (keyId: string) => void;
  onUpdateKey: (keyId: string, keyData: Omit<Key, "id" | "createdAt">) => void;
  onUpdateUser: (
    userId: string,
    userData: Omit<User, "id" | "createdAt">,
  ) => void;
  onLogout: () => void;
}

const AdminPanel = ({
  keys,
  users,
  onAddKey,
  onAddUser,
  onDeleteUser,
  onDeleteKey,
  onUpdateKey,
  onUpdateUser,
  onLogout,
}: AdminPanelProps) => {
  const [keyForm, setKeyForm] = useState({
    barcode: "",
    name: "",
    description: "",
    location: "",
  });

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    department: "",
  });

  const [editingKey, setEditingKey] = useState<Key | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddKey({ ...keyForm, isAvailable: true });
    setKeyForm({ barcode: "", name: "", description: "", location: "" });
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser(userForm);
    setUserForm({ name: "", email: "", department: "" });
  };

  const handleUpdateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingKey) {
      onUpdateKey(editingKey.id, {
        barcode: keyForm.barcode,
        name: keyForm.name,
        description: keyForm.description,
        location: keyForm.location,
        isAvailable: editingKey.isAvailable,
      });
      setEditingKey(null);
      setKeyForm({ barcode: "", name: "", description: "", location: "" });
    }
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdateUser(editingUser.id, userForm);
      setEditingUser(null);
      setUserForm({ name: "", email: "", department: "" });
    }
  };

  const startEditingKey = (key: Key) => {
    setEditingKey(key);
    setKeyForm({
      barcode: key.barcode,
      name: key.name,
      description: key.description,
      location: key.location,
    });
  };

  const startEditingUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      department: user.department,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Панель администратора
        </h1>
        <Button variant="outline" onClick={onLogout}>
          <Icon name="LogOut" className="w-4 h-4 mr-2" />
          Выйти
        </Button>
      </div>

      <Tabs defaultValue="keys" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="keys">Ключи</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="add">Добавить</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Все ключи ({keys.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {keys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{key.name}</h3>
                        <Badge
                          variant={key.isAvailable ? "default" : "destructive"}
                        >
                          {key.isAvailable ? "Доступен" : "Выдан"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{key.description}</p>
                      <p className="text-xs text-gray-500">
                        Штрихкод: {key.barcode} | {key.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditingKey(key)}
                      >
                        <Icon name="Edit" className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Icon name="Trash2" className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Удалить ключ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Вы уверены, что хотите удалить ключ "{key.name}"?
                              Это действие нельзя отменить.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteKey(key.id)}
                            >
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Все пользователи ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <Badge variant="outline" className="mt-1">
                        {user.department}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditingUser(user)}
                      >
                        <Icon name="Edit" className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Icon name="Trash2" className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Удалить пользователя?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Вы уверены, что хотите удалить пользователя "
                              {user.name}"? Это действие нельзя отменить.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteUser(user.id)}
                            >
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Icon name="User" className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingKey ? "Редактировать ключ" : "Добавить ключ"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={editingKey ? handleUpdateKey : handleKeySubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="keyBarcode">Штрихкод</Label>
                    <Input
                      id="keyBarcode"
                      value={keyForm.barcode}
                      onChange={(e) =>
                        setKeyForm((prev) => ({
                          ...prev,
                          barcode: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyName">Название</Label>
                    <Input
                      id="keyName"
                      value={keyForm.name}
                      onChange={(e) =>
                        setKeyForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyDescription">Описание</Label>
                    <Textarea
                      id="keyDescription"
                      value={keyForm.description}
                      onChange={(e) =>
                        setKeyForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyLocation">Расположение</Label>
                    <Input
                      id="keyLocation"
                      value={keyForm.location}
                      onChange={(e) =>
                        setKeyForm((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Icon
                      name={editingKey ? "Save" : "Plus"}
                      className="w-4 h-4 mr-2"
                    />
                    {editingKey ? "Сохранить изменения" : "Добавить ключ"}
                  </Button>
                  {editingKey && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setEditingKey(null);
                        setKeyForm({
                          barcode: "",
                          name: "",
                          description: "",
                          location: "",
                        });
                      }}
                    >
                      Отмена
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {editingUser
                    ? "Редактировать пользователя"
                    : "Добавить пользователя"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={editingUser ? handleUpdateUser : handleUserSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="userName">Имя</Label>
                    <Input
                      id="userName"
                      value={userForm.name}
                      onChange={(e) =>
                        setUserForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userEmail">Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={userForm.email}
                      onChange={(e) =>
                        setUserForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userDepartment">Отдел</Label>
                    <Input
                      id="userDepartment"
                      value={userForm.department}
                      onChange={(e) =>
                        setUserForm((prev) => ({
                          ...prev,
                          department: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Icon
                      name={editingUser ? "Save" : "UserPlus"}
                      className="w-4 h-4 mr-2"
                    />
                    {editingUser
                      ? "Сохранить изменения"
                      : "Добавить пользователя"}
                  </Button>
                  {editingUser && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setEditingUser(null);
                        setUserForm({ name: "", email: "", department: "" });
                      }}
                    >
                      Отмена
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
