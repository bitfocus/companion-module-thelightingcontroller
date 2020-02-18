const tcp = require('../../tcp');
const xmlStringParser = require('xml2js').parseString;
const button = require('./button');
const fader = require('./fader');
const bpmCounter = require('./bpmCounter');

/**
 * Companion instance API class for thelightingcontroller.
 * Utilized to track the state of the controller.
 *
 * @version 1.1.0
 * @since 1.1.0
 * @author Craig Dean <thargy@yahoo.com>
 */
class internalAPI {

	/**
	 * Create an instance of a thelightingcontroller API module.
	 *
	 * @param {instance} instance - the parent instance
	 * @since 1.1.0
	 */
	constructor(instance) {
		this.instance = instance;
		this.connected = false;

		this.debug = require('debug')(`instance:${instance.package_info.name}:${instance.id}.api`);
		this.log = function (level, info) {
			instance.system.emit('log', 'instance(' + instance.label + ')', level, "API: " + info);
		};

		// We hold buttons by both name
		this.buttonsByName = {};
		this.buttonsByPosition = {};
		this.faders = {};

		// Choices will be updated dynamically
		this.faderChoices = [];
		this.buttonChoices = [];
		this.buttonPositionChoices = [];

		this.bpmCounter = new bpmCounter(this);
		this.updateRefreshInterval(0);
	}

	/**
	 * INTERNAL: Updates the api status
	 * 
	 * @access private
	 * @param {number} status 
	 * @param {string} message 
	 * @since 1.1.0
	 */
	status(status, message) {
		let _this = this;
		if (status >= _this.instance.STATUS_ERROR) {
			_this.connected = false;
			_this.updateRefreshInterval(0);
			_this.bpmCounter.setMode(false);
		}
		_this.instance.checkFeedbacks('status');

		_this.instance.status(status, message);
	}

	/**
	 * INTERNAL: set the module to an error state.
	 * 
	 * @access private
	 * @param {string} err
	 * @since 1.1.0
	 */
	error(err) {
		let _this = this;
		_this.debug(err);
		_this.log('error', err);
		_this.status(_this.instance.STATUS_ERROR, err);
	}

	/**
	 * Connects to the specified controller.
	 *
	 * @access protected
	 * @param {string} host - the host uri.
	 * @param {number} port - the host port.
	 * @param {string} password - the host password.
	 * @since 1.1.0
	 */
	connect(host, port, password, refreshInterval) {
		let _this = this;

		let receivebuffer = '';
		_this.disconnect();

		_this.updateRefreshInterval(refreshInterval);

		if (!host || !port) {
			return;
		}

		let socket = _this.socket = new tcp(host, port);
		socket.socket.setEncoding(internalAPI.ENCODING);

		socket.on('status_change', function (status, message) {
			_this.status(status, message);
		});

		socket.on('connect', function () {
			_this.status(_this.STATUS_UNKNOWN, 'Connected, waiting for server ready');
			_this.send('HELLO', internalAPI.APPNAME, password);
		});

		socket.on('error', function (err) {
			_this.error(`Network ${err}`);
		});

		socket.on('data', function (chunk) {
			let i = 0, line = '', offset = 0;
			receivebuffer += chunk;

			while ((i = receivebuffer.indexOf(internalAPI.CRLF, offset)) !== -1) {
				line = receivebuffer.substr(offset, i - offset);
				offset = i + 2;
				socket.emit('receiveline', line.toString());
			}
			receivebuffer = receivebuffer.substr(offset);
		});

		socket.on('receiveline', function (line) {
			_this.receiveLine(line);
		});
	}

	/**
	 * Disconnect from the controller.
	 * 
	 * @access public
	 * @since 1.1.0
	 */
	disconnect() {
		let _this = this;
		_this.connected = false;
		_this.interfaceXML = undefined;
		_this.updateRefreshInterval(0);
		_this.bpmCounter.setMode(false);
		let socket = _this.socket;
		if (socket) {
			delete _this.socket;
			socket.destroy();
		}
	}

