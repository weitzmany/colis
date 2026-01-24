# Feature: Cooking Mode

## Overview

**Cooking Mode** is a mobile-optimized, step-by-step cooking interface that guides users through recipes while they cook. It features large, readable text, built-in timers, hands-free navigation, and a distraction-free cooking experience.

### User Benefit
Allows users to follow recipes on their mobile device while cooking without constantly touching the screen with messy hands. Large buttons and clear instructions make cooking easier and more confident.

### Business Value
- **Key Differentiator**: Sets Recipes apart from traditional recipe websites
- **User Engagement**: 70% of cooking sessions expected to use cooking mode
- **Mobile Focus**: Optimized for 70% of users who cook on mobile
- **Premium Feature Path**: Foundation for voice commands (Phase 3)

**Priority**: High (MVP Feature)

---

## User Stories

### Primary User Story
**As a home cook**, I want to follow recipe steps on my phone hands-free so that I can cook without constantly touching my device with messy hands.

### Additional User Stories
- **As a beginner cook**, I want clear, step-by-step instructions so that I don't feel overwhelmed
- **As a busy parent**, I want built-in timers for each step so that I don't have to manage multiple timers manually
- **As a mobile user**, I want large tap targets so that I can navigate easily while cooking
- **As a multi-tasker**, I want the screen to stay awake so that I don't have to keep unlocking my phone

---

## Requirements

### Functional Requirements

#### 1. Step-by-Step Display
- Display one recipe step at a time with large, readable text (18px+ font size)
- Show step number and total steps (e.g., "Step 3 of 8")
- Display current step instruction prominently
- Show previous step (grayed out) for context
- Show next step preview (optional)

#### 2. Navigation Controls
- **Next Step** button (large, prominent, right side or bottom)
- **Previous Step** button (smaller, left side or top)
- **Exit Cooking Mode** button (top-left or top-right)
- Progress bar or dots showing position in recipe
- Keyboard shortcuts: Space (next), Left/Right arrows (prev/next), Esc (exit)

#### 3. Built-in Timers
- Each step can have an optional timer (e.g., "Simmer for 10 minutes")
- **Start Timer** button appears for timed steps
- Timer displays prominently (large countdown)
- Timer continues in background if user leaves app
- Audio alert when timer completes
- Option to add custom timer for any step

#### 4. Ingredient List Access
- Ingredients list always accessible (drawer, sidebar, or bottom sheet)
- Toggle to show/hide ingredients while cooking
- Servings adjustment (scale ingredients dynamically)
- Check off ingredients as they're used (optional)

#### 5. Hands-Free Features
- **Keep Screen Awake**: Screen doesn't sleep during cooking mode
- **Large Tap Targets**: All buttons 44x44px minimum for easy tapping
- **Voice Commands** (Phase 3): "Next step", "Previous step", "Set timer"

#### 6. Recipe Information
- Recipe title always visible (top of screen)
- Total cook time and prep time visible
- Current servings (with adjustment controls)
- Option to view full recipe (exit cooking mode)

### Non-Functional Requirements

#### Performance
- Cooking mode loads in <2 seconds
- Step transitions are instant (<200ms)
- Timers accurate to within 1 second
- Offline access to recently viewed recipes (PWA)

#### Usability
- Intuitive navigation (users understand controls immediately)
- No accidental exits (confirm before leaving cooking mode)
- Clear visual hierarchy (step instruction is primary focus)
- Minimal distractions (no ads, no unnecessary elements)

#### Accessibility
- WCAG 2.1 Level AA compliant
- Screen reader support (announce step changes)
- Keyboard navigation (all controls accessible via keyboard)
- High-contrast mode support
- Large text support (adjustable font size)
- Touch target sizes: 44x44px minimum

#### Mobile Optimization
- Responsive design (works on all screen sizes)
- Touch-optimized controls
- Works in mobile browsers (no app required for MVP)
- Supports portrait and landscape orientations
- Works with screen rotation locked

---

## User Interface

### Cooking Mode Layout (Mobile)

