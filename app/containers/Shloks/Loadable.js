/**
 *
 * Asynchronously loads the component for Shloks
 *
 */

import loadable from '../../utils/loadable';

export default loadable(() => import('./index'));
