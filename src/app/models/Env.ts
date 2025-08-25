export type Role = 'ADMIN' | 'EMPLOYEE';

export interface DemoCredential {
  username: string;
  password: string;
}

export interface AppEnvironment {
  production: boolean;
  demoMode: boolean;
  demoCredentials: Record<Role, DemoCredential> | null;
  urlMaps: Record<string, string>;
}