```
┌─────────────────────────────────────────┐
│  ← Exit       Chicken Alfredo     ⋮     │ ← Header (Recipe title, exit, menu)
├─────────────────────────────────────────┤
│                                         │
│  Step 3 of 8                  ━━━━━━━━  │ ← Progress (Step number + progress bar)
│                                         │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │  Heat olive oil in a large        │ │
│  │  skillet over medium-high heat.   │ │ ← Current Step (Large text, 18px+)
│  │  Add garlic and cook until        │ │
│  │  fragrant, about 1 minute.        │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ⏱️  Timer: 1 minute                    │ ← Timer (if step has timer)
│  [Start Timer]                          │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│  [📋 View Ingredients (4)]               │ ← Ingredients access
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│  Previous Step (2):                     │
│  Bring a large pot of salted water...  │ ← Previous step (grayed out)
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│  Next Step (4):                         │
│  Add chicken and cook until golden...  │ ← Next step preview (optional)
│                                         │
├─────────────────────────────────────────┤
│  [← Previous]         [Next Step →]     │ ← Navigation buttons (large tap targets)
└─────────────────────────────────────────┘
```

### Ingredients Drawer (Slide up from bottom)

```
┌─────────────────────────────────────────┐
│  Ingredients (Serves 4)  [2] [4] [6]    │ ← Servings adjustment
├─────────────────────────────────────────┤
│  ☑ 1 lb chicken breast                  │
│  ☐ 2 cups heavy cream                   │ ← Check off ingredients
│  ☐ 1 cup Parmesan cheese, grated        │
│  ☐ 2 cloves garlic, minced              │
│  ☐ 2 tbsp olive oil                     │
│  ☐ Salt and pepper to taste             │
│  ☐ Fresh parsley for garnish            │
└─────────────────────────────────────────┘
```

### Timer Active State

```
┌─────────────────────────────────────────┐
│  ⏱️  TIMER RUNNING                       │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │         00:00:45                  │ │ ← Large countdown (48px+)
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [Pause]  [Stop]  [+1 min]              │ ← Timer controls
└─────────────────────────────────────────┘
```

### User Flow

```
User Flow: Enter and Use Cooking Mode

1. User selects recipe from library
2. User taps "Start Cooking" button on recipe details page
3. Cooking mode loads with Step 1 displayed
4. User reads step instruction
5. If step has timer:
   a. User taps "Start Timer"
   b. Timer runs and displays countdown
   c. User proceeds with step
   d. Timer alerts when complete
6. User taps "Next Step" to proceed
7. Repeat steps 4-6 until all steps complete
8. User sees "Recipe Complete" message
9. Option to rate recipe or exit cooking mode
```

---

## API Specification

### Endpoints

**Get Recipe for Cooking Mode**:
```
GET /api/recipes/{id}/cooking

Response:
{
  "id": 123,
  "title": "Chicken Alfredo",
  "servings": 4,
  "prepTime": 15,
  "cookTime": 25,
  "totalTime": 40,
  "ingredients": [
    { "id": 1, "name": "chicken breast", "amount": "1", "unit": "lb", "order": 1 },
    { "id": 2, "name": "heavy cream", "amount": "2", "unit": "cups", "order": 2 }
  ],
  "instructions": [
    { "id": 1, "stepNumber": 1, "instruction": "Bring a large pot...", "timeMinutes": null },
    { "id": 2, "stepNumber": 2, "instruction": "Heat olive oil...", "timeMinutes": 1 }
  ]
}
```

**Track Cooking Session** (Optional Analytics):
```
POST /api/recipes/{id}/cooking-sessions

Request:
{
  "startedAt": "2026-01-23T18:00:00Z",
  "completedAt": "2026-01-23T18:35:00Z",
  "stepsCompleted": 8
}

Response:
{
  "sessionId": 456,
  "message": "Cooking session recorded"
}
```

---

## Database Schema

**No additional tables needed for MVP.** Cooking mode uses existing recipe data (recipes, ingredients, instructions tables).

