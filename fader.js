/**
 * Defines a controller fader.
 * Utilized to generate/recall various icons.
 *
 * @version 1.1.0
 * @since 1.1.0
 * @author Craig Dean <thargy@yahoo.com>
 */
class fader {

    /**     * 
	 * Create an instance of a controller button.
     * 
     * @param {internalAPI} api 
     * @param {number} index 
     * @param {string} name 
     * @param {number} value
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
	 */
    update(value) {
        this.api.updateFader(this, value);
    }
}

exports = module.exports = fader;