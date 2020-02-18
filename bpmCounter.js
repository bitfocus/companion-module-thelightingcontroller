/**
 * Used to track BPM
 *
 * @version 1.1.0
 * @since 1.1.0
 * @author Craig Dean <thargy@yahoo.com>
 */
class bpmCounter {
    /**
     * Creates an instance of a BPM Counter
     * @access public
     * @since 1.1.0
     * @author Craig Dean <thargy@yahoo.com>
     */
    constructor(api) {
        this.api = api;
        this.bpm = 0;
        this.interval = 0;
        this.taps = [];
        this.lastTap = this.lastBeat = new Date(0);
        this.beatNumber = -1;
        this.auto = false;
    }

    /**
     * Sets auto mode.
     * 
     * @param {boolean} auto - True to automatically send Beats 
     * @access public
     * @since 1.1.0
     * @author Craig Dean <thargy@yahoo.com>
     */
    setMode(auto) {
        let _this = this;
        auto = !!auto;
        if (_this.auto == auto) { return; }

        // Kill existing beat timer (if any)
        let beatTimer = _this.beatTimer;
        if (beatTimer) {
            delete _this.beatTimer;
            clearTimeout(beatTimer);
        }

        _this.auto = auto;
        _this.api.instance.updateVariable('BPMMode', auto ? 'Auto' : 'Manual');

        if (auto) {
            _this.interval = bpmCounter.oneMinute / _this.bpm;
            _this.beat();
        } else {
            _this.interval = 0;
        }
    }

    /**
     * Call to perform tap - used to tap a BPM.
     * 
     * @access public
     * @since 1.1.0
     * @author Craig Dean <thargy@yahoo.com>
     */
    tap() {
        let _this = this;

        let lastTap = new Date();

        // Convert into integer
        let elapsed = lastTap - _this.lastTap;
        _this.lastTap = lastTap;

        let taps = _this.taps;
        let currentInterval = bpmCounter.oneMinute / _this.bpm;
        // If the current tap is more than 2 times the current interval, then
        // we are starting a new measure
        if (elapsed > bpmCounter.oneMinute ||
            (taps.length > 0 &&
                (elapsed > currentInterval * 2 || elapsed < currentInterval / 2))) {
            // Start a new measure
            taps.length = 0;
            elapsed = currentInterval;
        } else {
            // Push new tap
            taps.push(elapsed);
        }

        let avg;
        if (taps.length < 2) {
            avg = elapsed;
        } else {

            let excess = taps.length - bpmCounter.maxTaps;
            if (excess > 0) {
                // Remove the excess from the start of the array by collapsing to a single average
                excess++;
                avg = taps.slice(0, excess).reduce((previous, current) => current += previous) / excess;
                _this.taps = taps = [avg].concat(taps.slice(excess));
            }

            // Average the array
            avg = taps.reduce((previous, current) => current += previous) / taps.length;
        }
        _this.updateBPM(bpmCounter.oneMinute / avg);
    }

    /**
     * Updates the current BPM.
     * 
     * @access public
     * @param {number} bpm - Beats per minute between 10 and 50, or 0 to disable auto-beats
     * @since 1.1.0
     * @author Craig Dean <thargy@yahoo.com>
     */
    updateBPM(bpm) {
        let _this = this;
        if (isNaN(bpm)) {
            _this.api.log('error', 'Invalid BPM value!');
            return;
        }

        // Clamp bpm to integer between 10 and 500, or 0.
        bpm = Math.round(bpm);
        if (bpm < 10) { bpm = 10; }
        else if (bpm > 500) { bpm = 500; }

        // Kill existing beat timer (if any)
        let beatTimer = _this.beatTimer;
        if (beatTimer) {
            delete _this.beatTimer;
            clearTimeout(beatTimer);
        }

        if (bpm != _this.bpm) {
            _this.bpm = bpm;
            _this.api.instance.updateVariable('BPM', bpm);
            // Check feedback if changed.
            _this.api.instance.checkFeedbacks('bpm');
        }

        if (_this.auto) {
            let now = new Date();
            _this.interval = bpmCounter.oneMinute / bpm
            let elapsed = (now - _this.lastBeat)
            let due = _this.interval - elapsed;

            if (due < bpmCounter.accuracy) {
                _this.beat();
            } else {
                _this.beatTimer = setTimeout(function () { _this.beat() }, due);
            }
        } else {
            _this.interval = 0;
            _this.beat();
        }
    }

    /**
     * INTERNAL: Sends a beat.
     * 
     * @access private
     * @since 1.1.0
     * @author Craig Dean <thargy@yahoo.com>
     */
    beat() {
        let _this = this;
        _this.lastBeat = new Date();
        _this.api.instance.updateVariable('Beat', _this.beatNumber + 1, true);
        //_this.api.log('info', `Beat: ${_this.beatNumber}; BPM: ${_this.bpm}; interval: ${_this.interval}; taps: ${_this.taps.map(t=>Math.round(bpmCounter.oneMinute/t))}`);
        _this.beatNumber = (_this.beatNumber + 1) % 4;
        if (_this.api.connected) {
            _this.api.beat();
            if (_this.auto) {
                _this.api.send('BPM', _this.bpm);
            }
        }
        _this.api.instance.checkFeedbacks('bpm');

        if (_this.interval > 0) {
            _this.beatTimer = setTimeout(function () { _this.beat() }, _this.interval);
        }
    }
}

bpmCounter.oneSecond = 1000;
bpmCounter.oneMinute = 60 * bpmCounter.oneSecond;
bpmCounter.maxTaps = 5;
bpmCounter.accuracy = 20;

exports = module.exports = bpmCounter;