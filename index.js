const CRLF = '\u000d\u000a';
const SEPARATOR = '|';
const APPNAME = "thelightingcontrollerclient";
const ENCODING = "utf8";
const NAMEPREFIX = '$';

var xmlStringParser = require('xml2js').parseString;
var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');
var debug;
var log;


function instance(system, id, config) {
	var self = this;

	self.CHOICES_INPUTS = [];
	self.CHOICES_OUTPUTS = [];
	self.CHOICES_PRESETS = [];

	self.state = {};

	// super-constructor
	instance_skel.apply(this, arguments);

	return self;
}

instance.prototype.init = function () {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.status(self.STATE_UNKNOWN);

	self.init_presets();
	self.init_tcp();
};


instance.prototype.init_presets = function () {
	var self = this;
	var presets = [];
	var myname = self.label;

	for (var pb = 1; pb <= this.numPlaybacks; pb++) {
		presets.push({
			category: 'Playbacks',
			label: 'Go button for playback ' + pb,
			bank: {
				style: 'text',
				text: 'GO ' + pb,
				size: 'auto',
				color: 0,
				bgcolor: self.rgb(255, 0, 0)
			},
			actions: [
				{
					action: 'playback_go',
					options: {
						playback: pb
					}
				}
			]
		}, {
			category: 'Playbacks with Cuestatus',
			label: 'Go button for playback ' + pb,
			bank: {
				style: 'text',
				text: 'GO ' + pb + '\\n$(' + myname + ':playback' + pb + '_cuestack) : $(' + myname + ':playback' + pb + '_cue)',
				size: 'auto',
				color: 0,
				bgcolor: self.rgb(255, 0, 0)
			},
			actions: [
				{
					action: 'playback_go',
					options: {
						playback: pb
					}
				}
			],
			feedbacks: [
				{
					type: 'playback_empty',
					options: {
						playback: pb,
						goodbg: self.rgb(255, 0, 0),
						goodfg: self.rgb(0, 0, 0),
						badbg: self.rgb(127, 0, 0),
						badfg: self.rgb(0, 0, 0)
					}
				}
			]
		});

		for (var la = 1; la <= this.numLayers; la++) {
			presets.push({
				category: 'Sources',
				label: 'Play button for source ' + la,
				bank: {
					style: 'text',
					text: '⏵ ' + la + '\\n$(' + myname + ':source' + la + '_elapsed)',
					size: '18',
					color: 0,
					bgcolor: self.rgb(255, 0, 0)
				},
				actions: [
					{
						action: 'layer_playback',
						options: {
							layer: la,
							playstate: 0
						}
					}
				],
				feedbacks: [
					{
						type: 'source_playstate',
						options: {
							source: la,
							playstate: '0',
							goodbg: self.rgb(255, 0, 0),
							goodfg: self.rgb(0, 0, 0),
							badbg: self.rgb(127, 0, 0),
							badfg: self.rgb(0, 0, 0)
						}
					}
				]
			}, {
				category: 'Sources',
				label: 'Pause button for source ' + la,
				bank: {
					style: 'text',
					text: '⏸ ' + la,
					size: '18',
					color: 0,
					bgcolor: self.rgb(255, 0, 0)
				},
				actions: [
					{
						action: 'layer_playback',
						options: {
							layer: la,
							playstate: 5
						}
					}
				],
				feedbacks: [
					{
						type: 'source_playstate',
						options: {
							source: la,
							playstate: '5',
							goodbg: self.rgb(255, 0, 0),
							goodfg: self.rgb(0, 0, 0),
							badbg: self.rgb(127, 0, 0),
							badfg: self.rgb(0, 0, 0)
						}
					}
				]
			}, {
				category: 'Sources',
				label: 'Stop button for source ' + la,
				bank: {
					style: 'text',
					text: '⏹ ' + la + '\\n$(' + myname + ':source' + la + '_countdown)',
					size: '18',
					color: 0,
					bgcolor: self.rgb(255, 0, 0)
				},
				actions: [
					{
						action: 'layer_playback',
						options: {
							layer: la,
							playstate: 6
						}
					}
				],
				feedbacks: [
					{
						type: 'source_playstate',
						options: {
							source: la,
							playstate: '6',
							goodbg: self.rgb(255, 0, 0),
							goodfg: self.rgb(0, 0, 0),
							badbg: self.rgb(127, 0, 0),
							badfg: self.rgb(0, 0, 0)
						}
					}
				]
			});
		}
	}
	this.setPresetDefinitions(presets);
};


instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module is for controlling TheLightingController software, often released as Showtec QuickDMX, Chauvet ShowXpress or Sweetlight Controller.'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Software IP Address',
			width: 12,
			default: '127.0.0.1',
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Port number',
			width: 12,
			default: '7348',
			regex: self.REGEX_PORT
		},
		{
			type: 'textinput',
			id: 'password',
			label: 'Password',
			width: 6
		}
	]
};

instance.prototype.updateConfig = function (config) {
	var self = this;

	self.config = config;
	self.init_tcp();
};

// When module gets deleted
instance.prototype.destroy = function () {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
	}

	debug("destroy", self.id);
};

instance.prototype.action = function (action) {
	var self = this;
	var cmd;
	var opt = action.options;

	switch (action.action) {
		/*
		 * Tempo controls
		 */
		case 'beat':
			cmd = 'BEAT';
			break;
		case 'bpmTap':
			cmd = 'BPM_TAP';
			break;
		case 'bpm':
			const bpm = Number(opt.bpm);
			if (isNaN(bpm) || bpm < 0 || bpm > 399) {
				log('error', `Invalid BPM value ${opt.bpm}.`);
			} else {
				cmd = `BPM${SEPARATOR}${bpm}`;
			}
			break;
		case 'autobpm':
			cmd = `AUTO_BPM_${(opt.state=='true' ? 'ON' : 'OFF')}`;
			break;
		case 'freeze':
			cmd = `FREEZE_${(opt.state=='true' ? 'ON' : 'OFF')}`;
			break;

		/*
		 * Cues
		 */
		case 'cue':
			if (opt.name) {
				cmd = `CUE${SEPARATOR}${opt.name}`;
			} else {
				log('error', `Cannot perform ${action.action} action as required cue name not specified.`);
			}
			break;

		/*
		 * Buttons
		 */
		case 'toggle':
		case 'press':
		case 'release':
		case 'togglePosition':
		case 'pressPosition':
		case 'releasePosition':
			var button = self.getButton(opt.name);
			if (button) {
				var press;
				switch (action.action) {
					case 'toggle':
					case 'togglePosition':
						press = !button.pressed;
						break;
					case 'press':
					case 'pressPosition':
						press = true;
						break;
					default:
						press = false;
						break;
				}
				cmd = `BUTTON_${(press ? 'PRESS' : 'RELEASE')}${SEPARATOR}${button.name}`;
			} else {
				log('error', `Cannot perform ${action.action} action for unknown button ${(action.action.includes('Position') ? 'position' : 'index')} '${opt.name}'.`);
			}
			break;

		/*
		 * Faders
		 */
		case 'fader':
			var fader = self.getFader(opt.name);
			if (fader) {
				var value = opt.value;
				if (isNaN(value) || value > 100 || value < -100) {
					log('error', `Cannot perform ${action.action} action for fader ${opt.name}, as value '${value}' is invalid.`);
				} else {
					cmd = `FADER_CHANGE${SEPARATOR}${fader.index}${SEPARATOR}${value}`;
				}
			} else {
				log('error', `Cannot perform ${action.action} action for unknown fader '${opt.name}'.`);
			}
			break;

		/*
		 * Sequential
		 */
		case 'sequentialGo':
			cmd = 'SEQUENTIAL_GO';
			break;
		case 'sequentialPause':
			cmd = 'SEQUENTIAL_PAUSE';
			break;
		case 'sequentialStop':
			cmd = 'SEQUENTIAL_STOP';
			break;

		/*
		 * Timeline
		 */
		case 'timelinePlayfrom':
			cmd = 'TIMELINE_PLAYFROM';
			break;
		case 'timelinePlay':
			cmd = 'TIMELINE_PLAY';
			break;
		case 'timelineStop':
			cmd = 'TIMELINE_STOP';
			break;

		/*
		 * Custom commands
		 */
		case 'sendcustomcommand':
			cmd = opt.command;
			break;

		default:
			log('error', `Unknown action - ${action.action}`);
			break;
	}

	debug('action():', action);

	if (cmd !== undefined) {
		if (self.socket !== undefined) {
			debug(`sending '${cmd}' to ${self.socket.host}`);
			self.send(cmd);
		}
	}
};

