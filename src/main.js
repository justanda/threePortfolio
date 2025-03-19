import "./main.css";
// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 15;
camera.position.y = 10;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x222222);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
scene.add(directionalLight);

// point lights for glow effects
const createPointLight = (x, y, z, color, intensity, distance) => {
  const light = new THREE.PointLight(color, intensity, distance);
  light.position.set(x, y, z);
  scene.add(light);
  return light;
};

// colored lights
createPointLight(0, 2, 0, 0x00ff00, 2, 10);
createPointLight(-10, 2, -5, 0x0088ff, 1, 15);
createPointLight(10, 1, 5, 0xff0088, 1, 15);

// texture loaders
const textureLoader = new THREE.TextureLoader();

// Create textures
const createCanvasTexture = (color, text) => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 512, 512);

  // circuit-like patterns
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 512, Math.random() * 512);
    ctx.lineTo(Math.random() * 512, Math.random() * 512);
    ctx.stroke();
  }

  if (text) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText(text, 256, 256);
  }

  return new THREE.CanvasTexture(canvas);
};

// Create basic textures
const circuitTexture = createCanvasTexture("#004400", "CIRCUIT");
const normalMap = createCanvasTexture("#8888ff");
const metalTexture = createCanvasTexture("#aaaaaa", "METAL");

// motherboard base
const createMotherboard = () => {
  const geometry = new THREE.BoxGeometry(50, 1, 50);
  const material = new THREE.MeshStandardMaterial({
    color: 0x0a380a,
    roughness: 0.7,
    metalness: 0.2,
  });

  const motherboard = new THREE.Mesh(geometry, material);
  motherboard.receiveShadow = true;
  scene.add(motherboard);

  // Add circuit pattern texture
  addCircuitPatterns(motherboard);

  return motherboard;
};
// circuit patterns to motherboard
const addCircuitPatterns = (motherboard) => {
  // Configuration
  const gridSize = 5; // Distance between traces
  const boardSize = 40; // Total size of the motherboard
  //trace colors
  const traceColors = {
    primary: 0x00dd77,
    secondary: 0x00aa55,
    tertiary: 0x0066aa, // Fixed the syntax error
    highlight: 0x00ffcc,
  };

  // Create horizontal circuit traces in a grid pattern
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      if (Math.random() > 0.3) {
        // Increase density
        // Calculate the length with some subtle variation
        const length = 8 + Math.random() * 8;
        const width = 0.2 + Math.random() * 0.15;
        const height = 0.08 + Math.random() * 0.04;

        const traceGeometry = new THREE.BoxGeometry(length, height, width);

        // Randomly select trace color
        const colorKey =
          Math.random() > 0.7
            ? "primary"
            : Math.random() > 0.5
            ? "secondary"
            : "tertiary";
        const traceColor = traceColors[colorKey];

        const emissiveIntensity = Math.random() > 0.8 ? 0.8 : 0.3;

        const traceMaterial = new THREE.MeshStandardMaterial({
          color: traceColor,
          emissive: traceColor,
          emissiveIntensity: emissiveIntensity,
          roughness: 0.4,
          metalness: 0.8,
        });

        const trace = new THREE.Mesh(traceGeometry, traceMaterial);
        trace.position.y = 0.52 + Math.random() * 0.05;
        trace.position.x =
          i * gridSize - boardSize / 2 + (Math.random() - 0.5) * 2;
        trace.position.z = j * gridSize - boardSize / 2;

        motherboard.add(trace);
      }
    }
  }

  // Create vertical circuit traces with a similar grid pattern
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      if (Math.random() > 0.4) {
        // Calculate the length with some subtle variation
        const length = 6 + Math.random() * 8;
        const width = 0.2 + Math.random() * 0.15;
        const height = 0.08 + Math.random() * 0.04;

        const traceGeometry = new THREE.BoxGeometry(width, height, length);

        // Randomly select trace color
        const colorKey =
          Math.random() > 0.7
            ? "primary"
            : Math.random() > 0.5
            ? "secondary"
            : "tertiary";
        const traceColor = traceColors[colorKey];

        const emissiveIntensity = Math.random() > 0.8 ? 0.8 : 0.3;

        const traceMaterial = new THREE.MeshStandardMaterial({
          color: traceColor,
          emissive: traceColor,
          emissiveIntensity: emissiveIntensity,
          roughness: 0.4,
          metalness: 0.8,
        });

        const trace = new THREE.Mesh(traceGeometry, traceMaterial);
        trace.position.y = 0.52 + Math.random() * 0.05;
        trace.position.x = i * gridSize - boardSize / 2;
        trace.position.z =
          j * gridSize - boardSize / 2 + (Math.random() - 0.5) * 2;

        motherboard.add(trace);
      }
    }
  }

  // Add connection nodes at intersections
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      if (Math.random() > 0.6) {
        // Size variation
        const nodeSize = 0.3 + Math.random() * 0.2;
        const nodeHeight = 0.1 + Math.random() * 0.06;

        const nodeGeometry = new THREE.CylinderGeometry(
          nodeSize,
          nodeSize,
          nodeHeight,
          16
        );

        // Vary the node colors
        const nodeColor =
          Math.random() > 0.8
            ? 0x00ffaa
            : Math.random() > 0.6
            ? 0x00aaff
            : 0x00ff77;

        const nodeMaterial = new THREE.MeshStandardMaterial({
          color: nodeColor,
          emissive: nodeColor,
          emissiveIntensity: 0.7,
          roughness: 0.3,
          metalness: 0.9,
        });

        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.y = 0.55;
        node.position.x = i * gridSize - boardSize / 2;
        node.position.z = j * gridSize - boardSize / 2;
        node.rotation.x = Math.PI / 2;

        motherboard.add(node);
      }
    }
  }

  // Add IC chips and other motherboard elements
  addMotherboardElements(motherboard, boardSize);
};

