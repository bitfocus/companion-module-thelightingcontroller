module.exports = {

	/**
	 * Initialises the feedbacks
	 *
	 * @access private
	 * @since 1.1.0
	 */
	initVariables() {
		this.variables = {
			definitions: {},
			changes: {
				defintions: false,
				values: {}
			}
		};

		this.updateVariableDefinitions('BPMMode', 'Whether in Auto (sends Beats) or Manual (tap beats) mode', 'Manual');
		this.updateVariableDefinitions('BPM', 'Beats Per Minute', 120);
		this.updateVariableDefinitions('Beat', 'Current beat number (1-4)', 0);
		this.updateVariableDefinitions('audioBPM', 'Whether audio BPM is on', 'OFF');
		this.updateVariableDefinitions('frozen', 'Whether DMX changes are frozen', 'OFF');
		this.updateVariableDefinitions('lastCue', 'The last cue sent', '');
		this.updateVariableDefinitions('timelineState', 'The timeline state (PLAYING, PAUSED, STOPPED)', 'STOPPED');
		this.refreshVariables();
	},

	/**
	 * Gets a variable's current state.
	 * 
	 * @return {object} Variable object.
	 * @param {string} name 
	 * @access private
	 * @since 1.1.0
	 */
	getVariable(name) {
		let _this = this;
		let variable = _this.variables.definitions[name];
		if (!variable) {
			return;
		}

		// Clone
		variable = Object.assign({}, variable);
		var newValue = _this.variables.changes.values[name];
		if (newValue) {
			variable.value = newValue;
			variable.stale = true;
		}

		return variable;
	},

	/**
	 * Gets a variable's current value.
	 * 
	 * @return {object} Variable value.
	 * @param {string} name 
	 * @access private
	 * @since 1.1.0
	 */
	getVariableValue(name) {
		let _this = this;
		if (Object.prototype.hasOwnProperty.call(_this.variables.changes.values, name)) {
			return _this.variables.changes.values[name];
		}
		let variable = _this.variables.definitions[name];
		if (variable) {
			return variable.value;
		}
	},

	/**
	 * Updates a variable and it's definition
	 * 
	 * @returns {boolean} True if update occurred.
	 * @param {string} name - the name.
	 * @param {string} [label] - a description.
	 * @param {*} [value] - the current/default value.
	 * @param {boolean} [force] - will force an immediate update.
	 * @access private
	 * @since 1.1.0
	 */
	updateVariableDefinitions(name, label, value, force) {
		if (name === undefined) {
			this.log('error', 'Required variable name is missing');
			return;
		}

		let _this = this;
		let variables = _this.variables;
		let variable = variables.definitions[name];
		let updated = false;
		if (!variable) {
			variable = variables.definitions[name] = {
				name: name,
				label: label !== undefined ? label : name
			};
			variables.changes.definitions = true;
			variables.changes.values[name] = value;
			updated = true;
		} else {
			if (label !== undefined && variable.label != label) {
				variable.label = label;
				variables.changes.definitions = true;
				updated = true;
			}
			if (value !== undefined && variable.value != value) {
				variables.changes.values[name] = value;
				updated = true;
			} else {
				delete variables.changes.values[name];
			}
		}

		if (!updated) {
			return false;
		}

		if (force) {
			_this.refreshVariables();
		}
		return true;
	},

	/**
	 * Notifies the system of all updates.
	 * 
	 * @returns {boolean} True if any update occurred.
	 * @access private
	 * @since 1.1.0
	 */
	refreshVariables() {
		let _this = this;
		let variables = _this.variables;
		let definitions = variables.definitions;
		let changes = variables.changes;
		let updated = false;
		if (changes.definitions) {
			changes.definitions = false;
			this.setVariableDefinitions(Object.values(definitions));
			updated = true;
		}

		// Copy value changes over and blank
		let values = Object.assign({}, changes.values);
		changes.values = {};
		Object.entries(values).forEach(([name, value]) => {
			if (definitions[name].value == value) {
				return;
			}

			definitions[name].value = value;
			this.setVariable(name, value);
			updated = true;
		});

		return updated;
	},

	/**
	 * Updates a variable.
	 * 
	 * @returns {boolean} True if update occurred.
	 * @param {string} name - the name.
	 * @param {*} [value] - the current/default value.
	 * @param {boolean} [force] - will force an immediate update.
	 * @access private
	 * @since 1.1.0
	 */
	updateVariable(name, value, force) {
		return this.updateVariableDefinitions(name, undefined, value, force);
	},

	/**
	 * Removes a variable.
	 * 
	 * @returns {boolean} True if the variable was removed.
	 * @param {string} name - the name.
	 * @param {boolean} [force] - will force an immediate update.
	 * @access private
	 * @since 1.1.0
	 */
	removeVariable(name, force) {
		if (name === undefined) {
			this.log('error', 'Required variable name is missing');
			return;
		}

		let _this = this;
		let variables = _this.variables;
		let variable = variables.definitions[name];

		if (!variable) {
			// Not found
			return false;
		}

		delete variables.definitions[name];
		delete variables.changes.values[name];
		variables.changes.definitions = true;
		if (force) {
			_this.refreshVariables();
		}

		return true;
	},

	/**
	 * Updates variables relating to specified button.
	 * 
	 * @returns {boolean} True if any update occurred.
	 * @param {button} button 
	 * @param {boolean} [force] - will force an immediate update.
	 * @access private
	 * @since 1.1.0
	 */
	updateButtonVariables(button, force) {
		if (button === undefined || !button.safeName || !button.position) {
			this.log('error', 'Required button is missing');
			return;
		}
		let _this = this;
		let updated = _this.updateButtonNameVariables(button, false);
		updated |= _this.updateButtonPositionVariables(button, false);
		if (force) {
			_this.refreshVariables();
		}
		return updated;
	},

	/**
	 * Updates name variables relating to specified button.
	 * 
	 * @returns {boolean} True if any update occurred.
	 * @param {button} button 
	 * @param {boolean} [force] - will force an immediate update.
	 * @access private
	 * @since 1.1.0
	 */
	updateButtonNameVariables(button, force) {
		if (button === undefined || !button.safeName || !button.position) {
			this.log('error', 'Required button is missing');
			return;
		}
		let _this = this;
		let updated = _this.updateVariableDefinitions(`button_${button.safeName}_Pressed`, `Button '${button.name}' is pressed`, button.pressed);
		updated |= _this.updateVariableDefinitions(`button_${button.safeName}_Page`, `Button '${button.name}' page`, button.pageName);
		updated |= _this.updateVariableDefinitions(`button_${button.safeName}_Type`, `Button '${button.name}' type`, button.typeName);
		updated |= _this.updateVariableDefinitions(`button_${button.safeName}_Flash`, `Button '${button.name}' is flash`, button.flash);
		if (force) {
			_this.refreshVariables();
		}
		return updated;
	},

	/**
	 * Updates position variables relating to specified button.
	 * 
	 * @returns {boolean} True if any update occurred.
	 * @param {button} button 
	 * @param {boolean} [force] - will force an immediate update.
	 * @access private
	 * @since 1.1.0
	 */
	updateButtonPositionVariables(button, force) {
		if (button === undefined || !button.safeName || !button.position) {
			this.log('error', 'Required button is missing');
			return;
		}
		let _this = this;
		let updated = _this.updateVariableDefinitions(`button${button.position}Name`, `Button at '${button.position}' display name`, button.displayName);
		updated |= _this.updateVariableDefinitions(`button${button.position}Pressed`, `Button at '${button.position}' is pressed`, button.pressed);
		updated |= _this.updateVariableDefinitions(`button${button.position}Page`, `Button at '${button.position}' page`, button.pageName);
		updated |= _this.updateVariableDefinitions(`button${button.position}Type`, `Button at '${button.position}' type`, button.typeName);
		updated |= _this.updateVariableDefinitions(`button${button.position}Flash`, `Button at '${button.position}' is flash`, button.flash);
		if (force) {
			_this.refreshVariables();
		}
		return updated;
	},

	/**
	 * Removes variables relating to specified button.
	 * 
	 * @returns {boolean} True if any update occurred.
	 * @param {button} button 
	 * @param {boolean} [force] - will force an immediate update.
	 * @access private
	 * @since 1.1.0
	 */
	removeButtonVariables(button, force) {
		if (button === undefined || !button.safeName || !button.position) {
			this.log('error', 'Required button is missing');
			return;
		}
		let _this = this;
		let removed = _this.removeButtonNameVariables(button, false);
		removed |= _this.removeButtonPositionVariables(button, false);
		if (force) {
			_this.refreshVariables();
		}
		return removed;
	},

	/**
	 * Removes name variables relating to specified button.
	 * 
	 * @returns {boolean} True if any update occurred.
	 * @param {button} button 
	 * @param {boolean} [force] - will force an immediate update.
	 * @access private
	 * @since 1.1.0
	 */
	removeButtonNameVariables(button, force) {
		if (button === undefined || !button.safeName || !button.position) {
			this.log('error', 'Required button is missing');
			return;
		}
		let _this = this;
		let removed = _this.removeVariable(`button_${button.safeName}_Pressed`);
		removed |= _this.removeVariable(`button_${button.safeName}_Page`);
		removed |= _this.removeVariable(`button_${button.safeName}_Type`);
		removed |= _this.removeVariable(`button_${button.safeName}_Flash`);

		if (force) {
			_this.refreshVariables();
		}
		return removed;
	},

	/**
	 * Removes position variables relating to specified button.
	 * 
	 * @returns {boolean} True if any update occurred.
	 * @param {button} button 
	 * @param {boolean} [force] - will force an immediate update.
	 * @access private
	 * @since 1.1.0
	 */
	removeButtonPositionVariables(button, force) {
		if (button === undefined || !button.safeName || !button.position) {
			this.log('error', 'Required button is missing');
			return;
		}
		let _this = this;
		let removed = _this.removeVariable(`button${button.position}Name`);
		removed |= _this.removeVariable(`button${button.position}Pressed`);
		removed |= _this.removeVariable(`button${button.position}Page`);
		removed |= _this.removeVariable(`button${button.position}Type`);
		removed |= _this.removeVariable(`button${button.position}Flash`);

		if (force) {
			_this.refreshVariables();
		}
		return removed;
	},

	/**
	 * Updates variables relating to specified fader.
	 * 
	 * @returns {boolean} True if any update occurred.
	 * @param {fader} fader 
	 * @param {boolean} [force] - will force an immediate update.
	 * @access private
	 * @since 1.1.0
	 */
	updateFaderVariables(fader, force) {
		if (fader === undefined || fader.index === undefined) {
			this.log('error', 'Required fader is missing');
			return;
		}
		let _this = this;
		let updated = _this.updateVariableDefinitions(`fader${fader.index}Name`, `Fader ${fader.index} name`, fader.name);
		updated |= _this.updateVariableDefinitions(`fader${fader.index}Value`, `Fader ${fader.index} value`, fader.value);
		if (force) {
			_this.refreshVariables();
		}
		return updated;
	},

	/**
	 * Removes variables relating to specified fader.
	 * 
	 * @returns {boolean} True if any update occurred.
	 * @param {fader} fader 
	 * @param {boolean} [force] - will force an immediate update.
	 * @access private
	 * @since 1.1.0
	 */
	removeFaderVariables(fader, force) {
		if (fader === undefined || fader.index === undefined) {
			this.log('error', 'Required fader is missing');
			return;
		}
		let _this = this;
		let removed = _this.removeVariable(`fader${fader.index}Name`, fader.name);
		removed |= _this.removeVariable(`fader${fader.index}Value`, fader.value);

		if (force) {
			_this.refreshVariables();
		}
		return removed;
	}
}