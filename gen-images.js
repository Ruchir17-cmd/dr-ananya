const fs = require('fs');
const dir = 'C:/Users/Project/Desktop/dr ananya\'s clinic/images';

function svg(title, upperYs, lowerYs, upperXs, lowerXs, gap) {
  // upperYs: array of y for upper teeth; lowerYs for lower
  let teeth = '';
  upperXs.forEach((x,i) => {
    teeth += `<rect x="${x}" y="${upperYs[i]}" width="16" height="34" rx="5" fill="#fff" stroke="#0e7c86" stroke-width="1.5"/>`;
  });
  lowerXs.forEach((x,i) => {
    teeth += `<rect x="${x}" y="${lowerYs[i]}" width="16" height="30" rx="5" fill="#fff" stroke="#0e7c86" stroke-width="1.5"/>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220" viewBox="0 0 400 220">
  <rect width="400" height="220" fill="#eaf6f7"/>
  <text x="200" y="24" text-anchor="middle" font-family="Inter,Arial" font-size="16" font-weight="600" fill="#0e7c86">${title}</text>
  ${teeth}
  <line x1="40" y1="110" x2="360" y2="110" stroke="#b8d8db" stroke-dasharray="4 4"/>
</svg>`;
}

const sets = [
  // crossbite
  { name:'crossbite', before:{u:[30,50,70,90,110,130], uy:[40,38,36,36,38,40], l:[30,50,70,90,110,130], ly:[120,118,116,116,118,120], ut:[0,0,0,0,0,0] } },
];

// Simpler: define explicit before/after x arrays
const cases = [
  { key:'crossbite', beforeUpperX:[40,62,84,106,128,150], beforeUpperY:[40,38,36,36,38,40],
    beforeLowerX:[30,52,74,96,118,140], beforeLowerY:[118,116,114,114,116,118],
    afterUpperX:[34,56,78,100,122,144], afterUpperY:[40,38,36,36,38,40],
    afterLowerX:[34,56,78,100,122,144], afterLowerY:[118,116,114,114,116,118] },
  { key:'crowding', beforeUpperX:[38,52,66,82,96,110,124], beforeUpperY:[38,34,30,36,30,34,38],
    beforeLowerX:[40,62,84,106,128,150], beforeLowerY:[118,116,114,114,116,118],
    afterUpperX:[34,56,78,100,122,144,166], afterUpperY:[38,36,34,34,36,38,40],
    afterLowerX:[34,56,78,100,122,144], afterLowerY:[118,116,114,114,116,118] },
  { key:'spacing', beforeUpperX:[30,62,94,126,158], beforeUpperY:[40,38,36,38,40],
    beforeLowerX:[32,64,96,128,160], beforeLowerY:[118,116,114,116,118],
    afterUpperX:[40,66,92,118,144], afterUpperY:[40,38,36,38,40],
    afterLowerX:[40,66,92,118,144], afterLowerY:[118,116,114,116,118] },
  { key:'overbite', beforeUpperX:[34,56,78,100,122,144], beforeUpperY:[28,26,24,24,26,28],
    beforeLowerX:[34,56,78,100,122,144], beforeLowerY:[100,98,96,96,98,100],
    afterUpperX:[34,56,78,100,122,144], afterUpperY:[38,36,34,34,36,38],
    afterLowerX:[34,56,78,100,122,144], afterLowerY:[118,116,114,114,116,118] },
];

for (const c of cases) {
  const before = svg(`Before: ${c.key}`, c.beforeUpperY, c.beforeLowerY, c.beforeUpperX, c.beforeLowerX);
  const after = svg(`After: ${c.key}`, c.afterUpperY, c.afterLowerY, c.afterUpperX, c.afterLowerX);
  fs.writeFileSync(`${dir}/before-${c.key}.svg`, before);
  fs.writeFileSync(`${dir}/after-${c.key}.svg`, after);
}
console.log('generated');
