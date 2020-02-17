# companion-module-thelightingcontroller
Companion Module for integrating with [TheLightingController](http://thelightingcontroller.com) software, often released as Showtec QuickDMX, Chauvet ShowXpress or Sweetlight Controller.

Implements the [Communication Protocol](http://download.thelightingcontroller.com/software/External_Application/Protocol.pdf) for external applications over TCP, as used by the [Live Mobile](https://thelightingcontroller.com/viewtopic.php?f=85&t=4552) applications.

## Credits
- Images converted to base64 using https://www.base64-image.de/.
- Inspiration gained from implementation of protocol at https://github.com/Tidwell/thelightingcontrollerclient.
- Live Mobile can also be used directly from the web using https://live-mobile.thelightingcontroller.com/ to connect to the controller.

## KNOWN ISSUES
- Presets are not shown until after initial connection, refresh required.
- Presets do not set default options until the button is first viewed (Workaround added).
- Variable name changes do not trigger button refreshes.
- BPM is explicitly controller by companion, so Beats don't necessariily synchronise with those shown by QuickDMX.