	/**
	 * INTERNAL: Called when data is received from a device.
	 * 
	 * @access private
	 * @param {string} line - the next line of data received.
	 * @since 1.1.0
	 */
	receiveLine(line) {
		let _this = this;
		let parts = line.split(internalAPI.SEPARATOR);
		let cmd = parts[0];

		switch (cmd) {
			case 'HELLO': {
				_this.log('info', `Connected`);
				_this.connected = true;

				// Synchronise controller
				_this.refresh(true);
				_this.updateRefreshInterval();
				break;
			}
			case 'BPM':
				_this.log('info', `BPM requested.`);
				_this.api.send('BPM', _this.bpmCounter.bpm);
				break;
			case 'BEAT_ON':
				_this.log('info', 'BPM mode set to Auto');
				_this.bpmCounter.setMode(true);
				break;
			case 'BEAT_OFF':
				_this.log('info', 'BPM mode set to Manual');
				_this.bpmCounter.setMode(false);
				break;
			case 'BUTTON_LIST': {
				// Get remainder of line, without split
				_this.updateInterface(line.substr(cmd.length + internalAPI.SEPARATOR.length));
				break;
			}
			case 'BUTTON_PRESS':
			case 'BUTTON_RELEASE':
				var button = _this.getButton(parts[1]);
				var pressed = cmd == 'BUTTON_PRESS';
				if (button) {
					_this.log('info', `Button ${button.name} was ${(pressed ? 'pressed' : 'released')}`);
					button.set(pressed, true);
				} else {
					_this.log('error', `Button ${parts[1]} is unknown.`);
					_this.refresh();
				}
				break;
			case 'FADER_CHANGE':
				var index = Number(parts[1]);
				var value = Number(parts[2]);
				var fader = _this.getFader(index);
				if (fader) {
					_this.log('debug', `Fader ${fader.name} was changed to ${value}.`);
					fader.update(value, true);
				} else {
					_this.log('error', `Fader ${index} is unknown.`);
					_this.refresh();
				}
				break;
			case 'INTERFACE_CHANGE':
				_this.log('info', 'Interface change event received, updating state...');
				_this.refresh();
				break;
			case 'ERROR':
				switch (parts[1]) {
					case 'BAD PASSWORD':
						_this.error("The password is incorrect!");
						break;
					default:
						_this.error(`Sofware responded with error: ${parts.slice(1).join(internalAPI.SEPARATOR)}`);
						break;
				}
				break;
			default:
				_this.log('error', `Unknown event received - ${line}`);
				break;
		}
	}

	/**
	 * Sends a single line command to the API.
	 * 
	 * @access private
	 * @param {...string} args - Command parts 
	 * @since 1.1.0
	 */
	send() {
		let _this = this;
		let socket = _this.socket;
		let cmd = [...arguments].join(internalAPI.SEPARATOR);
		if (!socket || !socket.connected || (arguments[0] != 'HELLO' && !_this.connected)) {
			_this.log('debug', `Cannot send command '${cmd}' as offline!`);
			return;
		}

		_this.debug(`sending '${cmd}' to ${_this.socket.host}`);
		_this.socket.send(cmd + internalAPI.CRLF);
	}

