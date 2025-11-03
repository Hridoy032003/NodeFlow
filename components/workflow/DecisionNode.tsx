"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { GitBranch, MoreVertical, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DecisionNodeData {
  label?: string;
  description?: string;
  parentCount?: number;
  childCount?: number;
}

function DecisionNode({ data, selected }: NodeProps) {
  const nodeData = data as DecisionNodeData;
  return (
    <Card
      className={`min-w-[220px] transition-all ${
        selected ? "ring-2 ring-foreground shadow-lg" : "shadow-md"
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
            <GitBranch className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-base truncate">
                {String(nodeData.label || "Decision")}
              </h3>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </div>
            {nodeData.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {String(nodeData.description)}
              </p>
            )}
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-xs">
                Conditional
              </Badge>
              {(nodeData.parentCount ?? 0) > 0 && (
                <Badge
                  variant="outline"
                  className="text-[10px] h-5 px-1.5 gap-0.5"
                >
                  <ArrowUp className="w-3 h-3" />
                  {nodeData.parentCount}
                </Badge>
              )}
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
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="w-3 h-3 bg-foreground! border-2 border-background"
        style={{ left: "30%" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="w-3 h-3 bg-foreground! border-2 border-background"
        style={{ left: "70%" }}
      />
    </Card>
  );
}

export default memo(DecisionNode);
