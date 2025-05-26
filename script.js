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

  function playCameraAnimation() {
    if (!cameraOverlay || !cameraIcon) return;

    // Get text elements to shake
    const heroTitle = document.querySelector('.hero h1');
    const heroSubtitle = document.querySelector('.hero .subtitle');
    const allTextElements = [heroTitle, heroSubtitle].filter(el => el);

    // Show overlay
    cameraOverlay.classList.add('active');
    
    // Reset all animations
    cameraIcon.classList.remove('animate-in');
    shutterButton.style.animation = '';
    aperture.style.animation = '';
    flashEffect.classList.remove('flash');
    
    // Remove shake classes from text elements
    allTextElements.forEach(el => el.classList.remove('text-shake'));

    // Start camera appear animation with more dynamic timing
    setTimeout(() => {
      cameraIcon.classList.add('animate-in');
    }, 50);

    // More dynamic shutter click sequence
    setTimeout(() => {
      // Shutter button press with bounce
      shutterButton.style.animation = 'shutterClick 0.15s ease-out';
      
      // Aperture close effect - faster and more dramatic
      setTimeout(() => {
        aperture.style.animation = 'apertureClose 0.25s ease-out';
      }, 50);
      
      // Flash effect and text shake - synchronized impact
      setTimeout(() => {
        flashEffect.classList.add('flash');
        
        // Shake all text elements simultaneously
        allTextElements.forEach(el => {
          el.classList.add('text-shake');
        });
        
        // Add camera shake effect
        cameraIcon.style.animation += ', textShake 0.4s ease-out';
        
      }, 150);
      
    }, 600);

    // Hide overlay with more dramatic exit
    setTimeout(() => {
      cameraIcon.style.animation = 'cameraDisappear 0.5s ease-in forwards';
      setTimeout(() => {
        cameraOverlay.classList.remove('active');
        cameraIcon.classList.remove('animate-in');
        cameraIcon.style.animation = '';
        
        // Clean up text shake classes and flash effect
        allTextElements.forEach(el => el.classList.remove('text-shake'));
        flashEffect.classList.remove('flash');
      }, 500);
    }, 1800);
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

  // 5) Word-Cloud (unchanged) …
  // … (기존 word-cloud 생성 코드 삽입) …

  // 6) D3 Network Diagram
  const networkContainer = document.getElementById('network-container');
  const svg = d3.select('#network');

  if (networkContainer && !svg.empty()) {
    // --- 데이터 정의 ---
    const nodeHierarchy = {
      'DSIL': 0,
      'Capture / Imaging Tech': 1,
      'Processing & Enhancement': 1,
      'Analysis & Forensics': 1,
      'Applications & Systems': 1
    };
    const nodesData = [
      { id: 'DSIL' },
      { id: 'Capture / Imaging Tech' },
      { id: 'Image Sensor' }, { id: 'Drone Imaging' }, { id: '360 Camera' },
      { id: 'Microscopic Imaging' }, { id: 'Scanner Development' },
      { id: 'Non-Visible Spectrum' },
      { id: 'Processing & Enhancement' },
      { id: 'Image Restoration' }, { id: 'Color Workflow' },
      { id: 'Interpolation' }, { id: 'Dynamic Range' },
      { id: 'Print Resolution' }, { id: 'Frame Extraction' },
      { id: 'Analysis & Forensics' },
      { id: 'Image Quality' }, { id: 'Aesthetic Analysis' },
      { id: 'Depth Perception' },
      { id: 'Visual Satisfaction' }, { id: 'Psychological Analysis' },
      { id: 'Integrity / Forensics' },
      { id: 'Applications & Systems' },
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

    // 노드 레벨·반지름·레이블 설정
    nodesData.forEach(node => {
      node.level = nodeHierarchy[node.id] !== undefined ? nodeHierarchy[node.id] : 2;
      node.radius = node.level === 0 ? 95 : node.level === 1 ? 55 : 20;
      node.shortLabel = node.id
        .replace('Capture / Imaging Tech', 'Imaging')
        .replace('Processing & Enhancement', 'Processing')
        .replace('Analysis & Forensics', 'Analysis')
        .replace('Applications & Systems', 'Apps');
    });

    let simulation, centerX, centerY; // 변수를 상위 스코프에서 선언

    // --- Drag Functions ---
    function drag(sim) {
      function dragstarted(event, d) {
        if (!event.active) sim.alphaTarget(0.3).restart();
        d.fx = d.x; d.fy = d.y;
      }
      function dragged(event, d) {
        d.fx = event.x; d.fy = event.y;
      }
      function dragended(event, d) {
        if (!event.active) sim.alphaTarget(0.1); // 드래그 끝나면 약간의 활성화 유지
        // 모든 노드의 고정 해제 (DSIL 포함)
        d.fx = null; d.fy = null; 
      }
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    // --- Simulation Setup ---
    function setupSimulation() {
      const width = networkContainer.clientWidth;
      const height = networkContainer.clientHeight;
      const titleOffset = 50;
      const effectiveHeight = height - titleOffset;
      centerX = width / 2;
      centerY = effectiveHeight / 2 + titleOffset;

      svg.attr('viewBox', [0, 0, width, height])
         .attr('width', width)
         .attr('height', height);

      // DSIL 노드 고정 및 초기 위치 설정
      nodesData.forEach(n => {
        if (n.id === 'DSIL') { 
          n.fx = centerX; n.fy = centerY; 
          // DSIL 노드에도 초기 위치 저장 (return-to-initial force 적용 위해)
          n.initialX = centerX;
          n.initialY = centerY;
        }
      });

      // 초기 노드 위치를 정돈된 형태로 설정
      const initializeNodePositions = () => {
        // 레벨 1 노드들을 DSIL 주변에 원형으로 배치 (45도 회전)
        const level1Nodes = nodesData.filter(d => d.level === 1);
        const level1Count = level1Nodes.length;
        const radius1 = 250; // 레벨 1 노드들의 초기 반경
        
        level1Nodes.forEach((node, i) => {
          // 45도(π/4 라디안) 회전을 적용
          const angle = (2 * Math.PI * i) / level1Count + (Math.PI / 4);
          node.x = centerX + radius1 * Math.cos(angle);
          node.y = centerY + radius1 * Math.sin(angle);
          // 초기 위치 저장
          node.initialX = node.x;
          node.initialY = node.y;
        });
        
        // 레벨 2 노드들을 해당 부모 레벨 1 노드 주변에 배치
        const level1Map = {};
        level1Nodes.forEach(node => { level1Map[node.id] = node; });
        
        // 각 레벨 1 노드에 속한 레벨 2 노드 그룹화
        const childGroups = {};
        linksData.forEach(link => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          
          // 레벨 1 -> 레벨 2 연결만 고려
          if (level1Map[sourceId]) {
            childGroups[sourceId] = childGroups[sourceId] || [];
            const targetNode = nodesData.find(n => n.id === targetId);
            if (targetNode && targetNode.level === 2) {
              childGroups[sourceId].push(targetNode);
            }
          }
        });
        
        // 각 그룹별로 자식 노드들 배치
        Object.entries(childGroups).forEach(([parentId, children]) => {
          const parent = level1Map[parentId];
          const childCount = children.length;
          const radius2 = 120; // 레벨 2 노드들의 초기 반경
          
          children.forEach((child, i) => {
            // 45도(π/4 라디안) 회전을 적용
            const angle = (2 * Math.PI * i) / childCount + (Math.PI / 4);
            // 부모 노드를 중심으로 원형 배치
            child.x = parent.x + radius2 * Math.cos(angle);
            child.y = parent.y + radius2 * Math.sin(angle);
            // 초기 위치 저장
            child.initialX = child.x;
            child.initialY = child.y;
          });
        });
      };
      
      // 초기 노드 위치 설정
      initializeNodePositions();

      simulation = d3.forceSimulation(nodesData)
        .force("link", d3.forceLink(linksData).id(d => d.id).distance(d => d.source.level === 0 ? 180 : 120).strength(0.4))
        .force("charge", d3.forceManyBody().strength(d => d.level === 0 ? -1000 : d.level === 1 ? -500 : -100))
        .force("center", d3.forceCenter(centerX, centerY))
        .force("collide", d3.forceCollide().radius(d => {
          // 레벨2는 라벨까지 포함해 훨씬 더 크게
          return d.level === 2
            ? d.radius * 3       // (예: 10*3 = 30px)  
            : d.radius + 5;
        }).strength(0.7))
        // 초기 위치로 돌아가는 힘 추가
        .force("return-to-initial", alpha => {
          nodesData.forEach(d => {
            // DSIL 노드도 포함하여 초기 위치로 돌아가도록 수정 (조건 제거)
            if (d.initialX !== undefined && d.initialY !== undefined) {
              // 현재 위치와 초기 위치 사이의 거리에 비례하는 힘으로 천천히 돌아가도록
              d.vx += (d.initialX - d.x) * alpha * 0.03;
              d.vy += (d.initialY - d.y) * alpha * 0.03;
            }
          });
        })
        .alphaDecay(0.01) // 애니메이션 속도 감소 (기본값 0.0228)
        .velocityDecay(0.6); // 속도 감소 (기본값 0.4)

      svg.selectAll("g").remove();
      const linkGroup = svg.append("g").attr("stroke", "#aaa").attr("stroke-opacity", 0).style("opacity", 0);
      const nodeGroup = svg.append("g").style("opacity", 0);

      const linkElements = linkGroup.selectAll("line").data(linksData).join("line")
        .attr("stroke-width", 1.5);

      const nodeElements = nodeGroup.selectAll("g").data(nodesData).join("g")
        .call(drag(simulation))
        // 마우스 호버 이벤트 추가
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut);

      nodeElements.append("circle")
        .attr("class", "node-circle") // 클래스 추가
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
      
      // --- 마우스 호버 핸들러 ---
      function handleMouseOver(event, d) {
        const group = d3.select(this);
        
        // 다른 요소 위로 올리기
        group.raise();
        
        // 원 확대 및 스타일 변경
        group.select('.node-circle')
          .transition()
          .duration(300) // Duration 통일
          .attr('r', d => d.radius * 1.5) // 1.5배 확대
          .attr('stroke-width', 3);
          
        // 텍스트 확대
        group.select('.node-label')
          .transition()
          .duration(300) // Duration 통일
          .attr('font-size', d => {
             // 초기 크기(2.3rem)에 비례하여 확대
             if (d.level === 0) return '2.8rem'; 
             if (d.level === 1) return '1.5rem'; // 1rem -> 1.5rem
             return '1.1rem'; // 0.8rem -> 1.1rem
            });
      }

      function handleMouseOut(event, d) {
        const group = d3.select(this);
        
        // 원 원래 크기 및 스타일로 복귀
        group.select('.node-circle')
          .transition()
          .duration(300) // Duration 통일
          .attr('r', d => d.radius)
          .attr('stroke-width', d => d.level === 2 ? 0 : 1.5); // 레벨 2는 stroke 없음
          
        // 텍스트 원래 크기로 복귀
        group.select('.node-label')
          .transition()
          .duration(300) // Duration 통일
          .attr('font-size', d => {
             // 초기 크기로 복귀
             if (d.level === 0) return '2.3rem'; 
             if (d.level === 1) return '1rem'; 
             return '0.8rem'; 
            });
      }

      // 먼저 시뮬레이션을 약간 진행시켜 초기 레이아웃을 어느 정도 안정화
      let initialTicks = 40;
      for (let i = 0; i < initialTicks; i++) {
        simulation.tick();
      }
      
      // 점진적으로 나타나는 애니메이션 추가 - 노드와 링크 동시에 나타나게
      setTimeout(() => {
        // 노드와 링크 그룹이 함께 서서히 나타남
        nodeGroup.transition()
          .duration(1800)
          .style("opacity", 2);
          
        linkGroup.transition()
          .duration(1800)
          .style("opacity", 1)
          .attr("stroke-opacity", 0.6);
      }, 200); // 약간의 지연 후 시작

      simulation.on("tick", () => {
        // 레벨 1 노드들을 자신의 레벨 2 자식 노드들 중심으로 이동
        nodesData.forEach(node => {
          if (node.level === 1) {
            // 이 레벨 1 노드에 연결된 레벨 2 노드들 찾기
            const childNodes = [];
            linksData.forEach(link => {
              if (link.source.id === node.id) {
                const target = link.target;
                if (target.level === 2) {
                  childNodes.push(target);
                }
              }
            });
            
            // 자식 노드들이 있으면 중심점 계산
            if (childNodes.length > 0) {
              let centerX = 0, centerY = 0;
              childNodes.forEach(child => {
                centerX += child.x;
                centerY += child.y;
              });
              centerX /= childNodes.length;
              centerY /= childNodes.length;
              
              // 중심으로 부드럽게 이동 (즉시 이동하면 불안정해질 수 있음)
              node.x += (centerX - node.x) * 0.1;
              node.y += (centerY - node.y) * 0.1;
            }
          }
        });
        
        // 1) 경계 제약
        nodeElements
          .attr("cx", d => d.x = Math.max(d.radius, Math.min(width - d.radius, d.x)))
          .attr("cy", d => d.y = Math.max(d.radius + titleOffset, Math.min(height - d.radius, d.y)));

        // 2) 링크 업데이트
        linkElements
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        // 3) 노드 그룹 위치
        nodeElements
          .attr("transform", d => `translate(${d.x},${d.y})`);

          // 레벨2 라벨: CSS transform 으로만 이동 (text-anchor 고정)
          nodeElements.select("text.node-label")
            .each(function(d) {
              // 링크 각도 계산
              let dx = 0, dy = 0;
              if (d.level === 2) {
                const link = linksData.find(l => l.target.id === d.id);
                const angle = link
                  ? Math.atan2(link.target.y - link.source.y, link.target.x - link.source.x)
                  : 0;
                
                // 레벨 2 노드에 대해 더 멀리 떨어뜨림
                const distance = d.radius + 28;
                dx = Math.cos(angle) * distance;
                dy = Math.sin(angle) * distance;
                
                // text-anchor는 항상 middle로 고정 (좌우 이동 방지)
                this.setAttribute('text-anchor', 'middle');
                
                // 배경으로 테두리 추가하여 가독성 향상
                this.setAttribute('filter', 'drop-shadow(0px 0px 3px white)');
              }
              // CSS transform 에서 부드럽게 interpolate
              this.style.transform = `translate(${dx}px, ${dy}px)`;
            });
        
      });
    }

    // 초기 실행
    setupSimulation();

    // 7) 리사이즈 핸들러
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!simulation) return;
        const newW = networkContainer.clientWidth;
        const newH = networkContainer.clientHeight;
        const titleOffset = 50;
        const effH = newH - titleOffset;
        const cx = newW/2;
        const cy = effH/2 + titleOffset;

        svg.attr('viewBox', [0, 0, newW, newH]).attr('width', newW).attr('height', newH);

        nodesData.forEach(n => {
          if (n.id==='DSIL') { n.fx=cx; n.fy=cy; }
        });

        simulation.force("center", d3.forceCenter(cx, cy));
        simulation.alpha(0.3).restart();
      }, 250);
    });
  }
});
