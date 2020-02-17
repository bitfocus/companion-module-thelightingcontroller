module.exports = {

	/**
	 * Initialises the supported feedbacks.
	 *
	 * @access private
	 * @since 1.1.0
	 */
	initFeedbacks() {
		let _this = this;
		_this.TEXTTAG = '$(text)';
		_this.TEXTTAGRegex = new RegExp(_this.TEXTTAG.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&'), 'gi')

		_this.feedbacks = {
			/*
			 * BPM
			 */
			bpm: {
				label: 'Sets the BPM Tap button state.',
				description: 'Sets the BPM Tap button state depending on the BPM mode and current beat.',
			},
			/*
			 * Buttons
			 */
			buttonColor: {
				label: 'Synchronise button colors, by name',
				description: 'Will synchronise the button colours using the specified button\'s position.',
				options: [{
					type: 'dropdown',
					label: 'Name',
					id: 'name',
					regex: _this.REGEX_SOMETHING,
					choices: _this.api.buttonChoices
				},
				{
					type: 'textinput',
					label: 'Pressed alpha',
					id: 'alpha',
					default: 128,
					tooltip: 'A number from 0 to 255, where 0 will set the backgound of pressed buttons to black, and 255 will not affect the background.',
					regex: '/^(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$/'
				}, {
					type: 'textinput',
					label: 'Disabled Text',
					id: 'disabledText',
					tooltip: `Text to appear when button is not found, '${(_this.TEXTTAG)}' is substituted with original text.`,
					default: 'Disabled',
					regex: _this.REGEX_SOMETHING
				},
				{
					type: 'colorpicker',
					label: 'Disabled Foreground color',
					id: 'disabledfg',
					default: _this.rgb(80, 80, 80)
				},
				{
					type: 'colorpicker',
					label: 'Disabled Background color',
					id: 'disabledbg',
					default: _this.rgb(0, 0, 0)
				}]
			},
			buttonColorPosition: {
				label: 'Synchronise button colors, by position',
				description: 'Will synchronise the button colours using the specified button\'s position.',
				options: [{
					type: 'dropdown',
					label: 'Position',
					id: 'position',
					regex: _this.REGEX_SOMETHING,
					choices: _this.api.buttonPositionChoices
				},
				{
					type: 'textinput',
					label: 'Pressed alpha',
					id: 'alpha',
					default: 128,
					tooltip: 'A number from 0 to 255, where 0 will set the backgound of pressed buttons to black, and 255 will not affect the background.',
					regex: '/^(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$/'
				}, {
					type: 'textinput',
					label: 'Disabled Text',
					id: 'disabledText',
					tooltip: `Text to appear when button is not found, '${(_this.TEXTTAG)}' is substituted with original text.`,
					default: 'Disabled',
					regex: _this.REGEX_SOMETHING
				},
				{
					type: 'colorpicker',
					label: 'Disabled Foreground color',
					id: 'disabledfg',
					default: _this.rgb(80, 80, 80)
				},
				{
					type: 'colorpicker',
					label: 'Disabled Background color',
					id: 'disabledbg',
					default: _this.rgb(0, 0, 0)
				}]
			},

			/*
			 * Faders
			 */
			faderColor: {
				label: 'Match fader value',
				description: 'Will set the button color when the specified fader\'s value matches a specific value.',
				options: [{
					type: 'dropdown',
					label: 'Fader',
					id: 'index',
					regex: _this.REGEX_SOMETHING,
					choices: _this.api.faderChoices
				},
				{
					type: 'textinput',
					label: 'Value (-100 -> 100) to match',
					id: 'value',
					default: 0,
					tooltip: 'Value of fader to match',
					regex: '/^[+-]?(100|[0-9]|[0-9][0-9])$/'
				},
				{
					type: 'textinput',
					label: 'Tolerance (0 -> 100)',
					id: 'tolerance',
					default: 10,
					tooltip: 'Values within +/-tolerance of the specified value will be considered as matching.',
					regex: '/^(100|[0-9]|[0-9][0-9])$/'
				},
				{
					type: 'colorpicker',
					label: 'Matched Foreground color',
					id: 'matchedfg',
					default: _this.rgb(255, 255, 255)
				},
				{
					type: 'colorpicker',
					label: 'Matched Background color',
					id: 'matchedbg',
					default: _this.rgb(0, 128, 0)
				}, {
					type: 'textinput',
					label: 'Disabled Text',
					id: 'disabledText',
					tooltip: `Text to appear when button is not found, '${(_this.TEXTTAG)}' is substituted with original text.`,
					default: 'Disabled',
					regex: _this.REGEX_SOMETHING
				},
				{
					type: 'colorpicker',
					label: 'Disabled Foreground color',
					id: 'disabledfg',
					default: _this.rgb(80, 80, 80)
				},
				{
					type: 'colorpicker',
					label: 'Disabled Background color',
					id: 'disabledbg',
					default: _this.rgb(0, 0, 0)
				}]
			},
			faderFadeColor: {
				label: 'Fade with fader value',
				description: 'Will adjust the button\'s colors as the specified fader\'s value changes.',
				options: [{
					type: 'dropdown',
					label: 'Fader',
					id: 'index',
					regex: _this.REGEX_SOMETHING,
					choices: _this.api.faderChoices
				},
				{
					type: 'textinput',
					label: 'Start value (-100 -> 100)',
					id: 'startValue',
					default: 0,
					tooltip: 'Start value of fade range (values outside the range will be clamped).',
					regex: '/^[+-]?(100|[0-9]|[0-9][0-9])$/'
				},
				{
					type: 'textinput',
					label: 'End value (-100 -> 100)',
					id: 'endValue',
					default: -100,
					tooltip: 'Start value of fade range (values outside the range will be clamped).',
					regex: '/^[+-]?(100|[0-9]|[0-9][0-9])$/'
				},
				{
					type: 'colorpicker',
					label: 'Start Foreground color',
					id: 'startfg',
					default: _this.rgb(255, 255, 255)
				},
				{
					type: 'colorpicker',
					label: 'Start Background color',
					id: 'startbg',
					default: _this.rgb(0, 200, 0)
				},
				{
					type: 'colorpicker',
					label: 'End Foreground color',
					id: 'endfg',
					default: _this.rgb(255, 255, 255)
				},
				{
					type: 'colorpicker',
					label: 'End Background color',
					id: 'endbg',
					default: _this.rgb(0, 0, 0)
				}, {
					type: 'textinput',
					label: 'Disabled Text',
					id: 'disabledText',
					tooltip: `Text to appear when button is not found, '${(_this.TEXTTAG)}' is substituted with original text.`,
					default: 'Disabled',
					regex: _this.REGEX_SOMETHING
				},
				{
					type: 'colorpicker',
					label: 'Disabled Foreground color',
					id: 'disabledfg',
					default: _this.rgb(80, 80, 80)
				},
				{
					type: 'colorpicker',
					label: 'Disabled Background color',
					id: 'disabledbg',
					default: _this.rgb(0, 0, 0)
				}]
			},
			/*
			 * Timeline
			 */
			timelinePlayPause: {
				label: 'Timeline play/pause',
				description: 'Changes button image based on timeline play/pause state.',
			},

			/*
			 * Miscellaneous
			 */
			status: {
				label: 'Update button based on status.',
				description: 'Will set the button to offline when disconnected, or disabled when deleted.',
				options: [{
					type: 'textinput',
					label: 'Offline Text',
					id: 'offlineText',
					tooltip: `Text to appear when button is offline, '${(_this.TEXTTAG)}' is substituted with original text.`,
					default: 'Offline',
					regex: _this.REGEX_SOMETHING
				},
				{
					type: 'colorpicker',
					label: 'Offline Foreground color',
					id: 'offlinefg',
					default: _this.rgb(80, 80, 80)
				},
				{
					type: 'colorpicker',
					label: 'Offline Background color',
					id: 'offlinebg',
					default: _this.rgb(0, 0, 0)
				}]
			}
		};
		_this.setDefaultOptions(_this.feedbacks);

		_this.refreshFeedback();
	},

	/** Checks all defined feedbacks, or the feedbacks listed (if specified).
	 * 
	 * @access public
	 * @param {...string} [args] - feedbacks to check
	 * @since 1.1.0
	 */
	checkAllFeedbacks() {
		let _this = this;
		let al = arguments.length;
		if (al > 0) {
			for (var arg = 0; arg < arguments.length; ++arg) {
				_this.checkFeedbacks(arguments[arg]);
			}
		} else {
			Object.keys(_this.feedbacks).forEach((f) => _this.checkFeedbacks(f));
		}
	},

	/**
	 * Updates the feedback definitions.
	 * 
	 * @access public
	 * @since 1.1.0
	 */
	refreshFeedback() {
		let _this = this;
		_this.setFeedbackDefinitions(_this.feedbacks);
	},

	/**
	 * Executes the provided feedback.
	 * 
	 * @access public
	 * @param {Object} feedback - the feedback received
	 * @param {Object} bank - the current bank
	 * @since 1.1.0
	 */
	feedback(feedback, bank) {
		let _this = this;
		if (!feedback || !feedback.type) {
			_this.log('error', 'No feedback specified!');
			return;
		}
		let icons = _this.icons;
		let type = feedback.type;

		let opt = _this.applyDefaults(_this.feedbacks, type, feedback.options);

		switch (type) {
			/*
			 *
			 */
			case 'bpm':
				if (!_this.api.connected) {
					return;
				}
				return {
					png64: icons.getBeatIcon( _this.api.bpmCounter.beatNumber+1)
				};
			
			/*
			 * Buttons
			 */
			case 'buttonColor':
			case 'buttonColorPosition': {
				if (!_this.api.connected) {
					return;
				}

				let button = type == 'buttonColorPosition'
					? _this.api.getButtonPosition(opt.position)
					: _this.api.getButton(opt.name);

				if (!button) {
					return {
						style: 'text',
						text: opt.disabledText.replace(_this.TEXTTAGRegex, bank.text),
						alignment: 'center:center',
						size: '18',
						color: opt.disabledfg,
						bgcolor: opt.disabledbg
					};
				}

				if (button.pressed) {
					let alpha = opt.alpha;
					if (alpha < 0) {
						alpha = 0;
					} else if (opt.alpha > 255) {
						alpha = 255;
					}
					return {
						color: _this.rgb(255, 255, 255),
						bgcolor: alpha * 0x1000000 + button.color
					};
				}

				// Not pressed
				return {
					color: _this.rgb(0, 0, 0),
					bgcolor: button.color
				};
			}

			/*
			 * Faders
			 */
			case 'faderColor':
			case 'faderFadeColor': {
				if (!_this.api.connected) {
					return;
				}

				let fader = _this.api.getFader(opt.index);
				if (!fader) {
					return {
						style: 'text',
						text: opt.disabledText.replace(_this.TEXTTAGRegex, bank.text),
						alignment: 'center:center',
						size: '18',
						color: opt.disabledfg,
						bgcolor: opt.disabledbg
					};
				}

				if (type == 'faderColor') {
					let delta = Math.abs(fader.value - opt.value);
					if (!isNaN(delta) && delta <= opt.tolerance) {
						return {
							color: opt.matchedfg,
							bgcolor: opt.matchedbg
						};
					}
				} else {
					let start = {
						value: opt.startValue,
						style: {
							color: opt.startfg,
							bgcolor: opt.startbg
						}
					};
					let end = {
						value: opt.endValue,
						style: {
							color: opt.endfg,
							bgcolor: opt.endbg
						}
					};
					let value = fader.value;

					// Swap start and end so start value always <= end value.
					if (start.value > end.value) {
						let t = start;
						start = end;
						end = t;
					}

					// Deal with out of range values.
					if (value <= start.value) {
						// Note as both checks are <=, then if start.value==end.value
						// the start colors will be chosen only when the value exactly
						// matches the start value, and the end colors will never match!
						return start.style;
					}
					if (value >= end.value) {
						return end.style;
					}

					// Calculate percentage (0->1)
					// NOTE: Div by zero should never happen due to above checks
					let pc = (value - start.value) / (end.value - start.value);

					// Lerp
					let ss = start.style;
					let es = end.style;
					return {
						color: _this.api.lerp(ss.color, es.color, pc),
						bgcolor: _this.api.lerp(ss.bgcolor, es.bgcolor, pc)
					};
				}
				break;
			}

			/*
			 * Timeline
			 */
			case 'timelinePlayPause':
				if (!_this.api.connected) {
					return;
				}
				return {
					png64: _this.getVariableValue('timelineState') == 'PLAYING'
						? icons.timeline.pause
						: icons.timeline.play
				};

			/*
			 * Miscellaneous
			 */
			case 'status':
				if (!_this.api.connected) {
					return {
						style: 'text',
						text: opt.offlineText.replace(_this.TEXTTAGRegex, bank.text),
						alignment: 'center:center',
						size: '18',
						png64: undefined,
						color: opt.offlinefg == undefined ? _this.rgb(80, 80, 80) : opt.offlinefg,
						bgcolor: opt.offlinebg == undefined ? _this.rgb(0, 0, 0) : opt.offlinebg
					};
				}
				break;

			default:
				_this.log('error', `Unknown feedback type - ${type}`);
				break;
		}
	}
}