# companion-module-thelightingcontroller
Companion Module for integrating with [TheLightingController](http://thelightingcontroller.com) software, often released as Showtec QuickDMX, Chauvet ShowXpress or Sweetlight Controller.

## TODOs
- Periodically refresh interface as not all changes trigger the 'INTERFACE_CHANGE' message (e.g. buttons being moved). Add an optional refresh interval to config.
- Add full BPM system and test.
- Add convenience presets for BPM, Sequence, Timeline, etc.
- Add color correction logic for background colors,to match QuickDMX/Live Mobile (i.e. blacks should be gray not black)