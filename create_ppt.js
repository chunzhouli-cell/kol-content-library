const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Meshy KOL Team";
pres.title = "Meshy Gallery - Visual Global Content Community";

// Color palette
const C = {
  bg: "0D0D0D",
  bgSub: "1A1A1A",
  bgCard: "222222",
  accent: "C5F955",    // lime green
  pink: "FF3E8F",
  gold: "FFD200",
  white: "FFFFFF",
  gray: "9CA3AF",
  grayLight: "6B7280",
  grayDark: "374151",
};

function addBg(slide) {
  slide.background = { color: C.bg };
}

function addFooter(slide, pageNum, total) {
  slide.addText("MESHY GALLERY", {
    x: 0.5, y: 5.15, w: 3, h: 0.3,
    fontSize: 8, fontFace: "Arial", color: C.grayLight,
    charSpacing: 3, bold: true,
  });
  slide.addText(`${pageNum} / ${total}`, {
    x: 7.5, y: 5.15, w: 2, h: 0.3,
    fontSize: 8, fontFace: "Arial", color: C.grayLight,
    align: "right",
  });
}

// ======== SLIDE 1: Title ========
let s1 = pres.addSlide();
addBg(s1);
// Accent line
s1.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 0.04, fill: { color: C.accent },
});
s1.addText([
  { text: "Meshy", options: { color: C.accent, bold: true } },
  { text: " Gallery", options: { color: C.white, bold: true } },
], {
  x: 0.8, y: 1.2, w: 8, h: 1.2,
  fontSize: 52, fontFace: "Arial",
  margin: 0,
});
s1.addText("A Visual Global Content Community", {
  x: 0.8, y: 2.4, w: 8, h: 0.6,
  fontSize: 20, fontFace: "Arial", color: C.gray,
  italic: true,
});
// Decorative pink line
s1.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 3.2, w: 1.5, h: 0.04, fill: { color: C.pink },
});
s1.addText("KOL Growth Team  ·  2026", {
  x: 0.8, y: 3.5, w: 5, h: 0.4,
  fontSize: 12, fontFace: "Arial", color: C.grayLight,
});

// ======== SLIDE 2: The Problem ========
let s2 = pres.addSlide();
addBg(s2);
addFooter(s2, 2, 10);
s2.addText("THE PROBLEM", {
  x: 0.8, y: 0.4, w: 8, h: 0.5,
  fontSize: 10, fontFace: "Arial", color: C.pink,
  bold: true, charSpacing: 4,
});
s2.addText("Data vs. Visual Assets:\nA Gulf Between Two Worlds", {
  x: 0.8, y: 0.9, w: 8, h: 1.0,
  fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
  lineSpacingMultiple: 1.2,
});
// Three pain point cards
const pains = [
  { icon: "ADS", title: "Ad Team", desc: "Needs to visually browse assets for campaign clip selection" },
  { icon: "KOL", title: "KOL Team", desc: "Needs to review videos to summarize creative ideas & optimize integration" },
  { icon: "BIZ", title: "Sales Team", desc: "Needs compelling good cases to make persuasive client pitches" },
];
pains.forEach((p, i) => {
  const x = 0.8 + i * 3.0;
  // Card bg
  s2.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 2.3, w: 2.7, h: 2.4,
    fill: { color: C.bgSub }, rectRadius: 0.12,
    line: { color: "333333", width: 1 },
  });
  // Icon badge
  s2.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.2, y: 2.5, w: 0.7, h: 0.35,
    fill: { color: i === 0 ? C.pink : i === 1 ? C.accent : C.gold },
    rectRadius: 0.06,
  });
  s2.addText(p.icon, {
    x: x + 0.2, y: 2.5, w: 0.7, h: 0.35,
    fontSize: 9, fontFace: "Arial", color: i === 1 ? "000000" : C.white,
    bold: true, align: "center", valign: "middle", margin: 0,
  });
  s2.addText(p.title, {
    x: x + 0.2, y: 3.05, w: 2.3, h: 0.4,
    fontSize: 16, fontFace: "Arial", color: C.white, bold: true, margin: 0,
  });
  s2.addText(p.desc, {
    x: x + 0.2, y: 3.45, w: 2.3, h: 1.0,
    fontSize: 11, fontFace: "Arial", color: C.gray, lineSpacingMultiple: 1.4,
    margin: 0,
  });
});

