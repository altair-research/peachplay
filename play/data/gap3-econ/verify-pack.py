"""68E artifact integrity checks; no app code or network access."""
import hashlib
import json
from collections import Counter
from pathlib import Path
import xml.etree.ElementTree as ET
from PIL import Image

root = Path(__file__).resolve().parent
ns = {'s': 'http://www.w3.org/2000/svg'}
data = json.loads((root/'observations.json').read_text(encoding='utf-8'))
geo = json.loads((root/'state-paths.json').read_text(encoding='utf-8'))
states = {s['id'] for s in geo['states']}
assert len(states) == 48 and not states.intersection({'AK','HI','DC'})
counts = {}
for subject in ('corn','manufacturing'):
    for year in ('1909','1919'):
        values = data[subject]['years'][year]
        assert set(values).issubset(states)
        assert all(type(v) is int and v in (0,1,2) for v in values.values())
        counts[f'{subject}-{year}'] = dict(sorted(Counter(values.values()).items()))
assert counts['corn-1909'] == {0:13,1:5,2:2}
assert counts['corn-1919'] == {0:13,1:5,2:2}
assert counts['manufacturing-1909'] == {0:42,1:6}
assert counts['manufacturing-1919'] == {0:30,1:14,2:4}
assert data['manufacturing']['years']['1919']['MD'] == 1
assert data['manufacturing']['years']['1919']['RI'] == 0
geometry = {s['id']: s['path'] for s in geo['states']}
for svg in root.glob('*.svg'):
    tree = ET.parse(svg)
    assert tree.getroot().attrib['viewBox'] == '0 0 1000 650'
    paths = {p.attrib['id']:p.attrib['d'] for p in tree.findall('.//s:path',ns) if 'id' in p.attrib}
    assert paths == geometry
    assert not tree.findall('.//s:script',ns) and not tree.findall('.//s:image',ns)
    text = svg.read_text(encoding='utf-8')
    assert 'http' not in text.replace('http://www.w3.org/2000/svg','')
    subject, year = svg.stem.split('-')
    assert subject in ('corn','manufacturing') and year in ('1909','1919')
    assert len(tree.findall('.//s:title',ns)) == 49
for path in root.glob('*.json'):
    json.loads(path.read_text(encoding='utf-8'))
for path in root.glob('*.webp'):
    with Image.open(path) as im:
        im.verify()
sources = json.loads((root/'sources.json').read_text(encoding='utf-8'))
for source in sources['sources']:
    for field in ('id','agency','originalURL','publicationYear','locator','geography','indicator','unit','boundaryAndClassification','rights','transformation','localFiles'):
        assert field in source, (source['id'], field)
    assert 'measurementYear' in source or 'measurementYears' in source
    assert all((root/name).is_file() for name in source['localFiles'])
support = json.loads((root/'chicago-support.json').read_text(encoding='utf-8'))
pop = next(c for c in support['cards'] if c['id']=='chicago-population-1910-1920')
assert pop['values']['1920']-pop['values']['1910'] == 516422
assert len(support['blockedQuestionTemplates']) == 3
assert all(c['text']['en'] and c['text']['ko'] and c['rights'] for c in support['cards'])
files = [p for p in root.iterdir() if p.is_file() and p.name!='validation.json']
assert not any(p.name.startswith('_preview') for p in files), 'Remove intermediate previews first'
result = {'checkedOn':'2026-10-20','status':'PASS','scope':'artifact integrity only; not independent factual or game validation','svgCount':4,'statePathsPerMap':48,'cornTranscribedStatesPerYear':20,'manufacturingTranscribedStatesPerYear':48,'categoryCounts':counts,'sharedGeometryAllFour':True,'xmlAndJsonParse':True,'referenceImageCount':len(list(root.glob('*.webp'))),'externalSvgReferences':0,'gameIdsCreated':[],'files':[{'name':p.name,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(files)]}
result['bytesExcludingValidation'] = sum(f['bytes'] for f in result['files'])
encoded = json.dumps(result,ensure_ascii=False,indent=2)+'\n'
result['bytesIncludingValidation'] = result['bytesExcludingValidation'] + len(encoded.encode('utf-8'))
# Stabilize the total after adding its own number.
for _ in range(3):
    encoded = json.dumps(result,ensure_ascii=False,indent=2)+'\n'
    result['bytesIncludingValidation'] = result['bytesExcludingValidation']+len(encoded.encode('utf-8'))
assert result['bytesIncludingValidation'] <= 1000000, result['bytesIncludingValidation']
(root/'validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:result[k] for k in ('status','svgCount','referenceImageCount','bytesIncludingValidation','categoryCounts')}))
