import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
app.use(express.json());

const __dirname = process.cwd();

// Mock store for analytics
let totalVisits = 0;
let todayVisits = 0;
let todayToolUsage = 0;
const paths = new Map();
const tools = new Map();
const countries = new Map();

app.post('/api/visit', (req, res) => {
  totalVisits++;
  todayVisits++;
  const body = req.body || {};
  const vpath = String(body.path || '/').slice(0, 500);
  const country = 'Unknown';
  
  paths.set(vpath, (paths.get(vpath) || 0) + 1);
  countries.set(country, (countries.get(country) || 0) + 1);
  
  res.json({ ok: true });
});

app.post('/api/tool-usage', (req, res) => {
  todayToolUsage++;
  const body = req.body || {};
  const tool = String(body.tool || 'unknown').slice(0, 160);
  
  tools.set(tool, (tools.get(tool) || 0) + 1);
  
  res.json({ ok: true });
});

app.get('/api/admin/stats', (req, res) => {
  const getTop10 = (map, keyName) => Array.from(map.entries())
    .map(([k, count]) => ({ [keyName]: k, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  res.json({
    owner: 'عماد الدين لمراني',
    site: 'World PDF',
    totalVisits,
    todayVisits,
    todayToolUsage,
    topPaths: getTop10(paths, 'path'),
    topCountries: getTop10(countries, 'country'),
    topTools: getTop10(tools, 'tool')
  });
});

app.use(async (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();

  let requestPath = req.path === '/' ? '/index.html' : req.path;
  
  try {
    let filePath = path.join(__dirname, requestPath);
    let stat = await fs.stat(filePath).catch(() => null);
    
    if (!stat && !path.extname(requestPath)) {
      const htmlPath = filePath + '.html';
      const htmlStat = await fs.stat(htmlPath).catch(() => null);
      if (htmlStat) {
        filePath = htmlPath;
        stat = htmlStat;
      } else {
        const dirIndexPath = path.join(filePath, 'index.html');
        const dirIndexStat = await fs.stat(dirIndexPath).catch(() => null);
        if (dirIndexStat) {
          filePath = dirIndexPath;
          stat = dirIndexStat;
        }
      }
    }

    if (stat && stat.isFile() && filePath.endsWith('.html')) {
      let content = await fs.readFile(filePath, 'utf-8');
      if (!content.includes('/assets/js/analytics.js')) {
        content = content.replace('</body>', '    <script src="/assets/js/analytics.js" defer></script>\n</body>');
      }
      res.setHeader('Content-Type', 'text/html');
      return res.send(content);
    }
  } catch (e) {
    // Fallthrough to express.static
  }
  next();
});

app.use(express.static(__dirname));

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
