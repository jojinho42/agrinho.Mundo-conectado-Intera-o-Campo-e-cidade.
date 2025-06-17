let modo = "campo";
let flores = [];
let luzes = [];
let carros = [];
let arvores = [];
let casasCampo = [];
let passaros = [];
let nuvens = [];
let estrelas = [];
let peixes = [];
let pessoas = []

let coresRoupas = [];
let corCenario;
let solX = 150;
let ang = 0;
let coresFlores = [];
let coresCarros = [];
let coresLuzes = [];
let coresCasas = [];
let velocidadeCarro = 3;
let dia = true;
let teclaPressionada = false;
let tempoTecla = 0;
let transitionFrames = 0;
const maxTransitionFrames = 60;
let postes = [];
let starCanvas;
let mostrarInstrucoes = false;

const CONFIG = {
  quantidades: {
    casas: 4,
    arvores: 7,
    flores: 20,
    carros: 10,
    passaros: 5,
    nuvens: 5,
    estrelas: 150,
    peixes: 7,
    postes: Math.floor(1200 / 120),
    pessoas: 15
  },
  cores: {
    skyDay: [135, 206, 235],
    skyNight: [20, 24, 82],
    riverDay: [64, 164, 223],
    riverNight: [20, 60, 120],
    grass: [34, 139, 34],
    sidewalk: [150],
    road: [50],
    building: [169],
    buildingLight: [255, 255, 150],
    treeTrunk: [139, 69, 19],
    treeLeaves: [0, 100, 0],
    roof: [139, 0, 0],
    door: [139, 69, 19],
    windowDay: [200, 230, 255],
    windowNight: [255, 255, 150],
    flowerCenter: [255, 255, 0],
    bird: [0],
    cloud: [255, 255, 255, 200],
    skin: [255, 205, 148]
  },
  posicoes: {
    groundLevel: 0.5,
    riverStart: 0.85,
    riverEnd: 0.98,
    sidewalkTop: 0.85,
    birdMinY: 75,
    birdMaxY: 0.4,
    personHeight: 0.12
  },
  tamanhos: {
    sun: 60,
    buildingWidth: 90,
    buildingHeight: 180,
    sidewalkHeight: 0.15,
    treeWidth: 30,
    treeHeight: 90,
    carWidth: 60,
    carHeight: 30,
    fishMin: 15,
    fishMax: 30,
    flower: 15,
    star: 4.5,
    cloudWidth: 90,
    cloudHeight: 45,
    personMin: 30,
    personMax: 45
  },
  velocidades: {
    carroMin: 0.75,
    carroMax: 15,
    carroPadrao: 3,
    passaroMin: 1.5,
    passaroMax: 4.5,
    nuvem: 0.3,
    pessoaMin: 0.75,
    pessoaMax: 2.25
  }
};

class Peixe {
  constructor() {
    this.reset();
    this.color = color(random(150, 255), random(100, 200), random(50, 150));
    this.maxX = width + 30;
    this.minX = -30;
  }
  
  reset() {
    this.x = random(width);
    this.y = random(height * CONFIG.posicoes.riverStart + 30, height * CONFIG.posicoes.riverEnd - 15);
    this.speed = random(0.75, 3);
    this.size = random(CONFIG.tamanhos.fishMin, CONFIG.tamanhos.fishMax);
    this.direction = random([-1, 1]);
  }
  
  update() {
    this.x += this.speed * this.direction;
    if (this.x > this.maxX) this.x = this.minX;
    if (this.x < this.minX) this.x = this.maxX;
    
    this.y = constrain(this.y + sin(frameCount * 0.1) * 0.3, height * CONFIG.posicoes.riverStart + 30, height * CONFIG.posicoes.riverEnd - 15);
  }
  
  draw() {
    fill(this.color);
    // Corpo do peixe
    ellipse(this.x, this.y, this.size, this.size/2);
    
    // Cauda do peixe
    triangle(
      this.x - this.size/2 * this.direction, this.y, 
      this.x - (this.size/2 + 7.5) * this.direction, this.y - 4.5,
      this.x - (this.size/2 + 7.5) * this.direction, this.y + 4.5
    );
    
    // Olho do peixe
    fill(0);
    ellipse(this.x + this.size/4 * this.direction, this.y, 4.5, 4.5);
  }
}