// ======== SLIDE 3: The Solution ========
let s3 = pres.addSlide();
addBg(s3);
addFooter(s3, 3, 10);
s3.addText("THE SOLUTION", {
  x: 0.8, y: 0.4, w: 8, h: 0.5,
  fontSize: 10, fontFace: "Arial", color: C.accent,
  bold: true, charSpacing: 4,
});
s3.addText([
  { text: "Meshy Gallery", options: { color: C.accent, bold: true } },
], {
  x: 0.8, y: 0.9, w: 8, h: 0.7,
  fontSize: 32, fontFace: "Arial",
});
s3.addText("Our own \"Xiaohongshu\" — see how the world's most creative people use Meshy.", {
  x: 0.8, y: 1.6, w: 7, h: 0.6,
  fontSize: 14, fontFace: "Arial", color: C.gray, italic: true,
  lineSpacingMultiple: 1.4,
});
// Screenshot placeholder
s3.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 2.5, w: 8.4, h: 2.5,
  fill: { color: C.bgSub }, rectRadius: 0.12,
  line: { color: "333333", width: 1 },
});
s3.addText("[ Dashboard Screenshot ]", {
  x: 0.8, y: 2.5, w: 8.4, h: 2.5,
  fontSize: 14, fontFace: "Arial", color: C.grayLight,
  align: "center", valign: "middle",
});

// ======== SLIDE 4: Dashboard Analytics ========
let s4 = pres.addSlide();
addBg(s4);
addFooter(s4, 4, 10);
s4.addText("ANALYTICS DASHBOARD", {
  x: 0.8, y: 0.4, w: 8, h: 0.5,
  fontSize: 10, fontFace: "Arial", color: C.accent,
  bold: true, charSpacing: 4,
});
s4.addText("Three Dimensions of Insight", {
  x: 0.8, y: 0.9, w: 8, h: 0.7,
  fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
});
const dashboards = [
  { title: "Category Views", stat: "57.1M", desc: "Total views across all content categories" },
  { title: "Platform Distribution", stat: "278", desc: "KOL partners across 7 platforms" },
  { title: "Language Analytics", stat: "11", desc: "Languages covering global markets" },
];
dashboards.forEach((d, i) => {
  const x = 0.8 + i * 3.0;
  s4.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 1.9, w: 2.7, h: 2.8,
    fill: { color: C.bgSub }, rectRadius: 0.12,
    line: { color: "333333", width: 1 },
  });
  s4.addText(d.stat, {
    x: x, y: 2.2, w: 2.7, h: 0.9,
    fontSize: 40, fontFace: "Arial", color: C.accent,
    bold: true, align: "center", valign: "middle", margin: 0,
  });
  s4.addText(d.title, {
    x: x + 0.3, y: 3.2, w: 2.1, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: C.white, bold: true, margin: 0,
  });
  s4.addText(d.desc, {
    x: x + 0.3, y: 3.6, w: 2.1, h: 0.8,
    fontSize: 10, fontFace: "Arial", color: C.gray,
    lineSpacingMultiple: 1.4, margin: 0,
  });
});

