const c = document.getElementById("c");
const ctx = c.getContext("2d");

// Make canvas fullscreen
c.height = window.innerHeight;
c.width = window.innerWidth;

let hueFw = false;
let hue = -0.01;

let columns = 0; // number of columns for the rain
let drops = []; // an array of drops - one per column

const init = () =>
{
  settings.characterArray = settings.characters.split("");
  settings.tailLength = settings.tailLengthBase / settings.tailLengthDivider;
  columns = c.width / settings.fontSize;
  drops = [];

  // x below is the x coordinate
  // 1 = y-coordinate of the drop (same for every drop initially)
  for (let x = 0; x < columns; x++)
  {
    drops[x] = 1;
  }
}

const draw = () =>
{
  if (settings.newSettings)
  {
    settings.newSettings = false;
    init();
  }

  // Get the BG color based on the current time i.e. rgb(hh, mm, ss)
  // translucent BG to show trail

  // ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillStyle = `rgba(0, 0, 0, ${settings.tailLength})`;
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.fillStyle = "#BBB"; // grey text
  ctx.font = `${settings.fontSize}px arial`;

  // looping over drops
  for (let i = 0; i < drops.length; i++)
  {
    // background color
    ctx.fillStyle = "rgba(10, 10, 10, 1)";
    ctx.fillRect(i * settings.fontSize, drops[i] * settings.fontSize, settings.fontSize, settings.fontSize);
    // a random chinese character to print
    const text = settings.characterArray[Math.floor(Math.random() * settings.characterArray.length)];
    // x = i * settings.fontSize, y = value of drops[i] * settings.fontSize

    let targetRed = settings.characterColour.r;
    let targetGreen = settings.characterColour.g;
    let targetBlue = settings.characterColour.b;

    if (settings.colourChange) {
      hue += (hueFw) ? 0.01 : -0.01;
      targetRed = Math.floor(127 * Math.sin(settings.colourSpeed * hue + 0) + 128);
      targetGreen = Math.floor(127 * Math.sin(settings.colourSpeed * hue + 2) + 128);
      targetBlue = Math.floor(127 * Math.sin(settings.colourSpeed * hue + 4) + 128);
    }

    ctx.fillStyle = `rgba(${targetRed}, ${targetGreen}, ${targetBlue})`;
    ctx.fillText(text, i * settings.fontSize, drops[i] * settings.fontSize);

    // Incrementing Y coordinate
    drops[i]++;
    // sending the drop back to the top randomly after it has crossed the screen
    // adding randomness to the reset to make the drops scattered on the Y axis
    if (drops[i] * settings.fontSize > c.height && Math.random() > 0.975 - settings.randomOffset)
    {
      drops[i] = 0;
    }
  }
}

const hexToRgb = (hex) =>
{
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}


let intervalReference = 0;
intervalReference = setInterval(draw, settings.rainSpeedMs);


const livelyPropertyListener = (name, val) =>
{
  let safeValue = val;
  if (name === "characterColour")
  {
    safeValue = hexToRgb(val);
  }
  if (name === "colourSpeed")
  {
    safeValue = val / 1000;
  }
  if (name === "rainSpeedMs")
  {
    safeValue = 100 - val;
  }
  if (name === "randomOffset")
  {
    safeValue = val / 100;
  }
  if (name === "tailLengthBase")
  {
    safeValue = (100 - val);
  }

  settings[name] = safeValue;
  settings.newSettings = true;

  clearInterval(intervalReference);
  intervalReference = setInterval(draw, settings.rainSpeedMs);
}