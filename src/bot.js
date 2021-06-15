/**
 * Discord bot section.
 */

import envConfig from '../config.env.js'

import dnode from 'dnode';

const server = dnode({

});
server.listen(envConfig.dnodePort);