instance.prototype.feedback = function (feedback, bank) {
	var self = this;
	var opt = feedback.options;

	switch (feedback.type) {
		case 'syncColor':
		case 'syncColorPosition':
			var button = self.getButton(opt.name);
			if (!button) {
				return {
					color: opt.disabledfg,
					bgcolor: opt.disabledbg
				};
			} else if (button.pressed) {
				var bg;
				if (opt.alpha < 0) {
					bg = rgb(0, 0, 0);
				} else if (opt.alpha > 255) {
					bg = rgb(255, 255, 255);
				} else {
					bg = opt.alpha * 0x1000000 + button.color;
				}
				return {
					color: self.rgb(255, 255, 255),
					bgcolor: bg
				};
			} else {
				return {
					color: self.rgb(0, 0, 0),
					bgcolor: button.color
				};
			}
		default:
			log('error', `Unknown feedback type - ${feedback.type}`);
			break;
	}
};

instance.prototype.error = function (err) {
	var self = this;
	debug(err);
	self.log('error', err);
	self.status(self.STATUS_ERROR, err);
};

// TCP protocol
instance.prototype.init_tcp = function () {
	var self = this;
	var receivebuffer = '';
	self.responseHandlers = {};

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	}

	if (self.config.host && self.config.port) {
		self.socket = new tcp(self.config.host, self.config.port);

		self.socket.on('status_change', function (status, message) {
			self.status(status, message);
		});

		self.socket.on('connect', function () {
			self.status(this.STATUS_UNKNOWN, 'Connected, waiting for server ready');
			// TODO Set encoding to be safe! self.socket.setEncoding(ENCODING);
			self.send(`HELLO${SEPARATOR}${APPNAME}${SEPARATOR}${self.config.password}`);
		});

		self.socket.on('error', function (err) {
			self.error(`Network error ${err}`);
		});

		self.socket.on('data', function (chunk) {
			var i = 0, line = '', offset = 0;
			receivebuffer += chunk;

			while ((i = receivebuffer.indexOf(CRLF, offset)) !== -1) {
				line = receivebuffer.substr(offset, i - offset);
				offset = i + 2;
				self.socket.emit('receiveline', line.toString());
			}
			receivebuffer = receivebuffer.substr(offset);
		});

		self.socket.on('receiveline', function (line) {
			self.receiveLine(line);
		});
	}
};