class Poste {
  constructor(x) {
    this.x = x;
    this.height = 150;
    this.lightOn = false;
    this.calcadaTopo = height * CONFIG.posicoes.sidewalkTop;
  }
  
  draw() {
    fill(70);
    rect(this.x, this.calcadaTopo, 7.5, -this.height);
    fill(100);
    rect(this.x - 15, this.calcadaTopo - this.height, 37.5, 7.5);
    
    if (this.lightOn) {
      fill(...CONFIG.cores.buildingLight);
    } else {
      fill(200);
    }
    ellipse(this.x + 18, this.calcadaTopo - this.height + 3, 22.5);
    
    if (this.lightOn && !dia) {
      fill(255, 255, 150, 100);
      noStroke();
      triangle(
        this.x + 18, this.calcadaTopo - this.height + 3,
        this.x + 60, this.calcadaTopo - 45,
        this.x + 18, this.calcadaTopo
      );
    }
  }
}

function setup() {
  createCanvas(1200, 600);
  corCenario = color(...CONFIG.cores.skyDay);
  textFont("Arial");
  noStroke();
  createStarCanvas();
  gerarElementos();
}

function createStarCanvas() {
  starCanvas = createGraphics(width, height * CONFIG.posicoes.birdMaxY);
  starCanvas.noStroke();
  starCanvas.fill(255);
  for (let i = 0; i < CONFIG.quantidades.estrelas; i++) {
    starCanvas.ellipse(random(0, width), random(0, height * CONFIG.posicoes.birdMaxY), CONFIG.tamanhos.star, CONFIG.tamanhos.star);
  }
}

function gerarElementos() {
  flores = []; arvores = []; casasCampo = []; carros = []; passaros = []; 
  nuvens = []; peixes = []; postes = []; pessoas = []; coresFlores = []; 
  coresCarros = []; coresCasas = []; coresRoupas = [];

  for (let i = 0; i < CONFIG.quantidades.casas; i++) adicionarCasa();
  for (let i = 0; i < CONFIG.quantidades.arvores; i++) adicionarArvore();
  for (let i = 0; i < CONFIG.quantidades.flores; i++) adicionarFlor();
  
  for (let i = 0; i < CONFIG.quantidades.carros; i++) {
    carros.push({ x: random(-width, width), y: height * 0.7 + CONFIG.tamanhos.carHeight/2 });
    coresCarros.push(color(random(150, 255), random(150, 255), random(150, 255)));
  }

  for (let i = 0; i < CONFIG.quantidades.passaros; i++) {
    passaros.push({
      x: random(width),
      y: random(CONFIG.posicoes.birdMinY, height * CONFIG.posicoes.birdMaxY),
      velocidade: random(CONFIG.velocidades.passaroMin, CONFIG.velocidades.passaroMax),
      direcao: random([-1, 1])
    });
  }

  for (let i = 0; i < CONFIG.quantidades.nuvens; i++) nuvens.push({ x: random(-300, width), y: random(75, 225) });
  for (let i = 0; i < CONFIG.quantidades.peixes; i++) peixes.push(new Peixe());
  for (let x = 0; x < width; x += 120) postes.push(new Poste(x + 60));
  for (let i = 0; i < CONFIG.quantidades.pessoas; i++) adicionarPessoa();
}
function draw() {
  handleDayNightTransition();
  background(corCenario);
  
  drawSunMoon();
  drawClouds();
  if (!dia || transitionFrames > 0) drawStars();
  
  if (modo === "campo") drawCountryside();
  else drawCity();
}


function handleDayNightTransition() {
  if (transitionFrames > 0) {
    transitionFrames--;
    let transitionRatio = transitionFrames/maxTransitionFrames;
    corCenario = lerpColor(
      dia ? color(...CONFIG.cores.skyNight) : color(...CONFIG.cores.skyDay),
      dia ? color(...CONFIG.cores.skyDay) : color(...CONFIG.cores.skyNight),
      transitionRatio
    );
    if (transitionFrames === 0) updateAllElementsForDayNight();
  } else {
    corCenario = dia ? color(...CONFIG.cores.skyDay) : color(...CONFIG.cores.skyNight);
  }
}

