export const initCanvas = (canvas: HTMLCanvasElement) => {

    if(!canvas) return
    // const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 500; // 粒子数量

    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            color: 'rgba(0, 255, 255, 0.7)',
            speed: Math.random() * 2 + 0.5,
            direction: Math.random() * 2 * Math.PI,
        });
    }

    let animationId:number;

    // 动画循环
    function animate() {
        console.log('animate')
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制粒子
        particles.forEach(p => {
            // 更新粒子位置
            p.x += Math.cos(p.direction) * p.speed;
            p.y += Math.sin(p.direction) * p.speed;

            // 边界检测
            if (p.x < 0 || p.x > canvas.width) p.direction = Math.PI - p.direction;
            if (p.y < 0 || p.y > canvas.height) p.direction = -p.direction;

            // 绘制粒子
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.closePath();
        });

        // 连接粒子
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = `rgba(0, 255, 255, ${1 - distance / 100})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        animationId = requestAnimationFrame(animate);
    }

    animate();

    return {
        stop: function () {
            animationId && cancelAnimationFrame(animationId);
        }
    }

}