document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const pencilBtn = document.getElementById('pencil');
    const eraserBtn = document.getElementById('eraser');
    const colorPicker = document.getElementById('color-picker');
    const brushSize = document.getElementById('brush-size');
    const brushSizeValue = document.getElementById('brush-size-value');
    const clearBtn = document.getElementById('clear');
    const saveBtn = document.getElementById('save');
    const currentTool = document.getElementById('current-tool');
    
    // 设置画布大小
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        // 重绘内容（如果有需要可以保存绘图状态）
    }
    
    // 初始化
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 绘图状态
    let isDrawing = false;
    let currentColor = colorPicker.value;
    let currentSize = brushSize.value;
    let tool = 'pencil';
    
    // 更新画笔大小显示
    brushSizeValue.textContent = `${currentSize}px`;
    
    // 事件监听
    brushSize.addEventListener('input', function() {
        currentSize = this.value;
        brushSizeValue.textContent = `${currentSize}px`;
    });
    
    colorPicker.addEventListener('input', function() {
        currentColor = this.value;
    });
    
    pencilBtn.addEventListener('click', function() {
        tool = 'pencil';
        pencilBtn.classList.add('active');
        eraserBtn.classList.remove('active');
        currentTool.textContent = '(画笔)';
    });
    
    eraserBtn.addEventListener('click', function() {
        tool = 'eraser';
        eraserBtn.classList.add('active');
        pencilBtn.classList.remove('active');
        currentTool.textContent = '(橡皮擦)';
    });
    
    clearBtn.addEventListener('click', function() {
        if (confirm('确定要清空画布吗？')) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });
    
    saveBtn.addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
    
    // 绘图功能
    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }
    
    function stopDrawing() {
        isDrawing = false;
        ctx.beginPath(); // 开始新的路径
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        ctx.lineWidth = currentSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if (tool === 'eraser') {
            ctx.strokeStyle = '#ffffff';
        } else {
            ctx.strokeStyle = currentColor;
        }
        
        // 获取坐标（兼容鼠标和触摸事件）
        let x, y;
        if (e.type.includes('touch')) {
            const rect = canvas.getBoundingClientRect();
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.offsetX;
            y = e.offsetY;
        }
        
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    
    // 鼠标事件
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // 触摸事件（支持移动设备）
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        startDrawing(e);
    });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        draw(e);
    });
    
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        stopDrawing();
    });
});