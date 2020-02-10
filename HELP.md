# The Lighting Controller

Should work with all releases of The Lighting Controller - http://thelightingcontroller.com, which is more commonly know as -
- Showtec QuickDMX
- Chauvet ShowXpress
- Sweetlight Controller 

Control is achieved over TCP using the [Published Protocol](http://download.thelightingcontroller.com/software/External_Application/Protocol.pdf).

## Features
The module exposes variables for page, button and fader names and states/values.  These can be best understood by looking at the preset examples.

Buttons can either be referenced using their unique index, which is independent of where they appear in the controller software, or by their position, which is based on the page index, column and row number.  Using the position means that moving buttons around in the controller interface will result in corresponding changes to the position of buttons on the StreamDeck, without having to rearrange.  The presets are split into two, otherwise identical, groups to demonstrate the difference.  Note, however, that moving buttons on the controller doesn't send a message to force a sync. so a manual refresh is required.  This can be done by updating the config, or using the 'Refresh' action on a button.

Button colors can also be synchronized with controller button colors using the feedback system.  Again, the presets demonstrate this.  The Faders also support lerping (fading) between 2 colors with the relative value, again using the feedback system.  The presets show a Fader On, which fades with the fader, and goes to 0 (normally MAX, though +100 can be used instead), when pressed; and a Fader Off, which doesn't fade with the fader, but goes to -100 on pressing, and is highlighted when the value is <-89 (can be controlled with the tolerance option).  Using both button presets together allows you to toggle a fader between 0 and -100, and easily see the current setting.

### Commands

- Tempo control using:
    - Set BPM to explicit value
    - Tap BPM, where BPM is set based on last 3 taps.
    - Explicitly send Beat command.
    - Turn on/off Auto BPM (where BPM calculated from PC audio)
- Set Freeze DMX to on/off.
- Send a cue name, which will toggle the button of the same name.
- Button commands, which can either be targetted by their index, or position.
    - Toggle a button (Equivalent to LiveMobile)
    - Press a button (Useful when using Solo Buttons as prevents accident unsetting, or for flash   buttons)
    - Release a button (For completeness)
- Set fader to explicit value
- Timeline control
    - Play From
    - Play
    - Stop
- Sequential List control
    - Go
    - Pause
    - Stop
- Refresh
    - Manual refresh interface state
- Custom Command (Advanced users only - allows sending a custom TCP command for future-proofing)

### Feedback

- **Offline** : Indicates when the Controller software is disconnected, by dimming buttons and setting text to 'Offline'.
- **Synchronise button colors, by index** : Will synchronise the button colours using the specified button's index.  Also indicates Offline status. (Also indicated when offline)
- **Synchronise button colors, by position** : Will synchronise the button colours using the specified button's position. (Also indicated when offline)
- **Match fader value** : Will set the button color when the specified fader's value matches a specific value to within the specified tolerance.
- **Fade with fader value** : Will fade the background color of the button based on the fader's value.