// script.js – Main JavaScript for DSIL Website
// Handles sticky header, scroll-triggered animations, word-cloud, and D3 network diagram

// --- Utility: adjust padding when header changes height ---
function adjustMainPadding() {
  const header = document.getElementById('main-header');
  const main = document.querySelector('main');
  if (header && main && !main.classList.contains('no-padding')) {
    main.style.paddingTop = `${header.offsetHeight + 12}px`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1) 배경 색상 고정
  document.body.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  document.querySelector('main').style.backgroundColor = document.body.style.backgroundColor;

  adjustMainPadding();
  window.addEventListener('resize', adjustMainPadding);

  // 2) Camera Shutter Animation
  const cameraOverlay = document.getElementById('camera-overlay');
  const cameraIcon = document.querySelector('.camera-icon');
  const shutterButton = document.querySelector('.shutter-button');
  const aperture = document.querySelector('.aperture');
  const flashEffect = document.querySelector('.flash-effect');
  const triggerBtn = document.getElementById('camera-trigger');

  // ACCESSIBILITY CONSIDERATION:
  // The camera animation currently auto-plays on page load (via a setTimeout call in DOMContentLoaded).
  // For users with motion sensitivities, auto-playing animations can be problematic.
  // Consider the following improvements:
  // 1. Trigger the animation via user interaction only (e.g., on #camera-trigger click, without the auto-play).
  // 2. Provide a user preference or a toggle mechanism to disable animations site-wide or this specific animation.
  // Implementing these changes would require modifications to the auto-play logic below
  // and potentially new UI elements for the toggle.
  function playCameraAnimation() {
    // Ensure necessary elements for the animation are present.
    if (!cameraOverlay || !cameraIcon) return;

    // Get text elements (hero title and subtitle) to apply a shake effect during the animation.
    const heroTitle = document.querySelector('.hero h1');
    const heroSubtitle = document.querySelector('.hero .subtitle');
    // Filter out any null elements in case they are not found.
    const allTextElements = [heroTitle, heroSubtitle].filter(el => el);

    // --- Animation Stage 1: Overlay Activation & Initial Reset ---
    // Activate the camera overlay to make it visible.
    cameraOverlay.classList.add('active');
    
    // Reset any previous animation states to ensure a clean start.
    cameraIcon.classList.remove('animate-in'); // Reset camera icon's entry animation.
    shutterButton.style.animation = ''; // Clear shutter button animation.
    aperture.style.animation = ''; // Clear aperture animation.
    flashEffect.classList.remove('flash'); // Remove flash effect class.
    
    // Remove any lingering shake effects from text elements.
    allTextElements.forEach(el => el.classList.remove('text-shake'));

    // --- Animation Stage 2: Camera Icon Appears ---
    // Start the camera icon's "appear" animation after a brief delay (50ms).
    // This delay allows the overlay to become visible first.
    setTimeout(() => {
      cameraIcon.classList.add('animate-in');
    }, 50); // 50ms delay for visual sequencing.

    // --- Animation Stage 3: Shutter Sequence (Click, Aperture, Flash, Shake) ---
    // This sequence is timed to simulate a camera taking a picture.
    // The main shutter sequence starts after 600ms, allowing the camera icon to fully appear.
    setTimeout(() => {
      // Shutter button press animation (simulates the click).
      shutterButton.style.animation = 'shutterClick 0.15s ease-out';
      
      // Aperture closing effect, timed slightly after the shutter button press (50ms delay).
      setTimeout(() => {
        aperture.style.animation = 'apertureClose 0.25s ease-out';
      }, 50); // 50ms delay relative to shutterButton animation start.
      
      // Flash effect and text shake, synchronized for impact.
      // This occurs 150ms after the aperture effect begins.
      setTimeout(() => {
        flashEffect.classList.add('flash'); // Trigger the visual flash.
        
        // Apply shake effect to designated text elements.
        allTextElements.forEach(el => {
          el.classList.add('text-shake');
        });
        
        // Add a shake effect to the camera icon itself for more dynamism.
        cameraIcon.style.animation += ', textShake 0.4s ease-out';
        
      }, 150); // 150ms delay relative to aperture animation start.
      
    }, 600); // 600ms delay relative to the start of playCameraAnimation.

    // --- Animation Stage 4: Overlay Deactivation & Cleanup ---
    // Hide the overlay and clean up animation states after the full sequence.
    // This starts after 1800ms, allowing all prior effects to complete.
    setTimeout(() => {
      // Start the camera icon's "disappear" animation.
      cameraIcon.style.animation = 'cameraDisappear 0.5s ease-in forwards';
      
      // After the camera icon disappears (500ms), hide the overlay and reset states.
      setTimeout(() => {
        cameraOverlay.classList.remove('active'); // Hide the overlay.
        cameraIcon.classList.remove('animate-in'); // Reset camera icon entry class.
        cameraIcon.style.animation = ''; // Clear all animations from camera icon.
        
        // Clean up text shake and flash effects.
        allTextElements.forEach(el => el.classList.remove('text-shake'));
        flashEffect.classList.remove('flash');
      }, 500); // 500ms delay relative to cameraDisappear animation start.
    }, 1800); // 1800ms delay relative to the start of playCameraAnimation.
  }

  // Trigger button click event
  if (triggerBtn) {
    triggerBtn.addEventListener('click', playCameraAnimation);
  }

  // Auto-play on first load (optional)
  setTimeout(() => {
    playCameraAnimation();
  }, 500);

  // 3) Sticky Header
  const header = document.getElementById('main-header');
  if (header) {
    const scrollThreshold = 20;
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > scrollThreshold);
      adjustMainPadding();
    }, { passive: true });
  }

  // 4) Scroll-Triggered Animations
  const animatedElements = document.querySelectorAll('.scroll-animate');
  if ('IntersectionObserver' in window && animatedElements.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target,
            translateY: [30, 0],
            opacity: [0, 1],
            duration: 1000,
            easing: 'cubicBezier(0.165, 0.84, 0.44, 1)',
            delay: parseInt(entry.target.dataset.delay) || 0
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));
  } else {
    animatedElements.forEach(el => {
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    });
  }

  // 5) Word-Cloud
  // TODO: The original Word-Cloud generation code was indicated to be here.
  // If this feature is still desired, the relevant JavaScript code needs to be inserted.
  // If the Word-Cloud is no longer needed, this section can be removed.

  // 6) D3 Network Diagram
  const networkContainer = document.getElementById('network-container');
  const svg = d3.select('#network');

  // Check if the D3 network container and SVG element exist in the DOM.
  if (networkContainer && !svg.empty()) {
    // --- Data Definition for the Network Diagram ---
    const nodeHierarchy = {
      'DSIL': 0, 
      'Capture / Imaging Tech': 1, 
      'Processing & Enhancement': 1, 
      'Analysis & Forensics': 1, 
      'Applications & Systems': 1  
    };
    const nodesData = [
      { id: 'DSIL' }, { id: 'Capture / Imaging Tech' },
      { id: 'Image Sensor' }, { id: 'Drone Imaging' }, { id: '360 Camera' },
      { id: 'Microscopic Imaging' }, { id: 'Scanner Development' },
      { id: 'Non-Visible Spectrum' }, { id: 'Processing & Enhancement' },
      { id: 'Image Restoration' }, { id: 'Color Workflow' },
      { id: 'Interpolation' }, { id: 'Dynamic Range' },
      { id: 'Print Resolution' }, { id: 'Frame Extraction' },
      { id: 'Analysis & Forensics' }, { id: 'Image Quality' }, 
      { id: 'Aesthetic Analysis' }, { id: 'Depth Perception' },
      { id: 'Visual Satisfaction' }, { id: 'Psychological Analysis' },
      { id: 'Integrity / Forensics' }, { id: 'Applications & Systems' },
      { id: 'Digital Photography' }, { id: 'Commercial Photography' },
      { id: 'Sports Motion' }, { id: 'Imaging System' },
      { id: 'Print Research' }, { id: 'VR/AR Applications' }
    ];
    const linksData = [
      { source: 'DSIL', target: 'Capture / Imaging Tech' },
      { source: 'Capture / Imaging Tech', target: 'Image Sensor' },
      { source: 'Capture / Imaging Tech', target: 'Drone Imaging' },
      { source: 'Capture / Imaging Tech', target: '360 Camera' },
      { source: 'Capture / Imaging Tech', target: 'Microscopic Imaging' },
      { source: 'Capture / Imaging Tech', target: 'Scanner Development' },
      { source: 'Capture / Imaging Tech', target: 'Non-Visible Spectrum' },
      { source: 'DSIL', target: 'Processing & Enhancement' },
      { source: 'Processing & Enhancement', target: 'Image Restoration' },
      { source: 'Processing & Enhancement', target: 'Color Workflow' },
      { source: 'Processing & Enhancement', target: 'Interpolation' },
      { source: 'Processing & Enhancement', target: 'Dynamic Range' },
      { source: 'Processing & Enhancement', target: 'Print Resolution' },
      { source: 'Processing & Enhancement', target: 'Frame Extraction' },
      { source: 'DSIL', target: 'Analysis & Forensics' },
      { source: 'Analysis & Forensics', target: 'Image Quality' },
      { source: 'Analysis & Forensics', target: 'Aesthetic Analysis' },
      { source: 'Analysis & Forensics', target: 'Depth Perception' },
      { source: 'Analysis & Forensics', target: 'Visual Satisfaction' },
      { source: 'Analysis & Forensics', target: 'Psychological Analysis' },
      { source: 'Analysis & Forensics', target: 'Integrity / Forensics' },
      { source: 'DSIL', target: 'Applications & Systems' },
      { source: 'Applications & Systems', target: 'Digital Photography' },
      { source: 'Applications & Systems', target: 'Commercial Photography' },
      { source: 'Applications & Systems', target: 'Sports Motion' },
      { source: 'Applications & Systems', target: 'Imaging System' },
      { source: 'Applications & Systems', target: 'Print Research' },
      { source: 'Applications & Systems', target: 'VR/AR Applications' }
    ];

    nodesData.forEach(node => {
      node.level = nodeHierarchy[node.id] !== undefined ? nodeHierarchy[node.id] : 2;
      node.radius = node.level === 0 ? 95 : node.level === 1 ? 55 : 20; 
      node.shortLabel = node.id
        .replace('Capture / Imaging Tech', 'Imaging')
        .replace('Processing & Enhancement', 'Processing')
        .replace('Analysis & Forensics', 'Analysis')
        .replace('Applications & Systems', 'Apps');
    });

    let simulation, centerX, centerY;
    let nodeElements, linkElements; 
    let focusedNode = null; // For tracking the currently focused node

    function drag(sim) {
      function dragstarted(event, d) {
        if (!event.active) sim.alphaTarget(0.3).restart(); 
        d.fx = d.x; 
        d.fy = d.y; 
      }
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      function dragended(event, d) {
        if (!event.active) sim.alphaTarget(0.1); 
        // Only unfix if not the focused node or if focused node is being dragged
        if (!focusedNode || focusedNode.id !== d.id) {
            d.fx = null;
            d.fy = null;
        }
      }
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
    
    // --- Helper: Clear all highlights and focus ---
    function clearAllHighlights() {
        nodeElements.transition().duration(300)
            .style('opacity', 1)
            .each(function(d_node_data) { // Reset scale for each node
                d3.select(this).select('.node-circle')
                    .transition().duration(300)
                    .attr('r', d_node_data.radius)
                    .attr('stroke-width', d_node_data.level === 2 ? 0 : 1.5);
                d3.select(this).select('.node-label')
                    .transition().duration(300)
                    .attr('font-size', d_node_data.level === 0 ? '2.3rem' : d_node_data.level === 1 ? '1rem' : '0.8rem');
            });

        linkElements.transition().duration(300)
            .style('stroke-opacity', 0.6)
            .attr('stroke-width', 1.5);

        if (focusedNode && focusedNode.fx && focusedNode.fy) {
            // Only release if it was fixed by focus, not by ongoing drag
            const focusedNodeElement = nodeElements.filter(d => d.id === focusedNode.id);
            if (focusedNodeElement.size() > 0 && !d3.select(focusedNodeElement.node()).classed('dragging-manual')) { // Check a manual class if needed
                 focusedNode.fx = null;
                 focusedNode.fy = null;
            }
        }
    }

    // --- Helper: Apply styles for focused state ---
    function applyFocusStyles(nodeToFocusOn) {
        if (!nodeToFocusOn) {
            clearAllHighlights();
            return;
        }

        const linkedNodeIds = new Set();
        linkedNodeIds.add(nodeToFocusOn.id);

        linkElements
            .transition().duration(300)
            .style('stroke-opacity', link_d => {
                if (link_d.source.id === nodeToFocusOn.id || link_d.target.id === nodeToFocusOn.id) {
                    linkedNodeIds.add(link_d.source.id);
                    linkedNodeIds.add(link_d.target.id);
                    return 1;
                }
                return 0.1;
            })
            .attr('stroke-width', link_d => (link_d.source.id === nodeToFocusOn.id || link_d.target.id === nodeToFocusOn.id) ? 2.5 : 1.5);

        nodeElements
            .transition().duration(300)
            .style('opacity', d_node_data => linkedNodeIds.has(d_node_data.id) ? 1 : 0.3);
        
        // Ensure the focused node itself is scaled up
        nodeElements.filter(d => d.id === nodeToFocusOn.id)
            .select('.node-circle')
            .transition().duration(300)
            .attr('r', d_node_data => d_node_data.radius * 1.5)
            .attr('stroke-width', 3);
        nodeElements.filter(d => d.id === nodeToFocusOn.id)
            .select('.node-label')
            .transition().duration(300)
            .attr('font-size', d_node_data => {
                if (d_node_data.level === 0) return '2.8rem';
                if (d_node_data.level === 1) return '1.5rem';
                return '1.1rem';
            });
    }

    // --- Click Handlers ---
    function handleNodeClick(event, clicked_d_node) {
        event.stopPropagation(); // Prevent background click from firing.
        
        if (focusedNode && focusedNode.id === clicked_d_node.id) {
            // Clicking the already focused node: un-focus and clear highlights.
            if (focusedNode.fx && focusedNode.fy) { // Release fixed position
                focusedNode.fx = null;
                focusedNode.fy = null;
            }
            focusedNode = null;
            clearAllHighlights();
            simulation.alphaTarget(0.1).restart(); // Allow simulation to resettle
        } else {
            // Clicking a new node or focusing for the first time.
            if (focusedNode && focusedNode.fx && focusedNode.fy) { // Release previously focused node
                focusedNode.fx = null;
                focusedNode.fy = null;
            }
            focusedNode = clicked_d_node;
            focusedNode.fx = focusedNode.x; // Fix position
            focusedNode.fy = focusedNode.y;
            applyFocusStyles(focusedNode);
            simulation.alphaTarget(0).restart(); // Stabilize focused node
        }
    }

    function handleBackgroundClick() {
        if (focusedNode) {
            if (focusedNode.fx && focusedNode.fy) { // Release fixed position
                 focusedNode.fx = null;
                 focusedNode.fy = null;
            }
            focusedNode = null;
            clearAllHighlights();
            simulation.alphaTarget(0.1).restart(); // Allow simulation to resettle
        }
    }
    
    function setupSimulation() {
      const width = networkContainer.clientWidth;
      const height = networkContainer.clientHeight;
      const titleOffset = 50; 
      const effectiveHeight = height - titleOffset; 
      centerX = width / 2;
      centerY = effectiveHeight / 2 + titleOffset;

      svg.attr('viewBox', [0, 0, width, height])
         .attr('width', width)
         .attr('height', height)
         .on('click', handleBackgroundClick); // Attach background click handler

      nodesData.forEach(n => {
        if (n.id === 'DSIL') { 
          n.fx = centerX; 
          n.fy = centerY; 
          n.initialX = centerX;
          n.initialY = centerY;
        }
      });

      const initializeNodePositions = () => {
        const level1Nodes = nodesData.filter(d => d.level === 1);
        const level1Count = level1Nodes.length;
        const radius1 = 250; 
        
        level1Nodes.forEach((node, i) => {
          const angle = (2 * Math.PI * i) / level1Count + (Math.PI / 4); 
          node.x = centerX + radius1 * Math.cos(angle); 
          node.y = centerY + radius1 * Math.sin(angle); 
          node.initialX = node.x; 
          node.initialY = node.y; 
        });
        
        const level1Map = {}; 
        level1Nodes.forEach(node => { level1Map[node.id] = node; });
        
        const childGroups = {}; 
        linksData.forEach(link => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          
          if (level1Map[sourceId]) { 
            childGroups[sourceId] = childGroups[sourceId] || [];
            const targetNode = nodesData.find(n => n.id === targetId);
            if (targetNode && targetNode.level === 2) { 
              childGroups[sourceId].push(targetNode);
            }
          }
        });
        
        Object.entries(childGroups).forEach(([parentId, children]) => {
          const parent = level1Map[parentId];
          const childCount = children.length;
          const radius2 = 120; 
          
          children.forEach((child, i) => {
            const angle = (2 * Math.PI * i) / childCount + (Math.PI / 4); 
            child.x = parent.x + radius2 * Math.cos(angle); 
            child.y = parent.y + radius2 * Math.sin(angle); 
            child.initialX = child.x; 
            child.initialY = child.y; 
          });
        });
      };
      initializeNodePositions(); 

      simulation = d3.forceSimulation(nodesData)
        .force("link", d3.forceLink(linksData).id(d => d.id).distance(d => d.source.level === 0 ? 180 : 120).strength(0.4))
        .force("charge", d3.forceManyBody().strength(d => d.level === 0 ? -1000 : d.level === 1 ? -500 : -100))
        .force("center", d3.forceCenter(centerX, centerY))
        .force("collide", d3.forceCollide().radius(d => {
          return d.level === 2 ? d.radius * 3 : d.radius + 5;
        }).strength(0.7))
        .force("return-to-initial", alpha => {
          nodesData.forEach(d => {
            if (d.initialX !== undefined && d.initialY !== undefined && (!focusedNode || d.id !== focusedNode.id) ) { // Don't return focused node
              d.vx += (d.initialX - d.x) * alpha * 0.03;
              d.vy += (d.initialY - d.y) * alpha * 0.03;
            }
          });
        })
        .alphaDecay(0.01) 
        .velocityDecay(0.6); 

      svg.selectAll("g").remove();
      const linkGroup = svg.append("g").attr("stroke", "#aaa").attr("stroke-opacity", 0).style("opacity", 0);
      const nodeGroup = svg.append("g").style("opacity", 0);

      linkElements = linkGroup.selectAll("line").data(linksData).join("line") 
        .attr("stroke-width", 1.5);

      nodeElements = nodeGroup.selectAll("g").data(nodesData).join("g") 
        .call(drag(simulation)) 
        .on('mouseover', handleMouseOver) 
        .on('mouseout', handleMouseOut)
        .on('click', handleNodeClick); // Attach node click handler

      nodeElements.append("circle")
        .attr("class", "node-circle") 
        .attr("r", d => d.radius) 
        .attr("fill", d => d.level === 0 ? 'var(--accent)' : d.level === 1 ? 'var(--accent-dark)' : '#ccc') 
        .attr("stroke", d => d.level === 2 ? 'none' : '#fff') 
        .attr("stroke-width", d => d.level === 2 ? 0 : 1.5); 

      nodeElements.append("text")
        .attr("class", "node-label")
        .text(d => d.shortLabel) 
        .attr('x', 0).attr('y', 0) 
        .attr('text-anchor', 'middle') 
        .attr('alignment-baseline', 'middle') 
        .attr('font-size', d => d.level === 0 ? '2.3rem' : d.level === 1 ? '1rem' : '0.8rem') 
        .attr('fill', d => (d.level === 0 || d.level === 1) ? 'white' : 'var(--text-primary)') 
        .style('font-weight', d => d.level === 0 ? '600' : '500') 
        .style('pointer-events', 'none') 
        .style('text-shadow', '0 1px 2px rgba(0,0,0,0.1)') 
        .style('transition', 'transform 0.3s ease'); 

      nodeElements.append("title").text(d => d.id);
      
      // --- Mouse Hover Handlers (Modified for Focus State) ---
      function handleMouseOver(event, d_hovered_node) {
        d3.select(event.currentTarget).raise();

        if (!focusedNode) { // Standard hover behavior when no node is focused
            const group = d3.select(event.currentTarget);
            group.select('.node-circle').transition().duration(100).attr('r', d_hovered_node.radius * 1.5).attr('stroke-width', 3);
            group.select('.node-label').transition().duration(100).attr('font-size', d_hovered_node.level === 0 ? '2.8rem' : d_hovered_node.level === 1 ? '1.5rem' : '1.1rem');

            const linkedNodeIds = new Set();
            linkedNodeIds.add(d_hovered_node.id);

            linkElements.transition().duration(100)
                .style('stroke-opacity', link_d => {
                    if (link_d.source.id === d_hovered_node.id || link_d.target.id === d_hovered_node.id) {
                        linkedNodeIds.add(link_d.source.id);
                        linkedNodeIds.add(link_d.target.id);
                        return 1;
                    }
                    return 0.1;
                })
                .attr('stroke-width', link_d => (link_d.source.id === d_hovered_node.id || link_d.target.id === d_hovered_node.id) ? 2.5 : 1.5);

            nodeElements.transition().duration(100)
                .style('opacity', node_data => linkedNodeIds.has(node_data.id) ? 1 : 0.3);

        } else { // Hover behavior when a node IS focused
            const group = d3.select(event.currentTarget);
            // Scale up the hovered node regardless of focus state
            group.select('.node-circle').transition().duration(100).attr('r', d_hovered_node.radius * 1.5).attr('stroke-width', 3);
            group.select('.node-label').transition().duration(100).attr('font-size', d_hovered_node.level === 0 ? '2.8rem' : d_hovered_node.level === 1 ? '1.5rem' : '1.1rem');
            
            // Ensure the hovered node is fully opaque
            group.transition().duration(100).style('opacity', 1);

            // Highlight direct links of the hovered node
            linkElements
                .filter(link_d => link_d.source.id === d_hovered_node.id || link_d.target.id === d_hovered_node.id)
                .transition().duration(100)
                .style('stroke-opacity', 1)
                .attr('stroke-width', 2.5);
        }
      }

      function handleMouseOut(event, d_moused_out_node) {
        const group = d3.select(event.currentTarget);
        // Reset scale of the moused-out node only if it's not the focused node or no node is focused
        if (!focusedNode || (focusedNode && focusedNode.id !== d_moused_out_node.id)) {
            group.select('.node-circle').transition().duration(100)
                .attr('r', d_moused_out_node.radius)
                .attr('stroke-width', d_moused_out_node.level === 2 ? 0 : 1.5);
            group.select('.node-label').transition().duration(100)
                .attr('font-size', d_moused_out_node.level === 0 ? '2.3rem' : d_moused_out_node.level === 1 ? '1rem' : '0.8rem');
        }

        if (focusedNode) {
            applyFocusStyles(focusedNode); // Re-apply focus styles to ensure view consistency
        } else {
            clearAllHighlights(); // No focus, so clear all highlights from hover
        }
      }

      let initialTicks = 40;
      for (let i = 0; i < initialTicks; i++) {
        simulation.tick();
      }
      
      setTimeout(() => {
        nodeGroup.transition()
          .duration(1800) 
          .style("opacity", 1); 
          
        linkGroup.transition()
          .duration(1800)
          .style("opacity", 1) 
          .attr("stroke-opacity", 0.6); 
      }, 200); 

      simulation.on("tick", () => {
        nodesData.forEach(node => {
          if (node.level === 1 && (!focusedNode || node.id !== focusedNode.id)) { // Don't auto-move focused parent
            const childNodes = [];
            linksData.forEach(link => {
              if (link.source.id === node.id) {
                const target = link.target; 
                if (target.level === 2) {
                  childNodes.push(target);
                }
              }
            });
            
            if (childNodes.length > 0) {
              let avgX = 0, avgY = 0;
              childNodes.forEach(child => {
                avgX += child.x;
                avgY += child.y;
              });
              avgX /= childNodes.length;
              avgY /= childNodes.length;
              
              node.x += (avgX - node.x) * 0.1; 
              node.y += (avgY - node.y) * 0.1;
            }
          }
        });
        
        nodeElements 
          .attr("cx", d => d.x = Math.max(d.radius, Math.min(width - d.radius, d.x)))
          .attr("cy", d => d.y = Math.max(d.radius + titleOffset, Math.min(height - d.radius, d.y)));

        linkElements
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        nodeElements
          .attr("transform", d => `translate(${d.x},${d.y})`);

        nodeElements.select("text.node-label")
          .each(function(d_text) { 
            let dx = 0, dy = 0; 
            if (d_text.level === 2) {
              const link = linksData.find(l => l.target.id === d_text.id); 
              const angle = link 
                ? Math.atan2(link.target.y - link.source.y, link.target.x - link.source.x)
                : 0;
              
              const distance = d_text.radius + 28; 
              dx = Math.cos(angle) * distance; 
              dy = Math.sin(angle) * distance; 
              
              this.setAttribute('text-anchor', 'middle'); 
              this.setAttribute('filter', 'drop-shadow(0px 0px 3px white)'); 
            }
            this.style.transform = `translate(${dx}px, ${dy}px)`;
          });
      }); 
    } 

    setupSimulation();

    let resizeTimer; 
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!simulation) return; 

        const newW = networkContainer.clientWidth;
        const newH = networkContainer.clientHeight;
        const titleOffset = 50; 
        const effH = newH - titleOffset;
        const cx = newW / 2; 
        const cy = effH / 2 + titleOffset; 

        svg.attr('viewBox', [0, 0, newW, newH]).attr('width', newW).attr('height', newH);

        nodesData.forEach(n => {
          if (n.id === 'DSIL') { 
            n.fx = cx; 
            n.fy = cy; 
          }
          // If a node is focused, update its fixed position to the new center if it's DSIL,
          // or keep its relative position otherwise (might need adjustment if layout changes drastically)
          if (focusedNode && n.id === focusedNode.id) {
            if (n.id === 'DSIL') {
                focusedNode.fx = cx;
                focusedNode.fy = cy;
            } else {
                // For non-DSIL focused nodes, we might need to recalculate fx, fy
                // or let the simulation reposition them slightly by not setting fx/fy here.
                // For now, let's assume they stay fixed relative to their previous position,
                // which might not be ideal on large resizes.
                // A better approach might be to store relative offsets or re-pin.
                 focusedNode.fx = focusedNode.x; 
                 focusedNode.fy = focusedNode.y;
            }
          }
        });
        
        simulation.force("center", d3.forceCenter(cx, cy));
        if (focusedNode) {
            simulation.alphaTarget(0).restart(); // Keep focused stable
        } else {
            simulation.alpha(0.3).restart(); // Reheat to adjust layout
        }
      }, 250); 
    });
  } 
});
