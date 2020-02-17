module.exports = {

	/**
	 * Initialises the presets.
	 *
	 * @access private
	 * @since 1.1.0
	 */
	initPresets() {
		let _this = this;

		let icons = _this.icons;
		_this.presets = {};
		_this.buttonPresetPrefix = '$';
		_this.faderPresetPrefix = '#';
		_this.updatePresets({
			id: 'Refresh',
			category: 'Miscellaneous',
			label: 'Refresh',
			bank: {
				style: 'text',
				text: 'Refresh\\nDMX',
				size: 'auto',
				color: _this.rgb(255, 255, 255),
				bgcolor: _this.rgb(0, 0, 0)
			},
			actions: [
				{
					action: 'refresh'
				}
			],
			feedbacks: [
				{
					type: 'status'
				}
			]
		}, {
			id: 'Freeze',
			category: 'Miscellaneous',
			label: 'Freeze',
			bank: {
				style: 'text',
				text: '$(QuickDMX:frozen)',
				size: '14',
				png64: icons.freeze,
				alignment: 'center:bottom',
				pngalignment: 'center:center',
				color: _this.rgb(255, 255, 255),
				bgcolor: _this.rgb(0, 0, 0),
				latch: true
			},
			actions: [
				{
					action: 'freeze',
					options: {
						on: 'true'
					}
				}
			],
			release_actions: [
				{
					action: 'freeze',
					options: {
						on: 'false'
					}
				}
			],
			feedbacks: [
				{
					type: 'status'
				}
			]
		}, {
			id: 'Tap',
			category: 'Tempo',
			label: 'Tap BPM and send Beat.',
			bank: {
				style: 'text',
				text: '$(QuickDMX:BPM) BPM',
				size: '14',
				png64: icons.getBeatIcon(0),
				alignment: 'center:top',
				pngalignment: 'center:bottom',
				color: _this.rgb(255, 255, 255),
				bgcolor: _this.rgb(0, 0, 0)
			},
			actions: [
				{
					action: 'bpmTap'
				}
			],
			feedbacks: [
				{
					type: 'bpm'
				},
				{
					type: 'status'
				}
			]
		}, {
			id: 'Set BPM 120',
			category: 'Tempo',
			label: 'Set BPM to 120.',
			bank: {
				style: 'text',
				text: 'SET BPM\\n120',
				size: 'auto',
				alignment: 'center:center',
				color: _this.rgb(255, 255, 255),
				bgcolor: _this.rgb(0, 0, 0)
			},
			actions: [
				{
					action: 'bpm',
					options: {
						bpm: 120
					}
				}
			],
			feedbacks: [
				{
					type: 'status'
				}
			]
		}, {
			id: 'Audio BPM',
			category: 'Tempo',
			label: 'Set BPM to use audio (puts in manual Beat mode).',
			bank: {
				style: 'text',
				text: '$(QuickDMX:audioBPM)',
				size: '14',
				png64: icons.audioBPM,
				alignment: 'center:bottom',
				pngalignment: 'center:center',
				color: _this.rgb(255, 255, 255),
				bgcolor: _this.rgb(0, 0, 0),
				latch: true
			},
			actions: [
				{
					action: 'audioBPM',
					options: {
						on: 'true'
					}
				}
			],
			release_actions: [
				{
					action: 'audioBPM',
					options: {
						on: 'false'
					}
				}
			],
			feedbacks: [
				{
					type: 'status'
				}
			]
		}, {
			id: 'Sequential List Go',
			category: 'Sequential List',
			label: 'Sequential List Go',
			bank: {
				style: 'text',
				text: 'List',
				size: '14',
				png64: icons.sequence,
				alignment: 'center:bottom',
				pngalignment: 'center:center',
				color: _this.rgb(255, 255, 255),
				bgcolor: _this.rgb(0, 0, 0)
			},
			actions: [
				{
					action: 'sequentialGo'
				}
			],
			feedbacks: [
				{
					type: 'status'
				}
			]
		}, {
			id: 'Sequential List Pause',
			category: 'Sequential List',
			label: 'Sequential List Pause',
			bank: {
				style: 'text',
				text: 'List',
				size: '14',
				png64: icons.timeline.pause,
				alignment: 'center:bottom',
				pngalignment: 'center:center',
				color: _this.rgb(255, 255, 255),
				bgcolor: _this.rgb(0, 0, 0)
			},
			actions: [
				{
					action: 'sequentialPause'
				}
			],
			feedbacks: [
				{
					type: 'status'
				}
			]
		}, {
			id: 'Sequential List Stop',
			category: 'Sequential List',
			label: 'Sequential List Stop',
			bank: {
				style: 'text',
				text: 'List',
				size: '14',
				png64: icons.timeline.stop,
				alignment: 'center:bottom',
				pngalignment: 'center:center',
				color: _this.rgb(255, 255, 255),
				bgcolor: _this.rgb(0, 0, 0)
			},
			actions: [
				{
					action: 'sequentialStop'
				}
			],
			feedbacks: [
				{
					type: 'status'
				}
			]
		}, {
			id: 'Timeline Play From',
			category: 'Timeline',
			label: 'Timeline Play from Marker',
			bank: {
				style: 'text',
				text: 'Timeline',
				size: '14',
				png64: icons.timeline.playfrom,
				alignment: 'center:bottom',
				pngalignment: 'center:center',
				color: _this.rgb(255, 255, 255),
				bgcolor: _this.rgb(0, 0, 0)
			},
			actions: [
				{
					action: 'timelinePlayfrom'
				}
			],
			feedbacks: [
				{
					type: 'status'
				}
			]
		}, {
			id: 'Timeline Play Pause',
			category: 'Timeline',
			label: 'Timeline Play/Pause',
			bank: {
				style: 'text',
				text: 'Timeline',
				size: '14',
				png64: icons.timeline.play,
				alignment: 'center:bottom',
				pngalignment: 'center:center',
				color: _this.rgb(255, 255, 255),
				bgcolor: _this.rgb(0, 0, 0)
			},
			actions: [
				{
					action: 'timelinePlayPause'
				}
			],
			feedbacks: [
				{
					type: 'timelinePlayPause'
				}, {
					type: 'status'
				}
			]
		}, {
			id: 'Timeline Stop',
			category: 'Timeline',
			label: 'Timeline Stop',
			bank: {
				style: 'text',
				text: 'Timeline',
				size: '14',
				png64: icons.timeline.stop,
				alignment: 'center:bottom',
				pngalignment: 'center:center',
				color: _this.rgb(255, 255, 255),
				bgcolor: _this.rgb(0, 0, 0)
			},
			actions: [
				{
					action: 'timelineStop'
				}
			],
			feedbacks: [
				{
					type: 'status'
				}
			]
		});

		_this.refreshPresets();
	},

	/**
	 * Refreshes the preset definitions.
	 * 
	 * @access private
	 * @since 1.1.0
	 */
	refreshPresets() {
		let _this = this;
		_this.setPresetDefinitions(Object.values(_this.presets));
	},

	/**
	 * Updates all specified presets.
	 * 
	 * @param {...object} args - Preset objects to add or update.
	 * @access private
	 * @since 1.1.0
	 */
	updatePresets() {
		let _this = this;
		for (var arg = 0; arg < arguments.length; ++arg) {
			var preset = arguments[arg];
			if (preset.id) {
				_this.presets[preset.id] = preset;
			} else {
				_this.log('error', `Missing id for preset '${preset.label}'`);
			}
		}
	},

	/**
	 * Removes all specified presets.
	 * 
	 * @param {...string} args - Preset names to remove.
	 * @access private
	 * @since 1.1.0
	 */
	removePresets() {
		let _this = this;
		for (var arg = 0; arg < arguments.length; ++arg) {
			delete _this.presets[arguments[arg]];
		}
	},

	/**
	 * Updates all name presets related to the specified button.
	 * 
	 * @param {button} button - Button.
	 * @access private
	 * @since 1.1.0
	 */
	updateButtonNamePresets(button) {
		let _this = this;
		_this.updatePresets({
			id: `${_this.buttonPresetPrefix}N_${button.name}`,
			category: 'Buttons by name',
			label: button.flash ? 'Press flash button' : 'Toggle button',
			bank: {
				style: 'png',
				text: button.displayName,
				png64: button.icon,
				alignment: 'center:bottom',
				pngalignment: 'left:top',
				size: 'auto',
				color: 0,
				bgcolor: button.color
			},
			actions: [
				{
					action: 'button',
					options: {
						name: button.name,
						mode: (button.flash ? 'press' : 'toggle')
					}
				}
			],
			feedbacks: [
				{
					type: 'buttonColor',
					options: {
						name: button.name
					}
				}, {
					type: 'status'
				}
			]
		});
	},

	/**
	 * Updates all position presets related to the specified button.
	 * 
	 * @param {button} button - Button.
	 * @access private
	 * @since 1.1.0
	 */
	updateButtonPositionPresets(button) {
		let _this = this;
		_this.updatePresets({
			id: `${_this.buttonPresetPrefix}P_${button.name}`,
			category: 'Buttons by position',
			label: button.flash ? 'Press flash button' : 'Toggle button',
			bank: {
				style: 'png',
				text: `$(QuickDMX:button${button.position}Name)`,
				png64: button.icon,
				alignment: 'center:bottom',
				pngalignment: 'left:top',
				size: 'auto',
				color: 0,
				bgcolor: button.color
			},
			actions: [
				{
					action: 'buttonPosition',
					options: {
						position: button.position,
						mode: (button.flash ? 'press' : 'toggle')
					}
				}
			],
			feedbacks: [
				{
					type: 'buttonColorPosition',
					options: {
						position: button.position
					}
				}, {
					type: 'status'
				}
			]
		});
	},

	/**
	 * Removes all name presets related to the specified button.
	 * 
	 * @param {button} button - Button.
	 * @access private
	 * @since 1.1.0
	 */
	removeButtonNamePresets(button) {
		let _this = this;
		_this.removePresets(
			`${_this.buttonPresetPrefix}P_${button.name}`
		);
	},

	/**
	 * Removes all position presets related to the specified button.
	 * 
	 * @param {button} button - Button.
	 * @access private
	 * @since 1.1.0
	 */
	removeButtonPositionPresets(button) {
		let _this = this;
		_this.removePresets(
			`${_this.buttonPresetPrefix}N_${button.name}`
		);
	},

	/**
	 * Updates all presets related to the specified fader.
	 * 
	 * @param {fader} fader - Button.
	 * @access private
	 * @since 1.1.0
	 */
	updateFaderPresets(fader) {
		let _this = this;
		_this.updatePresets({
			id: `${_this.FaderPrefix}0_${fader.index}`,
			category: 'Faders',
			label: 'Set Fader to 0 (ON), and fade background with fader value.',
			bank: {
				style: 'text',
				text: `$(QuickDMX:fader${fader.index}Name)\\n$(QuickDMX:fader${fader.index}Value)`,
				size: 'auto',
				color: _this.rgb(255, 255, 255),
				bgcolor: _this.rgb(0, 200, 0)
			},
			actions: [
				{
					action: 'fader',
					options: {
						index: fader.index,
						value: 0
					}
				}
			],
			feedbacks: [
				{
					type: 'faderFadeColor',
					options: {
						index: fader.index,
					}
				}, {
					type: 'status'
				}
			]
		}, {
			id: `${_this.FaderPrefix}-100_${fader.index}`,
			category: 'Faders',
			label: 'Set Fader to -100 (OFF).',
			bank: {
				style: 'text',
				text: `$(QuickDMX:fader${fader.index}Name)\\nOFF`,
				size: 'auto',
				color: _this.rgb(255, 255, 255),
				bgcolor: 0
			},
			actions: [
				{
					action: 'fader',
					options: {
						index: fader.index,
						value: -100
					}
				}
			],
			feedbacks: [
				{
					type: 'faderColor',
					options: {
						index: fader.index,
						value: -100,
						// Must match -100 exactly to be fully off
						tolerance: 0,
						matchedbg: _this.rgb(128, 0, 0)
					}
				}, {
					type: 'status'
				}
			]
		});
	},

	/**
	 * Removes all presets related to the specified fader.
	 * 
	 * @param {fader} fader - Button.
	 * @access private
	 * @since 1.1.0
	 */
	removeFaderPresets(fader) {
		let _this = this;
		_this.removePresets(
			`${_this.FaderPrefix}0_${fader.index}`,
			`${_this.FaderPrefix}-100_${fader.index}`);
	}
}