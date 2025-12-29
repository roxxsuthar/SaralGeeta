/**
 *
 * Asynchronously loads the component for ContactUs
 *
 */

import loadable from '../../utils/loadable';

export default loadable(() => import('./index'));
