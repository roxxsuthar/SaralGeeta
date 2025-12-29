/**
 *
 * Asynchronously loads the component for LoadingScreen
 *
 */

import loadable from '../../utils/loadable';

export default loadable(() => import('./index'));