// ======== SLIDE 5: Gallery & Filters ========
let s5 = pres.addSlide();
addBg(s5);
addFooter(s5, 5, 10);
s5.addText("CONTENT GALLERY", {
  x: 0.8, y: 0.4, w: 8, h: 0.5,
  fontSize: 10, fontFace: "Arial", color: C.accent,
  bold: true, charSpacing: 4,
});
s5.addText("Smart Filtering & Rich Video Cards", {
  x: 0.8, y: 0.9, w: 8, h: 0.7,
  fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
});
// Filter chips mockup
const filters = [
  { label: "Platform", items: "Instagram · YT Shorts · TikTok · Twitter/X" },
  { label: "Language", items: "English · Korean · Japanese · French · Hindi" },
  { label: "Category", items: "General · 3D Print · Visual Art/VFX · Game Dev" },
  { label: "Month", items: "Mar 2026 · Feb 2026 · Jan 2026 · Dec 2025" },
  { label: "Ad Rights", items: "IG Partnership · TT Spark · YTB Ads · Upload" },
];
filters.forEach((f, i) => {
  const y = 1.8 + i * 0.45;
  s5.addText(f.label.toUpperCase(), {
    x: 0.8, y: y, w: 1.2, h: 0.35,
    fontSize: 8, fontFace: "Arial", color: C.grayLight,
    bold: true, charSpacing: 2, valign: "middle", margin: 0,
  });
  s5.addText(f.items, {
    x: 2.0, y: y, w: 7, h: 0.35,
    fontSize: 10, fontFace: "Arial", color: C.gray,
    valign: "middle", margin: 0,
  });
});
// Card info
s5.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 4.1, w: 8.4, h: 1.0,
  fill: { color: C.bgSub }, rectRadius: 0.08,
});
s5.addText("Each card shows: Platform · Thumbnail · Views · KOL Name · Date · Category · Ad Rights · Associated 3D Models", {
  x: 1.0, y: 4.1, w: 8, h: 1.0,
  fontSize: 11, fontFace: "Arial", color: C.gray,
  valign: "middle", margin: 0,
});

// ======== SLIDE 6: Curation - AI Can't Score Creativity ========
let s6 = pres.addSlide();
addBg(s6);
addFooter(s6, 6, 10);
s6.addText("CURATION", {
  x: 0.8, y: 0.4, w: 8, h: 0.5,
  fontSize: 10, fontFace: "Arial", color: C.gold,
  bold: true, charSpacing: 4,
});
s6.addText("Can AI Score Creativity?", {
  x: 0.8, y: 1.0, w: 8, h: 0.8,
  fontSize: 32, fontFace: "Arial", color: C.white, bold: true,
});
s6.addText("No, it can't.", {
  x: 0.8, y: 1.8, w: 8, h: 0.6,
  fontSize: 24, fontFace: "Arial", color: C.pink, bold: true,
});
s6.addText("So we built a human curation system:", {
  x: 0.8, y: 2.5, w: 8, h: 0.4,
  fontSize: 14, fontFace: "Arial", color: C.gray,
});
// Two curation features
const curations = [
  { title: "KOL Team's Pick", desc: "Hand-picked best content by the team.\nRecommend → curated showcase.", color: C.gold },
  { title: "Meshy Archives", desc: "Museum-style gallery of masterpieces.\nGold frames, brass plaques, horizontal scroll.", color: C.accent },
];
curations.forEach((c, i) => {
  const x = 0.8 + i * 4.5;
  s6.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 3.2, w: 4.0, h: 1.8,
    fill: { color: C.bgSub }, rectRadius: 0.12,
    line: { color: "333333", width: 1 },
  });
  s6.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 3.2, w: 0.06, h: 1.8,
    fill: { color: c.color },
  });
  s6.addText(c.title, {
    x: x + 0.3, y: 3.4, w: 3.5, h: 0.4,
    fontSize: 16, fontFace: "Arial", color: c.color, bold: true, margin: 0,
  });
  s6.addText(c.desc, {
    x: x + 0.3, y: 3.85, w: 3.5, h: 0.9,
    fontSize: 11, fontFace: "Arial", color: C.gray,
    lineSpacingMultiple: 1.5, margin: 0,
  });
});