// New function to add detailed elements to the motherboard
function addMotherboardElements(motherboard, boardSize) {
  // Add small IC chips
  for (let i = 0; i < 15; i++) {
    const size = 1 + Math.random() * 1.5;
    const chipGeometry = new THREE.BoxGeometry(size, 0.3, size);
    const chipMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.5,
      metalness: 0.7,
    });

    const chip = new THREE.Mesh(chipGeometry, chipMaterial);
    chip.position.set(
      (Math.random() - 0.5) * boardSize * 0.8,
      0.65,
      (Math.random() - 0.5) * boardSize * 0.8
    );

    // Add pins to the chip
    const pinCount = Math.floor(size * 3);
    const pinSize = 0.1;
    for (let j = 0; j < pinCount; j++) {
      const pin = new THREE.Mesh(
        new THREE.CylinderGeometry(pinSize, pinSize, 0.1, 8),
        new THREE.MeshStandardMaterial({
          color: 0xaaaaaa,
          metalness: 0.9,
          roughness: 0.1,
        })
      );

      // Position pins around the chip
      const angle = j * ((Math.PI * 2) / pinCount);
      pin.position.set(
        (size / 2) * Math.cos(angle),
        -0.2,
        (size / 2) * Math.sin(angle)
      );

      chip.add(pin);
    }

    motherboard.add(chip);
  }

  // Add capacitors
  for (let i = 0; i < 20; i++) {
    const capHeight = 0.6 + Math.random() * 0.8;
    const capRadius = 0.2 + Math.random() * 0.3;

    const capGeometry = new THREE.CylinderGeometry(
      capRadius,
      capRadius,
      capHeight,
      16
    );
    const capMaterial = new THREE.MeshStandardMaterial({
      color: Math.random() > 0.5 ? 0x444444 : 0x222222,
      roughness: 0.6,
      metalness: 0.4,
    });

    const capacitor = new THREE.Mesh(capGeometry, capMaterial);
    capacitor.position.set(
      (Math.random() - 0.5) * boardSize * 0.8,
      capHeight / 2 + 0.5,
      (Math.random() - 0.5) * boardSize * 0.8
    );

    motherboard.add(capacitor);
  }

  // Add sockets
  for (let i = 0; i < 5; i++) {
    const socketWidth = 3 + Math.random() * 2;
    const socketDepth = 1 + Math.random() * 1;
    const socketHeight = 0.5;

    const socketGeometry = new THREE.BoxGeometry(
      socketWidth,
      socketHeight,
      socketDepth
    );
    const socketMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.7,
      metalness: 0.3,
    });

    const socket = new THREE.Mesh(socketGeometry, socketMaterial);
    socket.position.set(
      (Math.random() - 0.5) * boardSize * 0.6,
      socketHeight / 2 + 0.5,
      (Math.random() - 0.5) * boardSize * 0.6
    );

    // Add pins inside socket
    const pinRows = 2;
    const pinsPerRow = Math.floor(socketWidth / 0.3);

    for (let r = 0; r < pinRows; r++) {
      for (let p = 0; p < pinsPerRow; p++) {
        if (Math.random() > 0.2) {
          // Some pins might be missing
          const pin = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.2, 6),
            new THREE.MeshStandardMaterial({
              color: 0xcccccc,
              metalness: 0.9,
              roughness: 0.1,
            })
          );

          pin.position.set(
            -socketWidth / 2 +
              0.3 +
              (p * (socketWidth - 0.6)) / (pinsPerRow - 1),
            0.1,
            -socketDepth / 4 + (r * socketDepth) / 2
          );

          socket.add(pin);
        }
      }
    }

    motherboard.add(socket);
  }
}
// resume components and info
const resumeComponents = [
  {
    type: "cpu",
    name: "PROFESSIONAL SUMMARY",
    position: { x: -10, y: 1, z: -8 },
    color: 0x0088ff,
    createGeometry: () => {
      const group = new THREE.Group();

      // Base CPU package
      const baseGeom = new THREE.BoxGeometry(6, 0.5, 6);
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.4,
        metalness: 0.8,
        map: circuitTexture,
        normalMap: normalMap,
      });
      const base = new THREE.Mesh(baseGeom, baseMaterial);
      base.castShadow = true;
      base.receiveShadow = true;
      group.add(base);

      // Die/Heat spreader on top
      const dieGeom = new THREE.BoxGeometry(4.5, 0.1, 4.5);
      const dieMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.1,
        metalness: 1.0,
        map: metalTexture,
        envMapIntensity: 1.5,
      });
      const die = new THREE.Mesh(dieGeom, dieMaterial);
      die.position.y = 0.3;
      die.castShadow = true;
      die.receiveShadow = true;
      group.add(die);

      // Heat spreader texture with modern CPU look
      const textureCanvas = document.createElement("canvas");
      textureCanvas.width = 512;
      textureCanvas.height = 512;
      const ctx = textureCanvas.getContext("2d");

      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, 512, 512);
      gradient.addColorStop(0, "#555555");
      gradient.addColorStop(1, "#333333");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      // Add grid lines
      ctx.strokeStyle = "#222222";
      ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 25, 0);
        ctx.lineTo(i * 25, 512);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * 25);
        ctx.lineTo(512, i * 25);
        ctx.stroke();
      }

      // Add text
      ctx.fillStyle = "#cccccc";
      ctx.font = "bold 48px monospace";
      ctx.textAlign = "center";
      ctx.fillText("RESUME CPU", 256, 200);
      ctx.font = "bold 36px monospace";
      ctx.fillText("3.8 GHz", 256, 270);
      ctx.font = "24px monospace";
      ctx.fillText("© 2025", 256, 330);
      ctx.fillText("16 CORES / 32 THREADS", 256, 370);

      const cpuTexture = new THREE.CanvasTexture(textureCanvas);

      const markingGeom = new THREE.PlaneGeometry(4, 4);
      const markingMaterial = new THREE.MeshBasicMaterial({
        map: cpuTexture,
        transparent: true,
      });
      const marking = new THREE.Mesh(markingGeom, markingMaterial);
      marking.rotation.x = -Math.PI / 2;
      marking.position.y = 0.36;
      group.add(marking);

      // Add small indentation in one corner
      const cornerIndent = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.1, 0.5),
        new THREE.MeshStandardMaterial({
          color: 0x222222,
          roughness: 0.5,
        })
      );
      cornerIndent.position.set(2, 0.3, 2);
      group.add(cornerIndent);

      // Add pins underneath
      const pinGroup = new THREE.Group();
      const pinSize = 0.1;
      const pinSpacing = 0.25;
      const pinRows = 20;

      for (let x = 0; x < pinRows; x++) {
        for (let z = 0; z < pinRows; z++) {
          if (Math.random() > 0.05) {
            // Some pins might be missing for realism
            const pin = new THREE.Mesh(
              new THREE.CylinderGeometry(pinSize / 3, pinSize / 3, 0.2, 6),
              new THREE.MeshStandardMaterial({
                color: 0xcccccc,
                metalness: 0.9,
                roughness: 0.1,
              })
            );

            pin.position.set(
              (x - pinRows / 2 + 0.5) * pinSpacing,
              -0.3,
              (z - pinRows / 2 + 0.5) * pinSpacing
            );

            pinGroup.add(pin);
          }
        }
      }

      group.add(pinGroup);

      return group;
    },
    content: `<h2>PROFESSIONAL SUMMARY</h2>
                  <p>Hey, I’m Justin! I’m a front-end developer with a builder’s mindset, whether it’s crafting sleek, user-friendly web apps or designing real-world spaces. I love turning ideas into interactive, intuitive experiences that not only look great but feel great to use. When I’m not coding, you’ll probably find me skateboarding, exploring new cities, or tracking down the best local eats. For me, it’s all about creating and connecting through design, code, and the people I meet along the way. Let’s build something awesome together.</p>`,
  },
  {
    type: "ram",
    name: "SKILLS",
    position: { x: 8, y: 1, z: -12 },
    color: 0xff0088,
    createGeometry: () => {
      const group = new THREE.Group();

      // RAM
      const baseGeom = new THREE.BoxGeometry(8, 0.5, 2);
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x006600,
        roughness: 0.4,
        metalness: 0.5,
        map: circuitTexture,
      });
      const base = new THREE.Mesh(baseGeom, baseMaterial);
      group.add(base);

      // RAM chip
      const chipGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.8);
      const chipMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.5,
        roughness: 0.8,
      });

      for (let i = 0; i < 8; i++) {
        const chip = new THREE.Mesh(chipGeometry, chipMaterial);
        chip.position.set(-3 + i, 0.3, 0);
        group.add(chip);
      }

      // Gold contacts
      const contactGeometry = new THREE.BoxGeometry(8, 0.05, 0.4);
      const contactMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 1.0,
        roughness: 0.1,
      });
      const contact = new THREE.Mesh(contactGeometry, contactMaterial);
      contact.position.y = -0.25;
      contact.position.z = 0.8;
      group.add(contact);

      // Heat spreader
      const spreaderGeo = new THREE.BoxGeometry(8, 0.1, 1.6);
      const spreaderMat = new THREE.MeshStandardMaterial({
        color: 0xff0088,
        emissive: 0xff0088,
        emissiveIntensity: 0.2,
        metalness: 0.7,
        roughness: 0.3,
      });
      const spreader = new THREE.Mesh(spreaderGeo, spreaderMat);
      spreader.position.y = 0.35;
      group.add(spreader);

      // RAM Content
      const labelCanvas = document.createElement("canvas");
      labelCanvas.width = 512;
      labelCanvas.height = 128;
      const ctx = labelCanvas.getContext("2d");
      ctx.fillStyle = "rgba(255, 0, 136, 0.8)";
      ctx.fillRect(0, 0, 512, 128);
      ctx.fillStyle = "white";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.fillText("SKILLS DDR4", 256, 70);

      const labelTexture = new THREE.CanvasTexture(labelCanvas);
      const labelGeo = new THREE.PlaneGeometry(7, 1);
      const labelMat = new THREE.MeshBasicMaterial({
        map: labelTexture,
        transparent: true,
      });
      const label = new THREE.Mesh(labelGeo, labelMat);
      label.position.y = 0.41;
      label.rotation.x = -Math.PI / 2;
      group.add(label);

      return group;
    },
    content: `<h2>TECHNICAL SKILLS</h2>
                  <h3>Front-End Development</h3>
                  <div class="skill-bar"><div class="skill-progress" style="width: 70%"></div></div>
                  <h3>Three.js & WebGL</h3>
                  <div class="skill-bar"><div class="skill-progress" style="width: 45%"></div></div>
                  <h3>UX/UI Design</h3>
                  <div class="skill-bar"><div class="skill-progress" style="width: 80%"></div></div>
                  <h3>JavaScript Frameworks</h3>
                  <div class="skill-bar"><div class="skill-progress" style="width: 65%"></div></div>
                  <h3>Responsive Design</h3>
                  <div class="skill-bar"><div class="skill-progress" style="width: 70%"></div></div>`,
  },
  {
    type: "gpu",
    name: "EXPERIENCE",
    position: { x: 12, y: 1, z: 6 },
    color: 0xff5500,
    createGeometry: () => {
      const group = new THREE.Group();

      // GPU PCB
      const pcbGeo = new THREE.BoxGeometry(10, 0.5, 5);
      const pcbMat = new THREE.MeshStandardMaterial({
        color: 0x221100,
        roughness: 0.6,
        metalness: 0.4,
        map: circuitTexture,
      });
      const pcb = new THREE.Mesh(pcbGeo, pcbMat);
      group.add(pcb);

      // GPU core
      const coreGeo = new THREE.BoxGeometry(3, 0.2, 3);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.2,
        metalness: 0.9,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 0.3;
      group.add(core);

      // VRAM chip
      const vramGeo = new THREE.BoxGeometry(1, 0.15, 1);
      const vramMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.4,
        metalness: 0.6,
      });

      const vramPositions = [
        { x: -3, z: -1.5 },
        { x: -1.5, z: -1.5 },
        { x: 0, z: -1.5 },
        { x: -3, z: 1.5 },
        { x: -1.5, z: 1.5 },
        { x: 0, z: 1.5 },
        { x: 3, z: -1.5 },
        { x: 4.5, z: -1.5 },
        { x: 3, z: 1.5 },
        { x: 4.5, z: 1.5 },
      ];

      vramPositions.forEach((pos) => {
        const vram = new THREE.Mesh(vramGeo, vramMat);
        vram.position.set(pos.x, 0.3, pos.z);
        group.add(vram);
      });

      // Heatsink/fans
      const heatsinkGeo = new THREE.BoxGeometry(9, 0.8, 4);
      const heatsinkMat = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        roughness: 0.3,
        metalness: 0.8,
      });
      const heatsink = new THREE.Mesh(heatsinkGeo, heatsinkMat);
      heatsink.position.y = 0.7;
      group.add(heatsink);

      //  heatsink fins
      for (let i = 0; i < 15; i++) {
        const finGeo = new THREE.BoxGeometry(9, 0.5, 0.15);
        const fin = new THREE.Mesh(finGeo, heatsinkMat);
        fin.position.y = 1.2;
        fin.position.z = -1.5 + i * 0.2;
        group.add(fin);
      }

      //  fans
      const addFan = (x, z) => {
        const fanGroup = new THREE.Group();

        // Fan frame
        const frameGeo = new THREE.RingGeometry(0.8, 1, 32);
        const frameMat = new THREE.MeshStandardMaterial({
          color: 0x333333,
          roughness: 0.7,
        });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.rotation.x = -Math.PI / 2;
        fanGroup.add(frame);

        // Fan blades
        const bladesGroup = new THREE.Group();
        const bladeGeo = new THREE.BoxGeometry(0.6, 0.05, 0.2);
        const bladeMat = new THREE.MeshStandardMaterial({
          color: 0x666666,
          roughness: 0.5,
        });

        for (let i = 0; i < 7; i++) {
          const blade = new THREE.Mesh(bladeGeo, bladeMat);
          blade.position.x = 0.4;
          blade.rotation.y = i * ((Math.PI * 2) / 7);
          bladesGroup.add(blade);
        }

        fanGroup.add(bladesGroup);
        fanGroup.position.set(x, 1.5, z);
        fanGroup.userData = { bladesGroup };

        return fanGroup;
      };

      const fan1 = addFan(-2.5, 0);
      const fan2 = addFan(2.5, 0);
      group.add(fan1);
      group.add(fan2);

      group.userData = { fans: [fan1, fan2] };

      return group;
    },
    content: `<h2>WORK EXPERIENCE</h2>
                  <h3>Senior Graphic Designer </h3>
                  
                  <p>Mirrored Images</p>
                  <p>2019 - Present</p>
                  <p>Designed and developed responsive landing pages, digital ads, and email templates while managing multiple projects, collaborating with stakeholders, and translating complex data into engaging visuals to enhance user experience and brand visibility.</p>
                  <h3>Senior Graphic Designer </h3>
                  <p>Mirrored Images</p>
                  <p>2017 - 2019</p>
                  <p>Created innovative user interfaces focusing on user experience and modern design principles.</p>`,
  },
  {
    type: "usb",
    name: "EDUCATION",
    position: { x: -6, y: 1, z: 10 },
    color: 0x00ff88,
    createGeometry: () => {
      const group = new THREE.Group();

      // USB port
      const bodyGeo = new THREE.BoxGeometry(4, 0.8, 2);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.2,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      group.add(body);

      const portGeo = new THREE.BoxGeometry(3, 0.4, 0.6);
      const portMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.5,
        metalness: 0.5,
      });
      const port = new THREE.Mesh(portGeo, portMat);
      port.position.z = -0.8;
      group.add(port);

      // Internal pins
      const pinGeo = new THREE.BoxGeometry(0.2, 0.1, 0.3);
      const pinMat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.9,
        roughness: 0.1,
      });

      // pins inside USB port
      for (let i = 0; i < 4; i++) {
        const pin = new THREE.Mesh(pinGeo, pinMat);
        pin.position.set(-1.2 + i * 0.8, -0.1, -0.8);
        group.add(pin);
      }

      // USB logo
      const labelCanvas = document.createElement("canvas");
      labelCanvas.width = 256;
      labelCanvas.height = 128;
      const ctx = labelCanvas.getContext("2d");
      ctx.fillStyle = "#111111";
      ctx.fillRect(0, 0, 256, 128);
      ctx.fillStyle = "#00ff88";
      ctx.font = "bold 60px Arial";
      ctx.textAlign = "center";
      ctx.fillText("USB 3.0", 128, 80);

      const labelTexture = new THREE.CanvasTexture(labelCanvas);
      const labelGeo = new THREE.PlaneGeometry(2, 0.6);
      const labelMat = new THREE.MeshBasicMaterial({
        map: labelTexture,
        transparent: true,
      });
      const label = new THREE.Mesh(labelGeo, labelMat);
      label.position.y = 0.41;
      label.position.z = 0.2;
      label.rotation.x = -Math.PI / 2;
      group.add(label);

      return group;
    },
    content: `<h2>EDUCATION</h2>
                  <h3>University of Denver</h3>
                  <p>Full Stack Web Development Media</p>
                  <h3>Highlands Ranch High School</h3>
                  <p>2012</p>`,
  },
  {
    type: "capacitor",
    name: "PROJECTS",
    position: { x: -15, y: 1, z: 0 },
    color: 0xffff00,
    createGeometry: () => {
      const group = new THREE.Group();

      // Capacitor base
      const baseGeo = new THREE.CylinderGeometry(1.5, 1.5, 2, 16);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.3,
        metalness: 0.8,
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      group.add(base);

      // Capacitor top
      const topGeo = new THREE.CircleGeometry(1.48, 16);
      const topMat = new THREE.MeshStandardMaterial({
        color: 0x666666,
        roughness: 0.4,
        metalness: 0.6,
      });
      const top = new THREE.Mesh(topGeo, topMat);
      top.position.y = 1.01;
      top.rotation.x = -Math.PI / 2;
      group.add(top);

      // Capacitor markings
      const labelCanvas = document.createElement("canvas");
      labelCanvas.width = 256;
      labelCanvas.height = 256;
      const ctx = labelCanvas.getContext("2d");
      ctx.fillStyle = "#666666";
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = "white";
      ctx.font = "bold 36px Arial";
      ctx.textAlign = "center";
      ctx.fillText("PROJECTS", 128, 100);
      ctx.fillText("100μF 16V", 128, 150);

      const labelTexture = new THREE.CanvasTexture(labelCanvas);
      const labelGeo = new THREE.CylinderGeometry(
        1.51,
        1.51,
        2.01,
        32,
        1,
        true
      );
      const labelMat = new THREE.MeshBasicMaterial({
        map: labelTexture,
        transparent: true,
      });
      const label = new THREE.Mesh(labelGeo, labelMat);
      group.add(label);

      // Polarity marking
      const polarityGeo = new THREE.BoxGeometry(0.2, 0.1, 1);
      const polarityMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });
      const polarity = new THREE.Mesh(polarityGeo, polarityMat);
      polarity.position.y = 1.1;
      group.add(polarity);

      // Bottom pins
      const pin1Geo = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);
      const pin2Geo = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);
      const pinMat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.9,
        roughness: 0.1,
      });

      const pin1 = new THREE.Mesh(pin1Geo, pinMat);
      pin1.position.set(0.5, -1.25, 0);
      group.add(pin1);

      const pin2 = new THREE.Mesh(pin2Geo, pinMat);
      pin2.position.set(-0.5, -1.25, 0);
      group.add(pin2);

      return group;
    },
    content: `<h2>KEY PROJECTS</h2>
                  <h3>React Portfolio</h3>
                  <p> Dynamically responsive portfolio that showcases my skills within react.</p>
                  <h3>Candidate Search</h3>
                  <p>A platform for searching and filtering job candidates built with React.</p>
                  <h3>Weather Dashboard</h3>
                  <p>A responsive weather dashboard for viewing current and forecasted weather data with location search.</p>
                  <h3>Employee Database</h3>
                  <p>Command line application for managing employee data with CRUD operations and reporting.</p>`,
  },
  {
    type: "chip",
    name: "CONTACT",
    position: { x: 0, y: 1, z: -15 },
    color: 0x00ffff,
    createGeometry: () => {
      const group = new THREE.Group();

      // Chip
      const baseGeo = new THREE.BoxGeometry(5, 0.5, 5);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.5,
        metalness: 0.6,
        map: circuitTexture,
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      group.add(base);

      // Chip circuitry markings
      const labelCanvas = document.createElement("canvas");
      labelCanvas.width = 512;
      labelCanvas.height = 512;
      const ctx = labelCanvas.getContext("2d");
      ctx.fillStyle = "#222222";
      ctx.fillRect(0, 0, 512, 512);

      // chip circuit pattern
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 2;
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 512, Math.random() * 512);
        ctx.lineTo(Math.random() * 512, Math.random() * 512);
        ctx.stroke();
      }

      //  connection dots
      ctx.fillStyle = "#00ffff";
      for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * 512, Math.random() * 512, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      //  chip text
      ctx.fillStyle = "#00ffff";
      ctx.font = "bold 40px monospace";
      ctx.textAlign = "center";
      ctx.fillText("CONTACT CHIP", 256, 200);
      ctx.font = "30px monospace";
      ctx.fillText("v3.0 // 2025", 256, 250);

      const labelTexture = new THREE.CanvasTexture(labelCanvas);
      const labelGeo = new THREE.PlaneGeometry(4.8, 4.8);
      const labelMat = new THREE.MeshBasicMaterial({
        map: labelTexture,
        transparent: true,
      });
      const label = new THREE.Mesh(labelGeo, labelMat);
      label.position.y = 0.26;
      label.rotation.x = -Math.PI / 2;
      group.add(label);

      // pins on edge
      const pinGeo = new THREE.BoxGeometry(0.2, 0.1, 0.2);
      const pinMat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.9,
        roughness: 0.1,
      });

      const pinCount = 36;
      const pinRadius = 2.7;
      for (let i = 0; i < pinCount; i++) {
        const angle = (i / pinCount) * Math.PI * 2;
        const pin = new THREE.Mesh(pinGeo, pinMat);
        pin.position.set(
          pinRadius * Math.cos(angle),
          -0.25,
          pinRadius * Math.sin(angle)
        );
        group.add(pin);
      }

      return group;
    },
    content: `<h2>CONTACT</h2>
                  <p>Email: justimiran@gmail.com</p>
                  <p>Phone: 303-995-7058</p>
                  <p>Portfolio: justinmiranda.netlify.app</p>
                  <p>LinkedIn: linkedin.com/in/justinmiranda-dev</p>
                  <p>GitHub: github.com/justanda</p>`,
  },
];

