# Garage Boss Remaster Bible

## Branch and release policy

- `main` remains the current live two-chapter browser game published by GitHub Pages.
- `classic-live` is an archival snapshot of the current version.
- `remaster` is the only branch used for the new visual and engine work.
- The remaster will not replace the live version until it is playable, tested on desktop and mobile, and explicitly approved for release.

## Creative target

Create an original comedy parking adventure that feels like a lost late-1980s or early-1990s Sierra-style game without copying any Sierra characters, rooms, dialogue, logos, code, music, or art assets.

The desired feeling is:

- 4:3 composition with a 320×200 logical game canvas
- crisp nearest-neighbor pixel scaling
- hand-pixeled EGA/VGA-inspired rooms with strong perspective
- a visible player sprite that walks to clicked destinations
- depth masks so Richie can pass behind desks, cars, booths, lifts, signs, and foreground objects
- room-specific walk polygons rather than free movement everywhere
- expressive walk, idle, talk, inspect, take, use, surprised, annoyed, and game-over animations
- classic verbs: WALK, LOOK, TALK, USE, TAKE
- a witty narrator response for nearly every hotspot, including repeat-click jokes
- inventory puzzles that cross several rooms
- score, stress, time, achievements, save slots, chapter select, hints, and comedic failure sequences
- optional music and ambient sound, including phones, horns, lifts, gates, terminals, radios, traffic, and fluorescent lights
- no unwinnable save states, even when the game pretends a terrible choice may have ruined everything

## First benchmark scene

### Garage Division Headquarters

The first complete remastered room will establish the final quality bar:

- Christine behind the accounting desk
- Richie entering through the office door and walking around the room
- ringing multiline phone
- accounting monitor with the wrong-property-code mystery
- numbered key board for The Vanishing Key Ring
- filing cabinets, rate sheets, coffee, clipboard, manager signs, intercom, television traffic report, and office plant
- foreground desk and chair layers that Richie can walk behind
- at least twelve meaningful hotspots
- several repeat-click descriptions per hotspot
- one short animated cutscene
- one complete inventory puzzle
- responsive 4:3 presentation on phones without stretching or blurring

## Story rule

Real incidents may inspire stories, but the public game should fictionalize customer identities, exact account details, legal correspondence, and sensitive internal information. Characters may be composites. The comedy should target bureaucracy, impossible situations, machines, and absurd decisions rather than vulnerable people.

## Future chapter backlog

### 1. The Three-Eighths-of-an-Inch Crisis

An inspector discovers that lettering on a required bicycle sign is 2 5/8 inches high when the rule demands 3 inches. Richie must locate a ruler, a sign maker, the approved wording, and a ladder before the inspector returns. A bad solution involves stretching the letters by hand.

### 2. The Notice That Arrived After It Ended

A monthly parker announces on the final day of the month that today is also the final day of parking, then immediately requests the security deposit. The puzzle revolves around the 30-day notice rule, a cancellation form, an occupied space, and a calendar that appears personally offended.

### 3. The Headlamp Nobody Touched

After legitimate body work, a customer reports that both lights failed the next day and blames the garage. Richie must review footage, reconstruct the repair timeline, inspect a wiring diagram, separate authorized repair time from an exploding rental bill, and avoid promising payment before the evidence exists.

### 4. The Check From February

A customer’s current bill is enormous because a much older payment appears to have landed on the wrong account. The player follows a paper trail through accounting, a canceled check, property codes, and an impatient exit lane while the vehicle waits to be released.

### 5. The Ancient Rate Sheet

A 2017 rate sheet contains the only reliable operating hours, but every rate printed on it is obsolete. The player must extract the hours without allowing a manager to post the ancient prices. Failure unleashes a line of customers demanding time travel discounts.

### 6. Eighteen More Days of Service

