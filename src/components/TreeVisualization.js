import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Loader } from 'lucide-react';
import GitTreeUtils from '../utils/GitTreeUtils';

const TreeVisualization = ({ data, onCommitClick, isLoading }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || isLoading || !data.nodes.length) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const container = svg.node().parentNode;
    const containerWidth = container.clientWidth;
    const width = Math.max(800, containerWidth);
    const height = Math.max(400, data.nodes.length * 80 + 100);
    
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Create groups for organized rendering
    const linkGroup = svg.append("g").attr("class", "links");
    const nodeGroup = svg.append("g").attr("class", "nodes");

    // Create links with smooth curves
    const linkElements = linkGroup
      .selectAll("path")
      .data(data.links)
      .enter()
      .append("path")
      .attr("stroke", d => d.color)
      .attr("stroke-width", 3)
      .attr("fill", "none")
      .attr("opacity", 0)
      .attr("stroke-dasharray", "5,5")
      .attr("d", d => {
        const source = data.nodes.find(n => n.sha === d.source);
        const target = data.nodes.find(n => n.sha === d.target);
        if (!source || !target) return "";
        
        // Create smooth curved path
        const midY = (source.y + target.y) / 2;
        return `M${source.x},${source.y} 
                Q${source.x},${midY} ${target.x},${target.y}`;
      });

    // Create commit nodes
    const nodeElements = nodeGroup
      .selectAll("g")
      .data(data.nodes)
      .enter()
      .append("g")
      .attr("class", "commit-node")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer")
      .on("click", (event, d) => onCommitClick(d))
      .on("mouseenter", function(event, d) {
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", 22)
          .style("filter", "drop-shadow(0 4px 8px rgba(0,0,0,0.4))");
      })
      .on("mouseleave", function(event, d) {
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", 18)
          .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))");
      });

    // Add commit circles with animation
    nodeElements
      .append("circle")
      .attr("r", 0)
      .attr("fill", d => d.color)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 3)
      .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))")
      .transition()
      .duration(600)
      .delay((d, i) => i * 100)
      .ease(d3.easeElasticOut)
      .attr("r", 18);

    // Add commit hash text
    nodeElements
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("fill", "#ffffff")
      .style("opacity", 0)
      .text(d => d.sha ? d.sha.substring(0, 4) : '?')
      .transition()
      .duration(300)
      .delay((d, i) => i * 100 + 300)
      .style("opacity", 1);

    // Add commit message labels
    nodeElements
      .append("text")
      .attr("x", 30)
      .attr("y", 0)
      .attr("dy", "0.3em")
      .attr("font-size", "12px")
      .attr("fill", "#e2e8f0")
      .style("opacity", 0)
      .text(d => GitTreeUtils.truncateMessage(d.message, 40))
      .transition()
      .duration(400)
      .delay((d, i) => i * 100 + 400)
      .style("opacity", 1);

    // Animate links after nodes
    linkElements
      .transition()
      .duration(800)
      .delay(600)
      .attr("opacity", 0.6)
      .attr("stroke-dasharray", "0");

  }, [data, isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader className="w-8 h-8 animate-spin text-blue-400" />
        <p className="text-slate-400">Loading repository data...</p>
      </div>
    );
  }

  if (!data || !data.nodes.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-400">No data to visualize</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/70 rounded-lg overflow-hidden border border-slate-700">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-300">
            Showing {data.nodes.length} commits across {new Set(data.nodes.map(n => n.branchName)).size} branches
          </h3>
          <div className="text-xs text-slate-500">
            Click nodes for details • Hover for preview
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        <svg ref={svgRef} className="w-full" style={{ minHeight: '400px' }} />
      </div>
    </div>
  );
};

export default TreeVisualization;