	/**
	 * INTERNAL: Updates the current controller state based on the interface XML.
	 * 
	 * @access private
	 * @param {string} interfaceXML 
	 * @since 1.1.0
	 */
	updateInterface(interfaceXML) {
		let _this = this;
		// We keep the raw XML between calls for rapid comparison
		if (_this.interfaceXML == interfaceXML) {
			_this.log('debug', 'No interface changes found.');
		} else {
			// Store XML for quick comparisons.
			_this.interfaceXML = interfaceXML;
			let buttonsByName = _this.buttonsByName;
			let buttonsByPosition = _this.buttonsByPosition;
			let faders = _this.faders;

			// XML has changed so parse it and detect changes.
			xmlStringParser(interfaceXML, (err, result) => {
				if (err) {
					//_this.disconnect();
					return _this.error(`The button list XML could not parsed. ${err}`);
				}

				let changes = {
					buttons: {
						addedNames: {},
						removedNames: Object.assign({}, buttonsByName),
						addedPositions: {},
						removedPositions: Object.assign({}, buttonsByPosition),
						updatedNames: {},
						updatedPositions: {},
						names: false,
						positions: false,
						types: false,
						colors: false,
						pressed: false
					},
					faders: {
						added: {},
						updated: {},
						removed: Object.assign({}, faders),
						names: false,
						values: false
					}
				};

				// Check we have any exposed buttons
				if (result.buttons && result.buttons.page && result.buttons.page.length) {
					result.buttons.page.forEach((page) => {
						// Get page name in variable safe form
						let pageName = page.$.name;

						// Check we have any buttons on the page
						if (!page.button || !page.button.length) { return; }

						page.button.forEach((b) => {
							if (!b.$) { return; }

							// Read button data
							let buttonName = b['_'];
							if (!buttonName) { return; }

							// Calculate position based on page name, column and line.
							let column = Number(b.$.column);
							let line = Number(b.$.line);
							let typeId = Number(b.$.type);
							let flash = Boolean(Number(b.$.flash));

							// Calculate background color of button.
							let colorHex = b.$.color;
							let pressed = Boolean(Number(b.$.pressed));

							// Lookup button.
							b = changes.buttons.removedNames[buttonName];
							if (!b) {
								// Create new button
								b = new button(
									this,
									buttonName,
									pageName,
									column,
									line,
									typeId,
									flash,
									colorHex,
									pressed);

								changes.buttons.addedNames[buttonName] = b;
								if (changes.buttons.removedPositions[b.position]) {
									delete changes.buttons.removedPositions[b.position];
									changes.buttons.updatedPositions[b.position] = b;
								} else {
									changes.buttons.addedPositions[b.position] = b;
								}

								changes.buttons.names = true;
								changes.buttons.positions = true;
								changes.buttons.types = true;
								changes.buttons.colors = true;
								changes.buttons.pressed = true;
							} else {
								delete changes.buttons.removedNames[buttonName];
								let updated = false;

								// Check for any changes
								if (b.setPosition(pageName, column, line)) {
									// Position changed
									if (changes.buttons.removedPositions[b.position]) {
										delete changes.buttons.removedPositions[b.position];
										changes.buttons.updatedPositions[b.position] = b;
									} else {
										changes.buttons.addedPositions[b.position] = b;
									}
									updated = changes.buttons.positions = true;
								} else {
									delete changes.buttons.removedPositions[b.position];
								}

								if (b.setType(typeId, flash)) {
									updated = changes.buttons.types = true;
								}

								if (b.setColor(colorHex)) {
									updated = changes.buttons.colors = true;
								}

								if (b.pressed != pressed) {
									b.pressed = pressed;
									updated = changes.buttons.pressed = true;
								}

								if (updated) {
									changes.buttons.updatedNames[b.name] = b;
								}
							}
						})
					});
				} else {
					_this.log('warning', 'No pages exposed');
				}

				// Check for faders
				if (result.buttons && result.buttons.fader && result.buttons.fader.length) {
					result.buttons.fader.forEach((f) => {
						if (!f.$) { return; }

						// Get index, name and value
						var index = Number(f.$.index);
						var faderName = f['_'];
						var value = Number(f.$.value);

						// Lookup fader
						f = changes.faders.removed[index];
						if (!f) {
							// Create fader
							f = new fader(
								this,
								index,
								faderName,
								value);
							changes.faders.added[index] = f;

							changes.faders.names = true;
							changes.faders.values = true;
						} else {
							delete changes.faders.removed[index];
							let updated = false;

							// Check for changes
							if (f.name != faderName) {
								f.name = faderName;
								updated = changes.faders.names = true;
							}

							if (f.value != value) {
								f.update(value, true);
								updated = changes.faders.values = true;
							}

							if (updated) {
								changes.faders.updated[index] = f;
							}
						}
					});
				} else {
					_this.log('warning', 'No faders exposed');
				}

				changes.buttonNamesOrPosition = changes.buttons.names || changes.buttons.positions;
				changes.anyButtons = changes.buttonNamesOrPosition || changes.buttons.types || changes.buttons.colors || changes.buttons.pressed;
				changes.anyFaders = changes.faders.names || changes.faders.values;

				let instance = _this.instance;
				if (changes.anyButtons || changes.anyFaders) {
					_this.log('info', 'Successfully parsed interface changes.');
					let msg = '';

					// Process button changes
					if (changes.anyButtons) {
						let m = [];
						let rn = Object.keys(changes.buttons.removedNames).length;
						let an = Object.keys(changes.buttons.addedNames).length;
						let rp = Object.keys(changes.buttons.removedPositions).length;
						let ap = Object.keys(changes.buttons.addedPositions).length;
						let un = Object.keys(changes.buttons.updatedNames).length;
						let up = Object.keys(changes.buttons.updatedPositions).length;

						// Process removals
						if (rn > 0) {
							Object.entries(changes.buttons.removedNames).forEach(([n, b]) => {
								if (buttonsByName[n] != b) {
									_this.log('error', `Removing unexpected button ${buttonsByName[n].name} != ${b.name}.`);
								}
								delete buttonsByName[n];
								instance.removeButtonNameVariables(b);
								instance.removeButtonNamePresets(b);
							});
							m.push(rn + ' names removed');
						}
						if (rp > 0) {
							Object.entries(changes.buttons.removedPositions).forEach(([p, b]) => {
								if (buttonsByPosition[p] != b) {
									_this.log('error', `Removing unexpected button ${buttonsByPosition[p].name} != ${b.name} by position.`);
								}
								delete buttonsByPosition[p];
								instance.removeButtonPositionVariables(b);
								instance.removeButtonPositionPresets(b);
							});
							m.push(rp + ' positions removed');
						}

						// Process additions					
						if (an > 0) {
							Object.entries(changes.buttons.addedNames).forEach(([n, b]) => {
								buttonsByName[n] = b;
								instance.updateButtonNameVariables(b);
								instance.updateButtonNamePresets(b);
							});
							m.push(an + ' names added');
						}
						if (ap > 0) {
							Object.entries(changes.buttons.addedPositions).forEach(([p, b]) => {
								buttonsByPosition[p] = b;
								instance.updateButtonPositionVariables(b);
								instance.updateButtonPositionPresets(b);
							});
							m.push(ap + ' positions added');
						}

						// Process updates
						if (un > 0) {
							Object.entries(changes.buttons.updatedNames).forEach(([n, b]) => {
								buttonsByName[n] = b;
								instance.updateButtonNameVariables(b);
								instance.updateButtonNamePresets(b);
							});
							m.push(un + ' names updated');
						}
						if (up > 0) {
							Object.entries(changes.buttons.updatedPositions).forEach(([p, b]) => {
								buttonsByPosition[p] = b;
								instance.updateButtonPositionVariables(b);
								instance.updateButtonPositionPresets(b);
							});
							m.push(up + ' positions updated');
						}

						if (changes.buttonNamesOrPosition) {
							// Rebuild choices arrays
							let buttonChoices = _this.buttonChoices;
							let buttonPositionChoices = _this.buttonPositionChoices;
							buttonChoices.length = 0;
							buttonPositionChoices.length = 0;
							Object.values(buttonsByPosition).forEach((b) => {
								buttonChoices.push(b.choice);
								buttonPositionChoices.push(b.positionChoice);
							});
						}

						msg += '\n Buttons: ' + m.join('; ') + '.';
					}

					// Process fader changes
					if (changes.anyFaders) {
						let m = []
						let rf = Object.keys(changes.faders.removed).length;
						let af = Object.keys(changes.faders.added).length;
						let uf = Object.keys(changes.faders.updated).length;
						if (rf > 0) {
							Object.entries(changes.faders.removed).forEach(([i, f]) => {
								if (faders[i] != f) {
									_this.log('error', `Removing unexpected fader ${faders[i].name} != ${f.name} by position.`);
								}
								delete faders[i];
								instance.removeFaderVariables(f);
								instance.removeFaderPresets(f);
							});
							m.push(rf + ' removed');
						}
						if (af > 0) {
							Object.entries(changes.faders.added).forEach(([i, f]) => {
								faders[i] = f;
								instance.updateFaderVariables(f);
								instance.updateFaderPresets(f);
							});

							m.push(af + ' added');
						}
						if (uf > 0) {
							Object.entries(changes.faders.updated).forEach(([i, f]) => {
								faders[i] = f;
								instance.updateFaderVariables(f);
								instance.updateFaderPresets(f);
							});

							m.push(uf + ' updated');
						}

						// Rebuild choices arrays
						let faderChoices = _this.faderChoices;
						faderChoices.length = 0;
						Object.values(faders).forEach((f) => {
							faderChoices.push(f.choice);
						});

						msg += '\n Faders: ' + m.join('; ') + '.';
					}

					_this.log('debug', msg);

					if (changes.anyFaders || changes.buttonNamesOrPosition) {
						instance.refreshActions();
						instance.refreshFeedback();
						instance.refreshPresets();
					}

					instance.refreshVariables();

					// TODO Can we only check some?
					instance.checkAllFeedbacks();
				}

				// Ensure status set to OK.
				_this.status(instance.STATUS_OK);
			});
		}
	}

