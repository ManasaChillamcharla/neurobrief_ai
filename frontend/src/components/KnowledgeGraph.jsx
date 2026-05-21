import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KnowledgeGraph = ({ graph }) => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    if (!graph || !graph.nodes || graph.nodes.length === 0) return;

    const width = 600;
    const height = 400;
    const cx = width / 2;
    const cy = height / 2;

    // Distribute nodes in a concentric ring system around a central hub
    const mainNode = graph.nodes.find(n => n.group === 'core') || graph.nodes[0];
    const otherNodes = graph.nodes.filter(n => n.id !== mainNode.id);

    const calculatedNodes = [];

    // Place central core node
    calculatedNodes.push({
      ...mainNode,
      x: cx,
      y: cy,
      color: '#06b6d4', // neon cyan
      radius: 24
    });

    // Place surrounding nodes in rings
    const count = otherNodes.length;
    otherNodes.forEach((node, index) => {
      const angle = (index / count) * 2 * Math.PI;
      // Alternate radius rings to look natural and organic
      const radiusDist = index % 2 === 0 ? 120 : 160;
      
      let color = '#a855f7'; // neon purple (concept)
      if (node.group === 'keyword') color = '#ec4899'; // neon pink
      else if (node.group === 'entity') color = '#10b981'; // neon emerald

      calculatedNodes.push({
        ...node,
        x: cx + radiusDist * Math.cos(angle),
        y: cy + radiusDist * Math.sin(angle),
        color,
        radius: 14 + (node.val || 1) * 2
      });
    });

    // Map links based on matched x/y coords
    const nodeMap = new Map(calculatedNodes.map(n => [n.id, n]));
    const calculatedLinks = (graph.links || []).map((link, idx) => {
      const sourceNode = nodeMap.get(link.source);
      const targetNode = nodeMap.get(link.target);
      
      if (sourceNode && targetNode) {
        return {
          id: `link_${idx}`,
          x1: sourceNode.x,
          y1: sourceNode.y,
          x2: targetNode.x,
          y2: targetNode.y
        };
      }
      return null;
    }).filter(Boolean);

    setNodes(calculatedNodes);
    setLinks(calculatedLinks);

  }, [graph]);

  if (!graph || !graph.nodes || graph.nodes.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center border border-dashed border-cyber-border rounded-2xl bg-slate-900/10">
        <p className="text-cyber-textMuted text-sm">No conceptual nodes computed yet.</p>
      </div>
    );
  }

  return (
    <div className="relative glass-card border border-cyber-border rounded-2xl p-4 overflow-hidden w-full bg-slate-950/40">
      
      {/* Legend Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-cyber-border/40">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">AI Topic Mapping</h3>
          <p className="text-[10px] text-cyber-textMuted">Interactive semantic relationships</p>
        </div>
        <div className="flex gap-4 text-[10px] font-bold">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyber-neonCyan inline-block"></span>Core Context</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyber-neonPurple inline-block"></span>Concepts</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyber-neonPink inline-block"></span>Keywords</span>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-hidden">
        <svg viewBox="0 0 600 400" className="w-full min-w-[500px] h-96 select-none">
          {/* Background grid */}
          <defs>
            <radialGradient id="neonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(168, 85, 247, 0.15)" />
              <stop offset="100%" stopColor="rgba(3, 7, 18, 0)" />
            </radialGradient>
          </defs>
          
          <rect width="600" height="400" fill="url(#neonGlow)" />

          {/* Links / Lines */}
          <g>
            {links.map((link) => (
              <line
                key={link.id}
                x1={link.x1}
                y1={link.y1}
                x2={link.x2}
                y2={link.y2}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            ))}
          </g>

          {/* Nodes */}
          <g>
            {nodes.map((node) => {
              const isHovered = hoveredNode && hoveredNode.id === node.id;
              
              return (
                <g 
                  key={node.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Glowing outer shadow ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius + (isHovered ? 8 : 4)}
                    fill={node.color}
                    opacity={isHovered ? 0.25 : 0.06}
                    className="transition-all duration-300"
                  />

                  {/* Inner Solid circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius}
                    fill="#111827"
                    stroke={node.color}
                    strokeWidth={isHovered ? '2.5' : '1.5'}
                    className="transition-all duration-300"
                  />

                  {/* Text Label inside or below node */}
                  <text
                    x={node.x}
                    y={node.group === 'core' ? node.y + 4 : node.y + node.radius + 14}
                    fill={isHovered ? '#ffffff' : '#9ca3af'}
                    fontSize={node.group === 'core' ? '10px' : '9px'}
                    fontWeight={node.group === 'core' ? 'bold' : 'normal'}
                    textAnchor="middle"
                    className="pointer-events-none transition-colors duration-200"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Floating details tooltip card */}
      <div className="h-12 mt-2 flex items-center justify-center">
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-4 py-1.5 rounded-xl border border-cyber-border bg-slate-900/90 text-xs flex items-center gap-2 shadow-lg backdrop-blur-md"
            >
              <span 
                className="w-2 h-2 rounded-full inline-block" 
                style={{ backgroundColor: hoveredNode.color }}
              ></span>
              <span className="text-cyber-textMuted uppercase font-bold text-[9px] tracking-wider">
                {hoveredNode.group} :
              </span>
              <span className="text-slate-100 font-semibold">{hoveredNode.label}</span>
              <span className="text-slate-500 text-[10px]">(Weight: {hoveredNode.val || 1})</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default KnowledgeGraph;
