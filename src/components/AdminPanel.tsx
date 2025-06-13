import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import type { Key, User } from "@/types";

interface AdminPanelProps {
  keys: Key[];
  users: User[];
  onAddKey: (keyData: Omit<Key, "id" | "createdAt">) => void;
  onAddUser: (userData: Omit<User, "id" | "createdAt">) => void;
  onLogout: () => void;
}

const AdminPanel = ({
  keys,
  users,
  onAddKey,
  onAddUser,
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
                    <Icon name="Key" className="w-5 h-5 text-gray-400" />
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
                    <Icon name="User" className="w-5 h-5 text-gray-400" />
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
                <CardTitle>Добавить ключ</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleKeySubmit} className="space-y-4">
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
                    <Icon name="Plus" className="w-4 h-4 mr-2" />
                    Добавить ключ
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Добавить пользователя</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUserSubmit} className="space-y-4">
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
                    <Icon name="UserPlus" className="w-4 h-4 mr-2" />
                    Добавить пользователя
                  </Button>
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
