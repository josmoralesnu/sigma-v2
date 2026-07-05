// Shell del Sigma externo: login → ruteo por ROL.
//   staff (admin/account/viewer) → consola de agencia (switcher + consolidar)
//   client (marca)               → portal de cliente (scopeado, read-only)
import { Sparkles } from "lucide-react";
import { CerebroLive } from "./CerebroLive";
import { ClientDashboard } from "./ClientDashboard";
import { Login } from "./Login";
import { useAuth } from "./useAuth";

export function SigmaApp() {
  const auth = useAuth();

  if (!auth.ready) return <Boot />;
  if (!auth.user) return <Login onLogin={auth.login} error={auth.error} />;

  return auth.user.role === "client" ? (
    <ClientDashboard user={auth.user} onLogout={auth.logout} />
  ) : (
    <CerebroLive user={auth.user} onLogout={auth.logout} />
  );
}

function Boot() {
  return (
    <div className="grid h-screen w-screen place-items-center bg-canvas text-content">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan/15 text-cyan breathe">
        <Sparkles size={22} />
      </span>
    </div>
  );
}
