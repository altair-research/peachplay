"""68E data preparation only; never imported by the app.

Usage: python src/data/gap3-econ/build-pack.py SOURCE_DIRECTORY
SOURCE_DIRECTORY contains downloaded PDFs and ne_110m GeoJSON using the
68e-* names listed below. Requires Pillow and Poppler for optional previews.
No network requests. No game, question bank, or app registration.
"""
import hashlib
import json
import math
import sys
from pathlib import Path
from xml.sax.saxutils import escape
from PIL import Image

ROOT = Path(__file__).resolve().parent
SOURCE = Path(sys.argv[1])
DATE = '2026-10-20'

def write_json(name, data):
    (ROOT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

# Categories, not invented exact values. Visually transcribed against atlas
# 1925 plate 281 panel 4 (both years) and 1914 plate 410 panel 1 / 1925 plate 350 panel 1.
# Corn: <100m, 100m to <200m, >=200m bushels. Unselected states remain null.
corn_states = 'IA IL NE IN OH MO TX MN KY TN SD PA KS OK GA MI WI AL VA NC'.split()
corn = {year: {s: 0 for s in corn_states} for year in ('1909', '1919')}
for year in corn:
    for state in ['IA', 'IL']:
        corn[year][state] = 2
    for state in ['NE', 'IN', 'OH', 'MO']:
        corn[year][state] = 1
corn['1909']['KS'] = 1
corn['1919']['TX'] = 1

raw = json.loads((SOURCE / '68e-states.geojson').read_text(encoding='utf-8'))
features = [f for f in raw['features'] if f['properties'].get('postal') not in ('AK', 'HI', 'DC')]
assert len(features) == 48
states = sorted(f['properties']['postal'] for f in features)
# Manufacturing: nominal product value <750m, 750m to <5bn, >=5bn dollars.
manufacturing = {year: dict.fromkeys(states, 0) for year in ('1909', '1919')}
for state in 'NY PA IL MA OH NJ'.split():
    manufacturing['1909'][state] = 1
for state in 'NY PA IL OH'.split():
    manufacturing['1919'][state] = 2
for state in 'WA CA MN WI MI IN MO MA CT NJ KS TX NC MD'.split():
    manufacturing['1919'][state] = 1

# Identical Albers equal-area projection, extent, and rounding for all four maps.
p1, p2, lat0, lon0 = map(math.radians, [29.5, 45.5, 37.5, -96])
n = (math.sin(p1) + math.sin(p2)) / 2
c = math.cos(p1) ** 2 + 2 * n * math.sin(p1)
rho0 = math.sqrt(c - 2 * n * math.sin(lat0)) / n

def project(point):
    lon, lat = map(math.radians, point[:2])
    rho = math.sqrt(c - 2 * n * math.sin(lat)) / n
    theta = n * (lon - lon0)
    return rho * math.sin(theta), -(rho0 - rho * math.cos(theta))

def rings(f):
    g = f['geometry']
    return g['coordinates'] if g['type'] == 'Polygon' else [r for p in g['coordinates'] for r in p]

points = [project(p) for f in features for ring in rings(f) for p in ring]
xmin, xmax = min(p[0] for p in points), max(p[0] for p in points)
ymin, ymax = min(p[1] for p in points), max(p[1] for p in points)
scale = min(920 / (xmax-xmin), 490 / (ymax-ymin))

def xy(p):
    x, y = project(p)
    return round(40 + (x-xmin)*scale, 2), round(64 + (y-ymin)*scale, 2)

geometries = []
for f in features:
    paths = []
    for ring in rings(f):
        pts = [xy(p) for p in ring]
        paths.append('M' + 'L'.join(f'{x},{y}' for x,y in pts) + 'Z')
    geometries.append({'id': f['properties']['postal'], 'name': f['properties']['name'], 'path': ''.join(paths)})
write_json('state-paths.json', {'viewBox': [0,0,1000,650], 'projection': 'Albers equal-area, parallels 29.5/45.5, origin 37.5/-96', 'boundaryVintage': 'Natural Earth current generalized boundaries; not reconstructed historical boundaries', 'states': geometries})

legends = {'corn': ['<100 million', '100 to <200 million', '200 million or more'], 'manufacturing': ['<750 million', '750 million to <5 billion', '5 billion or more']}
for subject, series in [('corn', corn), ('manufacturing', manufacturing)]:
    for year, values in series.items():
        title = f'{"Corn production" if subject == "corn" else "Manufactured product value"} - {year}'
        svg = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 650" role="img" aria-labelledby="title desc">', f'<title id="title">{title}</title>', '<desc id="desc">Adapted from U.S. Census Bureau historical statistics. Natural Earth boundaries. Category values, not exact quantities. Same projection and legend in both years.</desc>', '<defs><pattern id="mid" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#c8dfe6"/><path d="M-2 2L2-2M0 8L8 0M6 10L10 6" stroke="#356475" stroke-width="1"/></pattern><pattern id="missing" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#eee"/><circle cx="4" cy="4" r="1" fill="#999"/></pattern></defs>', '<rect width="1000" height="650" fill="white"/>', f'<text x="40" y="32" font-family="sans-serif" font-size="26">{title}</text>']
        fills = ['#f7fbfc', 'url(#mid)', '#214b5c']
        for g in geometries:
            cat = values.get(g['id'])
            fill = 'url(#missing)' if cat is None else fills[cat]
            label = 'outside selected source extract' if cat is None else legends[subject][cat]
            svg.append(f'<path id="{g["id"]}" d="{g["path"]}" fill="{fill}" fill-rule="evenodd" stroke="#263d45" stroke-width="1"><title>{escape(g["name"])}: {escape(label)}</title></path>')
        unit = 'bushels; 20 selected states only' if subject == 'corn' else 'nominal dollars; all manufacturing, not steel alone'
        for i, label in enumerate(legends[subject]):
            x = 40 + i*310
            svg.append(f'<rect x="{x}" y="562" width="22" height="22" fill="{fills[i]}" stroke="#263d45"/><text x="{x+30}" y="580" font-family="sans-serif" font-size="19">{escape(label)}</text>')
        if subject == 'corn':
            svg.append('<text x="40" y="55" font-family="sans-serif" font-size="17">Dotted states: outside the 20-state extract; not zero.</text>')
        svg += [f'<text x="40" y="612" font-family="sans-serif" font-size="18">{unit}</text>', '<text x="40" y="638" font-family="sans-serif" font-size="15">Source: U.S. Census Bureau; map adaptation: PeachPlay; boundaries: Natural Earth.</text>', '</svg>']
        (ROOT / f'{subject}-{year}.svg').write_text('\n'.join(svg), encoding='utf-8')

write_json('observations.json', {'schemaVersion':1, 'reviewedOn':DATE, 'reviewer':'Codex 68E (single reviewer; no independent expert sign-off)', 'valueType':'ordinal category only; do not infer exact values or within-category changes', 'corn': {'unit':'bushels', 'source':'atlas1925-agriculture:plate281-panel4', 'selectedStates':corn_states, 'missingMeans':'not transcribed, never zero', 'boundaries':[0,100000000,200000000], 'years':corn}, 'manufacturing': {'unit':'nominal US dollars of manufactured products', 'sources':{'1909':'atlas1914-manufactures:plate410-panel1', '1919':'atlas1925-manufactures:plate350-panel1'}, 'boundaries':[0,750000000,5000000000], 'years':manufacturing, 'warnings':['Not value added, employment, or physical production.', 'Do not claim real output growth from nominal dollar changes.', '1919 original 750m-1bn and 1bn-5bn classes merged; 1909 bars classified at same cutoffs.', '1909 Arizona/New Mexico were territories; modern state outlines are locators, not a historical statehood map.']}})

# Reference-only scans: original geometry and legends preserved; no remote href.
for src, dst in [('68e-corn1909.png','reference-corn-1909.webp'),('68e-crops1919.png','reference-corn-1919.webp'),('68e-corn-bars.png','reference-corn-comparison.webp'),('68e-industrial-bars.png','reference-manufacturing-1909.webp'),('68e-manufacturing1919.png','reference-manufacturing-1919.webp')]:
    im = Image.open(SOURCE/src).convert('RGB')
    im.save(ROOT/dst, 'WEBP', quality=70, method=6)

im = Image.open(SOURCE/'68e-population-table.png').convert('RGB')
im.crop((0,0,im.width,780)).save(ROOT/'reference-chicago-population.webp', 'WEBP', quality=78, method=6)
im = Image.open(SOURCE/'68e-manufacturing1919-bars.png').convert('RGB')
im.thumbnail((1600,1600))
im.save(ROOT/'reference-manufacturing-1919-bars.webp', 'WEBP', quality=75, method=6)
inputs = ['68e-agriculture.pdf','68e-agriculture1914.pdf','68e-manufactures.pdf','68e-manufactures1914.pdf','68e-states.geojson','68e-population.pdf']
write_json('input-hashes.json', [{'file':name,'sha256':hashlib.sha256((SOURCE/name).read_bytes()).hexdigest()} for name in inputs])
print('Generated four maps, category data, geometry, seven reference scans and source hashes.')
