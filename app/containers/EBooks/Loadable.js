/**
 *
 * Asynchronously loads the component for EBooks
 *
 */

import loadable from '../../utils/loadable';

export default loadable(() => import('./index'));