instance.prototype.receiveLine = function (line) {
	var self = this;
	let cmd = line;
	let data;
	if (line.indexOf(SEPARATOR) > -1) {
		const splitLine = line.split(SEPARATOR);
		cmd = splitLine[0];
		data = splitLine[1];
	}

	switch (cmd) {
		case 'HELLO':
			log('info', `Connected to ${self.config.host}:${self.config.port}`);
			self.status(self.STATUS_OK);

			// Update buttons
			self.send('BUTTON_LIST');
			break;
		case 'BPM':
			// TODO - this should generate a BPM response
			log('info', `BPM set to ${data}.`);
			break;
		case 'BEAT_ON':
			// TODO this requires BEATS to be sent
			log('info', `BPM ON - ${data}.`);
			break;
		case 'BEAT_OFF':
			log('info', `BPM OFF - ${data}.`);
			break;
		case 'BUTTON_LIST':
			xmlStringParser(data, (err, result) => {
				if (err) {
					return self.error(`The button list XML could not parsed. ${err}`);
				}

				self.updateState(result);
				log('info', `Successfully retrieved state.`);
			});
			break;
		case 'BUTTON_PRESS':
			var button = self.getButton(NAMEPREFIX + data);
			if (button) {
				log('info', `Button ${data} was pressed.`);
				button.pressed = true;
				self.setVariable(`button${button.index}Pressed`, button.pressed);

				// Check feedbacks
				self.checkFeedbacks('syncColor');
				self.checkFeedbacks('syncColorPosition');
			} else {
				log('error', `Button ${data} is unknown.`);
			}
			break;
		case 'BUTTON_RELEASE':
			var button = self.getButton(NAMEPREFIX + data);
			if (button) {
				log('info', `Button ${data} was released.`);
				button.pressed = false;
				self.setVariable(`button${button.index}Pressed`, button.pressed);

				// Check feedbacks
				self.checkFeedbacks('syncColor');
				self.checkFeedbacks('syncColorPosition');
			} else {
				log('error', `Button ${data} is unknown.`);
			}
			break;
		case 'FADER_CHANGE':
			var index = Number(data);
			var value = Number(line.split(SEPARATOR)[2]);
			var fader = self.getFader(index);
			if (fader) {
				log('info', `Fader ${fader.name} was changed to ${value}.`);
				fader.value = value;
				self.setVariable(`fader${fader.index}Name`, fader.name);
				self.setVariable(`fader${fader.index}Value`, fader.value);
			} else {
				log('error', `Fader ${index} is unknown.`);
			}
			break;
		case 'INTERFACE_CHANGE':
			log('info', 'Interface change event received, updating state...');
			self.send('BUTTON_LIST');
			break;
		case 'ERROR':
			switch (data) {
				case 'BAD PASSWORD':
					self.error("The password is incorrect!");
					break;
				default:
					self.error(`Sofware responded with error: ${data}`);
					break;
			}
			break;
		default:
			log('error', `Unknown event received - ${line}`);
			break;
	}
};

instance.prototype.send = function (msg) {
	this.socket.send(msg + CRLF);
};

instance.prototype.parseName = function (name) {
	return name.replace(/~/g, '\\n');
}

