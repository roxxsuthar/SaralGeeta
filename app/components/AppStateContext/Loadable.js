/**
 *
 * Asynchronously loads the component for AppStateContext
 *
 */

import loadable from '../../utils/loadable';

export default loadable(() => import('./index'));
