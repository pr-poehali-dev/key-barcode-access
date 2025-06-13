import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/LoginForm";
import KeyManagement from "@/components/KeyManagement";

const Index = () => {
  const { auth, login, logout } = useAuth();

  if (!auth.isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return <KeyManagement onLogout={logout} />;
};

export default Index;
