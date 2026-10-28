"""Regenerate the starter CV from the portfolio's English content: python scripts/generate_cv.py."""
from pathlib import Path
import re
import textwrap

root = Path(__file__).resolve().parent.parent
source = (root / 'src/App.tsx').read_text(encoding='utf-8')

def records(name):
    block = re.search(r'const ' + name + r' = \[(.*?)\n\];', source, re.S).group(1)
    result = []
    for obj in re.findall(r'\{([^{}]+)\}', block, re.S):
        record = dict(re.findall(r'(\w+): "([^"]*)"', obj))
        for key, values in re.findall(r'(\w+): \[(.*?)\]', obj, re.S):
            record[key] = re.findall(r'"([^"]*)"', values)
        result.append(record)
    return result

pages = []
commands = []
y = 785

def escape(value):
    return value.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

def line(text, size=9.5, bold=False, color='0.16 0.20 0.19', gap=14):
    global y, commands
    if y < 48:
        pages.append('\n'.join(commands))
        commands = []
        y = 785
    font = 'F2' if bold else 'F1'
    commands.append(f'BT /{font} {size} Tf {color} rg 1 0 0 1 46 {y} Tm ({escape(text)}) Tj ET')
    y -= gap

def paragraph(text, width=98):
    for part in textwrap.wrap(text, width=width):
        line(part)

def section(title):
    global y
    y -= 10
    line(title.upper(), 10, True, '0.08 0.36 0.25', 19)

line('NOUHA DJOBBI', 25, True, gap=31)
line('Software Engineering | Data Science | AI | Cybersecurity', 11, gap=20)
line('Bou Argoub, Nabeul, Tunisia | +216 22 362 591 | djobinouha130@gmail.com', 9, gap=21)
paragraph("Software engineering graduate pursuing a Master's in Data Science, with experience in mobile and web development and a focus on AI-powered network security.")
section('Experience')
for item in records('experience'):
    line(item['org'] + ' | ' + item['date'], 10, True, gap=16)
    paragraph(item['role'])
    for point in item['points']:
        paragraph('- ' + point)
    y -= 6
section('Projects')
for item in records('projects'):
    line(item['name'], 10, True, gap=16)
    line(item['status'] + ' | ' + ', '.join(item['tags']), 8.5, gap=15)
    paragraph(item['desc'])
    for point in item['points']:
        paragraph('- ' + point)
    y -= 6
section('Technical Skills')
for item in records('skills'):
    paragraph(item['title'] + ': ' + ', '.join(item['items']))
section('Education')
for item in records('education'):
    paragraph(item['title'] + ' | ' + item['date'])
    line(item['school'], 9, gap=17)
section('Certifications and Challenges')
certs = re.search(r'const certs = \[(.*?)\n\];', source, re.S).group(1)
for cert in re.findall(r'"([^"]*)"', certs):
    paragraph('- ' + cert)
section('Languages and Interests')
paragraph('Arabic | French | English')
paragraph('CTFs, TryHackMe and Hack The Box labs; machine learning and intrusion detection.')
pages.append('\n'.join(commands))

# Standard PDF fonts use Windows-1252, preserving French accents in proper names.
objects = [b'', b'', b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>', b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>']
page_ids = []
for index, content in enumerate(pages):
    content += f'\nBT /F1 8 Tf 0.4 0.45 0.43 rg 1 0 0 1 46 25 Tm (Nouha Djobbi | {index + 1} / {len(pages)}) Tj ET'
    data = content.encode('cp1252', errors='replace')
    page_id = len(objects) + 1
    stream_id = page_id + 1
    page_ids.append(page_id)
    objects.append(f'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents {stream_id} 0 R >>'.encode())
    objects.append(f'<< /Length {len(data)} >>\nstream\n'.encode() + data + b'\nendstream')
objects[0] = b'<< /Type /Catalog /Pages 2 0 R >>'
objects[1] = ('<< /Type /Pages /Count ' + str(len(pages)) + ' /Kids [' + ' '.join(f'{i} 0 R' for i in page_ids) + '] >>').encode()
output = bytearray(b'%PDF-1.4\n%\xe2\xe3\xcf\xd3\n')
offsets = [0]
for number, obj in enumerate(objects, 1):
    offsets.append(len(output))
    output.extend(f'{number} 0 obj\n'.encode() + obj + b'\nendobj\n')
xref = len(output)
output.extend(f'xref\n0 {len(objects) + 1}\n0000000000 65535 f \n'.encode())
for offset in offsets[1:]:
    output.extend(f'{offset:010} 00000 n \n'.encode())
output.extend(f'trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n'.encode())
path = root / 'public/cv/Nouha-Djobbi-CV.pdf'
path.parent.mkdir(parents=True, exist_ok=True)
path.write_bytes(output)
print(f'Created {path.name}: {len(pages)} pages, {len(output)} bytes')