	/**
	 * Sends a single beat to the controller
	 * 
	 * @access public
	 * @since 1.1.0
	 */
	beat() {
		this.send('BEAT');
	}

	/**
	 * Sends a BPM tap to the controller.
	 * 
	 * @access public
	 * @since 1.1.0
	 */
	bpmTap() {
		let _this = this;
		_this.bpmCounter.tap();
	}

	/**
	 * Sets the current BPM
	 * 
	 * @param {number} bpm - beats per minute; between 10 and 500, or 0 for manual mode.
	 * @access public
	 * @since 1.1.0
	 */
	bpm(bpm) {
		let _this = this;
		_this.bpmCounter.updateBPM(Number(bpm));
	}

	/**
	 * Turns audio BPM on/off, which detects BPM from audio source.
	 * 
	 * @param {boolean} on - true to turn on.
	 * @access public
	 * @since 1.1.0
	 */
	audioBPM(on) {
		let _this = this;
		let state = on ? 'ON' : 'OFF';
		_this.instance.updateVariable('audioBPM', state);
		_this.bpmCounter.setMode(!on);
		_this.instance.refreshVariables();
		_this.send('AUTO_BPM_' + state);
	}

	/**
	 * Turns freeze on/off.
	 * 
	 * @param {boolean} on - true to turn on.
	 * @access public
	 * @since 1.1.0
	 */
	freeze(on) {
		let _this = this;
		let state = on ? 'ON' : 'OFF';
		_this.instance.updateVariable('frozen', state, true);
		_this.send('FREEZE_' + state);
	}

