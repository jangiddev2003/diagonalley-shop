import React, { useEffect } from "react";
import "./MagicCursor.css";

// This is the core logic function that makes the magic cursor do its thing.
export const initMagicCursor = () => {
  // 1. ENABLE CSS CURSOR
  // Adds a special class to the website's <body> tag so our MagicCursor.css knows to activate.
  document.body.classList.add("magic-cursor-active");

  // 2. CREATE A TRANSPARENT CANVAS
  // A <canvas> is like a transparent painting board we use to draw the sparks.
  const canvas = document.createElement("canvas");
  canvas.id = "magic-cursor-canvas";
  // We inject this canvas into the webpage
  document.body.appendChild(canvas);
  
  // Gets a 'brush' (context) from the canvas so we can draw 2D shapes onto it.
  const ctx = canvas.getContext("2d");

  // 3. SETTING IT TO FULL SCREEN
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  // Whenever the user resizes their browser, update our canvas to match so it never looks stretched.
  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  };
  window.addEventListener("resize", resize);

  // We need to track exactly where the mouse is. We start it dead center initially.
  let mouseX = width / 2;
  let mouseY = height / 2;

  // 4. TRACKING MOUSE MOVEMENT
  const onMouseMove = (e: MouseEvent) => {
    // Remember where the mouse WAS right before now
    const prevX = mouseX;
    const prevY = mouseY;
    // Update variables with where the mouse IS now
    mouseX = e.clientX;
    mouseY = e.clientY;

    // We do some math (Pythagorean theorem!) to find the distance the mouse just traveled
    const dx = mouseX - prevX;
    const dy = mouseY - prevY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // If you move the mouse fast, it creates MORE particles.
    // 'Math.min(..., 10)' limits it to a max of 10 particles so computers don't crash from too many!
    const numParticles = Math.min(Math.floor(dist / 5), 10);
    for (let i = 0; i < numParticles; i++) {
        createParticle(mouseX, mouseY);
    }
  };

  // Every time the mouse fires a "moved" event, run our logic!
  window.addEventListener("mousemove", onMouseMove);

  // 5. ADDING GLOW EFFECTS PROPERLY
  // This is a big list telling JS exactly what types of items are "clickable" on the site.
  // It includes links (a), buttons (button), input fields, dropdowns, etc.
  const interactiveSelector = "a, button, input, select, textarea, [role='button'], .cursor-pointer, .interactive, .hover\\:scale-105";
  
  // When the mouse hovers over something...
  const handleMouseOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // Walk up the HTML tree to see if the element we touched is listed in our 'interactiveSelector'
    const interactiveElement = target.closest(interactiveSelector);
    if (interactiveElement) {
      // If it's a button, add our class to make it glow and grow slightly!
      interactiveElement.classList.add("magic-hover-target");
    }
  };
  
  // When the mouse leaves the button...
  const handleMouseOut = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const interactiveElement = target.closest(interactiveSelector);
    if (interactiveElement) {
      // Remove the glow!
      interactiveElement.classList.remove("magic-hover-target");
    }
  };

  // Turn these hover events on
  window.addEventListener("mouseover", handleMouseOver);
  window.addEventListener("mouseout", handleMouseOut);

  // 6. THE BLUEPRINT OF A SPARK (PARTICLE)
  // This class is a template. Every single spark that pops out is an "object" built from this class.
  class Particle {
    x: number;          // Where is it left-to-right
    y: number;          // Where is it top-to-bottom
    size: number;       // How big is the circle
    vx: number;         // Velocity-X (how fast it moves left/right)
    vy: number;         // Velocity-Y (how fast it moves up/down)
    life: number;       // How long does the spark stay alive before fading away
    maxLife: number;    // Starting life value to calculate percentage (for fadeouts)
    color: string;      // The spark color

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      
      // Makes size random between 1.5 to 4.5. Math.random() generates a random decimal from 0 to 0.99
      this.size = Math.random() * 3 + 1.5; 
      
      // Makes it shoot out in randomly slight horizontal and vertical directions
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5 - 0.5; // Starts drifting upwards (-0.5) for a Harry Potter floaty effect
      
      // Randomly live between 20 to 60 frames
      this.life = Math.random() * 40 + 20; 
      this.maxLife = this.life;
      
      // A palette of golden, magical colored hex codes
      const colors = ['#d4af37', '#f9e596', '#ffffff', '#e8cfa1'];
      // Picks a random color from the list above
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    // Every tiny fraction of a second, we run 'update' to physically move the spark
    update() {
      this.x += this.vx; // Move by its X velocity
      this.y += this.vy; // Move by its Y velocity
      this.life--;       // Lose 1 life frame
      this.size *= 0.96; // Shrink its size to 96% of what it used to be (makes it disappear smoothly)
    }

    // Actually draws the dot onto our screen using Canvas 2D math
    draw(ctx: CanvasRenderingContext2D) {
      // Find out how transparent it should be (starts at 1 (solid), lowers down to 0 (invisible))
      const alpha = Math.max(0, this.life / this.maxLife);
      ctx.globalAlpha = alpha; // Set the canvas transparency
      ctx.fillStyle = this.color; // Dip the "brush" into our particle color
      
      // Give the spark a neat shadow so it looks like it's glowing light
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      
      // Draw a perfect circle path!
      ctx.beginPath();
      // arc(x, y, radius, start angle, end angle basically mapping to pi for a full 360 circle)
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill(); // Paint the inside of the circle
      
      // Reset the shadow so other particles don't inherit it accidentally
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0; 
    }
  }

  // A giant array (bucket) to hold all our active sparks
  let particles: Particle[] = [];

  // A helper tool to instantly push one new particle into our bucket
  const createParticle = (x: number, y: number) => {
    particles.push(new Particle(x, y));
  };

  // Even if you stop moving the mouse, we want ambient sparks floating.
  // This interval loop runs every 150 milliseconds (0.15s)
  const emitInterval = setInterval(() => {
    // Only emit idle sparks if there are less than 30 total sparks (save battery/lag)
    if (particles.length < 30) {
      // Pick a random wiggle area closely around the exact mouse point
      const offsetX = (Math.random() - 0.5) * 10;
      const offsetY = (Math.random() - 0.5) * 10;
      particles.push(new Particle(mouseX + offsetX, mouseY + offsetY));
    }
  }, 150);

  // 7. THE RENDER ENGINE LOOP (RUNS 60 TIMES PER SECOND)
  let animationFrameId: number;
  const loop = () => {
    // Erase the ENTIRE canvas to prepare it for painting everything at its new positions
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    
    // For every particle currently alive in our bucket: Update it, then Draw it!
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(ctx!);
    }
    
    // FILTER: Get rid of "dead" particles from our bucket. 
    // They are dead if they run out of life or become too small to see.
    particles = particles.filter((p) => p.life > 0 && p.size > 0.1);
    
    // Ask your browser: "As soon as you are physically ready to draw the very next screen frame, run this loop again"
    animationFrameId = requestAnimationFrame(loop);
  };
  
  // Kickstart our engine
  loop();

  // 8. THE CLEANUP (Like throwing out the trash)
  // If the React component unmounts, or page changes, we need to turn everything off nicely so we don't leak memory.
  return () => {
    document.body.classList.remove("magic-cursor-active");
    window.removeEventListener("resize", resize);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseover", handleMouseOver);
    window.removeEventListener("mouseout", handleMouseOut);
    clearInterval(emitInterval); // Stops the idle sparks timer
    cancelAnimationFrame(animationFrameId); // Kills our 60 FPS animation loop
    
    // Destroys the HTML Canvas entirely
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
  };
};

/* 
  9. THE REACT WRAPPER
  Because we're in a React website, we need to wrap all that plain-vanilla Javascript into a React Component!
*/
const MagicCursor: React.FC = () => {
  // 'useEffect' means "Run this little block of code immediately once the component starts rendering"
  useEffect(() => {
    // IMPORTANT FAILSAFE: `matchMedia("(pointer: fine)")` checks if the device actually has an accurate mouse pointer (Desktops & Laptops).
    // If you are on an iPhone or an iPad with clumsy touch-clicks, we do NOT load the custom cursor because
    // it will be glitchy and annoying. Touch devices get ignored!
    if (window.matchMedia("(pointer: fine)").matches) {
        // Runs the huge logic block above
        const cleanup = initMagicCursor();
        // Hands cleanup to React, so when 'MagicCursor' dies, it safely trashes all the listeners and canvas
        return cleanup;
    }
  }, []); // The empty brackets [] mean "only run this on mount, do not run it repeatedly on updates!"

  // This react component doesn't actually spit out any HTML directly, it does everything secretly in Javascript above.
  return null;
};

export default MagicCursor;