// ======== SLIDE 7: Internal Value ========
let s7 = pres.addSlide();
addBg(s7);
addFooter(s7, 7, 10);
s7.addText("BUSINESS VALUE", {
  x: 0.8, y: 0.4, w: 8, h: 0.5,
  fontSize: 10, fontFace: "Arial", color: C.accent,
  bold: true, charSpacing: 4,
});
s7.addText("Internal Perspective", {
  x: 0.8, y: 0.9, w: 8, h: 0.7,
  fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
});
const internal = [
  { team: "KOL", color: C.accent, desc: "Better content planning, avoid homogenization" },
  { team: "Ads", color: C.pink, desc: "Save time, efficient asset selection & placement\nIntegrate ad data → closed-loop optimization" },
  { team: "Sales", color: C.gold, desc: "Precise, vivid good cases for client pitches" },
  { team: "Event", color: "60A5FA", desc: "Pick showcase videos directly for exhibitions" },
];
internal.forEach((t, i) => {
  const y = 1.8 + i * 0.9;
  // Team badge
  s7.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: y, w: 1.0, h: 0.35,
    fill: { color: t.color }, rectRadius: 0.06,
  });
  s7.addText(t.team, {
    x: 0.8, y: y, w: 1.0, h: 0.35,
    fontSize: 10, fontFace: "Arial", color: t.color === C.accent || t.color === C.gold ? "000000" : C.white,
    bold: true, align: "center", valign: "middle", margin: 0,
  });
  s7.addText(t.desc, {
    x: 2.0, y: y, w: 7, h: 0.7,
    fontSize: 12, fontFace: "Arial", color: C.gray,
    lineSpacingMultiple: 1.4, valign: "top", margin: 0,
  });
});
// Closed loop diagram
s7.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 4.4, w: 8.4, h: 0.8,
  fill: { color: C.bgSub }, rectRadius: 0.08,
});
s7.addText([
  { text: "Asset Selection", options: { color: C.accent, bold: true } },
  { text: "  →  ", options: { color: C.grayLight } },
  { text: "Ad Placement", options: { color: C.pink, bold: true } },
  { text: "  →  ", options: { color: C.grayLight } },
  { text: "Performance Feedback", options: { color: C.gold, bold: true } },
  { text: "  →  ", options: { color: C.grayLight } },
  { text: "Targeted Optimization", options: { color: C.accent, bold: true } },
], {
  x: 0.8, y: 4.4, w: 8.4, h: 0.8,
  fontSize: 13, fontFace: "Arial", align: "center", valign: "middle", margin: 0,
});

// ======== SLIDE 8: External Value ========
let s8 = pres.addSlide();
addBg(s8);
addFooter(s8, 8, 10);
s8.addText("BUSINESS VALUE", {
  x: 0.8, y: 0.4, w: 8, h: 0.5,
  fontSize: 10, fontFace: "Arial", color: C.pink,
  bold: true, charSpacing: 4,
});
s8.addText("External Perspective", {
  x: 0.8, y: 0.9, w: 8, h: 0.7,
  fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
});
// Bridge diagram
s8.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.8, w: 3.5, h: 1.2,
  fill: { color: C.bgSub }, rectRadius: 0.12,
  line: { color: C.accent, width: 1 },
});
s8.addText("On-Platform\nModel Community", {
  x: 0.8, y: 1.8, w: 3.5, h: 1.2,
  fontSize: 14, fontFace: "Arial", color: C.accent,
  bold: true, align: "center", valign: "middle", lineSpacingMultiple: 1.3,
});
// Arrow
s8.addText("⟷", {
  x: 4.3, y: 1.8, w: 1.4, h: 1.2,
  fontSize: 28, fontFace: "Arial", color: C.grayLight,
  align: "center", valign: "middle",
});
s8.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 5.7, y: 1.8, w: 3.5, h: 1.2,
  fill: { color: C.bgSub }, rectRadius: 0.12,
  line: { color: C.pink, width: 1 },
});
s8.addText("Off-Platform\nCreator Square · Artists\nIn-house Creators", {
  x: 5.7, y: 1.8, w: 3.5, h: 1.2,
  fontSize: 13, fontFace: "Arial", color: C.pink,
  bold: true, align: "center", valign: "middle", lineSpacingMultiple: 1.3,
});
// Value points
const external = [
  "Attract off-platform users → convert to on-platform community users",
  "Show real-world model applications → inspire in-house creators",
  "Build UGC/PUGC pool → endless ad & content supply",
  "Accumulate posts → bulk SEO/GEO content contribution",
  "In-house creator matrix → UGC Growth Engine",
];
external.forEach((e, i) => {
  const y = 3.3 + i * 0.4;
  s8.addText("→", {
    x: 0.8, y: y, w: 0.3, h: 0.35,
    fontSize: 12, fontFace: "Arial", color: C.accent, margin: 0,
  });
  s8.addText(e, {
    x: 1.2, y: y, w: 8, h: 0.35,
    fontSize: 11, fontFace: "Arial", color: C.gray, margin: 0, valign: "middle",
  });
});

