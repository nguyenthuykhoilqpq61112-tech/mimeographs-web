#!/usr/bin/env python3
import json
import os
import re
from pathlib import Path
from PIL import Image

REPO_DIR = Path("/home/uuxu/mimeographs-repo")
SITE_DIR = Path("/home/uuxu/mimeographs-site")
PUBLIC_AVATARS = SITE_DIR / "public" / "avatars"
SRC_DATA = SITE_DIR / "src" / "data"

PUBLIC_AVATARS.mkdir(parents=True, exist_ok=True)
SRC_DATA.mkdir(parents=True, exist_ok=True)

with open(REPO_DIR / "catalog.json", encoding="utf-8") as f:
    raw_catalog = json.load(f)

def parse_frontmatter(content):
    if not content.startswith("---"):
        return {}, content
    parts = content.split("---", 2)
    if len(parts) < 3:
        return {}, content
    fm_text = parts[1]
    body = parts[2]
    fm = {}
    for line in fm_text.strip().splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            fm[k.strip()] = v.strip()
    return fm, body

def parse_markdown_sections(text):
    sections = {}
    current_title = "intro"
    current_lines = []
    
    for line in text.splitlines():
        if line.startswith("## "):
            if current_lines:
                sections[current_title] = "\n".join(current_lines).strip()
            current_title = line[3:].strip()
            current_lines = []
        else:
            current_lines.append(line)
    if current_lines:
        sections[current_title] = "\n".join(current_lines).strip()
    return sections

def parse_items_from_ref(file_path):
    if not file_path.is_file():
        return []
    content = file_path.read_text(encoding="utf-8")
    items = []
    current_item = None
    
    for line in content.splitlines():
        if line.startswith("## "):
            if current_item:
                current_item["content"] = "\n".join(current_item["lines"]).strip()
                del current_item["lines"]
                items.append(current_item)
            current_item = {
                "title": line[3:].strip(),
                "lines": []
            }
        elif current_item is not None:
            current_item["lines"].append(line)
            
    if current_item:
        current_item["content"] = "\n".join(current_item["lines"]).strip()
        del current_item["lines"]
        items.append(current_item)
    return items

def extract_quotes(file_path):
    if not file_path.is_file():
        return []
    content = file_path.read_text(encoding="utf-8")
    quotes = []
    raw_quotes = re.findall(r'>\s*["“](.+?)["”]\s*(?:\n\*\((.+?)\)\*)?', content, re.DOTALL)
    for q_text, src in raw_quotes:
        cleaned_text = " ".join(q_text.strip().split())
        quotes.append({
            "quote": cleaned_text,
            "source": src.strip() if src else ""
        })
    return quotes

experts = []
print(f"Processing {len(raw_catalog['experts'])} experts...")

for i, exp in enumerate(raw_catalog["experts"]):
    slug = exp["slug"]
    name = exp["name"]
    category = exp["category"]
    folder = REPO_DIR / "mimeographs" / slug
    
    # 1. Process Avatar
    avatar_src = folder / "avatar.png"
    avatar_url = f"/avatars/{slug}.webp"
    avatar_dest = PUBLIC_AVATARS / f"{slug}.webp"
    
    if avatar_src.is_file():
        try:
            im = Image.open(avatar_src)
            im.thumbnail((400, 400), Image.Resampling.LANCZOS)
            im.save(avatar_dest, "WEBP", quality=82)
        except Exception as e:
            print(f"Error converting avatar for {slug}: {e}")
    
    # 2. Read SKILL.md
    skill_file = folder / "SKILL.md"
    skill_content = skill_file.read_text(encoding="utf-8") if skill_file.is_file() else ""
    fm, skill_body = parse_frontmatter(skill_content)
    skill_sections = parse_markdown_sections(skill_body)
    
    # 3. Read AGENTS.md
    agents_file = folder / "AGENTS.md"
    agents_content = agents_file.read_text(encoding="utf-8") if agents_file.is_file() else ""
    
    # 4. Read References
    ref_dir = folder / "references"
    mental_models = parse_items_from_ref(ref_dir / "mental-models.md")
    frameworks = parse_items_from_ref(ref_dir / "frameworks.md")
    principles = parse_items_from_ref(ref_dir / "principles.md")
    quotes = extract_quotes(ref_dir / "quotes.md")
    
    sources_file = ref_dir / "sources.md"
    sources = sources_file.read_text(encoding="utf-8") if sources_file.is_file() else ""
    
    tags = set([category])
    for mm in mental_models[:5]:
        tags.add(mm["title"])
    for fw in frameworks[:4]:
        tags.add(fw["title"])
    for pr in principles[:4]:
        tags.add(pr["title"])
        
    experts.append({
        "slug": slug,
        "name": name,
        "category": category,
        "summary": exp["summary"],
        "description": exp["description"],
        "avatar": avatar_url,
        "install": exp["install"],
        "tags": list(tags),
        "skill": {
            "full": skill_content,
            "body": skill_body,
            "sections": skill_sections
        },
        "agents": {
            "full": agents_content
        },
        "mental_models": mental_models,
        "frameworks": frameworks,
        "principles": principles,
        "quotes": quotes,
        "sources": sources
    })
    
    if (i + 1) % 20 == 0 or (i + 1) == len(raw_catalog["experts"]):
        print(f"Processed {i + 1}/{len(raw_catalog['experts'])} experts...")

with open(SRC_DATA / "experts.json", "w", encoding="utf-8") as f:
    json.dump({
        "repo": raw_catalog.get("repo", "K-Dense-AI/mimeographs"),
        "count": len(experts),
        "categories": raw_catalog.get("categories", []),
        "experts": experts
    }, f, ensure_ascii=False, indent=2)

print("Finished compiling data to src/data/experts.json and public/avatars/")

# Also generate public static chunks for on-demand lightning fast loading
PUBLIC_DATA = SITE_DIR / "public" / "data"
PUBLIC_EXPERTS_DIR = PUBLIC_DATA / "experts"
PUBLIC_DATA.mkdir(parents=True, exist_ok=True)
PUBLIC_EXPERTS_DIR.mkdir(parents=True, exist_ok=True)

summary_list = []
for exp in experts:
    summary_list.append({
        "slug": exp["slug"],
        "name": exp["name"],
        "category": exp["category"],
        "summary": exp["summary"],
        "description": exp["description"],
        "avatar": exp["avatar"],
        "install": exp["install"],
        "tags": exp["tags"][:8],
        "top_quote": exp["quotes"][0]["quote"] if exp["quotes"] else "",
        "principles_count": len(exp["principles"]),
        "mental_models_count": len(exp["mental_models"]),
        "frameworks_count": len(exp["frameworks"])
    })
    
    # Write individual detail json
    with open(PUBLIC_EXPERTS_DIR / f"{exp['slug']}.json", "w", encoding="utf-8") as f:
        json.dump(exp, f, ensure_ascii=False)

with open(PUBLIC_DATA / "summary.json", "w", encoding="utf-8") as f:
    json.dump({
        "repo": raw_catalog.get("repo", "K-Dense-AI/mimeographs"),
        "count": len(summary_list),
        "categories": raw_catalog.get("categories", []),
        "experts": summary_list
    }, f, ensure_ascii=False)

print(f"Generated summary.json ({len(summary_list)} items) and individual detail files in public/data/")
