/**
 *
 * Asynchronously loads the component for LearnGeeta
 *
 */

import loadable from '../../utils/loadable';

export default loadable(() => import('./index'));
