"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { Square, ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EndNodeData {
  label?: string;
  parentCount?: number;
}

function EndNode({ data, selected }: NodeProps) {
  const nodeData = data as EndNodeData;
  return (
    <Card
      className={`min-w-[180px] transition-all ${
        selected ? "ring-2 ring-foreground shadow-lg" : "shadow-md"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-foreground! border-2 border-background"
      />

      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-muted border flex items-center justify-center">
            <Square className="w-5 h-5 fill-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base">
                {String(nodeData.label || "End")}
              </h3>
              {(nodeData.parentCount ?? 0) > 0 && (
                <Badge
                  variant="outline"
                  className="text-[10px] h-5 px-1.5 gap-0.5"
                >
                  <ArrowUp className="w-3 h-3" />
                  {nodeData.parentCount}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Finish workflow</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default memo(EndNode);