A crystal retirement award celebrates exactly “18 More Days of Service,” but the award company refuses to begin engraving until a small payment is made. Payment reminders multiply, the honoree’s final day approaches, and the trophy becomes a recurring inventory item that never seems to arrive.

### 7. The Four-Minute Delay

A customer insists attendants were standing around and the car was never prepared. The request log says 7:00 PM, the customer arrived at 6:57 PM, and the car was delivered at 7:01 PM. Richie must use clocks, text logs, and security footage to survive a complaint about a four-minute wait.

### 8. The Ticket With No Car

An open ticket survives a shift change, but the vehicle is nowhere in the garage. The morning manager, bookman, and overnight attendant each insist someone else checked. The puzzle uses shift logs, key hooks, camera angles, and a ticket that seems to move when nobody is looking.

### 9. The Check Came in the Mail

A vendor invoice cannot be paid electronically, the check is supposedly in transit, the ticket booklets are urgently needed, and every phone call ends with “still under review.” The player must physically shepherd the check through a maze of approvals before the garage runs out of tickets.

### 10. The Uniforms That Would Not Die

A canceled uniform program returns as a giant merchandise claim for shirts nobody can find. Every closet searched reveals more hangers but fewer uniforms. The final confrontation takes place in a warehouse filled with identical navy pants.

### 11. The Wedding of One Hundred Spaces

A wedding party reserves a large block of spaces at a fixed rate with no reimbursement for unused spots. The guest count changes hourly, limousines arrive without coupons, and somebody tries to park the cake van on a stacker.

### 12. The Wrong Garage Ticket

A recurring random encounter. A customer hands Richie a ticket from a completely different garage and insists the car must be here because “this is where the app brought me.” Every chapter gives the customer a more impossible ticket.

### 13. Manager for a Day

A newly promoted manager needs a position letter, manager sign, personnel notice, supply training, rate training, monthly-account training, and visits from every supervisor. The player must complete the onboarding chain before the new manager encounters the first customer.

### 14. Convention Apocalypse

A major Javits event combines anime costumes, auto-show vehicles, boat-show equipment, QR coupons, oversized charges, and one guest who believes cosplay armor qualifies for validation.

### 15. The Door That Hated Rain

A garage door behaves perfectly until it rains. The player must distinguish a motor problem from sensor problems while water drips onto every diagnostic clue. Repeatedly resetting the motor works just long enough to inspire false confidence.

### 16. The Courier of Jacks

A disabled vehicle blocks the entrance while a courier attempts to deliver jacks through the same entrance. A parking ticket is issued during the chaos. The chapter ends with Richie constructing a rebuttal from photographs, delivery records, and increasingly unlikely street geometry.

## Recurring jokes and Easter eggs

- Christine’s “Absolutely not.” response to reckless spending
- “Eagle Eyes” achievement for accounting discoveries
- a customer who claims every SUV is compact
- a mystery ticket from another garage
- food deliveries addressed to a second-floor garage office
- mini cupcakes mysteriously appearing in a Midtown garage
- a Greek salad marked “No onions please” used as an inventory red herring
- a terminal reboot that breaks the printer
- a lift that remains “emotionally unavailable”
- the unpaid crystal award reappearing in backgrounds before anyone receives it
- old paperwork buried beneath newer paperwork, with 2017 at the bottom

## Initial remaster milestones

1. Establish the 320×200 canvas, scaling, input, room, hotspot, walk-polygon, and depth-mask systems.
2. Produce the definitive Richie sprite sheet and animation state machine.
3. Complete Garage Division Headquarters as the benchmark room.
4. Remaster one garage scene with a vehicle, booth, attendant, and working entrance.
5. Port one full Chapter 1 case into the new engine.
6. Add save-slot migration so the remaster can recognize progress from the classic edition where practical.
7. Build a chapter-select shell that clearly labels Classic Edition and Remastered Edition.
8. Test on current Android Chrome, desktop Chrome, and desktop Edge before any merge to `main`.
