import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const componentsDir = 'd:/DAST/figma/src/components';

walkDir(componentsDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Prepend "use client" if it uses hooks or next/navigation
    if (content.includes('useState') || content.includes('useEffect') || content.includes('useNavigate') || content.includes('onClick')) {
      if (!content.includes('"use client"')) {
        content = '"use client";\n\n' + content;
      }
    }

    // 2. Replace react-router with next/link and next/navigation
    // import { Link, useNavigate } from 'react-router';
    // const navigate = useNavigate(); -> const router = useRouter();
    content = content.replace(/import\s+{[^}]*useNavigate[^}]*}\s+from\s+['"]react-router['"];?/, "import { useRouter } from 'next/navigation';");
    content = content.replace(/import\s+{[^}]*Link[^}]*}\s+from\s+['"]react-router['"];?/, "import Link from 'next/link';");
    
    // Handle combined imports: import { Link, useNavigate } from 'react-router';
    if (content.includes("from 'react-router'")) {
       let m = content.match(/import\s+{([^}]+)}\s+from\s+['"]react-router['"];?/);
       if (m) {
         let imports = m[1].split(',').map(s => s.trim());
         let nextImports = [];
         if (imports.includes('Link')) nextImports.push("import Link from 'next/link';");
         if (imports.includes('useNavigate')) nextImports.push("import { useRouter } from 'next/navigation';");
         content = content.replace(m[0], nextImports.join('\n'));
       }
    }

    content = content.replace(/useNavigate\(\)/g, "useRouter()");
    content = content.replace(/const navigate =/g, "const router =");
    content = content.replace(/navigate\(/g, "router.push(");

    // 3. Replace <Link to="..."> with <Link href="...">
    content = content.replace(/<Link\s+([^>]*)to=/g, "<Link $1href=");

    // 4. Fix mockData relative imports. 
    // They were in `src/app/components/*/*` pointing to `../../mockData`.
    // Now they are in `src/components/*/*` pointing to `../../mockData` which correctly resolves to `src/mockData`. Wait, `src/components/dashboard/DashboardHome.tsx` -> `../../mockData` -> `src/mockData`. That's correct!
    // So no change needed for mockData path.

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Migrated:', filePath);
    }
  }
});