	/**
	 * Sends a cue to the controller - this presses the button with the cue name, and
	 * sets the 'lastCue' variable to the new cue name.
	 * 
	 * @param {string} name 
	 * @access public
	 * @since 1.1.0
	 */
	cue(name) {
		let _this = this;
		if (!name) {
			_this.log('error', 'Cue name not supplied.');
		}
		_this.instance.updateVariable('lastCue', name, true);
		_this.send('CUE', name)
	}

	/**
	 * Gets a button by name.
	 * 
	 * @returns {button} The button.
	 * @param {string} name - the button name.
	 * @access public
	 * @since 1.1.0
	 */
	getButton(name) {
		return this.buttonsByName[name];
	}

	/**
	 * Gets a button by name.
	 * 
	 * @returns {button} The button.
	 * @param {string} position - the button's position.
	 * @access public
	 * @since 1.1.0
	 */
	getButtonPosition(position) {
		return this.buttonsByPosition[position];
	}

	/**
	 * Gets the fader with the specified index.
	 * 
	 * @returns {fader} The fader.
	 * @param {number} index 
	 * @access public
	 * @since 1.1.0
	 */
	getFader(index) {
		return this.faders[index];
	}

	/**
	 * Starts the sequential list.
	 * 
	 * @access public
	 * @since 1.1.0
	 */
	sequentialGo() {
		let _this = this;
		_this.send('SEQUENTIAL_GO');
	}

	/**
	 * Pauses the sequential list.
	 * 
	 * @access public
	 * @since 1.1.0
	 */
	sequentialPause() {
		let _this = this;
		_this.send('SEQUENTIAL_PAUSE');
	}

	/**
	 * Stops the sequential list.
	 * 
	 * @access public
	 * @since 1.1.0
	 */
	sequentialStop() {
		let _this = this;
		_this.send('SEQUENTIAL_STOP');
	}

	/**
	 * Starts the timeline from the red marker.
	 * 
	 * @access public
	 * @since 1.1.0
	 */
	timelinePlayfrom() {
		let _this = this;
		_this.instance.updateVariable('timelineState', 'PLAYING', true);
		_this.send('TIMELINE_PLAYFROM');
		_this.instance.checkFeedbacks('timelinePlayPause');
	}

	/**
	 * Plays or pause the timeline
	 * 
	 * @access public
	 * @since 1.1.0
	 */
	timelinePlayPause() {
		let _this = this;
		switch (_this.instance.getVariableValue('timelineState')) {
			case 'PLAYING':
				_this.instance.updateVariable('timelineState', 'PAUSED', true);
				break;
			default:
				_this.instance.updateVariable('timelineState', 'PLAYING', true);
				break;
		}
		_this.send('TIMELINE_PLAY');
		_this.instance.checkFeedbacks('timelinePlayPause');
	}

	/**
	 * Stops the timeline
	 * 
	 * @access public
	 * @since 1.1.0
	 */
	timelineStop() {
		let _this = this;
		_this.instance.updateVariable('timelineState', 'STOPPED', true);
		_this.send('TIMELINE_STOP');
		_this.instance.checkFeedbacks('timelinePlayPause');
	}

