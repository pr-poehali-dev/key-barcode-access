import { useState, useEffect } from "react";
import type { Key, User, KeyAssignment } from "@/types";

export const useKeyManagement = () => {
  const [keys, setKeys] = useState<Key[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<KeyAssignment[]>([]);

  useEffect(() => {
    // Загрузка данных из localStorage
    const savedKeys = localStorage.getItem("keys");
    const savedUsers = localStorage.getItem("users");
    const savedAssignments = localStorage.getItem("assignments");

    if (savedKeys) setKeys(JSON.parse(savedKeys));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedAssignments) setAssignments(JSON.parse(savedAssignments));

    // Демо данные для первого запуска
    if (!savedKeys) {
      const demoKeys: Key[] = [
        {
          id: "1",
          barcode: "123456789",
          name: "Офис 101",
          description: "Главный офис",
          location: "1 этаж",
          isAvailable: true,
          createdAt: new Date(),
        },
        {
          id: "2",
          barcode: "987654321",
          name: "Склад А",
          description: "Основной склад",
          location: "Цокольный этаж",
          isAvailable: true,
          createdAt: new Date(),
        },
      ];
      setKeys(demoKeys);
    }

    if (!savedUsers) {
      const demoUsers: User[] = [
        {
          id: "1",
          name: "Иван Петров",
          email: "ivan@company.com",
          department: "IT",
          createdAt: new Date(),
        },
        {
          id: "2",
          name: "Мария Смирнова",
          email: "maria@company.com",
          department: "Бухгалтерия",
          createdAt: new Date(),
        },
      ];
      setUsers(demoUsers);
    }
  }, []);

  const saveToStorage = (type: string, data: any) => {
    localStorage.setItem(type, JSON.stringify(data));
  };

  const addKey = (keyData: Omit<Key, "id" | "createdAt">) => {
    const newKey: Key = {
      ...keyData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    const updatedKeys = [...keys, newKey];
    setKeys(updatedKeys);
    saveToStorage("keys", updatedKeys);
  };

  const addUser = (userData: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveToStorage("users", updatedUsers);
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    saveToStorage("users", updatedUsers);
  };

  const deleteKey = (keyId: string) => {
    const updatedKeys = keys.filter((key) => key.id !== keyId);
    setKeys(updatedKeys);
    saveToStorage("keys", updatedKeys);
  };

  const updateKey = (keyId: string, keyData: Omit<Key, "id" | "createdAt">) => {
    const updatedKeys = keys.map((key) =>
      key.id === keyId ? { ...key, ...keyData } : key,
    );
    setKeys(updatedKeys);
    saveToStorage("keys", updatedKeys);
  };

  const updateUser = (
    userId: string,
    userData: Omit<User, "id" | "createdAt">,
  ) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, ...userData } : user,
    );
    setUsers(updatedUsers);
    saveToStorage("users", updatedUsers);
  };

  const assignKey = (keyId: string, userId: string, notes?: string) => {
    const assignment: KeyAssignment = {
      id: Date.now().toString(),
      keyId,
      userId,
      assignedAt: new Date(),
      notes,
    };

    const updatedAssignments = [...assignments, assignment];
    const updatedKeys = keys.map((key) =>
      key.id === keyId ? { ...key, isAvailable: false } : key,
    );

    setAssignments(updatedAssignments);
    setKeys(updatedKeys);
    saveToStorage("assignments", updatedAssignments);
    saveToStorage("keys", updatedKeys);
  };

  const returnKey = (assignmentId: string) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) return;

    const updatedAssignments = assignments.map((a) =>
      a.id === assignmentId ? { ...a, returnedAt: new Date() } : a,
    );
    const updatedKeys = keys.map((key) =>
      key.id === assignment.keyId ? { ...key, isAvailable: true } : key,
    );

    setAssignments(updatedAssignments);
    setKeys(updatedKeys);
    saveToStorage("assignments", updatedAssignments);
    saveToStorage("keys", updatedKeys);
  };

  const getKeyByBarcode = (barcode: string) => {
    return keys.find((key) => key.barcode === barcode);
  };

  const getActiveAssignments = () => {
    return assignments.filter((a) => !a.returnedAt);
  };

  return {
    keys,
    users,
    assignments,
    addKey,
    addUser,
    deleteUser,
    deleteKey,
    updateKey,
    updateUser,
    assignKey,
    returnKey,
    getKeyByBarcode,
    getActiveAssignments,
    // Добавляем алиасы для совместимости
    editKey: updateKey,
    editUser: updateUser,
  };
};
