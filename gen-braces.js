const fs = require('fs');
const dir = 'C:/Users/Project/Desktop/dr ananya\'s clinic/images';

function bracesSvg(title, wireOffset=0, bracketColor='#c0c0c0') {
  // 6 upper teeth with brackets and archwire
  let t = '';
  const xs = [40,70,100,130,160,190,220];
  xs.forEach(x => {
    t += `<rect x="${x}" y="60" width="22" height="46" rx="6" fill="#fff" stroke="#0e7c86" stroke-width="1.5"/>`;
    t += `<rect x="${x+4}" y="86" width="14" height="10" rx="2" fill="${bracketColor}" stroke="#888" stroke-width="1"/>`;
  });
  // archwire
  const path = `M${xs[0]+11},91 Q${(xs[0]+xs[xs.length-1])/2+11},${70+wireOffset} ${xs[xs.length-1]+11},91`;
  t += `<path d="${path}" stroke="#b8860b" stroke-width="2.5" fill="none"/>`;
  // lower teeth
  xs.forEach(x => {
    t += `<rect x="${x}" y="130" width="22" height="46" rx="6" fill="#fff" stroke="#0e7c86" stroke-width="1.5"/>`;
    t += `<rect x="${x+4}" y="134" width="14" height="10" rx="2" fill="${bracketColor}" stroke="#888" stroke-width="1"/>`;
  });
  const path2 = `M${xs[0]+11},139 Q${(xs[0]+xs[xs.length-1])/2+11},${160-wireOffset} ${xs[xs.length-1]+11},139`;
  t += `<path d="${path2}" stroke="#b8860b" stroke-width="2.5" fill="none"/>`;
  return `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="300" height="220" viewBox="0 0 300 220"><rect width="300" height="220" fill="#f5fafb"/><text x="150" y="24" text-anchor="middle" font-family="Inter,Arial" font-size="15" font-weight="600" fill="#0e7c86">${title}</text>${t}</svg>`;
}

fs.writeFileSync(dir+'/braces.svg', bracesSvg('Braces - Front View'));
fs.writeFileSync(dir+'/braces-left.svg', bracesSvg('Braces - Left View', -8));
fs.writeFileSync(dir+'/braces-right.svg', bracesSvg('Braces - Right View', 8));
console.log('done');
