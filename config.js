module.exports = {
	/**
	 * Creates the configuration fields for web config.
	 *
	 * @returns {Array} the config fields
	 * @access public
	 * @since 1.1.0
	 */
	config_fields() {
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
				regex: this.REGEX_IP
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Port number',
				width: 12,
				default: '7348',
				regex: this.REGEX_PORT
			},
			{
				type: 'textinput',
				id: 'password',
				label: 'Password',
				width: 6
			},
			{
				type: 'textinput',
				id: 'bpm',
				label: 'Initial BPM (note controller doesn\'t communicate it`s BPM so we have to set one)',
				default: 120,
				width: 4,
				regex: this.REGEX_BPM
			}
		]
	},

	/**
	 * Process an updated configuration array.
	 *
	 * @param {Object} config - the new configuration
	 * @access public
	 * @since 1.1.0
	 */
	updateConfig(config) {
		let _this = this;
		let resetConnection = true;
		let updateBpm = false;

		if (config !== undefined) {
			resetConnection = _this.config === undefined ||
				config.host != _this.config.host ||
				config.port != _this.config.port ||
				config.password != _this.config.password;
			updateBpm = _this.config === undefined ||
				config.bpm != _this.config.bpm

			_this.config = config;
		}

		if (resetConnection || !_this.api.connected) {
			_this.api.connect(_this.config.host, _this.config.port, _this.config.password);
		} else {
			// We're connected so refresh
			_this.api.refresh();
			
			if (updateBpm) {
				_this.api.setBPM(_this.config.bpm)
			}
		}
	}
}