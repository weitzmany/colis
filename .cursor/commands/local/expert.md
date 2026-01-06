# Random Expert Selector

Choose a random expert from the available expert personas and output only their name.

## Usage

Execute this command to randomly select an expert and output only their name.

## Implementation

This command uses a performance-optimized approach with a mapping cache:

1. **Mapping File**: `.cursor/commands/local/.expert_mapping.txt` stores `filename|expert_name` mappings
2. **Directory Scan**: Scans `.cursor/rules/experts/*.mdc` for filenames only (no file reads)
3. **Missing Files Check**: Compares directory files with mapping file
4. **Lazy Loading**: Only reads files that are missing from the mapping
5. **Random Selection**: Selects randomly from the mapping list (no file reads needed)

### Command Implementation

```bash
# Configuration
MAPPING_FILE=".cursor/commands/local/.expert_mapping.txt"
EXPERT_DIR=".cursor/rules/experts"

# Ensure mapping file exists
touch "$MAPPING_FILE"

# Get all expert files (filenames only)
current_files=$(ls "$EXPERT_DIR"/*.mdc 2>/dev/null | xargs -n1 basename | sort)

# Get files already in mapping (just filenames, skip comments and empty lines)
mapped_files=$(grep -v '^#' "$MAPPING_FILE" 2>/dev/null | grep -v '^$' | grep '|' | cut -d'|' -f1 | sort)

# Find missing files
missing_files=$(comm -23 <(echo "$current_files") <(echo "$mapped_files"))

# Process missing files: read name and add to mapping
if [ -n "$missing_files" ]; then
  while IFS= read -r filename; do
    filepath="$EXPERT_DIR/$filename"
    if [ -f "$filepath" ]; then
      expert_name=$(grep -m 1 "^name:" "$filepath" 2>/dev/null | sed 's/^name: //')
      if [ -n "$expert_name" ]; then
        echo "$filename|$expert_name" >> "$MAPPING_FILE"
      fi
    fi
  done <<< "$missing_files"
fi

# Random selection from mapping file (skip comments and empty lines)
mapping_data=$(grep -v '^#' "$MAPPING_FILE" | grep -v '^$' | grep '|')
total_lines=$(echo "$mapping_data" | wc -l | tr -d ' ')
if [ "$total_lines" -eq 0 ]; then
  exit 1
fi

random_line=$((RANDOM % total_lines + 1))
echo "$mapping_data" | cut -d'|' -f2 | sed -n "${random_line}p"
```

### One-liner Version

```bash
MAPPING_FILE=".cursor/commands/local/.expert_mapping.txt" && EXPERT_DIR=".cursor/rules/experts" && touch "$MAPPING_FILE" && current_files=$(ls "$EXPERT_DIR"/*.mdc 2>/dev/null | xargs -n1 basename | sort) && mapped_files=$(grep -v '^#' "$MAPPING_FILE" 2>/dev/null | grep -v '^$' | grep '|' | cut -d'|' -f1 | sort) && missing_files=$(comm -23 <(echo "$current_files") <(echo "$mapped_files")) && [ -n "$missing_files" ] && while IFS= read -r filename; do filepath="$EXPERT_DIR/$filename" && [ -f "$filepath" ] && expert_name=$(grep -m 1 "^name:" "$filepath" 2>/dev/null | sed 's/^name: //') && [ -n "$expert_name" ] && echo "$filename|$expert_name" >> "$MAPPING_FILE"; done <<< "$missing_files"; mapping_data=$(grep -v '^#' "$MAPPING_FILE" | grep -v '^$' | grep '|') && total_lines=$(echo "$mapping_data" | wc -l | tr -d ' ') && [ "$total_lines" -eq 0 ] && exit 1 || random_line=$((RANDOM % total_lines + 1)) && echo "$mapping_data" | cut -d'|' -f2 | sed -n "${random_line}p"
```

## Performance Benefits

- **First Run**: Scans directory, reads all files, creates mapping
- **Subsequent Runs**: Only scans directory (filenames), compares with mapping, reads only new files
- **Random Selection**: Uses mapping file (no file reads needed)
- **Cache Invalidation**: Automatically detects new files and updates mapping

