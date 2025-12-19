"use client";

import { Collapse, Group, Text, UnstyledButton } from "@mantine/core";
import {
  IconChevronDown,
  IconChevronRight,
  TablerIcon,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface MainLinkProps {
  icon: TablerIcon;
  label: string;
  link?: string;
  subItems?: { link: string; label: string }[];
  isActive: boolean;
  isSubMenuActive: string | null;
  isOpen: boolean;
  setOpenMenus: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  setActiveSubMenu: React.Dispatch<React.SetStateAction<string | null>>;
}

const MainLink = ({
  icon: Icon,
  label,
  link,
  subItems = [],
  isActive,
  isSubMenuActive,
  isOpen,
  setOpenMenus,
  setActiveSubMenu,
}: MainLinkProps) => {
  const hasSubItems = subItems && subItems.length > 0;
  const pathname = usePathname();

  const isAnySubmenuActive = subItems.some(
    (subItem) => subItem.link === pathname
  );

  const handleClick = () => {
    if (hasSubItems) {
      setOpenMenus((prev) => ({ ...prev, [label]: !isOpen }));
    }
  };

  return (
    <>
      {link ? (
        <Link href={link} passHref>
          <UnstyledButton
            onClick={handleClick}
            className={`w-full px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-[#0f6d69] text-white font-semibold shadow-md"
                : isAnySubmenuActive
                ? "bg-white/15 text-white"
                : "hover:bg-white/10 text-white"
            }`}
          >
            <Group justify="space-between" align="center" gap="xs">
              <Group gap="xs">
                <Icon size={18} stroke={2} />
                <Text size="sm">{label}</Text>
              </Group>
              {hasSubItems &&
                (isOpen ? (
                  <IconChevronDown size={14} />
                ) : (
                  <IconChevronRight size={14} />
                ))}
            </Group>
          </UnstyledButton>
        </Link>
      ) : (
        <UnstyledButton
          onClick={handleClick}
          className={`w-full px-3 py-2 rounded-lg transition-all duration-200 ${
            isActive
              ? "bg-[#0f6d69] text-white font-semibold shadow-md"
              : isAnySubmenuActive
              ? "bg-white/15 text-white"
              : "hover:bg-white/10 text-white"
          }`}
        >
          <Group justify="space-between" align="center" gap="xs">
            <Group gap="xs">
              <Icon size={18} stroke={2} />
              <Text size="sm">{label}</Text>
            </Group>
            {hasSubItems &&
              (isOpen ? (
                <IconChevronDown size={14} />
              ) : (
                <IconChevronRight size={14} />
              ))}
          </Group>
        </UnstyledButton>
      )}

      {hasSubItems && (
        <Collapse in={isOpen}>
          <div className="ml-7 my-1 space-y-0.5">
            {subItems.map((subItem) => (
              <Link href={subItem.link} key={subItem.link} passHref>
                <UnstyledButton
                  onClick={() => setActiveSubMenu(subItem.link)}
                  className={`w-full px-3 py-1.5 rounded-md transition-all duration-200 text-left ${
                    pathname === subItem.link
                      ? "bg-[#0f6d69] text-white font-medium shadow-sm"
                      : "hover:bg-white/10 text-white/90"
                  }`}
                >
                  <Text size="sm">{subItem.label}</Text>
                </UnstyledButton>
              </Link>
            ))}
          </div>
        </Collapse>
      )}
    </>
  );
};

interface MenuItem {
  icon: TablerIcon;
  label: string;
  link?: string;
  subItems?: { link: string; label: string }[];
  category?: string;
}

interface ClientNavWrapperProps {
  menuItems: MenuItem[];
}

const ClientNavWrapper = ({ menuItems }: ClientNavWrapperProps) => {
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const pathname = usePathname();

  useEffect(() => {
    setActiveSubMenu(null);
  }, [pathname]);

  // Group menu items by category
  const groupedItems: { [key: string]: MenuItem[] } = {};
  menuItems.forEach((item) => {
    const category = item.category || "General";
    if (!groupedItems[category]) {
      groupedItems[category] = [];
    }
    groupedItems[category].push(item);
  });

  return (
    <>
      {Object.entries(groupedItems).map(([category, items], categoryIndex) => (
        <div key={category} className={categoryIndex > 0 ? "mt-4" : ""}>
          {/* Category Header */}
          <Text
            size="xs"
            fw={600}
            className="text-white/50 uppercase tracking-wide mb-2 px-1"
          >
            {category}
          </Text>

          {/* Menu Items */}
          <div className="space-y-0.5">
            {items.map((item) => (
              <MainLink
                key={item.label}
                {...item}
                isActive={pathname === item.link}
                isSubMenuActive={activeSubMenu}
                isOpen={openMenus[item.label] ?? false}
                setOpenMenus={setOpenMenus}
                setActiveSubMenu={setActiveSubMenu}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default ClientNavWrapper;
