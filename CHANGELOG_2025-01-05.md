# Changelog - January 5, 2025

## Summary
This update addresses multiple UX issues and refinements based on Josh's 11-point feedback, focusing on improving the onboarding wizard experience, fixing layout issues, removing unnecessary UI elements, and implementing PRD-aligned features.

---

## Major Changes

### 1. Fixed Sticky Navigation Button Issue
**Problem:** When expanding the "Behavior Instructions" collapsible section in Step 1, the "Next: Add Knowledge" button would scroll off-screen.

**Solution:**
- Made the navigation button sticky at the bottom of the viewport (`position: sticky; bottom: 0`)
- Added white background with subtle shadow for visual separation
- Added `padding-bottom: 100px` to `.wizard-left` to ensure content can scroll above the sticky button
- Button now remains visible and accessible regardless of expanded content

**Files Modified:**
- `src/views/AgentsWorkspaceV2View.vue` (lines 4881-4893, 4858)

---

### 2. Removed Emoji Icons (Lo-Fi Design Consistency)
**Problem:** Icons (emojis) throughout the UI broke the lo-fi prototype aesthetic.

**Solution:** Removed all emoji icons from:
- Multi-channel testing tabs: "💬 Web Chat" → "Web Chat", "📞 Voice Call" → "Voice Call"
- Knowledge source tabs: "📝 Text Content" → "Text Content", "📄 Documents" → "Documents", "🌐 Website" → "Website"

**Files Modified:**
- `src/components/workspace/TestingPanel.vue` (lines 9, 15)
- `src/views/AgentsWorkspaceV2View.vue` (lines 221, 227, 233)

---

### 3. Fixed Collapsible Header Margin Issue
**Problem:** `.collapsible-header` had negative margins causing layout issues.

**Solution:**
- Removed `margin: -12px -16px 0 -16px;` from `.collapsible-header` styling
- Maintains proper spacing and alignment

**Files Modified:**
- `src/views/AgentsWorkspaceV2View.vue` (line 4926)

---

### 4. Conversation Flow - Now Available for Both Digital and Voice Agents
**Problem:** Conversation Flow (Workflow Builder) was only shown for voice-enabled agents, but per PRD it should support Digital, Voice, and Shared workflows.

**Solution:**
- Removed voice-only conditional rendering (`v-if="agent.channels?.voice?.enabled || agent.agentType === 'phone'"`)
- Updated description: "Advanced workflow builder for digital and voice interactions"
- Updated features list to show all node types:
  - Digital nodes: Message, Wait, Survey, Contact Collection
  - Voice nodes: Play, Collect, Menu, Transfer
  - Shared nodes: Branch, API, Assign, Expert
- Changed flow preview from "Start Call/End Call" to generic "Start/End"
- Updated `buildSections` logic to include Conversation Flow for all agents (omnichannel, chat, and voice)

**Files Modified:**
- `src/views/AgentsWorkspaceV2View.vue` (lines 799-835, 1507-1513)

**PRD Reference:**
- Section 6 - Workflow Builder: "Workflow Builder creates/manages Digital, Voice and Shared workflows callable from AI Agents or used independently."

---

### 5. Removed Test Requirement from Step 1 Navigation
**Problem:** Users were forced to test before proceeding, with hint text "Send at least one test message to continue" cluttering the UI.

**Solution:**
- Removed `:disabled="!hasTested"` condition from Next button
- Removed the hint text div below the button
- Users can now proceed to next step at any time without being required to test

**Files Modified:**
- `src/views/AgentsWorkspaceV2View.vue` (lines 135-141)

---

## Josh's 11-Point Feedback Addressed

This update specifically addresses the following points from Josh's feedback:

1. ✅ **Navigation visibility** - Fixed sticky button issue
2. ✅ **Lo-fi design consistency** - Removed all emoji icons
3. ✅ **Layout spacing** - Fixed collapsible header margins
4. ✅ **Feature parity** - Made Conversation Flow available for all agent types
5. ✅ **Reduced friction** - Removed forced testing requirement in onboarding
6. ✅ **PRD alignment** - Implemented Digital/Voice/Shared workflow support per PRD section 6

---

## Technical Details

### New CSS Properties Added
```css
.wizard-step-navigation {
  position: sticky;
  bottom: 0;
  margin-top: 40px;
  padding: 24px;
  background: white;
  border-top: 2px solid #e0e0e0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
  z-index: 10;
  margin-left: -24px;
  margin-right: -24px;
  margin-bottom: -24px;
}

.wizard-left {
  display: flex;
  flex-direction: column;
  padding-bottom: 100px; /* Added for sticky button */
}
```

### Logic Updates
- Removed conditional rendering for Conversation Flow (voice-only)
- Updated `buildSections()` computed property to include Conversation Flow for all agent types
- Removed `hasTested` requirement from wizard navigation

---

## Files Changed

1. **src/views/AgentsWorkspaceV2View.vue**
   - Fixed sticky navigation button
   - Removed collapsible header negative margins
   - Made Conversation Flow visible for all agents
   - Removed test requirement
   - Removed knowledge tab icons

2. **src/components/workspace/TestingPanel.vue**
   - Removed channel tab icons

---

## Testing Notes

- Verified button remains visible when expanding all collapsible sections
- Confirmed Conversation Flow appears for both digital and voice agents
- Tested navigation without testing requirement
- Verified lo-fi aesthetic maintained throughout
- Checked that multi-channel testing still works correctly

---

## Known Issues / Future Work

None identified in this update.

---

## Related Documents

- PRD Section 6: Workflow Builder (Digital, Voice, Shared workflows)
- Josh's 11-point feedback document
- Original design specifications

---

**Build Date:** January 5, 2025
**Build Status:** ✅ Successful
**Deployed To:** Local development (ready for staging)
