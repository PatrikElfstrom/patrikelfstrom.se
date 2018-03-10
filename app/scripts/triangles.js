(() => {
    let resizeTimer = null;
    let firstTime = true;

    const body = document.body;
    const wrapper = body.querySelector('.wrapper');
    const container = body.querySelector('.triangles');

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomColorGenerator(hue = 0, saturation = 0, lightness = 10, min = 0, max = 5) {
        lightness = lightness + randomNumber(min, max);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    const renderTriangles = () => {
        const width = body.clientWidth;
        const height = body.clientHeight;
        const svg = new Triangulr(width, height, false, () => {
            return randomColorGenerator();
        });

        container.innerHTML = '';
        container.appendChild(svg);

        window.requestAnimationFrame(() => {
            printLogo(svg);
        });
    };

    function printLogo(svg) {
        const rows = svg.dataset.rows;
        const cols = svg.dataset.cols;

        // Get the center triangle coordinates
        const centerX = Math.floor(svg.dataset.cols / 2) ;
        let centerY = Math.floor(svg.dataset.rows / 2);

        // Move logo up a bit since the script sux
        centerY = Math.ceil((centerY) / 2);

        // If the center triangle is pointing right (this is null), go to the next row
        let centerTriangle = svg.querySelector(`[data-row="${centerY}"][data-col="${centerX}"][data-right="false"]`);

        // console.log(centerTriangle)
        if(!centerTriangle) {
            centerY = centerY + 1;
        }

        centerTriangle = svg.querySelector(`[data-row="${centerY}"][data-col="${centerX}"][data-right="false"]`);
        
        const centerTriangleRect = centerTriangle.getBoundingClientRect();
        
        // Center triangles
        const trianglesOffset = (centerTriangleRect.left - window.innerWidth/2) * -1;
        container.style.transform = `translateX(${trianglesOffset < 0 ? trianglesOffset : 0}px)`

        // Get text Y position
        const textPositionY = Math.max(centerTriangleRect.top + centerTriangleRect.height * 3, centerTriangleRect.top*2);

        // Position text after logo
        wrapper.style.top = `${textPositionY}px`;

        // The design
        // Coordinates are relative to the center triangle
        const triangles = [
            // Center
            { y:  0, x:  0 },
            { y: -1, x:  0 },
            { y: -1, x: -1 },
            { y:  0, x: -1 },
            { y:  1, x: -1 },
            { y:  1, x:  0 },

            // Ring Left
            { y: -5,  x: -1 },
            { y: -4,  x: -1 },
            { y: -4,  x: -2 },
            { y: -3,  x: -2 },
            { y: -3,  x: -3 },
            { y: -2,  x: -3 },
            { y: -1,  x: -3 },
            { y:  0,  x: -3 },
            { y:  1,  x: -3 },
            { y:  2,  x: -3 },
            { y:  3,  x: -3 },

            // Ring right
            { y: -5,  x: 0 },
            { y: -4,  x: 0 },
            { y: -4,  x: 1 },
            { y: -3,  x: 1 },
            { y: -3,  x: 2 },
            { y: -2,  x: 2 },
            { y: -1,  x: 2 },
            { y:  0,  x: 2 },
            { y: 1,  x: 2 },
            { y: 2,  x: 2 },
            { y: 3,  x: 2 },
            { y: 3,  x: 1 },
            { y: 4,  x: 1 },
            { y: 4,  x: 0 },
            { y: 5,  x: 0 },
            { y: 5,  x: -1 },
            { y: 4,  x: -1 }
        ];

        // Paint the design
        triangles.forEach(polygon => {
            const triangle = svg.querySelector(`[data-row="${centerY + polygon.y}"][data-col="${centerX + polygon.x}"]`);

            const color = randomColorGenerator(200, 100, 30, 0, 10);
            triangle.style.fill = color;
            triangle.style.stroke = color;

            if(firstTime) {
                triangle.style.transitionDelay = `${randomNumber(300, 1500)}ms`;
            } else {
                triangle.style.transitionDelay = `${randomNumber(300, 1000)}ms`;
            }

            triangle.classList.add('logo')
        });
    }

    renderTriangles();

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        firstTime = false;
        resizeTimer = setTimeout(renderTriangles, 100);
    })
})();