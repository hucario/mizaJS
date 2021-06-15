import winston from 'winston'
import envConfig from '../../config.env.js'
const format = winston.format;
const { combine, colorize, simple } = format;

const substr = format((info) => {
	if (typeof envConfig.maxLogLength === 'undefined' || envConfig.maxLogLength === -1) {
		return info;
	}
	if (info.message.length > envConfig.maxLogLength) {
		let more = info.message.length - envConfig.maxLogLength;
		info.message = info.message.substring(0, envConfig.maxLogLength)
		info.message += `... [${more} characters trimmed]`
	}
	return info;
  });

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console({
			level: envConfig.consoleLevel || 'verbose',
			format: combine(
				substr(),
				colorize(),
				simple()
			  )
		}),
		new winston.transports.File({
			filename: 'verbose.log',
			level: 'verbose'
		}),
		new winston.transports.File({
			filename: 'debug.log',
			level: 'debug'
		}),
		new winston.transports.File({
			filename: 'combined.log',
			level: 'info'
		}),
		new winston.transports.File({
			filename: 'errors.log',
			level: 'error'
		})
	]
});

export default logger;