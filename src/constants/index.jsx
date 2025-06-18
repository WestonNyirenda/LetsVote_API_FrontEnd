// src/navigation/index.jsx or wherever you're putting it
import { ChartColumn, Home, NotepadText, Package, PackagePlus, Settings } from "lucide-react";

export const navbarLinks = [
  {
    title: "Dashboard",
    links: [
      {
        label: "Dashboard",
        icon: Home,
        path: "/",
      },
      {
        label: "Analytics",
        icon: ChartColumn,
        path: "/analytics",
      },
      {
        label: "Reports",
        icon: NotepadText,
        path: "/reports",
      },
    ],
  },
  {
    title: "Inventory",
    links: [
      {
        label: "Stock",
        icon: Package,
        path: "/stock",
      },
      {
        label: "New Item",
        icon: PackagePlus,
        path: "/items/new",
      },
    ],
  },
  {
    title: "Settings",
    links: [
      {
        label: "Preferences",
        icon: Settings,
        path: "/settings",
      },
    ],
  },
];