//  motherboard/add all components
const motherboard = createMotherboard();

// position all components
const components = resumeComponents.map((compData) => {
  const component = compData.createGeometry();
  component.position.set(
    compData.position.x,
    compData.position.y,
    compData.position.z
  );
  component.userData.type = compData.type;
  component.userData.name = compData.name;
  component.userData.content = compData.content;
  component.userData.color = compData.color;
  scene.add(component);
  return component;
});

// Consumer info panel
const createInfoPanel = () => {
  const panel = document.createElement("div");
  panel.id = "info-panel";
  panel.style.position = "absolute";
  panel.style.right = "20px";
  panel.style.top = "20px";
  panel.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  panel.style.color = "#ffffff";
  panel.style.padding = "20px";
  panel.style.borderRadius = "10px";
  panel.style.maxWidth = "450px";
  panel.style.fontFamily = "Arial, sans-serif";
  panel.style.boxShadow = "0 0 20px rgba(0, 255, 255, 0.4)";
  panel.style.border = "1px solid #00ffff";
  panel.style.display = "none";
  document.body.appendChild(panel);

  return panel;
};

const infoPanel = createInfoPanel();

const createTitlePanel = () => {
  const panel = document.createElement("div");
  panel.id = "title-panel";
  panel.style.position = "absolute";
  panel.style.left = "5px";
  panel.style.bottom = "5px";
  panel.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  panel.style.color = "#00ff88";
  panel.style.padding = "20px";
  panel.style.borderRadius = "10px";
  panel.style.fontFamily = "Arial, sans-serif";
  panel.style.boxShadow = "0 0 20px rgba(0, 255, 136, 0.4)";
  panel.style.border = "1px solid #00ff88";

  const title = document.createElement("h1");
  title.textContent = "MOTHERBOARD RESUME";
  title.style.margin = "0 0 10px 0";
  title.style.fontSize = "24px";
  panel.appendChild(title);

  const subtitle = document.createElement("p");
  subtitle.textContent = "INTERACTIVE MOTHERBOARD CV // v1.0";
  subtitle.style.margin = "0";
  subtitle.style.fontSize = "14px";
  panel.appendChild(subtitle);

  const instructions = document.createElement("p");
  instructions.textContent = "CLICK ON COMPONENTS TO VIEW DETAILS";
  instructions.style.margin = "10px 0 0 0";
  instructions.style.fontSize = "12px";
  instructions.style.opacity = "0.7";
  panel.appendChild(instructions);

  document.body.appendChild(panel);

  return panel;
};

