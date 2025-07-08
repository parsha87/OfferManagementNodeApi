
// import * as winston from 'winston';
// import 'winston-daily-rotate-file';

// // Log levels.
// // If you set log level to info, it will log - info, warn, error
// // If you set log level to debug, it will log - debug, verbose, http, info, warn, error
// // 0: error
// // 1: warn
// // 2: info
// // 3: http
// // 4: verbose
// // 5: debug
// // 6: silly

// // define the custom settings for each transport (file, console)
// const options = {
//   // non rotating file.
//   file: {
//     level: 'info',
//     filename: `./logs/policy-admin-service.log`,
//     handleExceptions: true,
//     maxsize: 5242880, // 5MB
//     maxFiles: 5,
//     format: winston.format.combine(
//       winston.format.timestamp(),
//       winston.format.json(),
//     ),
//   },
//   // console
//   console: {
//     level: 'debug',
//     handleExceptions: true,
//     format: winston.format.combine(
//       winston.format.colorize(),
//       winston.format.simple(),
//     ),
//   },
//   // rotating file
//   rotatingFile: {
//     level: 'info',
//     dirname: 'logs',
//     filename: 'policy-admin-service-%DATE%.log',
//     datePattern: 'YYYY-MM-DD',
//     zippedArchive: true,
//     maxSize: '20m',
//     maxFiles: '14d',
//   },
// };

// // instantiate a new Winston Logger with the settings defined above
// // export const logger = winston.createLogger({
// //   transports: [
// //     // This comes from the winston-daily-rotate-file
// //     new winston.transports.DailyRotateFile(options.rotatingFile),

// //     // This is the default console based transport...
// //     new winston.transports.Console(options.console),

// //     // This was the default file based transport...
// //     // new winston.transports.File(options.file),
// //   ],
// //   exitOnError: false, // do not exit on handled exceptions
// // });

// // create a stream object with a 'write' function that will be used by `morgan`

// export const winstonProvider = {
//   provide: 'winston',
//   useExisting: '', //TODO
//   useFatcory: () => {
//     return winston.createLogger({
//       transports: [
//         // This comes from the winston-daily-rotate-file
//         new winston.transports.DailyRotateFile(options.rotatingFile),

//         // This is the default console based transport...
//         new winston.transports.Console(options.console),

//         // This was the default file based transport...
//         // new winston.transports.File(options.file),
//         new winston.transports.Stream({
//           // @ts-ignore
//           write: function(message, encoding) {
//             // use the 'info' log level so the output will be picked up by both
//             // transports (file and console)
//             winston.info(message);
//           },
//         }),
//       ],
//       exitOnError: false, // do not exit on handled exceptions
//     });
//   },
// };

