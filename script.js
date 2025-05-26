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
    // nodeHierarchy: Defines the hierarchical level of primary nodes.
    // Level 0 is the central node, Level 1 are its direct children (main categories).
    const nodeHierarchy = {
      'DSIL': 0, // Central node
      'Capture / Imaging Tech': 1, // Main category
      'Processing & Enhancement': 1, // Main category
      'Analysis & Forensics': 1, // Main category
      'Applications & Systems': 1  // Main category
    };

    // nodesData: An array of objects, each representing a node in the network.
    // Each node must have an 'id' which is a unique identifier.
    // Other properties (level, radius, shortLabel, initialX, initialY, x, y, fx, fy, vx, vy) are added or used by D3.
    const nodesData = [
      // Level 0 (Central Node)
      { id: 'DSIL' },
      // Level 1 (Main Categories)
      { id: 'Capture / Imaging Tech' },
      { id: 'Processing & Enhancement' },
      { id: 'Analysis & Forensics' },
      { id: 'Applications & Systems' },
      // Level 2 (Sub-categories/Keywords, implicitly level 2 if not in nodeHierarchy)
      { id: 'Image Sensor' }, { id: 'Drone Imaging' }, { id: '360 Camera' },
      { id: 'Microscopic Imaging' }, { id: 'Scanner Development' },
      { id: 'Non-Visible Spectrum' },
      { id: 'Image Restoration' }, { id: 'Color Workflow' },
      { id: 'Interpolation' }, { id: 'Dynamic Range' },
      { id: 'Print Resolution' }, { id: 'Frame Extraction' },
      { id: 'Image Quality' }, { id: 'Aesthetic Analysis' },
      { id: 'Depth Perception' },
      { id: 'Visual Satisfaction' }, { id: 'Psychological Analysis' },
      { id: 'Integrity / Forensics' },
      { id: 'Digital Photography' }, { id: 'Commercial Photography' },
      { id: 'Sports Motion' }, { id: 'Imaging System' },
      { id: 'Print Research' }, { id: 'VR/AR Applications' }
    ];

    // linksData: An array of objects, each representing a link (edge) between two nodes.
    // 'source' and 'target' properties refer to the 'id' of the connected nodes.
    const linksData = [
      // Connections from DSIL (Level 0) to Main Categories (Level 1)
      { source: 'DSIL', target: 'Capture / Imaging Tech' },
      { source: 'DSIL', target: 'Processing & Enhancement' },
      { source: 'DSIL', target: 'Analysis & Forensics' },
      { source: 'DSIL', target: 'Applications & Systems' },
      // Connections from 'Capture / Imaging Tech' (Level 1) to its sub-categories (Level 2)
      { source: 'Capture / Imaging Tech', target: 'Image Sensor' },
      { source: 'Capture / Imaging Tech', target: 'Drone Imaging' },
      { source: 'Capture / Imaging Tech', target: '360 Camera' },
      { source: 'Capture / Imaging Tech', target: 'Microscopic Imaging' },
      { source: 'Capture / Imaging Tech', target: 'Scanner Development' },
      { source: 'Capture / Imaging Tech', target: 'Non-Visible Spectrum' },
      // Connections from 'Processing & Enhancement' (Level 1) to its sub-categories (Level 2)
      { source: 'Processing & Enhancement', target: 'Image Restoration' },
      { source: 'Processing & Enhancement', target: 'Color Workflow' },
      { source: 'Processing & Enhancement', target: 'Interpolation' },
      { source: 'Processing & Enhancement', target: 'Dynamic Range' },
      { source: 'Processing & Enhancement', target: 'Print Resolution' },
      { source: 'Processing & Enhancement', target: 'Frame Extraction' },
      // Connections from 'Analysis & Forensics' (Level 1) to its sub-categories (Level 2)
      { source: 'Analysis & Forensics', target: 'Image Quality' },
      { source: 'Analysis & Forensics', target: 'Aesthetic Analysis' },
      { source: 'Analysis & Forensics', target: 'Depth Perception' },
      { source: 'Analysis & Forensics', target: 'Visual Satisfaction' },
      { source: 'Analysis & Forensics', target: 'Psychological Analysis' },
      { source: 'Analysis & Forensics', target: 'Integrity / Forensics' },
      // Connections from 'Applications & Systems' (Level 1) to its sub-categories (Level 2)
      { source: 'Applications & Systems', target: 'Digital Photography' },
      { source: 'Applications & Systems', target: 'Commercial Photography' },
      { source: 'Applications & Systems', target: 'Sports Motion' },
      { source: 'Applications & Systems', target: 'Imaging System' },
      { source: 'Applications & Systems', target: 'Print Research' },
      { source: 'Applications & Systems', target: 'VR/AR Applications' }
    ];

    // --- Node Property Initialization ---
    // Iterate over each node in nodesData to set its properties based on hierarchy and for display.
    nodesData.forEach(node => {
      // node.level: Determines the visual hierarchy (0 for center, 1 for main categories, 2 for sub-items).
      // Defaults to 2 if not found in nodeHierarchy.
      node.level = nodeHierarchy[node.id] !== undefined ? nodeHierarchy[node.id] : 2;
      // node.radius: Visual size of the node circle, larger for higher-level nodes.
      node.radius = node.level === 0 ? 95 : node.level === 1 ? 55 : 20; // pixels
      // node.shortLabel: A condensed label for display, replacing longer strings for brevity.
      node.shortLabel = node.id
        .replace('Capture / Imaging Tech', 'Imaging')
        .replace('Processing & Enhancement', 'Processing')
        .replace('Analysis & Forensics', 'Analysis')
        .replace('Applications & Systems', 'Apps');
    });

    // simulation: D3 force simulation object.
    // centerX, centerY: Coordinates for the center of the SVG canvas.
    // These are declared in a higher scope to be accessible by setupSimulation and resize handler.
    let simulation, centerX, centerY;

    // --- Drag Functions for Node Interactivity ---
    // These functions define the behavior of nodes when dragged by the user.
    // 'sim' is the D3 force simulation instance.
    function drag(sim) {
      // dragstarted: Called when a drag gesture starts.
      // It activates the simulation's alpha target (keeps simulation "warm") and fixes the node's position (fx, fy).
      function dragstarted(event, d) {
        if (!event.active) sim.alphaTarget(0.3).restart(); // Increase alphaTarget to make the simulation more responsive during drag.
        d.fx = d.x; // Fix the node's x-coordinate.
        d.fy = d.y; // Fix the node's y-coordinate.
      }
      // dragged: Called repeatedly as the node is dragged.
      // Updates the fixed position (fx, fy) of the node to the mouse pointer's current position.
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      // dragended: Called when a drag gesture ends.
      // It reduces the alphaTarget (allowing simulation to cool down) and releases the fixed position (fx, fy = null).
      function dragended(event, d) {
        if (!event.active) sim.alphaTarget(0.1); // Lower alphaTarget, but keep some activity to settle.
        d.fx = null; // Release the fixed x-coordinate, allowing simulation to position it.
        d.fy = null; // Release the fixed y-coordinate.
      }
      // Returns a D3 drag behavior instance configured with the defined event handlers.
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    // --- Simulation Setup Function ---
    // This function initializes and configures the D3 force-directed graph simulation.
    function setupSimulation() {
      // --- SVG and Dimensions Setup ---
      // Get the current dimensions of the network container.
      const width = networkContainer.clientWidth;
      const height = networkContainer.clientHeight;
      const titleOffset = 50; // Space reserved at the top for the "Research Areas" title.
      const effectiveHeight = height - titleOffset; // Usable height for the graph.
      // Calculate the center coordinates of the usable area.
      centerX = width / 2;
      centerY = effectiveHeight / 2 + titleOffset;

      // Configure the SVG element's viewBox for responsiveness and set its dimensions.
      svg.attr('viewBox', [0, 0, width, height])
         .attr('width', width)
         .attr('height', height);

      // --- Central Node (DSIL) Positioning ---
      // Fix the central 'DSIL' node to the calculated center and store its initial position.
      // This initial position is used by the 'return-to-initial' force.
      nodesData.forEach(n => {
        if (n.id === 'DSIL') { 
          n.fx = centerX; // Fix x-coordinate to center.
          n.fy = centerY; // Fix y-coordinate to center.
          n.initialX = centerX; // Store initial x for 'return-to-initial' force.
          n.initialY = centerY; // Store initial y for 'return-to-initial' force.
        }
      });

      // --- Initial Node Positions Calculation ---
      // Defines and calls a function to set aesthetically pleasing initial positions for nodes
      // before the simulation starts, reducing initial chaotic movement.
      const initializeNodePositions = () => {
        // Position Level 1 nodes in a circle around the DSIL (central) node, with a 45-degree offset.
        const level1Nodes = nodesData.filter(d => d.level === 1);
        const level1Count = level1Nodes.length;
        const radius1 = 250; // Distance of Level 1 nodes from the center.
        
        level1Nodes.forEach((node, i) => {
          const angle = (2 * Math.PI * i) / level1Count + (Math.PI / 4); // Angle for each node, with 45-degree offset.
          node.x = centerX + radius1 * Math.cos(angle); // Initial x-coordinate.
          node.y = centerY + radius1 * Math.sin(angle); // Initial y-coordinate.
          node.initialX = node.x; // Store for 'return-to-initial' force.
          node.initialY = node.y; // Store for 'return-to-initial' force.
        });
        
        // Position Level 2 nodes in smaller circles around their respective parent Level 1 nodes.
        const level1Map = {}; // Helper map for quick lookup of Level 1 nodes.
        level1Nodes.forEach(node => { level1Map[node.id] = node; });
        
        const childGroups = {}; // Group Level 2 nodes by their Level 1 parent.
        linksData.forEach(link => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          
          if (level1Map[sourceId]) { // If the source is a Level 1 node.
            childGroups[sourceId] = childGroups[sourceId] || [];
            const targetNode = nodesData.find(n => n.id === targetId);
            if (targetNode && targetNode.level === 2) { // If the target is a Level 2 node.
              childGroups[sourceId].push(targetNode);
            }
          }
        });
        
        // Distribute Level 2 nodes around their parent.
        Object.entries(childGroups).forEach(([parentId, children]) => {
          const parent = level1Map[parentId];
          const childCount = children.length;
          const radius2 = 120; // Distance of Level 2 nodes from their parent Level 1 node.
          
          children.forEach((child, i) => {
            const angle = (2 * Math.PI * i) / childCount + (Math.PI / 4); // Angle for each child, with 45-degree offset.
            child.x = parent.x + radius2 * Math.cos(angle); // Initial x-coordinate.
            child.y = parent.y + radius2 * Math.sin(angle); // Initial y-coordinate.
            child.initialX = child.x; // Store for 'return-to-initial' force.
            child.initialY = child.y; // Store for 'return-to-initial' force.
          });
        });
      };
      initializeNodePositions(); // Call the function to set initial positions.

      // --- D3 Force Simulation Configuration ---
      simulation = d3.forceSimulation(nodesData)
        // forceLink: Attracts linked nodes towards each other.
        // Distance varies by source node level (longer for Level 0 to Level 1).
        .force("link", d3.forceLink(linksData).id(d => d.id).distance(d => d.source.level === 0 ? 180 : 120).strength(0.4))
        // forceManyBody: Simulates attraction (if positive strength) or repulsion (if negative) between nodes.
        // Repulsion strength varies by level (stronger repulsion for higher-level nodes).
        .force("charge", d3.forceManyBody().strength(d => d.level === 0 ? -1000 : d.level === 1 ? -500 : -100))
        // forceCenter: Drags all nodes towards the specified center point (centerX, centerY).
        .force("center", d3.forceCenter(centerX, centerY))
        // forceCollide: Prevents nodes from overlapping.
        // Collision radius is larger for Level 2 nodes to accommodate their labels.
        .force("collide", d3.forceCollide().radius(d => {
          return d.level === 2 ? d.radius * 3 : d.radius + 5;
        }).strength(0.7))
        // forceReturnToInitial: A custom force that gently pulls nodes towards their stored initialX/initialY positions.
        // This helps maintain a somewhat organized layout after dragging or initial settling.
        .force("return-to-initial", alpha => {
          nodesData.forEach(d => {
            if (d.initialX !== undefined && d.initialY !== undefined) {
              // Velocity adjustment proportional to distance from initial position and current alpha.
              d.vx += (d.initialX - d.x) * alpha * 0.03;
              d.vy += (d.initialY - d.y) * alpha * 0.03;
            }
          });
        })
        .alphaDecay(0.01) // Rate at which simulation cools down (lower is slower).
        .velocityDecay(0.6); // Friction affecting node movement (higher means more friction).

      // --- SVG Element Creation (Links and Nodes) ---
      // Remove any existing groups to prevent duplication on resize/re-setup.
      svg.selectAll("g").remove();
      // Create a group for links, initially transparent.
      const linkGroup = svg.append("g").attr("stroke", "#aaa").attr("stroke-opacity", 0).style("opacity", 0);
      // Create a group for nodes, initially transparent.
      const nodeGroup = svg.append("g").style("opacity", 0);

      // Bind linksData to line elements within linkGroup.
      const linkElements = linkGroup.selectAll("line").data(linksData).join("line")
        .attr("stroke-width", 1.5);

      // Bind nodesData to group (<g>) elements within nodeGroup.
      // Each group will contain a circle and a text label.
      const nodeElements = nodeGroup.selectAll("g").data(nodesData).join("g")
        .call(drag(simulation)) // Apply drag behavior to nodes.
        .on('mouseover', handleMouseOver) // Attach mouseover event handler.
        .on('mouseout', handleMouseOut);  // Attach mouseout event handler.

      // Append circles to node groups.
      nodeElements.append("circle")
        .attr("class", "node-circle") // Class for potential CSS styling.
        .attr("r", d => d.radius) // Radius based on node level.
        .attr("fill", d => d.level === 0 ? 'var(--accent)' : d.level === 1 ? 'var(--accent-dark)' : '#ccc') // Fill color by level.
        .attr("stroke", d => d.level === 2 ? 'none' : '#fff') // Stroke color (none for level 2).
        .attr("stroke-width", d => d.level === 2 ? 0 : 1.5); // Stroke width.

      // Append text labels to node groups.
      nodeElements.append("text")
        .attr("class", "node-label")
        .text(d => d.shortLabel) // Display the short label.
        .attr('x', 0).attr('y', 0) // Centered within the node group.
        .attr('text-anchor', 'middle') // Horizontal centering.
        .attr('alignment-baseline', 'middle') // Vertical centering.
        .attr('font-size', d => d.level === 0 ? '2.3rem' : d.level === 1 ? '1rem' : '0.8rem') // Font size by level.
        .attr('fill', d => (d.level === 0 || d.level === 1) ? 'white' : 'var(--text-primary)') // Text color by level.
        .style('font-weight', d => d.level === 0 ? '600' : '500') // Font weight by level.
        .style('pointer-events', 'none') // Makes text non-interactive to mouse events (pass through to circle).
        .style('text-shadow', '0 1px 2px rgba(0,0,0,0.1)') // Slight text shadow for readability.
        .style('transition', 'transform 0.3s ease'); // Smooth transition for label positioning.

      // Add tooltips (native browser title attribute) showing the full node ID on hover.
      nodeElements.append("title").text(d => d.id);
      
      // --- Mouse Hover Handlers ---
      // handleMouseOver: Triggered when the mouse pointer enters a node group.
      function handleMouseOver(event, d_node) { // Renamed 'd' to 'd_node' to avoid conflict with outer scope 'd' if any.
        const group = d3.select(this); // 'this' refers to the <g> element hovered.
        
        group.raise(); // Bring the hovered node group to the front (visually on top).
        
        // Enlarge the node's circle and increase its stroke width.
        group.select('.node-circle')
          .transition()
          .duration(300)
          .attr('r', d => d.radius * 1.5) // Scale radius by 1.5.
          .attr('stroke-width', 3);
          
        // Enlarge the node's text label.
        group.select('.node-label')
          .transition()
          .duration(300)
          .attr('font-size', d => { // Font size adjusted based on original level-dependent size.
             if (d.level === 0) return '2.8rem'; 
             if (d.level === 1) return '1.5rem';
             return '1.1rem';
            });
      }

      // handleMouseOut: Triggered when the mouse pointer leaves a node group.
      function handleMouseOut(event, d_node) { // Renamed 'd' to 'd_node'.
        const group = d3.select(this);
        
        // Revert the node's circle to its original size and stroke width.
        group.select('.node-circle')
          .transition()
          .duration(300)
          .attr('r', d => d.radius)
          .attr('stroke-width', d => d.level === 2 ? 0 : 1.5);
          
        // Revert the node's text label to its original font size.
        group.select('.node-label')
          .transition()
          .duration(300)
          .attr('font-size', d => {
             if (d.level === 0) return '2.3rem';
             if (d.level === 1) return '1rem';
             return '0.8rem';
            });
      }

      // --- Initial Simulation Ticks & Fade-In Animation ---
      // Run the simulation for a few ticks initially to allow layout to stabilize somewhat
      // before making elements visible. This prevents a harsh jump from unpositioned to positioned.
      let initialTicks = 40;
      for (let i = 0; i < initialTicks; i++) {
        simulation.tick();
      }
      
      // After initial ticks, gradually fade in the nodes and links for a smoother visual entry.
      setTimeout(() => {
        nodeGroup.transition()
          .duration(1800) // 1.8 seconds duration for fade-in.
          .style("opacity", 1); // Target opacity 1 (fully visible). Note: original code had 2, likely a typo, 1 is standard.
          
        linkGroup.transition()
          .duration(1800)
          .style("opacity", 1) // Target opacity 1 for the group.
          .attr("stroke-opacity", 0.6); // Links themselves have a slight transparency.
      }, 200); // Start fade-in after a 200ms delay.

      // --- Simulation Tick Event Handler ---
      // This function is called on every "tick" of the D3 simulation, updating element positions.
      simulation.on("tick", () => {
        // Custom logic: Adjust Level 1 nodes to be centered among their Level 2 children.
        // This creates a tighter grouping for categories and their items.
        nodesData.forEach(node => {
          if (node.level === 1) {
            const childNodes = [];
            linksData.forEach(link => {
              if (link.source.id === node.id) {
                const target = link.target; // D3 replaces string IDs with object references in links.
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
              
              // Gently pull the parent node towards the average position of its children.
              node.x += (avgX - node.x) * 0.1; // The 0.1 factor controls the strength/smoothness.
              node.y += (avgY - node.y) * 0.1;
            }
          }
        });
        
        // 1) Boundary Constraints: Keep nodes within the SVG viewport.
        // Nodes are constrained by their radius against the edges.
        // The top boundary includes the titleOffset.
        nodeElements // Though nodeElements are groups, we update underlying data (d.x, d.y) which simulation uses.
          .attr("cx", d => d.x = Math.max(d.radius, Math.min(width - d.radius, d.x)))
          .attr("cy", d => d.y = Math.max(d.radius + titleOffset, Math.min(height - d.radius, d.y)));

        // 2) Link Positions: Update link endpoints based on source/target node positions.
        linkElements
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        // 3) Node Group Positions: Update the transform of each node group (<g>) to its new (x,y).
        nodeElements
          .attr("transform", d => `translate(${d.x},${d.y})`);

        // 4) Level 2 Label Positioning: Dynamically position labels for Level 2 nodes
        // to be outside their circles, along the angle of their link from the parent.
        nodeElements.select("text.node-label")
          .each(function(d_text) { // 'this' refers to the text element. 'd_text' is its bound data.
            let dx = 0, dy = 0; // Default offset (for non-Level 2 nodes, label stays centered in circle).
            if (d_text.level === 2) {
              const link = linksData.find(l => l.target.id === d_text.id); // Find the link connecting to this Level 2 node.
              const angle = link // Calculate angle from parent (source) to this node (target).
                ? Math.atan2(link.target.y - link.source.y, link.target.x - link.source.x)
                : 0;
              
              const distance = d_text.radius + 28; // Distance of label from node center (radius + padding).
              dx = Math.cos(angle) * distance; // Calculate x-offset.
              dy = Math.sin(angle) * distance; // Calculate y-offset.
              
              this.setAttribute('text-anchor', 'middle'); // Keep text centered on its (dx,dy) position.
              this.setAttribute('filter', 'drop-shadow(0px 0px 3px white)'); // Add a subtle white outline for readability.
            }
            // Apply the calculated offset using CSS transform for smooth animation.
            this.style.transform = `translate(${dx}px, ${dy}px)`;
          });
      }); // End of simulation.on("tick")
    } // End of setupSimulation()

    // Initial setup of the simulation.
    setupSimulation();

    // --- Resize Handler ---
    // Adjusts the simulation and SVG dimensions when the browser window is resized.
    let resizeTimer; // Timer to debounce resize events.
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      // Debounce the resize handling to avoid excessive recalculations.
      resizeTimer = setTimeout(() => {
        if (!simulation) return; // Do nothing if simulation isn't initialized.

        // Get new dimensions of the container.
        const newW = networkContainer.clientWidth;
        const newH = networkContainer.clientHeight;
        const titleOffset = 50; // Same offset as in setup.
        const effH = newH - titleOffset;
        const cx = newW / 2; // New center X.
        const cy = effH / 2 + titleOffset; // New center Y.

        // Update SVG viewBox and dimensions.
        svg.attr('viewBox', [0, 0, newW, newH]).attr('width', newW).attr('height', newH);

        // Re-fix the DSIL node to the new center.
        nodesData.forEach(n => {
          if (n.id === 'DSIL') { 
            n.fx = cx; 
            n.fy = cy; 
          }
        });

        // Update the center force of the simulation.
        simulation.force("center", d3.forceCenter(cx, cy));
        // Reheat the simulation to adjust node positions.
        simulation.alpha(0.3).restart();
      }, 250); // 250ms debounce interval.
    });
  } // End of if (networkContainer && !svg.empty())
});
