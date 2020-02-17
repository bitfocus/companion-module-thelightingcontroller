// Defines button types, including icons
let instance_skel = require('../../instance_skel');

let internalAPI = require('./internalAPI');
let icons = require('./icons');
let config = require('./config');
let actions = require('./actions');
let feedback = require('./feedback');
let presets = require('./presets');
let variables = require('./variables');

/**
 * Companion instance class for thelightingcontroller module.
 *
 * @extends instance_skel
 * @version 1.1.0
 * @since 1.1.0
 * @author Craig Dean <thargy@yahoo.com>
 */
class instance extends instance_skel {
	/**
	 * Create an instance of thelightingcontroller module.
	 *
	 * @param {EventEmitter} system - the brains of the operation
	 * @param {string} id - the instance ID
	 * @param {Object} _config - saved user configuration parameters
	 * @since 1.1.0
	 */
	constructor(system, id, _config) {
		super(system, id, _config);

		Object.assign(this, {
			...config,
			...actions,
			...feedback,
			...presets,
			...variables
		});

		this.REGEX_BPM = '/^([1-9]\\d|[1-4]\\d\\d|500)$/';

		this.config = _config;

		this.icons = new icons(this);
		this.api = new internalAPI(this);
	}

	/**
	 * Clean up the instance before it is destroyed.
	 *
	 * @access public
	 * @since 1.1.0
	 */
	destroy() {
		this.api.disconnect();
		delete this.api;
		delete this.icons;
		this.debug("destroy", this.id);
	}

	/**
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 *
	 * @access public
	 * @since 1.1.0
	 */
	init() {
		this.initVariables();
		this.initFeedbacks();
		this.initActions();
		this.initPresets();

		this.status(this.STATE_UNKNOWN);

		// Force config update.
		this.updateConfig();
	}

	/**
	 * Set the module to an error state.
	 * 
	 * @access public
	 * @param {string} err - error message.
	 * @since 1.1.0
	 */
	error(err) {
		this.debug(err);
		this.log('error', err);
		this.status(this.STATUS_ERROR, err);
	}

	/**
	 * INTERNAL Used to append a 'defautlOptions' key to actions and feedback dictionary
	 * items, which can then be used to fix the lack of defaults on presets.
	 * 
	 * @access private
	 * @param {*} dictionary 
	 */
	setDefaultOptions(dictionary) {
		// FIXME Workatound for unapplied defaults on presets
		Object.values(dictionary).forEach((definition) => {
			let defaultOptions = {};
			let options = definition.options;
			if (!options || options.length < 1) { return; }
			options.forEach((o) => {
				let d = o.default;
				if (d == undefined) { return; }
				defaultOptions[o.id] = d;
			});
			definition.defaultOptions = defaultOptions;
		});
	}

	/**
	 * INTERNAL Used to correct the lack of defaults applied on presets.
	 * 
	 * @returns {object} The options, merged with the defaults.
	 * @param {object} dictionary - the feedback or actions dictionary.
	 * @param {string} key - the dictionary key.
	 * @param {object} options - the options to apply over defaults.
	 */
	applyDefaults(dictionary, key, options) {
		if (!dictionary) { return options; }
		let entry = dictionary[key];
		if (!entry) { return options; }
		let defaults = entry.defaultOptions;
		if (!defaults) { return options; }
		return Object.assign({}, defaults, options);
	}
}

exports = module.exports = instance;