**Future Enhancement** (Phase 2+): `cooking_sessions` table for analytics
```sql
CREATE TABLE cooking_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  recipe_id INTEGER NOT NULL REFERENCES recipes(id),
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  steps_completed INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Testing Strategy

### Unit Tests
- Timer logic (start, pause, stop, countdown accuracy)
- Step navigation logic (next, previous, boundaries)
- Servings adjustment calculations
- Screen wake lock API calls

### Integration Tests
- Fetch recipe data for cooking mode
- Render all recipe steps correctly
- Timer audio alerts work correctly
- Ingredients drawer toggles correctly

### E2E Tests (Cypress/Playwright)
- **Test 1**: User enters cooking mode and completes all steps
- **Test 2**: User starts timer and receives alert when complete
- **Test 3**: User navigates between steps (next, previous)
- **Test 4**: User views ingredients while in cooking mode
- **Test 5**: User exits cooking mode and returns to recipe details
- **Test 6**: Screen stays awake during cooking mode

### User Acceptance Criteria
- ✅ User can start cooking mode from recipe details page in <2 taps
- ✅ User can navigate through steps easily with large buttons
- ✅ Timer countdown is accurate and alert sounds when complete
- ✅ Screen stays awake during cooking mode
- ✅ User can view ingredients without leaving cooking mode
- ✅ Cooking mode works on mobile devices (iOS Safari, Android Chrome)

### Accessibility Tests
- Screen reader announces step changes
- All controls accessible via keyboard
- Touch targets are 44x44px minimum
- High-contrast mode works correctly
- Text is readable at large font sizes

---

## Success Metrics

### Usage Metrics
- **Cooking Mode Adoption**: 70% of recipe views result in cooking mode usage
- **Session Completion**: 80% of cooking mode sessions complete all steps
- **Average Session Duration**: 25-40 minutes (matches recipe cook times)
- **Return Rate**: Users who use cooking mode have 2x higher weekly return rate

### User Satisfaction
- Cooking mode usability rating: 4.5+ stars
- "Cooking mode makes following recipes easier": 85%+ agree
- Feature request rate for voice commands: Track for Phase 3 prioritization

### Technical Metrics
- Cooking mode load time: <2 seconds (95th percentile)
- Step transition time: <200ms (99th percentile)
- Timer accuracy: ±1 second
- Zero critical bugs reported in first month

---

## Implementation Notes

### Frontend Implementation

**Key Components**:
- `CookingMode.tsx` - Main cooking mode container
- `CookingStep.tsx` - Individual step display
- `CookingTimer.tsx` - Timer component
- `IngredientsDrawer.tsx` - Slide-up ingredients list
- `CookingProgress.tsx` - Progress bar and step counter

**State Management**:
```typescript
interface CookingModeState {
  recipeId: number;
  currentStep: number;
  totalSteps: number;
  timerRunning: boolean;
  timerSeconds: number;
  ingredientsVisible: boolean;
  servings: number;
}
```

**Screen Wake Lock API**:
```typescript
// Keep screen awake during cooking mode
let wakeLock: WakeLockSentinel | null = null;

async function requestWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
  } catch (err) {
    console.error('Wake Lock error:', err);
  }
}

async function releaseWakeLock() {
  if (wakeLock) {
    await wakeLock.release();
    wakeLock = null;
  }
}
```

### Mobile Optimizations
- Touch event handlers (no click delay)
- Swipe gestures for next/previous (optional)
- Vibration feedback for timer alerts (optional)
- Prevent accidental zoom (viewport settings)

### Performance Optimizations
- Preload next step data
- Lazy load recipe images
- Minimize re-renders (React.memo, useMemo)
- Service worker caching for offline access

---

## Future Enhancements (Post-MVP)

### Phase 2: Enhanced Cooking Mode
- **Ingredient Highlighting**: Highlight ingredients used in current step
- **Multi-Timer Support**: Run multiple timers simultaneously
- **Step Photos**: Add photos for each step (user-uploaded or scraped)

### Phase 3: Advanced Features
- **Voice Commands**: "Next step", "Previous step", "Set timer for 10 minutes"
- **Hands-Free Mode**: Auto-advance to next step when timer completes
- **Video Instructions**: Embedded video for each step (if available)
- **Cooking Notes**: Add notes while cooking (e.g., "Needed 2 more minutes")

### Phase 4: Smart Features
- **Smart Appliance Integration**: Connect to smart ovens, Instant Pots
- **Adaptive Timing**: Adjust times based on user feedback
- **Cooking Tips**: Show tips based on user's cooking experience level

---

**Last Updated**: 2026-01-23
**Status**: Ready for Implementation
**Priority**: High (MVP Feature)
**Estimated Development**: 2 weeks

## Review/Contribution

**Reviewed by**:
- Daisy Thompson (UI/UX) - ✅ User experience, interaction design - 2026-01-23
- Michael Brown (Mobile) - ✅ Mobile optimization, offline access - 2026-01-23
- Allison Foster (Accessibility) - ✅ WCAG compliance, screen reader support - 2026-01-23
- Thomas Anderson (Frontend) - ✅ React implementation, state management - 2026-01-23

**Status**: ✅ Approved for Implementation - 2026-01-23
