const picker = document.getElementById("picker");
const preview = document.getElementById("preview");
const hexInput = document.getElementById("hex");
const rgbInput = document.getElementById("rgb");
const hslInput = document.getElementById("hsl");
const bigCode = document.getElementById("bigCode");
const toast = document.getElementById("toast");
const csvBtn = document.getElementById("csvBtn");
const modeBtn = document.getElementById("modeBtn");
const copyButtons = document.querySelectorAll(".copy-btn");


let dark = true;


function updateTheme() {
  if (dark) {
    document.documentElement.style.setProperty("--bg", "#1e1e1e");
    document.documentElement.style.setProperty("--panel", "#2b2b2b");
    document.documentElement.style.setProperty("--text", "#fff");
    document.documentElement.style.setProperty("--input-text", "#0f0");
    modeBtn.textContent = "ライトモード";
  } else {
    document.documentElement.style.setProperty("--bg", "#f5f5f5");
    document.documentElement.style.setProperty("--panel", "#ffffff");
    document.documentElement.style.setProperty("--text", "#000");
    document.documentElement.style.setProperty("--input-text", "#008000");
    modeBtn.textContent = "ダークモード";
  }
}


modeBtn.addEventListener("click", () => {
  dark = !dark;
  updateTheme();
});


updateTheme();


async function copyValue(id) {
  const val = document.getElementById(id).value;
  if (!val) return;
  try {
    await navigator.clipboard.writeText(val);
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1000);
  } catch (err) {
    console.error("Failed to copy!", err);
  }
}


copyButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    copyValue(target);
  });
});


function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}


function updateValues(hex) {
  preview.style.backgroundColor = hex;
  picker.value = hex;
  hexInput.value = hex.toUpperCase();
  bigCode.textContent = hex.toUpperCase();


  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);


  rgbInput.value = `rgb(${r}, ${g}, ${b})`;
  hslInput.value = rgbToHsl(r, g, b);
}


picker.addEventListener("input", e => updateValues(e.target.value));


csvBtn.addEventListener("click", () => {
  const csv = `HEX,RGB,HSL\n${hexInput.value},${rgbInput.value},${hslInput.value}`;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "color_codes.csv";
  a.click();
  URL.revokeObjectURL(url);
});


updateValues(picker.value);