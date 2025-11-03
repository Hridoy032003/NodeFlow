"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { Play, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StartNodeData {
  label?: string;
  childCount?: number;
}

function StartNode({ data, selected }: NodeProps) {
  const nodeData = data as StartNodeData;
  return (
    <Card
      className={`min-w-[180px] transition-all ${
        selected ? "ring-2 ring-foreground shadow-lg" : "shadow-md"
      }`}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-muted border flex items-center justify-center">
            <Play className="w-5 h-5 ml-0.5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base">
                {String(nodeData.label || "Start")}
              </h3>
              {(nodeData.childCount ?? 0) > 0 && (
                <Badge
                  variant="outline"
                  className="text-[10px] h-5 px-1.5 gap-0.5"
                >
                  <ArrowDown className="w-3 h-3" />
                  {nodeData.childCount}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Begin workflow</p>
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

export default memo(StartNode);
