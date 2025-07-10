import React from "react";
import { Home, Puzzle, CreditCard, List, Mountain } from "lucide-react";
import { useAllowedModules } from "@/hooks/useAllowedModules";
import { MODULE_CONFIGS } from "./moduleConfig";

const adminNavItems = [
  { label: "Clients", icon: <Home size={18} />, href: "/admin" },
  { label: "Modules", icon: <Puzzle size={18} />, href: "/admin/modules" },
  { label: "Billing", icon: <CreditCard size={18} />, href: "/admin/billing" },
  { label: "Logs", icon: <List size={18} />, href: "/admin/logs" },
];

export default function Sidebar() {
  // Detect if impersonating a client
  let clientId: string | null = null;
  if (typeof window !== "undefined") {
    clientId = localStorage.getItem("clientId");
  }
  const { modules: allowedModules, loading } = useAllowedModules(clientId);

  // Logo section
  const logo = (
    <a
      href={clientId ? "/dashboard" : "/admin"}
      className="flex items-center gap-2 mb-6 px-3 py-2 select-none hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-all"
      aria-label="SlopeShift Home"
    >
      <Mountain className="h-7 w-7 text-primary-alpine" />
      <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">SlopeShift</span>
    </a>
  );

  // If impersonating a client, show allowed modules
  if (clientId) {
    return (
      <nav aria-label="Client sidebar" className="prose-sm flex flex-col gap-2 py-4 px-2 bg-white dark:bg-slate-900 shadow-md rounded-r-xl min-w-[200px]">
        {logo}
        {loading ? (
          <div className="text-gray-400 px-3 py-2">Loading modules...</div>
        ) : (
          allowedModules.length === 0 ? (
            <div className="text-gray-400 px-3 py-2">No modules enabled</div>
          ) : (
            allowedModules.map((moduleName) => {
              const config = MODULE_CONFIGS[moduleName];
              if (!config) return null;
              return (
                <a
                  key={config.name}
                  href={config.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  tabIndex={0}
                  aria-label={config.label}
                >
                  {config.getIcon()}
                  <span className="font-medium">{config.label}</span>
                </a>
              );
            })
          )
        )}
      </nav>
    );
  }

  // Default: show admin nav
  return (
    <nav aria-label="Admin sidebar" className="prose-sm flex flex-col gap-2 py-4 px-2 bg-white dark:bg-slate-900 shadow-md rounded-r-xl min-w-[200px]">
      {logo}
      {adminNavItems.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          tabIndex={0}
          aria-label={item.label}
        >
          {item.icon}
          <span className="font-medium">{item.label}</span>
        </a>
      ))}
    </nav>
  );
} 