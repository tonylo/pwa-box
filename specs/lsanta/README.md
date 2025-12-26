# Lettie's Santa Arrival App Spec

## Goal
Provide a simple, magical countdown and arrival tracker so Lettie can see when Santa is getting close.

## Scope
- Show a live countdown to Santa's arrival (date and time configurable).
- Display status messages (e.g., "Checking the sky...", "Almost here!").
- Include a small checklist for last-minute prep (e.g., cookies, carrots).
- Snowfall and Reindeer animations
- A button to ring a bell for the reindeer to hear
- An occasional Santa ho-ho-ho

Out of scope:
- Real-world Santa tracking or external map data.
- Accounts, sync, or sharing.

## UX Notes
- Designed for quick glances on mobile and tablet.
- Friendly, playful visuals with large typography.
- One primary screen; minimal navigation.

## Data & Storage
- Default arrival time: 3:00 AM UK time on the next Christmas Day.
- Store arrival time and checklist state locally (localStorage).
- No personal data beyond local preferences.

## Offline Behavior
- App shell cached for offline use.
- Countdown uses local time and stored arrival timestamp.

## Accessibility
- High contrast text for readability.
- Buttons large enough for touch.
- Provide non-animated fallback for motion-sensitive users.

## Acceptance Criteria
- Countdown updates at least once per second.
- Arrival time can be edited and persists on refresh.
- Checklist items can be toggled and persist on refresh.
- App works offline after first load.

## Future Ideas
- Snowfall toggle.
- Optional "Santa has arrived" celebration screen.
- Multiple time zones for traveling families.
