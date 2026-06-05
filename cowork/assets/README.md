# /cowork/assets/

Drop captured media into this folder. The page at `/cowork/` is wired to expect these exact filenames. When a file lands, swap the matching placeholder block in `cowork/index.html` for the real embed.

## Expected files

| Filename | Purpose | Status |
| --- | --- | --- |
| `harness-walkthrough.mp4` | 60 to 90 second screen recording of CapacityOS running inside Cowork. Section 01. | pending |
| `capacityos-dashboard.png` | Annotated screenshot of the daily operating view. Section 02. | pending |
| `skill-speedrun.mp4` | 3 to 5 minute recording of building a Cowork skill from zero. Section 03. | pending |
| `writing-portfolio.pdf` | Branded PDF of selected Cowork-related LinkedIn posts and writing. Leave-behind. | pending |
| `before-after-reel.pdf` | Expanded before / after examples with output screenshots. Leave-behind. | pending |

## Swap pattern in index.html

Each section currently has a placeholder block that looks like:

```html
<div class="media-slot video">
  <div class="placeholder-mark">
    <strong>Video Slot</strong>
    harness-walkthrough.mp4
    <span class="hint">60 to 90 seconds. Screen recording of CapacityOS in Cowork.</span>
  </div>
</div>
```

When the file is captured, replace the inner `placeholder-mark` div with:

```html
<video controls playsinline preload="metadata" poster="/cowork/assets/harness-walkthrough-poster.jpg">
  <source src="/cowork/assets/harness-walkthrough.mp4" type="video/mp4">
</video>
```

For image slots, replace with:

```html
<img src="/cowork/assets/capacityos-dashboard.png" alt="CapacityOS daily operating view, annotated">
```

For the leave-behind list (Section 07), find the matching `asset-row` div and:
- Change `<div class="asset-row">` to `<a class="asset-row" href="/cowork/assets/[filename]" download>`
- Change the `<span class="asset-action pending">Pending</span>` to `<span class="asset-action">Download</span>`

## Capture order recommendation

1. Dashboard screenshot first (lowest effort, biggest visual payoff).
2. Harness walkthrough video next (Sami asked for this directly).
3. Skill-building speed run third (the builder credibility shot).
4. Writing portfolio and before/after PDFs after the videos land.
