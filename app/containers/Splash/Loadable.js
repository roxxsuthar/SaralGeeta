/**
 *
 * Asynchronously loads the component for Splash
 *
 */

import loadable from '../../utils/loadable';

export default loadable(() => import('./index'));