## Mapping File Format

The `.cursor/commands/local/.expert_mapping.txt` file uses pipe-separated format:
```
accessibility_expert.mdc|Sarah Johnson
api_design_expert.mdc|Andrew Lee
architecture_expert.mdc|Arthur Davis
...
```

## Expected Output

Output will be only the expert's name, for example:
- `Sarah Johnson`
- `Dorothy Clark`
- `Arthur Davis`
- `Thomas Mitchell`

(No additional text, prefixes, or formatting - just the name)

## SEO Considerations for Generated Content

When this command is used to select experts who generate web-accessible documentation or content, consider the following SEO best practices:

### Content Discoverability

1. **Structured Content**:
   - Ensure generated content follows semantic HTML structure
   - Use proper heading hierarchy (H1 → H2 → H3)
   - Include descriptive meta titles and descriptions
   - Add structured data (Schema.org) when applicable

2. **Search-Friendly URLs**:
   - If content is published to web, use SEO-friendly URLs
   - Include relevant keywords in URL paths
   - Use kebab-case for readability
   - Keep URLs concise and descriptive

3. **Content Optimization**:
   - Include relevant keywords naturally in content
   - Optimize for user intent, not just keywords
   - Ensure content is comprehensive and valuable
   - Use internal linking between related content

### Metadata and Tags

1. **Meta Tags**:
   - Title tags: 50-60 characters, include primary keyword
   - Meta descriptions: 150-160 characters, compelling and descriptive
   - Open Graph tags for social sharing
   - Twitter Cards for Twitter sharing

2. **Structured Data**:
   - Use JSON-LD structured data for articles, guides, documentation
   - Include author information (expert name)
   - Add publication dates
   - Mark up content type (Article, HowTo, FAQPage, etc.)

### Content Quality for SEO

1. **Comprehensive Content**:
   - Create in-depth, valuable content
   - Answer user questions completely
   - Include examples and practical guidance
   - Update content regularly to maintain freshness

2. **User Experience Signals**:
   - Fast page load times
   - Mobile-responsive design
   - Clear navigation and structure
   - Accessible content (WCAG compliance)

3. **Internal Linking**:
   - Link to related expert-generated content
   - Create topic clusters around expert expertise
   - Use descriptive anchor text
   - Maintain logical content hierarchy

### Expert-Generated Content SEO Checklist

When experts generate web-accessible content:

- [ ] **Title Optimization**: Descriptive, keyword-rich titles (50-60 chars)
- [ ] **Meta Description**: Compelling description with call-to-action (150-160 chars)
- [ ] **Heading Structure**: Proper H1-H6 hierarchy with keywords
- [ ] **Content Quality**: Comprehensive, valuable, original content
- [ ] **Keyword Usage**: Natural keyword integration, not keyword stuffing
- [ ] **Internal Links**: Links to related content with descriptive anchor text
- [ ] **Images**: Alt text for all images, descriptive filenames
- [ ] **URL Structure**: SEO-friendly, descriptive URLs
- [ ] **Structured Data**: JSON-LD markup for content type
- [ ] **Mobile Optimization**: Responsive design, mobile-friendly
- [ ] **Page Speed**: Fast loading times, optimized assets
- [ ] **Accessibility**: WCAG compliant, accessible to all users
- [ ] **Freshness**: Regular updates, current information
- [ ] **Social Sharing**: Open Graph and Twitter Card tags
- [ ] **Canonical URLs**: Proper canonical tags to avoid duplicate content

### SEO Best Practices for Expert Documentation

1. **Expert Profile Pages**:
   - Create dedicated pages for each expert
   - Include expert bio, expertise, and contributions
   - Link to expert-generated content
   - Use structured data for Person/Organization

2. **Content Organization**:
   - Organize content by topic/expertise area
   - Create topic clusters around expert domains
   - Use breadcrumb navigation
   - Maintain clear site structure