// ======== SLIDE 9: Flywheel ========
let s9 = pres.addSlide();
addBg(s9);
addFooter(s9, 9, 10);
s9.addText("THE FLYWHEEL", {
  x: 0.8, y: 0.4, w: 8, h: 0.5,
  fontSize: 10, fontFace: "Arial", color: C.accent,
  bold: true, charSpacing: 4,
});
s9.addText("UGC Growth Engine", {
  x: 0.8, y: 0.9, w: 8, h: 0.7,
  fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
});
// Circular flow
const steps = [
  { label: "Multimedia\nAssets", x: 4.2, y: 1.8, color: C.accent },
  { label: "Attract\nExternal Users", x: 7.0, y: 2.6, color: C.pink },
  { label: "Convert to\nCommunity Users", x: 7.0, y: 3.8, color: C.gold },
  { label: "In-house\nCreators", x: 4.2, y: 4.2, color: C.accent },
  { label: "UGC/PUGC\nContent Pool", x: 1.5, y: 3.8, color: C.pink },
  { label: "SEO/GEO\n& Ad Supply", x: 1.5, y: 2.6, color: C.gold },
];
steps.forEach((st) => {
  s9.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: st.x, y: st.y, w: 2.0, h: 0.8,
    fill: { color: C.bgSub }, rectRadius: 0.1,
    line: { color: st.color, width: 1 },
  });
  s9.addText(st.label, {
    x: st.x, y: st.y, w: 2.0, h: 0.8,
    fontSize: 10, fontFace: "Arial", color: st.color,
    bold: true, align: "center", valign: "middle",
    lineSpacingMultiple: 1.2, margin: 0,
  });
});

// ======== SLIDE 10: Thank You ========
let s10 = pres.addSlide();
addBg(s10);
s10.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 5.585, w: 10, h: 0.04, fill: { color: C.accent },
});
s10.addText([
  { text: "Meshy", options: { color: C.accent } },
  { text: " Gallery", options: { color: C.white } },
], {
  x: 0.8, y: 1.5, w: 8, h: 1.0,
  fontSize: 44, fontFace: "Arial", bold: true, margin: 0,
});
s10.addText("Where data meets creativity.", {
  x: 0.8, y: 2.5, w: 8, h: 0.6,
  fontSize: 18, fontFace: "Arial", color: C.gray, italic: true,
});
s10.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 3.3, w: 1.5, h: 0.04, fill: { color: C.pink },
});
s10.addText("Thank you.", {
  x: 0.8, y: 3.6, w: 8, h: 0.5,
  fontSize: 16, fontFace: "Arial", color: C.grayLight,
});

// Save
const outPath = "/Users/chunzhouli/Downloads/Meshy-Gallery-Intro.pptx";
pres.writeFile({ fileName: outPath }).then(() => {
  console.log("PPT saved to: " + outPath);
}).catch(err => {
  console.error("Error:", err);
});
