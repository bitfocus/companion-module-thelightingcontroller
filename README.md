# companion-module-thelightingcontroller
Companion Module for integrating with [TheLightingController](http://thelightingcontroller.com) software, often released as Showtec QuickDMX, Chauvet ShowXpress or Sweetlight Controller.

Implements the [Communication Protocol](http://download.thelightingcontroller.com/software/External_Application/Protocol.pdf) for external applications over TCP, as used by the [Live Mobile](https://thelightingcontroller.com/viewtopic.php?f=85&t=4552) applications.

# Setting up QuickDMX/TLC/ShowXPress
There are 3 steps to enabling the API.

1. **File -> Preferences -> Network - External App** - ensure 'Enable' checkbox is ticked and port is correct, as you will need it to configure the module (default is 7348).
![1 Preferences-Live Settings](https://user-images.githubusercontent.com/1908506/97643113-be6c5f80-1a3e-11eb-884e-4153040cf750.png)

2. **Live Settings (Right-click on the hamburger menu on the Live tab)->Network - External Control** ensure 'Enable' checkbox is tiched, and enter a password that you will need to enter into the module configuration.
![2 LiveSettings-Network](https://user-images.githubusercontent.com/1908506/97643126-c4624080-1a3e-11eb-9d3e-9b1b95cdbb32.png)

3. **Visible in external application (right-click on page dropdown)** - ensure you have marked every page you want to control as visible in the external application, otherwise no buttons will appear.
![3 Visible in External Application](https://user-images.githubusercontent.com/1908506/97643234-0a1f0900-1a3f-11eb-86b5-3297fc2e42d6.png)

# Setting up the module
The module configuration can be seen here:
<img width="866" alt="Configuration" src="https://user-images.githubusercontent.com/1908506/97643756-78180000-1a40-11eb-9c76-ee63d463048b.png">

* **Label** - Enter a unique label to identify the controller - note this will also be used to prefix log messages.
* **Software IP Address** - The IP Address of the computer running TLC/QuickDMX/ShowXPress.  `127.0.0.1` means the same machine running the companion server.
* **Port number** - Normally this is 7348, but can be changed in the preferences (see above).
* **Password** - Again, this should match the password you entered above.
* **Polling interval** - This decides how often the API should poll the controller for changes.  If you don't change your controllers interface, you can leave this as empty to prevent polling and to avoid spamming the logs.
* **Initial BPM** - As the API doesn't provide an initial value for BPM, you should enter one here.

## Credits
- Images converted to base64 using https://www.base64-image.de/.
- Inspiration gained from implementation of protocol at https://github.com/Tidwell/thelightingcontrollerclient.
- Live Mobile can also be used directly from the web using https://live-mobile.thelightingcontroller.com/ to connect to the controller.

## KNOWN ISSUES
- Presets are not shown until after initial connection, refresh required.
- Presets do not set default options until the button is first viewed (Workaround added).
- Variable name changes do not trigger button refreshes.
- BPM is explicitly controller by companion, so Beats don't necessariily synchronise with those shown by QuickDMX.
