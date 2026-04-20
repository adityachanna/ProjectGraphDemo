"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import type { GraphEdge, GraphNode, KnowledgeGraph as KnowledgeGraphData } from "@/lib/types";

type KnowledgeGraphProps = {
  graph: KnowledgeGraphData;
};

type SimNode = GraphNode & d3.SimulationNodeDatum;
type SimEdge = GraphEdge & d3.SimulationLinkDatum<SimNode>;

const colors: Record<GraphNode["type"], string> = {
  student: "#216869",
  branch: "#3f7cac",
  year: "#95afba",
  interest: "#d96c06",
  skill: "#7a5cbe",
  goal: "#2d936c",
  emotion: "#c2410c",
  recommendation: "#a4161a",
  rule: "#4a5568",
};

export function KnowledgeGraph({ graph }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 680;
    const height = 500;
    const nodes: SimNode[] = graph.nodes.map((node) => ({ ...node }));
    const edges: SimEdge[] = graph.edges.map((edge) => ({ ...edge }));

    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("role", "img");

    const linkGroup = svg.append("g").attr("stroke", "#8a96a8").attr("stroke-opacity", 0.75);
    const nodeGroup = svg.append("g");
    const labelGroup = svg.append("g");

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimEdge>(edges)
          .id((node) => node.id)
          .distance(110),
      )
      .force("charge", d3.forceManyBody().strength(-480))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(42));

    const links = linkGroup
      .selectAll("line")
      .data(edges)
      .join("line")
      .attr("stroke-width", 1.6);

    const edgeLabels = labelGroup
      .selectAll("text.edge")
      .data(edges)
      .join("text")
      .attr("class", "edge")
      .attr("font-size", 10)
      .attr("fill", "#5d6878")
      .text((edge) => edge.label);

    const node = nodeGroup
      .selectAll<SVGCircleElement, SimNode>("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (item) => (item.type === "recommendation" ? 22 : 17))
      .attr("fill", (item) => colors[item.type])
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2);

    const dragBehavior = d3
      .drag<SVGCircleElement, SimNode>()
      .on("start", (event, item) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        item.fx = item.x;
        item.fy = item.y;
      })
      .on("drag", (event, item) => {
        item.fx = event.x;
        item.fy = event.y;
      })
      .on("end", (event, item) => {
        if (!event.active) simulation.alphaTarget(0);
        item.fx = null;
        item.fy = null;
      });

    node.call(dragBehavior);

    const labels = labelGroup
      .selectAll("text.node")
      .data(nodes)
      .join("text")
      .attr("class", "node")
      .attr("font-size", 12)
      .attr("font-weight", 700)
      .attr("fill", "#111827")
      .attr("text-anchor", "middle")
      .text((item) => item.label);

    simulation.on("tick", () => {
      links
        .attr("x1", (edge) => (edge.source as SimNode).x ?? 0)
        .attr("y1", (edge) => (edge.source as SimNode).y ?? 0)
        .attr("x2", (edge) => (edge.target as SimNode).x ?? 0)
        .attr("y2", (edge) => (edge.target as SimNode).y ?? 0);

      node.attr("cx", (item) => item.x ?? 0).attr("cy", (item) => item.y ?? 0);

      labels.attr("x", (item) => item.x ?? 0).attr("y", (item) => (item.y ?? 0) + 32);

      edgeLabels
        .attr("x", (edge) => (((edge.source as SimNode).x ?? 0) + ((edge.target as SimNode).x ?? 0)) / 2)
        .attr("y", (edge) => (((edge.source as SimNode).y ?? 0) + ((edge.target as SimNode).y ?? 0)) / 2);
    });

    return () => {
      simulation.stop();
    };
  }, [graph]);

  return (
    <section className="panel graph-panel" aria-label="Knowledge graph">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Knowledge representation</p>
          <h2>Live Graph</h2>
        </div>
      </div>
      <svg ref={svgRef} />
      <div className="graph-legend" aria-label="Graph legend">
        {Object.entries(colors).map(([type, color]) => (
          <span key={type}>
            <i style={{ backgroundColor: color }} />
            {type}
          </span>
        ))}
      </div>
    </section>
  );
}
