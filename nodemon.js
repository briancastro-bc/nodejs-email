import path from 'path';
import nodemon from 'nodemon';

nodemon({
  ext: 'js ts json',
  script: './src/server.js',
  watch: ['./src'],
  ignore: [
    '.git',
    'node_modules'
  ],
  verbose: true,
  restartable: 'rs'
}).on('restart', (files) => {
  console.log('Restarting server: ', files);
});