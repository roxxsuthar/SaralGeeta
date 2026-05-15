/**
 *
 * Asynchronously loads the component for FAQ
 *
 */

import loadable from '../../utils/loadable';

export default loadable(() => import('./index'));
