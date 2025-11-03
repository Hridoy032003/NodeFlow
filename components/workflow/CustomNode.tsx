"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { Box, MoreVertical, FileText, ArrowDown, ArrowUp } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CustomNodeData {
  label?: string;
  description?: string;
  icon?: string;
  parentCount?: number;
  childCount?: number;
}

function CustomNode({ data, selected }: NodeProps) {
  const nodeData = data as CustomNodeData;
  // Dynamically get the icon component
  const getIconComponent = () => {
    const iconName = nodeData.icon || "Box";
    const Icon = (LucideIcons as any)[iconName as string];
    return Icon || Box;
  };

  const IconComponent = getIconComponent();

  return (
    <Card
      className={`min-w-[220px] max-w-[280px] transition-all ${
        selected
          ? "ring-2 ring-foreground shadow-lg"
          : "shadow-md hover:shadow-lg"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-foreground! border-2 border-background"
      />

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-md bg-muted border flex items-center justify-center shrink-0">
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-base truncate">
                {String(nodeData.label || "Custom Node")}
              </h3>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </div>

            {/* Parent-Child Indicators */}
            {((nodeData.parentCount ?? 0) > 0 ||
              (nodeData.childCount ?? 0) > 0) && (
              <div className="flex items-center gap-1.5 mb-2">
                {(nodeData.parentCount ?? 0) > 0 && (
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 px-1.5 gap-1"
                  >
                    <ArrowUp className="w-3 h-3" />
                    {nodeData.parentCount}
                  </Badge>
                )}
                {(nodeData.childCount ?? 0) > 0 && (
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 px-1.5 gap-1"
                  >
                    <ArrowDown className="w-3 h-3" />
                    {nodeData.childCount}
                  </Badge>
                )}
              </div>
            )}

            {nodeData.description ? (
              <div className="mt-2 p-2 rounded-md bg-muted/50 border">
                <div className="flex items-start gap-2">
                  <FileText className="w-3 h-3 mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {String(nodeData.description)}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-foreground! border-2 border-background"
      />
    </Card>
  );
}

export default memo(CustomNode);