function updateAllElementsForDayNight() {
  for (let poste of postes) poste.lightOn = !dia;
  if (!dia) createStarCanvas();
}

function drawSunMoon() {
  ang += 0.01;
  let y = map(sin(ang), -1, 1, 150, 450);
  solX = map(sin(ang), -1, 1, 150, width - 150);

  if (transitionFrames > 0) {
    let transitionRatio = transitionFrames/maxTransitionFrames;
    fill(lerpColor(
      dia ? color(220, 220, 220) : color(255, 255, 150),
      dia ? color(255, 255, 150) : color(220, 220, 220),
      transitionRatio
    ));
  } else fill(dia ? color(255, 255, 150) : color(220, 220, 220));
  ellipse(solX, y, CONFIG.tamanhos.sun);
}

function drawClouds() {
  for (let nuvem of nuvens) {
    drawNuvem(nuvem.x, nuvem.y);
    nuvem.x += CONFIG.velocidades.nuvem;
    if (nuvem.x > width) nuvem.x = -150;
  }
}

function drawNuvem(x, y) {
  fill(...CONFIG.cores.cloud);
  ellipse(x, y, CONFIG.tamanhos.cloudWidth, CONFIG.tamanhos.cloudHeight);
  ellipse(x + 60, y + 15, CONFIG.tamanhos.cloudWidth, CONFIG.tamanhos.cloudHeight);
  ellipse(x - 60, y + 15, CONFIG.tamanhos.cloudWidth, CONFIG.tamanhos.cloudHeight);
}

function drawStars() {
  if (!dia || (transitionFrames > 0 && !dia)) image(starCanvas, 0, 0);
}

function drawCountryside() {
  drawGrass();
  drawStream();
  
  for (let i = 0; i < flores.length; i++) drawFlor(flores[i].x, flores[i].y, coresFlores[i]);
  for (let arvore of arvores) drawArvore(arvore.x, arvore.y);
  for (let i = 0; i < casasCampo.length; i++) drawCasaCampo(casasCampo[i].x, casasCampo[i].y, coresCasas[i]);
  for (let passaro of passaros) { drawPassaro(passaro); moverPassaro(passaro); }
  for (let peixe of peixes) { peixe.update(); peixe.draw(); }
}

function drawGrass() {
  fill(...CONFIG.cores.grass);
  rect(0, height * CONFIG.posicoes.groundLevel, width, height * (CONFIG.posicoes.riverStart - CONFIG.posicoes.groundLevel));
  
  beginShape();
  vertex(0, height * CONFIG.posicoes.groundLevel);
  vertex(width, height * CONFIG.posicoes.groundLevel);
  vertex(width, height * CONFIG.posicoes.riverStart);
  for (let x = width; x >= 0; x -= 30) {
    vertex(x, height * CONFIG.posicoes.riverStart + sin(x * 0.05 + frameCount * 0.03) * 12);
  }
  vertex(0, height * CONFIG.posicoes.riverStart);
  endShape(CLOSE);
}

