# companion-module-thelightingcontroller
Companion Module for integrating with [TheLightingController](http://thelightingcontroller.com) software, often released as Showtec QuickDMX, Chauvet ShowXpress or Sweetlight Controller.

## Credits
- Images converted to base64 using https://www.base64-image.de/.
- Inspiration gained from implementation of protocol at https://github.com/Tidwell/thelightingcontrollerclient.

## TODOs
- Periodically refresh interface as not all changes trigger the 'INTERFACE_CHANGE' message (e.g. buttons being moved). Add an optional refresh interval to config.
- Add full BPM system and test.
- Add convenience presets for BPM, Sequence, Timeline, etc.