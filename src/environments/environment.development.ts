import { AppEnvironment } from '../app/models/Env';

export const environment: AppEnvironment = {
  production: false,
  demoMode: true,
  demoCredentials: {
    ADMIN: { username: 'demo-admin', password: 'DemoAdmin@123' },
    EMPLOYEE: { username: 'demo-employee', password: 'DemoEmployee@123' },
  },
};
