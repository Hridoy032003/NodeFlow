"use client";

import { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Card } from "./card";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";


// Popular workflow icons
const WORKFLOW_ICONS = [
  "Box",
  "Package",
  "Database",
  "Server",
  "Cloud",
  "Mail",
  "Send",
  "FileText",
  "File",
  "Folder",
  "Upload",
  "Download",
  "Check",
  "X",
  "AlertCircle",
  "Info",
  "Bell",
  "Calendar",
  "Clock",
  "Timer",
  "Zap",
  "Activity",
  "TrendingUp",
  "BarChart",
  "PieChart",
  "Filter",
  "Search",
  "Edit",
  "Trash",
  "Copy",
  "Share",
  "Link",
  "Eye",
  "Lock",
  "Unlock",
  "User",
  "Users",
  "UserPlus",
  "Phone",
  "MessageSquare",
  "MessageCircle",
  "ShoppingCart",
  "CreditCard",
  "DollarSign",
  "Tag",
  "Bookmark",
  "Star",
  "Heart",
  "ThumbsUp",
  "Flag",
  "Target",
  "Award",
  "Gift",
  "Code",
  "Terminal",
  "Cpu",
  "HardDrive",
  "Wifi",
  "Globe",
  "MapPin",
  "Navigation",
  "Compass",
  "Image",
  "Video",
  "Music",
  "Mic",
  "Camera",
  "Printer",
  "Monitor",
  "Smartphone",
  "Tablet",
  "Settings",
  "Tool",
  "Wrench",
  "Sliders",
  "ToggleLeft",
  "Power",
  "RefreshCw",
  "RotateCw",
  "Shuffle",
  "Repeat",
  "PlayCircle",
  "PauseCircle",
  "StopCircle",
  "SkipForward",
  "SkipBack",
  "Volume2",
  "VolumeX",
];

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIcons = WORKFLOW_ICONS.filter((iconName) =>
    iconName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : null;
  };

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search icons..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />
      <ScrollArea className="h-64 w-full rounded-md border p-2">
        <div className="grid grid-cols-6 gap-2">
          {filteredIcons.map((iconName) => {
            const Icon = (LucideIcons as any)[iconName];
            if (!Icon) return null;

            return (
              <button
                key={iconName}
                onClick={() => onChange(iconName)}
                className={`flex items-center justify-center p-3 rounded-md transition-all hover:bg-purple-100 dark:hover:bg-purple-900/30 ${
                  value === iconName ? "bg-purple-500 text-white" : "bg-muted"
                }`}
                title={iconName}
                type="button"
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </ScrollArea>
      {value && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Selected:</span>
          <div className="flex items-center gap-2 font-medium text-foreground">
            {getIconComponent(value)}
            <span>{value}</span>
          </div>
        </div>
      )}
    </div>
  );
}