	/**
	 * Triggers a refresh of the controller state.
	 * 
	 * @access public
	 * @since 1.1.0
	 */
	refresh(force) {
		let _this = this;

		if (!_this.connected) {
			_this.log('error', 'Cannot refresh interface as offline!');
			return;
		}

		// Tell controller what we think the current state is
		// The following are not reported from the controller directly and
		// can be changed by other controllers so we force them to sync here.
		// TODO Make this behaviour configurable.
		_this.bpmCounter.updateBPM(_this.instance.getVariableValue('BPM'));
		_this.audioBPM(_this.instance.getVariableValue('audioBPM') == 'ON');
		_this.freeze(_this.instance.getVariableValue('frozen') == 'ON');
		if (force) {
			let cue = _this.instance.getVariableValue('lastCue');
			if (cue) {
				_this.cue(cue);
			}
			switch (_this.instance.getVariableValue('timelineState')) {
				case 'PLAYING':
					_this.timelinePlayfrom();
					break;
				case 'PAUSED':
					// Start and immediately pause to put us in pause mode
					_this.timelinePlayfrom();
					_this.timelinePlayPause();
					break;
				case 'STOPPED':
					_this.timelineStop();
					break;
			}
		}
		this.send('BUTTON_LIST');
	}

	/**
	 * Updates the refresh interval.
	 * 
	 * @param {number|undefined} refreshInterval - Interval, in milliseconds, between interface refreshes. 0 to cancel, undefined to use current value.
	 * @access public
	 * @since 1.1.0
	 */
	updateRefreshInterval(refreshInterval) {
		let _this = this;
		if (isNaN(refreshInterval)) {
			refreshInterval = _this.refreshInterval || 0;
		} else if (refreshInterval > 9999999) {
			refreshInterval = 9999999;
		}

		console.log(`Refresh Interval: ${refreshInterval}`);
		// Cancel current refresh timer (if any).
		let timer = _this.refreshTimer;
		if (timer) {
			delete _this.refreshTimer;
			clearInterval(timer);
		}

		if (refreshInterval < 100) {
			// Cancelling refresh
			return;
		}

		_this.refreshInterval = refreshInterval;
		_this.refreshTimer = setInterval(function () {
			_this.refresh(false)
		}, refreshInterval);
	}

	/**
	 * Calculates a color proportionally between start and end.
	 * 
	 * @returns {number} A color between start and end.
	 * @param {number} start - start color.
	 * @param {number} end - end color.
	 * @param {number} amount - <=0 to return start, >=1 to return end, otherwise a color between the two.
	 * @access public
	 * @since 1.1.0
	 */
	lerp(start, end, amount) {
		if (start == end || amount <= 0) return start;
		if (amount >= 1) return end;

		var sc = this.toColor(start);
		var ec = this.toColor(end);

		return this.fromColor({
			r: sc.r + Math.round(amount * (ec.r - sc.r)),
			g: sc.g + Math.round(amount * (ec.g - sc.g)),
			b: sc.b + Math.round(amount * (ec.b - sc.b)),
			a: sc.a + Math.round(amount * (ec.a - sc.a))
		});
	}

	/**
	 * Converts a numerical color to its object form.
	 * 
	 * @returns {Object} Color as a color object
	 * @param {number} color - color as a number
	 * @access public
	 * @since 1.1.0
	 */
	toColor(color) {
		return {
			b: color & 0xFF,
			g: (color & 0xFF00) >>> 8,
			r: (color & 0xFF0000) >>> 16,
			a: ((color & 0xFF000000) >>> 24) / 255
		};
	}

	/**
	 * Converts a color object to its numerical representation.
	 * 
	 * @return {number} Color as a number.
	 * @param {Object} color Color as a color object.
	 * @param {number} color.a - Color alpha.
	 * @param {number} color.r - Color red component.
	 * @param {number} color.g - Color green component.
	 * @param {number} color.b - Color blue component.
	 * @access public
	 * @since 1.1.0
	 */
	fromColor(color) {
		return (((color.r & 0xff) << 16) |
			((color.g & 0xff) << 8) |
			(color.b & 0xff))
			+ color.a * 0x1000000
	}
}

internalAPI.CRLF = '\u000d\u000a';
internalAPI.SEPARATOR = '|';
internalAPI.APPNAME = "thelightingcontrollerclient";
internalAPI.ENCODING = "utf8";
internalAPI.NAMEPREFIX = '$';

exports = module.exports = internalAPI;