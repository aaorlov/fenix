
declare module NodeJS  {
  interface Global {
    PRODUCTION_ENV: string;
    DEVELOPMENT_ENV: string;
    STAGING_ENV: string;
    ROLE_GUEST: string;    
    ROLE_PARENT: string;
    ROLE_DOCTOR: string;
  }
}