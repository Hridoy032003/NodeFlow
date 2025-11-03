"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, RotateCcw, Trophy } from "lucide-react";

interface Node {
  id: number;
  x: number;
  y: number;
  color: string;
  connected: boolean;
}

export default function NotFound() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const colors = [
    "#3b82f6", // blue
    "#ef4444", // red
    "#10b981", // green
    "#f59e0b", // amber
    "#8b5cf6", // purple
    "#ec4899", // pink
  ];

  // Initialize game
  const initGame = () => {
    const newNodes: Node[] = [];
    for (let i = 0; i < 12; i++) {
      newNodes.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        connected: false,
      });
    }
    setNodes(newNodes);
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
  };

  // Timer countdown
  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("nodeflow-404-highscore", score.toString());
      }
    }
  }, [timeLeft, gameActive, score, highScore]);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem("nodeflow-404-highscore");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Handle node click
  const handleNodeClick = (nodeId: number) => {
    if (!gameActive) return;

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, connected: true } : node
      )
    );
    setScore((prev) => prev + 10);

    // Add bonus time for combos
    if (score % 50 === 0 && score > 0) {
      setTimeLeft((prev) => prev + 3);
    }
  };

  const connectedCount = nodes.filter((n) => n.connected).length;
  const progressPercent = (connectedCount / nodes.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <Card className="p-8 shadow-2xl border-2">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <span className="text-4xl font-bold text-primary">404</span>
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Workflow Not Found
            </h1>
            <p className="text-muted-foreground text-lg">
              Oops! Looks like this workflow got disconnected.
            </p>
          </div>

          {/* Game Area */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-semibold">
                    Score: <span className="text-primary">{score}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    Time: <span className="text-primary">{timeLeft}s</span>
                  </span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                High Score: {highScore}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-muted rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Game Canvas */}
            <div className="relative w-full h-[400px] bg-gradient-to-br from-muted/30 to-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20 overflow-hidden">
              {!gameActive && nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">
                      Connect the Nodes!
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Click all the workflow nodes before time runs out
                    </p>
                    <Button onClick={initGame} size="lg">
                      Start Game
                    </Button>
                  </div>
                </div>
              )}

              {!gameActive && timeLeft === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold mb-2">
                      {score > highScore - 10
                        ? "🎉 Amazing!"
                        : score > 50
                        ? "Great Job!"
                        : "Time's Up!"}
                    </h3>
                    <p className="text-xl mb-4">
                      Final Score:{" "}
                      <span className="text-primary font-bold">{score}</span>
                    </p>
                    <Button onClick={initGame} size="lg">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Play Again
                    </Button>
                  </div>
                </div>
              )}

              {/* Nodes */}
              {nodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  disabled={node.connected || !gameActive}
                  className="absolute transition-all duration-200 transform"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform:
                      hoveredNode === node.id && !node.connected
                        ? "translate(-50%, -50%) scale(1.2)"
                        : "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-white shadow-lg ${
                      node.connected
                        ? "opacity-30 scale-75"
                        : "animate-pulse cursor-pointer hover:shadow-xl"
                    }`}
                    style={{
                      backgroundColor: node.connected ? "#666" : node.color,
                      borderColor: node.connected
                        ? "#444"
                        : hoveredNode === node.id
                        ? "#fff"
                        : node.color,
                    }}
                  >
                    {node.connected ? "✓" : node.id + 1}
                  </div>
                </button>
              ))}

              {/* Connection Lines Effect */}
              {gameActive && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                  {nodes.map((node, i) =>
                    nodes
                      .slice(i + 1)
                      .filter((n) => node.connected && n.connected)
                      .map((targetNode) => (
                        <line
                          key={`${node.id}-${targetNode.id}`}
                          x1={`${node.x}%`}
                          y1={`${node.y}%`}
                          x2={`${targetNode.x}%`}
                          y2={`${targetNode.y}%`}
                          stroke={node.color}
                          strokeWidth="2"
                          className="animate-pulse"
                        />
                      ))
                  )}
                </svg>
              )}
            </div>

            {gameActive && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                💡 Tip: Connect all nodes quickly for bonus points! Every 5
                nodes gives you +3 seconds
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" variant="default">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2 text-center">How to Play</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Click all the colored nodes before time runs out</li>
              <li>• Each node gives you 10 points</li>
              <li>• Connect 5 nodes to earn bonus time (+3 seconds)</li>
              <li>• Beat your high score and become a Node Master!</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