3. **Search Optimization**:
   - Optimize for long-tail keywords related to expert expertise
   - Create content that answers specific user questions
   - Use FAQ format for common questions
   - Include "People Also Ask" style content

4. **Performance Optimization**:
   - Optimize images and assets
   - Minimize JavaScript and CSS
   - Use lazy loading for images
   - Implement caching strategies

### Example: SEO-Optimized Expert Content Structure

```html
<!-- SEO-optimized HTML structure for expert-generated content -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO Meta Tags -->
  <title>Expert Guide: [Topic] by [Expert Name] | [Site Name]</title>
  <meta name="description" content="[Compelling 150-160 character description with primary keyword]">
  <meta name="keywords" content="[relevant, comma-separated keywords]">
  <meta name="author" content="[Expert Name]">
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="[Title]">
  <meta property="og:description" content="[Description]">
  <meta property="og:type" content="article">
  <meta property="og:author" content="[Expert Name]">
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="[Title]">
  <meta name="twitter:description" content="[Description]">
  
  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "[Title]",
    "description": "[Description]",
    "author": {
      "@type": "Person",
      "name": "[Expert Name]",
      "jobTitle": "[Expertise]"
    },
    "datePublished": "[Date]",
    "dateModified": "[Date]"
  }
  </script>
</head>
<body>
  <article>
    <header>
      <h1>[Primary Heading with Primary Keyword]</h1>
      <p class="author">By <a href="/experts/[expert-slug]">[Expert Name]</a></p>
      <time datetime="[ISO Date]">[Date]</time>
    </header>
    
    <nav aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/experts">Experts</a></li>
        <li><a href="/experts/[expert-slug]">[Expert Name]</a></li>
        <li aria-current="page">[Current Page]</li>
      </ol>
    </nav>
    
    <main>
      <section>
        <h2>[Section Heading]</h2>
        <!-- Content with proper semantic HTML -->
      </section>
    </main>
    
    <aside>
      <h2>Related Content</h2>
      <!-- Internal links to related expert content -->
    </aside>
  </article>
</body>
</html>
```

### SEO Monitoring for Expert Content

1. **Performance Tracking**:
   - Monitor organic search traffic to expert-generated content
   - Track keyword rankings for expert expertise topics
   - Measure engagement metrics (time on page, bounce rate)
   - Analyze search query data

2. **Content Performance**:
   - Identify top-performing expert content
   - Analyze which expert topics drive most traffic
   - Monitor content freshness and update frequency
   - Track backlinks and external references

3. **Optimization Opportunities**:
   - Identify content gaps in expert coverage
   - Find opportunities to improve existing content
   - Monitor competitor content in expert domains
   - Track user search behavior and intent

---

## Review/Contribution

**Expert**: Steven Taylor  
**Expertise**: SEO (Search Engine Optimization)  
**Date**: 2026-01-05  
**Changes**: Added comprehensive "SEO Considerations for Generated Content" section covering content discoverability (structured content with semantic HTML and heading hierarchy, search-friendly URLs with keyword optimization, content optimization with natural keyword usage and internal linking), metadata and tags (meta tags with title tags and descriptions, Open Graph and Twitter Cards, structured data with JSON-LD for articles and expert information), content quality for SEO (comprehensive content with examples, user experience signals with performance and accessibility, internal linking with topic clusters), expert-generated content SEO checklist with 15 items covering title optimization, meta descriptions, heading structure, content quality, keyword usage, internal links, images, URL structure, structured data, mobile optimization, page speed, accessibility, freshness, social sharing, and canonical URLs, SEO best practices for expert documentation (expert profile pages with structured data, content organization with topic clusters, search optimization with long-tail keywords, performance optimization), example SEO-optimized expert content structure with complete HTML example including meta tags, Open Graph tags, Twitter Cards, structured data, semantic HTML, and breadcrumb navigation, and SEO monitoring for expert content (performance tracking with organic search traffic and keyword rankings, content performance analysis, optimization opportunities). This addition ensures that when this command is used to generate web-accessible documentation or content, SEO best practices are applied to maximize search engine visibility and discoverability of expert-generated content.

---
