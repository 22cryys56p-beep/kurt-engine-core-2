import os
import shutil
import markdown


# -------------------------
# Parse a Markdown page
# -------------------------
def parse_markdown(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        raw = f.read()

    parts = raw.split("---")

    if len(parts) < 3:
        raise ValueError(f"{filepath} is missing front matter.")

    meta_raw = parts[1]
    content_md = parts[2].strip()

    title = "Kurt's English"

    for line in meta_raw.splitlines():
        if line.startswith("title:"):
            title = line.split(":", 1)[1].strip()
            break

    html_content = markdown.markdown(content_md, extensions=['extra', 'nl2br'])

    return title, html_content


# -------------------------
# Build entire site
# -------------------------
def build():

    # Load template
    with open("templates/base.html", "r", encoding="utf-8") as f:
        template = f.read()

    # Create build folder
    os.makedirs("build", exist_ok=True)

    # Copy assets
    if os.path.exists("assets"):
        destination = os.path.join("build", "assets")

        if os.path.exists(destination):
            shutil.rmtree(destination)

        shutil.copytree("assets", destination)

    # Build every markdown file
    for filename in os.listdir("content"):

        if not filename.endswith(".md"):
            continue

        filepath = os.path.join("content", filename)

        title, html = parse_markdown(filepath)

        output = template.replace("{{ title }}", title)
        output = output.replace("{{ content }}", html)

        if filename == "home.md":
            output_name = "index.html"
        elif filename == "classes.md":
            output_name = "classes-.html"
        else:
            output_name = filename.replace(".md", ".html")

        output_path = os.path.join("build", output_name)

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(output)

        print(f"Built {output_name}")

    print("\nWebsite build complete.")


if __name__ == "__main__":
    build()
