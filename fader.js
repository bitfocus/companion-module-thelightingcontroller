/**
 * Defines a controller fader.
 * Utilized to generate/recall various icons.
 *
 * @version 1.1.0
 * @since 1.1.0
 * @author Craig Dean <thargy@yahoo.com>
 */
class fader {
    /**
	 * Create an instance of a controller button.
     * 
     * @param {internalAPI} api 
     * @param {number} index 
     * @param {string} name 
     * @param {number} value
     * @access public
     * @since 1.1.0
     */
    constructor(
        api,
        index,
        name,
        value) {
        this.api = api;
        this.index = index;
        this.name = name;
        this.value = value;
        this.choice = { id: index, label: `${index}: ${name}` };
    }

	/**
	 * Sends command to update the fader position.
	 * 
	 * @param {number} value - the new value.
	 * @param {boolean} [skipSend] - if true then command is not sent to controller (used internally).
     * @access public
     * @since 1.1.0
	 */
    update(value, skipSend) {
        let _this = this;
        if (!skipSend) {
            _this.cancelFade();
        }

        if (isNaN(value) || value < -100 || value > 100) {
            _this.api.log('error', 'The fader value must be between -100 and 100.');
            return;
        }

        value = Math.round(value);

        if (_this.value == value) {
            return;
        }

        if (!skipSend) {
            _this.api.send('FADER_CHANGE', _this.id, value);
        }

        let instance = _this.api.instance;

        _this.value = value;
        instance.updateFaderVariables(_this, true);
        instance.checkFeedbacks('faderColor');
        instance.checkFeedbacks('faderFadeColor');
    }

    /**
     * Fades to a new value over time.
     * 
     * @param {number} value - destinatino value
     * @param {number} [time] - duration of fade in ms
     * @access public
     * @since 1.1.0
     */
    fade(value, time) {
        let _this = this;
        _this.cancelFade();

        if (isNaN(value) || value < -100 || value > 100) {
            _this.api.log('error', 'The fader value must be between -100 and 100.');
            return;
        }

        value = Math.round(value);

        if (isNaN(time)) {
            // If time 
            return _this.update(value);
        }

        if (time < 100 || time > 600000) {
            _this.api.log('error', 'The fader time must be between 100 and 600000ms.');
            return;
        }

        if (_this.value == value) {
            return;
        }

        let instance = _this.api.instance;
        let delta = value - _this.value;
        let interval = fader.minimumPoll;
        let step = delta * interval / time;
        if (Math.abs(step) < 1) {
            // Step size too small, so use longer interval.
            if (step < 0) {
                step = -1;
            } else {
                step = 1;
            }
            interval = time / delta;
        }
        let next = _this.value + step;
        _this.api.log('debug', `Fade ${fader.name} from ${_this.value} -> ${value}, ${step}/${interval}ms`);

        let start = process.hrtime();

        // Kick off fade timer.
        _this.fadeInterval = setInterval(function () {
            _this.value = Math.round(next);
            next += step;
            let done = step > 0 ? next > value : next < value;
            if (done) { _this.value = value; }

            _this.api.send('FADER_CHANGE', _this.id, _this.value);
            instance.updateFaderVariables(_this, true);
            instance.checkFeedbacks('faderColor');
            instance.checkFeedbacks('faderFadeColor');

            if (done) {
                let end = process.hrtime(start);
                _this.api.log('debug', `Faded ${fader.name} in ${end[0]}s ${end[1] / 1000000}ms.`);
                _this.cancelFade();
            }
        }, interval);
    }

    /**
     * Cancels any ongoing fade.
     * 
     * @access protected
     * @since 1.1.0
     */
    cancelFade() {
        let _this = this;

        // Cancel active fades
        let fadeInterval = _this.fadeInterval;
        if (!fadeInterval) { return; }

        delete _this.fadeInterval;
        clearInterval(fadeInterval);
    }
}

fader.minimumPoll = 100;

exports = module.exports = fader;