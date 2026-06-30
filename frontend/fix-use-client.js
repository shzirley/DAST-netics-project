const fs = require('fs');
const path = require('path');

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if(fs.statSync(p).isDirectory()) walk(p);
    else if(p.endsWith('.tsx') || p.endsWith('.ts')) {
      let content = fs.readFileSync(p, 'utf8');
      
      const useClientRegex = /['"]use client['"];?[\r\n]+/;
      const match = content.match(useClientRegex);
      
      if (match && match.index > 0) {
        // It's not at the very beginning
        content = content.replace(useClientRegex, '');
        content = '"use client";\n' + content;
        fs.writeFileSync(p, content);
      }
    }
  });
}
walk('d:/DAST/figma/src');
