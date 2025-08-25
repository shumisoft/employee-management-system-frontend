import { AppEnvironment } from '../app/models/Env';

export const environment: AppEnvironment = {
  production: true,
  demoMode: false,
  demoCredentials: null,
  urlMaps: {
    'ems-fe.ritwikrajsingh.com': 'https://ritwikrajsingh.com',
    'ems-fe-dev.dipanshushukla.com': 'https://dipanshushukla.com',
    localhost: 'http://localhost:3000',
  },
};
