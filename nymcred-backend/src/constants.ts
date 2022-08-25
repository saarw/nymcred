// Domain name of the application
export const APP_DOMAIN = 'nymcred.com';

// Human-readable name of the app
export const APP_NAME = 'Nymcred';

// Landing page with marketing materials and sign-up
export const APP_SITE = 'nymcred.com';

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Base URI for the app, depending on environment
export const UI_HOST = IS_PRODUCTION ? 'https://' + APP_DOMAIN : 'http://localhost';