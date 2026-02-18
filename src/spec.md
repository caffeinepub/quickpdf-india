# Specification

## Summary
**Goal:** Fix the Image Resize mode selector and options layout so it remains visually correct and fully usable on mobile without changing resize behavior.

**Planned changes:**
- Update the "By Pixels / By Percentage / Target Size" mode controls styling so the buttons are responsive (no overflow), remain visible/tappable on narrow screens, and have correct active/inactive background + text colors consistent with the theme.
- Adjust the Image Resize options form layout for all modes to prevent input/control overflow on mobile (including the Target Size input + unit selector row), using responsive stacking/sizing as needed.
- Apply small, consistent spacing/typography refinements to the Resize Image options section for a more polished look across mobile/tablet/desktop, without altering any tool logic.

**User-visible outcome:** On phones and narrow screens, the Resize Image mode buttons and all related inputs fit cleanly within the page, remain readable and tappable, and no longer cause horizontal overflow.