function drawStream() {
  const riachoTopo = height * CONFIG.posicoes.riverStart;
  const riachoBase = height;
  
  let riverColor;
  if (transitionFrames > 0) {
    riverColor = lerpColor(
      dia ? color(...CONFIG.cores.riverNight) : color(...CONFIG.cores.riverDay),
      dia ? color(...CONFIG.cores.riverDay) : color(...CONFIG.cores.riverNight),
      transitionFrames/maxTransitionFrames
    );
  } else riverColor = dia ? color(...CONFIG.cores.riverDay) : color(...CONFIG.cores.riverNight);
  
  fill(riverColor);
  noStroke();
  beginShape();
  vertex(0, riachoTopo);
  for (let x = 0; x <= width; x += 30) {
    vertex(x, riachoTopo + sin(x * 0.05 + frameCount * 0.03) * 12);
  }
  vertex(width, riachoTopo);
  vertex(width, riachoBase);
  vertex(0, riachoBase);
  endShape(CLOSE);
  
  if (dia || transitionFrames > 0) {
    let alpha = dia ? 80 : lerp(80, 0, transitionFrames/maxTransitionFrames);
    fill(255, 255, 255, alpha);
    for (let x = 0; x < width; x += 60) {
      ellipse(x, riachoTopo + 15 + sin(x * 0.1 + frameCount * 0.1) * 7.5, 45, 4.5);
    }
    fill(255, 255, 255, alpha * 0.6);
    for (let x = 0; x < width; x += 22.5) {
      ellipse(x, riachoTopo + sin(x * 0.2 + frameCount * 0.15) * 4.5, 30, 1.5);
    }
  } else if (solX > 0 && solX < width) {
    fill(255, 255, 255, 30);
    noStroke();
    for (let i = 0; i < 3; i++) {
      ellipse(solX, riachoTopo + 22.5 + i * 7.5, 120 - i * 30, 4.5);
    }
  }
}

function drawCity() {
  drawBuildings();
  drawRoad();
  drawSidewalk();
  
  for (let poste of postes) {
    poste.calcadaTopo = height * CONFIG.posicoes.sidewalkTop;
    poste.lightOn = !dia || transitionFrames > 0;
    poste.draw();
  }
  
  for (let i = 0; i < pessoas.length; i++) {
    drawPessoa(pessoas[i].x, pessoas[i].y, pessoas[i].tamanho, coresRoupas[i]);
    moverPessoa(pessoas[i]);
  }
  
  for (let i = 0; i < carros.length; i++) {
    drawCarro(carros[i].x, carros[i].y, coresCarros[i]);
    moverCarro(carros[i]);
  }
}

function drawPessoa(x, y, tamanho, corRoupa) {
  fill(...CONFIG.cores.skin);
  ellipse(x, y - tamanho * 0.4, tamanho * 0.3, tamanho * 0.3);
  fill(corRoupa);
  rect(x - tamanho * 0.15, y - tamanho * 0.35, tamanho * 0.3, tamanho * 0.5);
  fill(0);
  rect(x - tamanho * 0.15, y + tamanho * 0.15, tamanho * 0.1, tamanho * 0.4);
  rect(x + tamanho * 0.05, y + tamanho * 0.15, tamanho * 0.1, tamanho * 0.4);
  
  let bracoOffset = sin(frameCount * 0.1) * 5;
  fill(...CONFIG.cores.skin);
  rect(x - tamanho * 0.25, y - tamanho * 0.2 + bracoOffset, tamanho * 0.1, tamanho * 0.4);
  rect(x + tamanho * 0.15, y - tamanho * 0.2 - bracoOffset, tamanho * 0.1, tamanho * 0.4);
}

function moverPessoa(pessoa) {
  pessoa.x += pessoa.velocidade * pessoa.direcao;
  if (pessoa.x > width + 30) pessoa.x = -30;
  else if (pessoa.x < -30) pessoa.x = width + 30;
}

function drawBuildings() {
  fill(...CONFIG.cores.building);
  for (let i = 0; i < width; i += 120) {
    rect(i, height * 0.4, CONFIG.tamanhos.buildingWidth, CONFIG.tamanhos.buildingHeight);
    
    let windowColor;
    if (transitionFrames > 0) {
      windowColor = lerpColor(
        dia ? color(...CONFIG.cores.windowNight) : color(...CONFIG.cores.windowDay),
        dia ? color(...CONFIG.cores.windowDay) : color(...CONFIG.cores.windowNight),
        transitionFrames/maxTransitionFrames
      );
    } else windowColor = dia ? color(...CONFIG.cores.windowDay) : color(...CONFIG.cores.windowNight);
    
    fill(windowColor);
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 3; k++) {
        rect(i + 15 + k * 30, height * 0.45 + j * 45, 15, 22.5);
      }
    }
    fill(...CONFIG.cores.building);
  }
}

