# Secret Diary for GioGio

## Dev Setup

```bash
$ bundle install
$ bundle exec jekyll serve
```

## IMPORTANT INSTRUCTIONS FOR CLAUDE

When working on this project:
1. **Mobile-first always**: GioGio only has phone/tablet, no PC
2. **Keep the cute pink theme**: This is a secret diary for a young girl
3. **Test responsiveness**: Always consider mobile, tablet, and desktop views
4. **Be careful with z-index**: Header is 100, navigation buttons are 20, mobile buttons are 1000
5. **JavaScript and CSS can conflict**: When modifying calendar or interactive elements, check both files

## Overview
This is a Jekyll-based "secret diary" website created by a father for his nearly 12-year-old daughter (GioGio). The site allows the father to write messages that his daughter can read in the future to understand how her father felt throughout the years.

## Design Goals
- **Mobile-first**: Optimized for phones and tablets (daughter doesn't have a PC)
- **Cute pink style**: Sweet design that resembles a real secret diary
- **Clear dates**: Intuitive display of message dates
- **Responsive**: Adapts to all devices while maintaining readability

## Technical Structure

### Tech Stack
- **Jekyll**: Static site generator
- **GitHub Pages**: Hosting
- **SCSS**: CSS preprocessor for styling
- **Liquid**: Jekyll's templating engine

### Folder Structure
```
diary/
├── _posts/          # Diary entries
├── _layouts/        # Page templates
├── _includes/       # Reusable components
├── _sass/           # SCSS files
├── assets/          # Compiled CSS, JS, images
└── _config.yml      # Jekyll configuration
```

### Main SCSS Files
- `variables.scss`: Pink colors ($firstColor, $secondColor, $thirdColor) and breakpoints
- `content.scss`: Styles for content and diary "paper" effect
- `date-display.scss`: Cute date display with hearts
- `mobile-nav.scss`: Mobile-optimized navigation
- `typo.scss`: Responsive typography
- `calendar.scss`: Interactive calendar

## Theme Colors
- `$firstColor: #FFF9F9` - Very light pink (background)
- `$secondColor: #FDECEC` - Light pink (header/footer)
- `$thirdColor: #FFC7C7` - Pink accent (links, dates, buttons)
- `$forthColor: #AAAAAA` - Gray (text)

## Useful Commands
```bash
# Local development
bundle exec jekyll serve

# Production build
bundle exec jekyll build

# Common issues:
# - If CSS changes don't appear, hard refresh the browser (Ctrl+Shift+R)
# - Jekyll caches aggressively, sometimes need to restart the server
```

## Diary Posts
Posts are in Markdown format in the `_posts/` folder with the format:
- Filename: `YYYY-MM-DD-title.md`
- Required front matter: layout, title, date, categories, excerpt

## Special Features
1. **Interactive calendar**: Shows days with messages
2. **Italian dates**: Automatic conversion of month and day names
3. **Post navigation**: Fixed buttons on mobile to navigate between messages
4. **"Paper" design**: Diary page effect with shadows
5. **Swipe navigation**: Swipe left/right between posts on mobile
6. **Performance optimized**: CSS/HTML minification, font preloading
7. **Accessibility**: Focus indicators, smooth scrolling, skip links
8. **SEO ready**: Automatic meta tags and structured data

## Future Development Notes
- The site is designed to grow with GioGio
- Always maintain the sweet style and pink colors
- Priority on readability for mobile devices
- Messages should be personal and affectionate

## Known Issues and Solutions

### Calendar Issues
- **Problem**: Months overflow on mobile
  - **Solution**: Use abbreviations (Gen, Feb, Mar) via CSS pseudo-elements
- **Problem**: JavaScript overrides CSS styles
  - **Solution**: Use `!important` in CSS or rewrite JS to be less intrusive
- **Problem**: Calendar shows wrong year on load
  - **Solution**: Initialize with current date in constructor

### Layout Issues
- **Problem**: Elements overlap (menu over content, buttons under footer)
  - **Solution**: Proper z-index hierarchy and position fixed/absolute
- **Problem**: Navigation arrows not centered in mobile circles
  - **Solution**: Remove position absolute from icons, use flexbox centering

## CSS Architecture
- `calendar-clean.scss` replaced old `calendar.scss`
- `calendar-simple.js` replaced old `calendar.v2.js`
- `swipe-navigation.js` for mobile post navigation
- Mobile-specific styles in `mobile-nav.scss`
- Date display component in `date-display.scss`
- Performance optimizations in `_config.yml`

## Automated Testing

### Test Setup
The project includes automated visual regression tests using Playwright MCP server to verify:
- Responsive design across different viewports
- Calendar layout and functionality
- Navigation between posts
- Theme consistency
- Mobile-first design principles

### Test Scenarios

#### Homepage Tests
- **Mobile (320px, 375px)**: Calendar months distribution (6 columns, 2 rows)
- **Tablet (768px)**: Calendar single row layout
- **Desktop (1280px)**: Full calendar display
- **Theme verification**: Pink colors consistency
- **Z-index hierarchy**: Header, navigation, mobile buttons

#### Post Page Tests
- **Mobile navigation**: Previous/Next post buttons
- **Content readability**: Typography and spacing
- **Date display**: Italian date formatting with hearts
- **Paper effect**: Diary page styling with shadows

### Running Tests
```bash
# Start Jekyll server
bundle exec jekyll serve

# Run automated tests (requires Playwright MCP server)
# IMPORTANT: Use playwright_close() before changing viewport
# to ensure correct dimensions are applied
```

### MCP Playwright Setup
Tests require the Playwright MCP server to be configured and running.

**Critical viewport handling:**
- Always call `playwright_close()` before changing viewport size
- Then use `playwright_navigate()` with width/height parameters
- This ensures the browser uses the correct dimensions

### Test Results
Screenshots are saved in `/screenshots/` with naming convention:
- `homepage-[viewport]-[timestamp].png`
- `post-[viewport]-[timestamp].png`

## Manual Testing Checklist
Before considering changes complete:
- [x] Check on mobile (320px, 375px, 414px)
- [x] Check on tablet (768px)
- [x] Check on desktop (1024px+)
- [x] Verify calendar months display correctly
- [x] Test navigation between posts
- [x] Ensure all text is readable
- [x] Verify pink theme consistency