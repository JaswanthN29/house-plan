/**
 * Interactive 2D Apartment Floor Plan Studio - Mobile Friendly JS Module
 */

let currentScale = 1;

function zoom(factor) {
    currentScale *= factor;
    currentScale = Math.min(Math.max(currentScale, 0.6), 2.5);
    const wrap = document.getElementById('canvasWrapper');
    if (wrap) wrap.style.transform = `scale(${currentScale})`;
}

function resetZoom() {
    currentScale = 1;
    const wrap = document.getElementById('canvasWrapper');
    if (wrap) wrap.style.transform = `scale(1)`;
}

function toggleLayer(layerName) {
    if (layerName === 'furniture') {
        const el = document.getElementById('layer-furniture');
        const btn = document.getElementById('togFurniture');
        if (el && btn) {
            const show = el.style.display === 'none';
            el.style.display = show ? 'block' : 'none';
            btn.classList.toggle('active', show);
        }
    } else if (layerName === 'labels') {
        const el = document.getElementById('layer-labels');
        const btn = document.getElementById('togLabels');
        if (el && btn) {
            const show = el.style.display === 'none';
            el.style.display = show ? 'block' : 'none';
            btn.classList.toggle('active', show);
        }
    } else if (layerName === 'dimensions') {
        const el = document.getElementById('layer-dimensions');
        const btn = document.getElementById('togDimensions');
        if (el && btn) {
            const show = el.style.display === 'none';
            el.style.display = show ? 'block' : 'none';
            btn.classList.toggle('active', show);
        }
    }
}

function setRenderMode(mode) {
    const btnR = document.getElementById('btnRender');
    const btnB = document.getElementById('btnBlueprint');
    const btnW = document.getElementById('btnWireframe');
    const floorplanSvg = document.getElementById('floorplan');

    if (btnR) btnR.classList.remove('active');
    if (btnB) btnB.classList.remove('active');
    if (btnW) btnW.classList.remove('active');

    if (floorplanSvg) floorplanSvg.classList.remove('blueprint-mode', 'wireframe-mode');

    if (mode === 'render' && btnR) {
        btnR.classList.add('active');
    } else if (mode === 'blueprint' && btnB && floorplanSvg) {
        btnB.classList.add('active');
        floorplanSvg.classList.add('blueprint-mode');
    } else if (mode === 'wireframe' && btnW && floorplanSvg) {
        btnW.classList.add('active');
        floorplanSvg.classList.add('wireframe-mode');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const btn = document.getElementById('togTheme');
    const isDark = document.body.classList.contains('dark-theme');
    if (btn) btn.innerHTML = isDark ? '☀️ Light' : '🌙 Dark';
}

function selectRoom(name, area, dim) {
    const selName = document.getElementById('selRoomName');
    const selArea = document.getElementById('selRoomArea');
    const selDim = document.getElementById('selRoomDim');

    if (selName) selName.innerText = name;
    if (selArea) selArea.innerText = area + ' sq ft';
    if (selDim) selDim.innerText = dim;

    // Highlight room item in sidebar
    const items = document.querySelectorAll('.room-item');
    items.forEach(item => {
        const titleEl = item.querySelector('.room-item-name');
        if (titleEl) {
            item.classList.toggle('active', titleEl.innerText === name);
        }
    });
}

/* Mobile Touch & Gesture Handlers */
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.canvas-container');
    const wrapper = document.getElementById('canvasWrapper');
    
    if (!container || !wrapper) return;

    let touchStartDist = 0;
    let initialScale = 1;
    let lastTap = 0;

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            touchStartDist = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            initialScale = currentScale;
        } else if (e.touches.length === 1) {
            const now = Date.now();
            if (now - lastTap < 300) {
                resetZoom();
            }
            lastTap = now;
        }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && touchStartDist > 0) {
            const dist = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            const factor = dist / touchStartDist;
            currentScale = Math.min(Math.max(initialScale * factor, 0.6), 2.5);
            wrapper.style.transform = `scale(${currentScale})`;
        }
    }, { passive: true });

    container.addEventListener('touchend', () => {
        touchStartDist = 0;
    }, { passive: true });
});