function drawRoad() {
  fill(...CONFIG.cores.road);
  rect(0, height * 0.7, width, height * 0.15);
  stroke(255);
  strokeWeight(4.5);
  for (let i = 0; i < width; i += 120) {
    line(i, height * 0.7 + height * 0.15/2, i + 60, height * 0.7 + height * 0.15/2);
  }
  noStroke();
}

function drawSidewalk() {
  const calcadaTopo = height * CONFIG.posicoes.sidewalkTop;
  const calcadaAltura = height * CONFIG.tamanhos.sidewalkHeight;
  fill(...CONFIG.cores.sidewalk);
  rect(0, calcadaTopo, width, calcadaAltura);
  fill(200);
  for (let x = 0; x < width; x += 60) {
    rect(x, calcadaTopo + calcadaAltura/2 - 7.5, 30, 15);
  }
}

function drawFlor(x, y, cor) {
  fill(cor);
  ellipse(x, y, CONFIG.tamanhos.flower);
  ellipse(x + 7.5, y + 7.5, CONFIG.tamanhos.flower);
  ellipse(x - 7.5, y + 7.5, CONFIG.tamanhos.flower);
  fill(...CONFIG.cores.flowerCenter);
  ellipse(x, y + 3, 7.5);
}

function drawArvore(x, y) {
  fill(...CONFIG.cores.treeTrunk);
  rect(x, y, CONFIG.tamanhos.treeWidth, CONFIG.tamanhos.treeHeight);
  fill(...CONFIG.cores.treeLeaves);
  ellipse(x + CONFIG.tamanhos.treeWidth/2, y - 30, 90, 90);
}

function drawCasaCampo(x, y, cor) {
  fill(cor);
  rect(x, y, 90, 60);
  fill(...CONFIG.cores.roof);
  triangle(x, y, x + 45, y - 45, x + 90, y);
  fill(...CONFIG.cores.door);
  rect(x + 37.5, y + 22.5, 15, 37.5);
  
  let windowColor;
  if (transitionFrames > 0) {
    windowColor = lerpColor(
      dia ? color(...CONFIG.cores.windowNight) : color(...CONFIG.cores.windowDay),
      dia ? color(...CONFIG.cores.windowDay) : color(...CONFIG.cores.windowNight),
      transitionFrames/maxTransitionFrames
    );
  } else windowColor = dia ? color(...CONFIG.cores.windowDay) : color(...CONFIG.cores.windowNight);
  
  fill(windowColor);
  rect(x + 15, y + 15, 15, 15);
  rect(x + 60, y + 15, 15, 15);
}

function drawCarro(x, y, cor) {
  fill(cor);
  rect(x, y, CONFIG.tamanhos.carWidth, CONFIG.tamanhos.carHeight, 7.5);
  fill(0);
  ellipse(x + 12, y + 30, 18, 18);
  ellipse(x + 48, y + 30, 18, 18);
  fill(200, 230, 255, 150);
  rect(x + 7.5, y + 7.5, 45, 15, 4.5);
}

function moverCarro(carro) {
  carro.x += velocidadeCarro;
  if (carro.x > width) carro.x = -CONFIG.tamanhos.carWidth;
}

function drawPassaro(passaro) {
  fill(...CONFIG.cores.bird);
  ellipse(passaro.x, passaro.y, 15, 7.5); // Corpo
  
  // Cabeça na direção correta
  ellipse(passaro.x + (passaro.direcao * 7.5), passaro.y - 4.5, 10.5);
  
  // Bico na direção correta
  if (passaro.direcao > 0) {
    triangle(
      passaro.x + 12, passaro.y - 4.5,
      passaro.x + 18, passaro.y - 4.5,
      passaro.x + 8, passaro.y
    );
  } else {
    triangle(
      passaro.x - 12, passaro.y - 4.5,
      passaro.x - 18, passaro.y - 4.5,
      passaro.x - 8, passaro.y
    );
  }
  
  // Asas na direção correta
  if (passaro.direcao > 0) {
    arc(passaro.x - 4.5, passaro.y, 22.5, 15, 0, PI);
  } else {
    arc(passaro.x + 4.5, passaro.y, 22.5, 15, PI, TWO_PI);
  }
}

