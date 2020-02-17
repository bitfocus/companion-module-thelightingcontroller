module.exports = {

	/**
	 * Initialises the actions.
	 *
	 * @access private
	 * @since 1.1.0
	 */
	initActions() {
		let _this = this;
		let modeChoices = [
			{ id: 'toggle', label: 'Toggle' },
			{ id: 'press', label: 'Press ' },
			{ id: 'release', label: 'Release' }
		];

		_this.actions = {
			/*
			 * Tempo controls
			 */
			'bpm': {
				label: 'Set BPM',
				options: [{
					type: 'textinput',
					label: 'BPM',
					tooltip: 'Beats per minutes, between 10 and 500.',
					id: 'bpm',
					default: '120',
					regex: this.REGEX_BPM
				}]
			},
			'bpmTap': {
				label: 'Tap BPM'
			},
			'audiobpm': {
				label: 'Set BPM from system audio',
				options: [{
					type: 'dropdown',
					label: 'On/Off',
					id: 'on',
					choices: [{ id: 'false', label: 'Off' }, { id: 'true', label: 'On' }]
				}]
			},
			'freeze': {
				label: 'Freeze',
				options: [{
					type: 'dropdown',
					label: 'On/Off',
					id: 'on',
					choices: [{ id: 'false', label: 'Off' }, { id: 'true', label: 'On' }]
				}]
			},
			/*
			 * Cues
			 */
			'cue': {
				label: 'Toggle Cue',
				options: [{
					type: 'textInput',
					label: 'Button index',
					id: 'name',
					regex: this.REGEX_SOMETHING
				}]
			},
			/*
			 * Buttons
			 */
			'button': {
				label: 'Button press/release/toggle, by name',
				options: [{
					type: 'dropdown',
					label: 'Button name',
					id: 'name',
					regex: this.REGEX_SOMETHING,
					choices: this.api.buttonChoices
				}, {
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					default: 'toggle',
					choices: modeChoices
				}]
			},
			'buttonPosition': {
				label: 'Button press/release/toggle, by position',
				options: [{
					type: 'dropdown',
					label: 'Button position',
					id: 'position',
					regex: this.REGEX_SOMETHING,
					choices: this.api.buttonPositionChoices
				}, {
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					default: 'toggle',
					choices: modeChoices
				}]
			},
			/*
			 * Faders
			 */
			'fader': {
				label: 'Set fader value',
				options: [{
					type: 'dropdown',
					label: 'Fader',
					id: 'index',
					regex: this.REGEX_SOMETHING,
					choices: this.api.faderChoices
				},
				{
					type: 'textinput',
					label: 'Value (-100 -> 100)',
					id: 'value',
					default: 0,
					regex: '/^[+-]?(100|[0-9]|[0-9][0-9])$/'
				},
				{
					type: 'textinput',
					label: 'Time (100 -> 600000) milliseconds, or empty for no fade.',
					id: 'time',
					default: 2000,
					regex: '/^(|[1-9]\\d{2,4}|[1-5]\\d{5}|600000)$/'
				}]
			},
			/*
			 * Sequential
			 */
			'sequentialGo': {
				label: 'Sequential Go'
			},
			'sequentialPause': {
				label: 'Sequential Pause'
			},
			'sequentialStop': {
				label: 'Sequential Stop'
			},
			/*
			 * Timeline
			 */
			'timelinePlayfrom': {
				label: 'Timeline Play from red marker'
			},
			'timelinePlayPause': {
				label: 'Timeline Play/Pause'
			},
			'timelineStop': {
				label: 'Timeline Stop'
			},
			/*
			 * Custom commands
			 */
			'refresh': {
				label: 'Refresh interface'
			},
			'sendcustomcommand': {
				label: 'Send custom command',
				options: [{
					type: 'textinput',
					label: 'Command',
					id: 'command',
					default: 'HELLO',
					tooltip: "Enter any command you like in plain ASCII. Beware of correct syntax, you mustn't enter the linefeed at the end of the command.",
					regex: this.REGEX_SOMETHING
				}]
			}
		};
		_this.setDefaultOptions(_this.actions);

		_this.refreshActions();
	},

	/**
	 * Updates the action definitions.
	 * 
	 * @access private
	 * @since 1.1.0
	 */
	refreshActions() {
		let _this = this;
		_this.setActions(_this.actions);
	},

	/**
	 * Executes the provided action.
	 *
	 * @param {Object} action - the action to be executed
	 * @access public
	 * @since 1.1.0
	 */
	action(action) {
		let _this = this;

		let opt = _this.applyDefaults(_this.actions, action.action, action.options);
		action = action.action;

		if (!_this.api.connected) {
			this.log('error', `Cannot perform '${action}' action as offline.`);
			return;
		}

		switch (action) {
			/*
			 * Tempo controls
			 */
			case 'bpmTap':
				_this.api.bpmTap();
				break;
			case 'bpm': {
				_this.api.bpm(opt.bpm);
				break;
			}
			case 'audioBPM':
				_this.api.audioBPM(opt.on == 'true');
				break;
			case 'freeze':
				_this.api.freeze(opt.on == 'true');
				break;

			/*
			 * Cues
			 */
			case 'cue':
				_this.api.cue(opt.name);
				break;

			/*
			 * Buttons
			 */
			case 'button':
			case 'buttonPosition': {
				let b = action == 'buttonPosition'
					? _this.api.getButtonPosition(opt.position)
					: _this.api.getButton(opt.name);
				if (b) {
					switch (opt.mode) {
						case 'press':
							b.press();
							break;
						case 'release':
							b.release();
							break;
						case 'toggle':
						default:
							b.toggle();
							break;

					}
				} else {
					_this.log('error', `Cannot ${opt.mode} button named '${opt.name}' as not found.`);
				}
				break;
			}

			/*
			 * Faders
			 */
			case 'fader':
				var fader = _this.api.getFader(opt.index);
				if (fader) {
					fader.fade(opt.value, opt.time);
				} else {
					_this.log('error', `Cannot set fader position for unknown fader '${opt.index}'.`);
				}
				break;

			/*
			 * Sequential
			 */
			case 'sequentialGo':
				_this.api.sequentialGo();
				break;
			case 'sequentialPause':
				_this.api.sequentialPause();
				break;
			case 'sequentialStop':
				_this.api.sequentialStop();
				break;

			/*
			 * Timeline
			 */
			case 'timelinePlayfrom':
				_this.api.timelinePlayfrom();
				break;
			case 'timelinePlayPause':
				_this.api.timelinePlayPause();
				break;
			case 'timelineStop':
				_this.api.timelineStop();
				break;

			/*
			 * Custom commands
			 */
			case 'refresh':
				_this.api.refresh();
				break;
			case 'sendcustomcommand':
				if (opt.command) {
					_this.api.send(opt.command);
				} else {
					_this.log('warning', `Cannot send empty command`);
				}
				break;

			default:
				_this.log('error', `Unknown action - ${action}`);
				break;
		}
	}
}