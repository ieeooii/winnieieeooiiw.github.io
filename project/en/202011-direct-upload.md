---
thumbnail: /images/projects/202007-direct-upload.png
gradient: linear-gradient(135deg, #d8d9dd, #b5b8c4)
---

# Direct File Upload from Graphics Software to Platform

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, React.js, TypeScript, MobX, Emotion.js, SCSS, jQuery, Jest, Enzyme |
| Period | 2020.07 – 2020.11 |
| Team | Frontend 1, Graphics Engineer 1, Backend 1, Product Designer 1 (Frontend owner) |
| Service Link | style.clo-set.com |

## Overview

A feature that enables direct upload of 3D garment files (`.zprj`, `.zpac`, etc.) from CLO software into CLOSET. The flow spans multiple steps: file selection → style item mapping → assembly grouping → rendering settings. Multiple 3D files can be processed at once, with users manually mapping each file to its corresponding style item.

## Key Features

<div class="img-row-2">

![Direct Upload Main](/images/projects/202007-direct-upload.png)
![Browse File Modal](/images/projects/202007-direct-upload-browse-modal.png)
![Recent File Modal](/images/projects/202007-direct-upload-recent-modal.png)
![Upload Dropdown](/images/projects/202005-upload-dropdown.png)
![Upload Modal](/images/projects/202005-upload-modal.png)

</div>

## Key Implementations

### Direct Web Upload from 3D Graphics Software
- Collaborated with the backend engineer to build a Unity raw data web upload feature from the company's 3D graphic software products (CLO3D, MD)
- Wrote behavior-driven tests with Enzyme
- Migrated a jQuery-built page to React.js

### ItemSelectModal Refactoring
- **Problem**: `ItemSelectModal.tsx` was managing selected file list, per-assembly grouping structure, selection state reset on group switch, and auto-numbering counter all in a single file. Entangled state dependencies caused repeated bugs where switching groups corrupted the selection state of other groups.
- **Solve**: Migrated to TypeScript and separated state by responsibility. Extracted assembly grouping logic as a standalone module, clearly limiting the scope of selection state resets to the current group only. Added "Keep current thumbnail" checkbox and auto-numbering tooltip. Saved rendering settings to localStorage for restoration on revisit.
- **Result**: State corruption bug on group switch resolved; state responsibilities clearly separated for predictable modification scope going forward

### SCSS → Emotion.js Migration + Accessibility Bug Fix (2023.04)
- **Problem**: Upload components were styled with SCSS modules, blocking design system token application. Conditional styling used `className` string concatenation, making conditions increasingly hard to trace. There was also an accessibility bug where the upload content name label pointed to the wrong element.
- **Solve**: Full migration to Emotion.js. Conditional styles handled via `css` prop and template literals for clear per-condition style visibility. Fixed the label `htmlFor` attribute to resolve the accessibility bug.
- **Result**: Design system tokens applicable, conditional styles traceable, accessibility improved

## Retrospective / Lessons Learned

Direct Upload is the bridge between CLO software and the CLOSET web service, frequently impacted by file format changes or rendering spec updates. The biggest lesson was the importance of clear state "ownership." When multiple states coexist in a single component, any one change can unintentionally affect others. After this project, I made it a habit to always design upfront: "who owns this state, and when should it be reset?"