instance.prototype.updateState = function (rawButtonList) {
	var self = this;
	const state = {
		pages: {},
		faders: {},
		buttons: {}
	};

	const variables = [];

	if (rawButtonList.buttons && rawButtonList.buttons.page) {
		var index = 0;
		rawButtonList.buttons.page.forEach((page) => {
			if (!page.$) { return; }
			const p = {
				index: ++index,
				name: page.$.name,
				columns: page.$.columns,
				columnButtons: {},
				buttons: {}
			}
			variables.push({ label: `Page ${p.index} name`, name: `page${p.index}Name` });
			variables.push({ label: `Page ${p.index} column count`, name: `page${p.index}Columns` });
			variables.push({ label: `Page ${p.index} button count`, name: `page${p.index}Buttons` });

			var col = 1;
			while (col <= p.columns) {
				if (page.$['colbuttons_' + col]) {
					p.columnButtons[col] = page.$['colbuttons_' + col];
				}
				col++;
			}
			if (page.button && page.button.length) {
				page.button.forEach((button) => {
					if (!button.$) { return; }
					var name = button['_'] || '';
					var safeName = self.parseName(name);
					var b = {
						index: Number(button.$.index),
						name: name,
						safeName: safeName,
						pressed: Boolean(Number(button.$.pressed)),
						flash: Boolean(Number(button.$.flash)),
						column: Number(button.$.column),
						line: Number(button.$.line),
						color: parseInt(button.$.color.substr(1), 16),
						page: p.index,
						pageName: p.name
					};
					b.position = `(${b.page}:${b.column},${b.line})`;
					p.buttons[b.name] = b;

					// Add direct lookups by index and position
					state.buttons[b.index] = b;
					state.buttons[b.position] = b;

					// We prepend name with $ to prevent collision with index/position
					// which always start with a number, or '(' respectively
					state.buttons[NAMEPREFIX + b.name] = b;

					// Create variables for index & position
					variables.push({ label: `Button ${b.index} name`, name: `button${b.index}Name` });
					variables.push({ label: `Button ${b.index} is pressed`, name: `button${b.index}Pressed` });
					variables.push({ label: `Button ${b.index} is flash`, name: `button${b.index}Flash` });
					variables.push({ label: `Button ${b.position} name`, name: `button${b.position}Name` });
					variables.push({ label: `Button ${b.position} is pressed`, name: `button${b.position}Pressed` });
					variables.push({ label: `Button ${b.position} is flash`, name: `button${b.position}Flash` });

					// TODO add type indicator
					/*
					variables.push({ label: `Button ${b.index} column number`, name: `button${b.index}Column` });
					variables.push({ label: `Button ${b.index} line number`, name: `button${b.index}Line` });
					variables.push({ label: `Button ${b.index} color`, name: `button${b.index}Color` });
					*/
				});
			}
			state.pages[p.name] = p;
		});
	}

	if (rawButtonList.buttons && rawButtonList.buttons.fader) {
		rawButtonList.buttons.fader.forEach((fader) => {
			if (!fader.$) { return; }
			var f = {
				index: Number(fader.$.index),
				name: fader['_'],
				value: Number(fader.$.value)
			};
			state.faders[f.index] = f;

			variables.push({ label: `Fader ${f.index} name`, name: `fader${f.index}Name` });
			variables.push({ label: `Fader ${f.index} value`, name: `fader${f.index}Value` });
		});
	}

	// Update state
	self.state = state;

	// Update variable defintions and values
	self.setVariableDefinitions(variables);

	Object.values(self.state.pages).forEach((page) => {
		self.setVariable(`page${page.index}Name`, page.name);
		self.setVariable(`page${page.index}Columns`, page.columns);
		self.setVariable(`page${page.index}Buttons`, Object.keys(page.buttons).length);
	});

	var faderChoices = [];
	Object.values(self.state.faders).forEach((fader) => {
		self.setVariable(`fader${fader.index}Name`, fader.name);
		self.setVariable(`fader${fader.index}Value`, fader.value);
		faderChoices.push({ id: fader.index, label: `${fader.index}: ${fader.name}` });
	});

	var buttonChoices = [];
	var buttonPositionChoices = [];
	Object.keys(self.state.buttons).forEach((key) => {
		// Only look at named version of button, to prevent triplication
		if (key.charAt(0) != NAMEPREFIX) { return; }
		var button = self.state.buttons[key];

		self.setVariable(`button${button.index}Name`, button.safeName);
		self.setVariable(`button${button.index}Pressed`, button.pressed);
		self.setVariable(`button${button.index}Flash`, button.flash);
		self.setVariable(`button${button.position}Name`, button.safeName);
		self.setVariable(`button${button.position}Pressed`, button.pressed);
		self.setVariable(`button${button.position}Flash`, button.flash);
		/*
		self.setVariable(`button${button.index}Column`, button.column);
		self.setVariable(`button${button.index}Line`, button.line);
		self.setVariable(`button${button.index}Color`, button.color);
		*/
		buttonChoices.push({ id: button.index, label: `${button.pageName} #${button.index}: ${button.safeName}` });
		buttonPositionChoices.push({ id: button.position, label: `${button.pageName} ${button.position}: ${button.safeName}` });
	});

	// Update actions	
	self.system.emit('instance_actions', self.id, {
		/*
		 * Tempo controls
		 */
		'bpm': {
			label: 'Set BPM',
			options: [{
				type: 'textinput',
				label: 'BPM',
				id: 'bpm',
				default: '120',
				regex: '/^\\d{1,3}$/'
			}]
		},
		'bpmTap': {
			label: 'Tap BPM'
		},
		'beat': {
			label: 'Send a beat'
		},
		'autobpm': {
			label: 'Set Auto BPM',
			options: [{
				type: 'dropdown',
				label: 'On/Off',
				id: 'state',
				choices: [{ id: 'false', label: 'Off' }, { id: 'true', label: 'On' }]
			}]
		},
		'freeze': {
			label: 'Freeze',
			options: [{
				type: 'dropdown',
				label: 'On/Off',
				id: 'state',
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
				regex: self.REGEX_SOMETHING
			}]
		},
		/*
		 * Buttons
		 */
		'toggle': {
			label: 'Toggle Button, by index',
			options: [{
				type: 'dropdown',
				label: 'Button index',
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: buttonChoices
			}]
		},
		'press': {
			label: 'Press Button, by index',
			options: [{
				type: 'dropdown',
				label: 'Button index',
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: buttonChoices
			}]
		},
		'release': {
			label: 'Release Button, by index',
			options: [{
				type: 'dropdown',
				label: 'Button index',
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: buttonChoices
			}]
		},
		'togglePosition': {
			label: 'Toggle Button, by position',
			options: [{
				type: 'dropdown',
				label: 'Button position',
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: buttonPositionChoices
			}]
		},
		'pressPosition': {
			label: 'Press Button, by position',
			options: [{
				type: 'dropdown',
				label: 'Button position',
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: buttonPositionChoices
			}]
		},
		'releasePosition': {
			label: 'Release Button, by position',
			options: [{
				type: 'dropdown',
				label: 'Name',
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: buttonPositionChoices
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
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: faderChoices
			},
			{
				type: 'textinput',
				label: 'Value (-100 -> 100)',
				id: 'value',
				regex: '/^[+-]?(100|[0-9]|[0-9][0-9])$/'
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
			label: 'Timeline Play From'
		},
		'timelinePlay': {
			label: 'Timeline Play'
		},
		'timelineStop': {
			label: 'Timeline Stop'
		},
		/*
		 * Custom commands
		 */
		'sendcustomcommand': {
			label: 'Send custom command',
			options: [{
				type: 'textinput',
				label: 'Command',
				id: 'command',
				default: 'HELLO',
				tooltip: "Enter any command you like in plain ASCII. Beware of correct syntax, you mustn't enter the linefeed at the end of the command.",
				regex: self.REGEX_SOMETHING
			}]
		}
	});

	// Update feedbacks

	self.setFeedbackDefinitions({
		syncColor: {
			label: 'Synchronise colors, by index',
			description: 'Will synchronise the button colours.',
			options: [{
				type: 'dropdown',
				label: 'Button index',
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: buttonChoices
			},
			{
				type: 'textinput',
				label: 'Pressed alpha',
				id: 'alpha',
				default: '128',
				tooltip: 'A number from 0 to 255, where 0 will set the backgound of pressed buttons to black, and 255 will not affect the background.',
				regex: '/^(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$/'
			},
			{
				type: 'colorpicker',
				label: 'Disabled Foreground color',
				id: 'disabledfg',
				default: self.rgb(80, 80, 80)
			},
			{
				type: 'colorpicker',
				label: 'DisabledBackground color',
				id: 'disabledbg',
				default: self.rgb(0, 0, 0)
			}]
		},
		syncColorPosition: {
			label: 'Synchronise colors, by position',
			description: 'Will synchronise the button colours.',
			options: [{
				type: 'dropdown',
				label: 'Name',
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: buttonPositionChoices
			},
			{
				type: 'colorpicker',
				label: 'Disabled Foreground color',
				id: 'disabledfg',
				default: self.rgb(80, 80, 80)
			},
			{
				type: 'colorpicker',
				label: 'DisabledBackground color',
				id: 'disabledbg',
				default: self.rgb(0, 0, 0)
			}]
		}
	});

	// Update presets


	// Check feedbacks
	self.checkFeedbacks('syncColor');
	self.checkFeedbacks('syncColorPosition');
};

instance.prototype.getButton = function (name) {
	var self = this;
	return name && self.state.buttons && self.state.buttons[name];
};

instance.prototype.getFader = function (index) {
	return this.state.faders[index];
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;