/**
 *
 * Asynchronously loads the component for ChatFiles
 *
 */

import loadable from '../../utils/loadable';

export default loadable(() => import('./index'));