const titlePanel = createTitlePanel();

// raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// style sheet for resume content
const addStyleSheet = () => {
  const style = document.createElement("style");
  style.textContent = `
           #info-panel h2 {
             color: #00ffff;
             margin-top: 0;
             border-bottom: 1px solid #00ffff;
             padding-bottom: 10px;
           }
           #info-panel h3 {
             color: #00ff88;
             margin: 15px 0 5px 0;
           }
           #info-panel p {
             margin: 5px 0;
             line-height: 1.4;
           }
           .skill-bar {
             background-color: rgba(255, 255, 255, 0.1);
             height: 10px;
             border-radius: 5px;
             margin-top: 5px;
             overflow: hidden;
           }
           .skill-progress {
             background-color: #ff0088;
             height: 100%;
             border-radius: 5px;
           }
         `;
  document.head.appendChild(style);
};

addStyleSheet();

// mouse movement for hover effects
document.addEventListener("mousemove", (event) => {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// click events to show component information
document.addEventListener("click", () => {
  raycaster.setFromCamera(mouse, camera);

  // Find intersections with components
  const intersects = raycaster.intersectObjects(components, true);

  if (intersects.length > 0) {
    let component = intersects[0].object;
    while (component.parent && !component.userData.type) {
      component = component.parent;
    }

    if (component.userData.type) {
      // Display component information
      infoPanel.innerHTML = component.userData.content;
      infoPanel.style.display = "block";
      infoPanel.style.borderColor = `#${component.userData.color
        .toString(16)
        .padStart(6, "0")}`;
      infoPanel.style.boxShadow = `0 0 20px rgba(${
        (component.userData.color >> 16) & 255
      }, ${(component.userData.color >> 8) & 255}, ${
        component.userData.color & 255
      }, 0.4)`;
    }
  } else {
    // Hide info panel if clicking empty space
    infoPanel.style.display = "none";
  }
});

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
const animate = () => {
  requestAnimationFrame(animate);

  // Rotate fans in GPU
  components.forEach((component) => {
    if (component.userData.type === "gpu" && component.userData.fans) {
      component.userData.fans.forEach((fan) => {
        if (fan.userData.bladesGroup) {
          fan.userData.bladesGroup.rotation.z += 0.1;
        }
      });
    }
  });

  // floating animation for components
  const time = Date.now() * 0.001;
  components.forEach((component, index) => {
    component.position.y = component.userData.originalY || component.position.y;
    component.userData.originalY =
      component.userData.originalY || component.position.y;
    component.position.y += Math.sin(time + index) * 0.05;
  });

  // orbital camera movement
  camera.position.x = Math.sin(time * 0.1) * 20;
  camera.position.z = Math.cos(time * 0.1) * 20;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
};

// Init component original positions
components.forEach((component) => {
  component.userData.originalY = component.position.y;
});

// Start the animation loop
animate();
