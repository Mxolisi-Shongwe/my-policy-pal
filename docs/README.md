# PolicyPal Documentation

This directory contains comprehensive documentation for the PolicyPal application.

## Available Documentation

### 1. User Guide (USER_GUIDE.md)
A non-technical guide designed for end users. Covers:
- Getting started
- Feature explanations
- Step-by-step instructions
- Tips and best practices
- Troubleshooting

**Target Audience**: End users, customers, non-technical stakeholders

### 2. Technical Documentation (TECHNICAL_DOCUMENTATION.md)
Comprehensive technical documentation for developers. Includes:
- System architecture
- Database schema
- Component hierarchy
- API reference
- Deployment instructions
- Code examples and diagrams

**Target Audience**: Developers, technical team, system administrators

## Generating PDF Documents

### Option 1: Using Markdown to PDF Converter (Recommended)

Install a markdown to PDF converter:

```bash
# Using npm
npm install -g md-to-pdf

# Convert User Guide
md-to-pdf USER_GUIDE.md

# Convert Technical Documentation
md-to-pdf TECHNICAL_DOCUMENTATION.md
```

### Option 2: Using Pandoc

Install Pandoc: https://pandoc.org/installing.html

```bash
# Convert User Guide
pandoc USER_GUIDE.md -o USER_GUIDE.pdf --pdf-engine=xelatex

# Convert Technical Documentation
pandoc TECHNICAL_DOCUMENTATION.md -o TECHNICAL_DOCUMENTATION.pdf --pdf-engine=xelatex
```

### Option 3: Using VS Code Extension

1. Install "Markdown PDF" extension in VS Code
2. Open the markdown file
3. Right-click and select "Markdown PDF: Export (pdf)"

### Option 4: Using Online Converter

1. Visit https://www.markdowntopdf.com/
2. Upload the markdown file
3. Download the generated PDF

## Viewing Documentation

### In Browser
You can view the markdown files directly in:
- GitHub/GitLab (automatic rendering)
- VS Code (with Markdown Preview)
- Any markdown viewer

### In Terminal
```bash
# Using cat
cat USER_GUIDE.md

# Using less
less USER_GUIDE.md
```

## Updating Documentation

When updating the application:

1. Update the relevant markdown file
2. Regenerate PDFs if needed
3. Update version numbers
4. Update "Last Updated" date

## Documentation Structure

```
docs/
├── README.md                          # This file
├── USER_GUIDE.md                      # User-friendly guide
├── TECHNICAL_DOCUMENTATION.md         # Technical reference
├── USER_GUIDE.pdf                     # Generated PDF (not in repo)
└── TECHNICAL_DOCUMENTATION.pdf        # Generated PDF (not in repo)
```

## Quick PDF Generation Script

Create a file named `generate-pdfs.sh`:

```bash
#!/bin/bash

echo "Generating PDFs from Markdown documentation..."

# Check if md-to-pdf is installed
if ! command -v md-to-pdf &> /dev/null; then
    echo "md-to-pdf not found. Installing..."
    npm install -g md-to-pdf
fi

# Generate PDFs
echo "Converting USER_GUIDE.md to PDF..."
md-to-pdf USER_GUIDE.md

echo "Converting TECHNICAL_DOCUMENTATION.md to PDF..."
md-to-pdf TECHNICAL_DOCUMENTATION.md

echo "PDFs generated successfully!"
echo "- USER_GUIDE.pdf"
echo "- TECHNICAL_DOCUMENTATION.pdf"
```

Make it executable and run:
```bash
chmod +x generate-pdfs.sh
./generate-pdfs.sh
```

## Contributing to Documentation

When contributing:

1. Follow the existing structure
2. Use clear, concise language
3. Include code examples where relevant
4. Add diagrams for complex flows
5. Keep technical and user docs separate
6. Update table of contents
7. Test all code examples

## Documentation Standards

### User Guide
- Use simple, non-technical language
- Include screenshots (when possible)
- Provide step-by-step instructions
- Focus on "how to" rather than "how it works"

### Technical Documentation
- Use technical terminology appropriately
- Include code examples
- Provide architecture diagrams
- Document APIs and interfaces
- Include troubleshooting sections

## Support

For documentation questions or improvements:
- Create an issue in the repository
- Contact: dev@policypal.com

---

**Last Updated**: 2024