function moverPassaro(passaro) {
  passaro.x += passaro.velocidade * passaro.direcao;
  if (passaro.x > width + 30) {
    passaro.x = -30;
    passaro.y = random(CONFIG.posicoes.birdMinY, height * CONFIG.posicoes.birdMaxY);
  } else if (passaro.x < -30) {
    passaro.x = width + 30;
    passaro.y = random(CONFIG.posicoes.birdMinY, height * CONFIG.posicoes.birdMaxY);
  }
  passaro.y += sin(frameCount * 0.1) * 0.45;
}

function keyPressed() {
  if (!teclaPressionada || millis() - tempoTecla > 200) {
    teclaPressionada = true;
    tempoTecla = millis();
    
    const shiftPressed = keyIsDown(SHIFT);
    
    switch (key.toLowerCase()) {
      case ' ': alternarModo(); break;
      case 'd': transitionFrames = maxTransitionFrames; dia = !dia; break;
      case 'f': if (modo === "campo") shiftPressed ? removerFlor() : adicionarFlor(); 
        break;
      case 'a': if (modo === "campo") shiftPressed ? removerArvore() : adicionarArvore(); 
        break;
      case 'c': if (modo === "campo") shiftPressed ? removerCasa() : adicionarCasa(); 
        break;
      case 'v': if (modo === "cidade") shiftPressed ? removerCarro() : adicionarCarro(); 
        break;
      case 'p': if (modo === "cidade") shiftPressed ? removerPessoa() : adicionarPessoa(); 
        break;
      case 'r': removerUltimoObjeto(); break;
      case '+': if (modo === "cidade") velocidadeCarro = min(velocidadeCarro + 0.75, CONFIG.velocidades.carroMax); break;
      case '-': if (modo === "cidade") velocidadeCarro = max(velocidadeCarro - 0.75, CONFIG.velocidades.carroMin); break;
      case 'i': mostrarInstrucoes = !mostrarInstrucoes; break;
    }
  }
  return false;
}

function keyReleased() {
  teclaPressionada = false;
}

function alternarModo() {
  modo = modo === "campo" ? "cidade" : "campo";
  gerarElementos();
}

function adicionarFlor() {
  flores.push({ 
    x: random(width), 
    y: random(height * CONFIG.posicoes.groundLevel, height * CONFIG.posicoes.riverStart - 30)
  });
  coresFlores.push(color(random(255), random(255), random(255)));
}

function removerFlor() {
  if (flores.length > 0) { flores.pop(); coresFlores.pop(); }
}

function adicionarArvore() {
  arvores.push({ 
    x: random(width) - CONFIG.tamanhos.treeWidth/2, 
    y: random(height * CONFIG.posicoes.groundLevel, height * CONFIG.posicoes.riverStart - CONFIG.tamanhos.treeHeight - 15)
  });
}

function removerArvore() {
  if (arvores.length > 0) arvores.pop();
}

function adicionarCasa() {
  casasCampo.push({ 
    x: random(width) - 45, 
    y: random(height * CONFIG.posicoes.groundLevel, height * CONFIG.posicoes.riverStart - 60)
  });
  coresCasas.push(color(random(200, 255), random(150, 200), random(100, 150)));
}

function removerCasa() {
  if (casasCampo.length > 0) { casasCampo.pop(); coresCasas.pop(); }
}

function adicionarCarro() {
  carros.push({ x: random(-width, width), y: height * 0.7 + CONFIG.tamanhos.carHeight/2 });
  coresCarros.push(color(random(150, 255), random(150, 255), random(150, 255)));
}

function removerCarro() {
  if (carros.length > 0) { carros.pop(); coresCarros.pop(); }
}

function adicionarPessoa() {
  pessoas.push({
    x: random(width),
    y: height * CONFIG.posicoes.sidewalkTop + 30,
    velocidade: random(CONFIG.velocidades.pessoaMin, CONFIG.velocidades.pessoaMax),
    direcao: random([-1, 1]),
    tamanho: random(CONFIG.tamanhos.personMin, CONFIG.tamanhos.personMax)
  });
  coresRoupas.push(color(random(255), random(255), random(255)));
}

function removerPessoa() {
  if (pessoas.length > 0) { pessoas.pop(); coresRoupas.pop(); }
}

