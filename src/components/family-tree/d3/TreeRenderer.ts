
import * as d3 from 'd3';

export const renderTreeWithD3 = (
  svgRef: React.RefObject<SVGSVGElement>, 
  data: any
) => {
  if (!data || !svgRef.current) return;

  // Clear previous tree
  d3.select(svgRef.current).selectAll('*').remove();

  // Set dimensions
  const margin = { top: 50, right: 120, bottom: 50, left: 120 };
  const width = 960 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  // Create SVG
  const svg = d3.select(svgRef.current)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Create hierarchy
  const root = d3.hierarchy(data);

  // Create tree layout
  const tree = d3.tree().size([height, width]);

  // Compute layout
  tree(root);

  // Add links
  svg.selectAll('.link')
    .data(root.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x));

  // Add nodes
  const node = svg.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', d => `node ${d.children ? 'node--internal' : 'node--leaf'}`)
    .attr('transform', d => `translate(${d.y},${d.x})`);

  // Add circles to nodes
  node.append('circle')
    .attr('r', d => d.data.virtual ? 5 : 10)
    .style('fill', d => {
      if (d.data.virtual) return '#ccc';
      return d.data.gender === 'male' ? '#4682B4' : 
             d.data.gender === 'female' ? '#FF69B4' : '#9370DB';
    })
    .style('stroke', d => d.data.virtual ? '#ccc' : '#333');

  // Add labels
  node.append('text')
    .attr('dy', '.35em')
    .attr('x', d => d.children ? -13 : 13)
    .style('text-anchor', d => d.children ? 'end' : 'start')
    .text(d => d.data.name);

  // Add zoom functionality
  const zoomHandler = d3.zoom()
    .scaleExtent([0.5, 2])
    .on('zoom', (event) => {
      svg.attr('transform', event.transform);
    });

  d3.select(svgRef.current)
    .call(zoomHandler)
    .call(
      zoomHandler.transform,
      d3.zoomIdentity.translate(margin.left, margin.top)
    );

  return { zoomHandler };
};

export const handleZoom = (
  svgRef: React.RefObject<SVGSVGElement>, 
  action: 'in' | 'out' | 'reset'
) => {
  if (!svgRef.current) return;
  
  if (action === 'in') {
    d3.select(svgRef.current)
      .transition()
      .call(d3.zoom().scaleBy, 1.2);
  } else if (action === 'out') {
    d3.select(svgRef.current)
      .transition()
      .call(d3.zoom().scaleBy, 0.8);
  } else if (action === 'reset') {
    d3.select(svgRef.current)
      .transition()
      .call(
        d3.zoom().transform,
        d3.zoomIdentity.translate(120, 50)
      );
  }
};
