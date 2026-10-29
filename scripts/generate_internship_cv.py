"""Generate the one-page French internship CV without external dependencies."""
from pathlib import Path
import re
import textwrap

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public/cv/Nouha-Djobbi-Stage-4-6-mois.md"
TARGET = SOURCE.with_suffix(".pdf")


def escape(text):
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


commands = []
y = 800
for raw in SOURCE.read_text(encoding="utf-8").splitlines():
    if not raw:
        continue
    size, leading, font, color = 9, 12, "F1", "0.13 0.17 0.20"
    if raw.startswith("# "):
        raw, size, leading, font = raw[2:], 23, 29, "F2"
    elif raw.startswith("## "):
        raw, size, leading, font = raw[3:], 11, 19, "F2"
    elif raw.startswith("### "):
        y -= 10
        raw, size, leading, font, color = raw[4:], 10, 17, "F2", "0.06 0.34 0.31"
        commands.append(f"0.78 0.85 0.84 RG 0.5 w 40 {y + 9} m 555 {y + 9} l S")
    elif raw.startswith("**") and raw.endswith("**"):
        raw, font, leading = raw[2:-2], "F2", 14
    raw = re.sub(r"\*\*(.*?)\*\*", r"\1", raw)
    # Conservative widths keep text inside the 515-point content column.
    width = 103 if size <= 9 else 85 if size <= 11 else 35
    for index, line in enumerate(textwrap.wrap(raw, width=width)):
        if index and raw.startswith("- "):
            line = "  " + line
        commands.append(f"BT /{font} {size} Tf {color} rg 1 0 0 1 40 {y} Tm ({escape(line)}) Tj ET")
        y -= leading

if y < 35:
    raise ValueError(f"CV exceeds one page (bottom position {y}); shorten the source.")

stream = "\n".join(commands).encode("cp1252")
objects = [
    b"<< /Type /Catalog /Pages 2 0 R >>",
    b"<< /Type /Pages /Count 1 /Kids [3 0 R] >>",
    b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    f"<< /Length {len(stream)} >>\nstream\n".encode() + stream + b"\nendstream",
]
output = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
offsets = [0]
for number, obj in enumerate(objects, 1):
    offsets.append(len(output))
    output.extend(f"{number} 0 obj\n".encode() + obj + b"\nendobj\n")
xref = len(output)
output.extend(f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode())
for offset in offsets[1:]:
    output.extend(f"{offset:010} 00000 n \n".encode())
output.extend(f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode())
TARGET.write_bytes(output)
print(f"Created {TARGET.name}: 1 page, bottom position {y}, {len(output)} bytes")
