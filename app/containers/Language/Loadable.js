/**
 *
 * Asynchronously loads the component for Language
 *
 */

import loadable from '../../utils/loadable';

export default loadable(() => import('./index'));
