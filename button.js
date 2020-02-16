/**
 * Defines a controller button.
 * Utilized to generate/recall various icons.
 *
 * @version 1.1.0
 * @since 1.1.0
 * @author Craig Dean <thargy@yahoo.com>
 */
class button {
    /**
	 * Create an instance of a controller button.
     * 
     * @param {internalAPI} api
     * @param {string} name 
     * @param {string} pageName
     * @param {number} column
     * @param {number} line
     * @param {number} type
     * @param {boolean} flash
     * @param {string} colorHex
     * @param {boolean} pressed 
     */
    constructor(
        api,
        name,
        pageName,
        column,
        line,
        type,
        flash,
        colorHex,
        pressed) {
        this.api = api;

        this.name = name;
        this.safeName = name.replace(button.REGEX_SAFEVARIABLE, '_');
        this.displayName = name.replace(/~/g, '\\n');
        this.setPosition(pageName, column, line);
        this.setType(type, flash);
        this.setColor(colorHex);
        this.pressed = pressed;
    }

    /**
     * Updates the button's position.
     * 
     * @access public
     * @param {string} pageName 
     * @param {number} column 
     * @param {number} line 
     */
    setPosition(pageName, column, line) {
        let _this = this;
        let safePageName = pageName.replace(button.REGEX_SAFEVARIABLE, '_');
        let position = `[${safePageName}:${column},${line}]`;
        if (position == _this.position) {
            return false;
        }
        _this.pageName = pageName;
        _this.safePageName = safePageName;
        _this.column = column;
        _this.line = line;
        _this.position = position;
        let name = _this.name;
        let choiceLabel = `${position}: ${name}`;
        _this.choice = { id: name, label: choiceLabel };
        _this.positionChoice = { id: position, label: choiceLabel };
        return true;
    }

    /**
     * Updates the button's type and whether it is a flash button.
     * 
     * @access public
     * @param {number} typeId 
     * @param {boolean} flash 
     */
    setType(typeId, flash) {
        let _this = this;
        let changed = false;
        if (typeId != _this.typeId) {
            _this.typeId = typeId;
            _this.type = button._buttonTypes[typeId] ||
                (button._buttonTypes[typeId] = { id: typeId, name: 'Unknown' });
            _this.typeName = _this.type.name;
            changed = true;
        }
        if (flash != _this.flash) {
            _this.flash = flash;
            changed = true;
        }
        if (!changed) {
            return false;
        }

        _this.icon = _this.api.instance.icons.getButtonIcon(typeId, flash);
        return true;
    }

    /**
     * Updates the button's background color.
     * 
     * @param {string} colorHex 
     */
    setColor(colorHex) {
        let _this = this;
        if (_this.colorHex == colorHex) { return false; }
        _this.colorHex = colorHex;

        // Original controller software takes RGB values and reduces them to a range of 85->212
        // This prevents collisions with black or white text.
        var c = _this.api.toColor(parseInt(colorHex.substr(1), 16));
        _this.color = _this.api.fromColor({
            r: (c.r >> 1) + 85,
            g: (c.g >> 1) + 85,
            b: (c.b >> 1) + 85,
            a: c.a
        });
        return true;
    }

	/**
	 * Sets the pressed state of the button.
	 * 
	 * @param {boolean} pressed - true if button is pressed; otherwise false.
	 * @param {boolean} [skipSend] - if true then command is not sent to controller (used internally).
	 * @access public
	 * @since 1.1.0
	*/
    set(pressed, skipSend) {
		let _this = this;
		if (button === undefined) {
			_this.api.log('error', 'Parameter fader is required.')
			return;
		}
		let cmd = 'BUTTON_';
		if (pressed === true) {
			cmd += 'PRESS';
		} else if (pressed === false) {
			cmd += 'RELEASE';
		} else {
			_this.api.log('error', 'Parameter pressed must be a boolean.')
			return;
		}

		if (_this.pressed == pressed) {
			return;
		}

		if (!skipSend) {
			_this.api.send(cmd, _this.name);
		}

        let instance = _this.api.instance;
		_this.pressed = pressed;
		instance.updateButtonVariables(_this, true);
		instance.checkAllFeedbacks('buttonColor', 'buttonColorPosition');
    }

	/**
	 * Sends command to press the button.
	 * 
     * @access public
     * @since 1.1.0
	*/
    press() {
        this.set(true);
    }

	/**
	 * Sends command to release the specified button.
	 * 
     * @access public
     * @since 1.1.0
	 */
    release() {
        this.set(false);
    }

	/**
	 * Sends command to toggle the specified button.
	 * 
     * @access public
     * @since 1.1.0
	 */
    toggle() {
        let _this = this;
        _this.set(!_this.pressed);
    }
}

/**
 * Detects unsafe characters for variable names.
 */
button.REGEX_SAFEVARIABLE = /[$:()\s)]/g;

/**
 * Button types
 */
button._buttonTypes = [{
    id: 0,
    name: 'Steps',
}, {
    id: 1,
    name: 'Generator',
}, {
    id: 2,
    name: 'Pixels',
}, {
    id: 3,
    name: 'Media',
}, {
    id: 4,
    name: 'Timeline',
}, {
    id: 5,
    name: 'Macro',
}];

exports = module.exports = button;