function removerUltimoObjeto() {
  if (modo === "campo") {
    if (flores.length > 0) { flores.pop(); coresFlores.pop(); }
    else if (arvores.length > 0) arvores.pop();
    else if (casasCampo.length > 0) { casasCampo.pop(); coresCasas.pop(); }
  } else {
    if (carros.length > 0) { carros.pop(); coresCarros.pop(); }
    else if (pessoas.length > 0) { pessoas.pop(); coresRoupas.pop(); }
  }
}

function drawInstructions() {
  if (!mostrarInstrucoes) return;
  
  fill(0, 0, 0, 200);
  stroke(255, 255, 255, 100);
  strokeWeight(2);
  rect(15, 15, 615, 545, 15);
  
  fill(255);
  textSize(28);
  textAlign(LEFT, TOP);
  text("🕹️ CONTROLES DO JOGO", 35, 30);
  
  const col1 = 35;
  const col2 = 280;
  const lineHeight = 30;
  let yPos = 80;
  
  textSize(20);
  text("Modo Campo 🌄", col1, yPos);
  text("Modo Cidade 🏙️", col2, yPos);
  yPos += 40;
  
  textSize(16);
  stroke(255, 255, 255, 50);
  line(col1, yPos-10, col1+200, yPos-10);
  line(col2, yPos-10, col2+200, yPos-10);
  
  text("[F] Adicionar flor", col1, yPos);
  text("[V] Adicionar carro", col2, yPos);
  yPos += lineHeight
  
  text("[Shift+F] Remover flor", col1, yPos);
  text("[Shift+V] Remover carro", col2, yPos);
  yPos += lineHeight;
  
  text("[C] Adicionar casa", col1, yPos);
  text("[P] Adicionar pessoa", col2, yPos);
  yPos += lineHeight;
  
  text("[Shift+C] Remover casa", col1, yPos);
  text("[Shift+P] Remover pessoa", col2, yPos);
  yPos += lineHeight;
  
  text("[A] Adicionar árvore", col1, yPos);
  yPos += lineHeight;
  
  text("[Shift+A] Remover árvore", col1, yPos);
  yPos += lineHeight;
  
  yPos += 20;
  textSize(20);
  text("Controles Gerais 🕹️", col1, yPos);
  yPos += 40;
 
  text("ATENÇÃO os elementos do jogo são colocados de forma aleatoria", col1, yPos);
  yPos += lineHeight;
  
  textSize(16);
  const generalControls = [
    "[ESPAÇO] Alternar entre campo/cidade",
    "[D] Alternar dia/noite",
    "[R] Remover último objeto adicionado",    
    "[+] Aumentar velocidade dos carros",
    "[-] Diminuir velocidade dos carros",
    "[i] Para sair das intruções"
  ];
  
  for (let i = 0; i < generalControls.length; i++) {
    text(generalControls[i], col1, yPos + i*lineHeight);
  }
  
  fill(0, 0, 0, 200);
  noStroke();
  rect(width - 250, 15, 235, 150, 15);
  
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text("📊 STATUS DO JOGO", width - 235, 30);
  
  textSize(16);
  text(`Modo Atual: ${modo === "campo" ? "Campo 🌄" : "Cidade 🏙️"}`, width - 235, 70);
  text(`Horário: ${dia ? "Dia ☀️" : "Noite 🌙"}`, width - 235, 100);
  text(`Carros: ${carros.length} (Vel: ${velocidadeCarro.toFixed(1)})`, width - 235, 130);
  text(`Pessoas: ${pessoas.length}`, width - 235, 160);
}

function draw() {
  handleDayNightTransition();
  background(corCenario);
  
  drawSunMoon();
  drawClouds();
  if (!dia || transitionFrames > 0) drawStars();
  
  // Texto no topo da tela
  if (!mostrarInstrucoes) {
    fill(255, 255, 255, 180);
    noStroke();
    rect(width/8 - 150, 20, 300, 40, 10);
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Clique 'i' para abrir as instruções", width/8, 40);
  }
  
  if (modo === "campo") drawCountryside();
  else drawCity();

}