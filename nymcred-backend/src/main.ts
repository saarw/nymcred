import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express = require('express');
import { AppModule } from './app.module';
import * as csurf from 'csurf';
import cookieParser = require('cookie-parser');
import { APP_DOMAIN, IS_PRODUCTION } from './constants';


function ignoreCsrf(url: string): boolean {
  // Csurf protection needs to be disabled for API calls that users do not perform from the 
  // browser, such as calls from 3rd party services or for password reset links in e-mails.
  // Replace false with checks against such paths, for example url === '/api/auth/reset';
  return false; 
}

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.use(cookieParser());
  const csrf = csurf({cookie: {
      key: '_csrf',
      maxAge: 7 * 24 * 3600
    }});
  app.use(function (req: any, res: any, next: any) {
    if (ignoreCsrf(req.url)) {
      return next()
    }
    csrf(req, res, next)
  });
  app.use((req: any, res: any, next: any) => {
    if (!ignoreCsrf(req.url)) {
      res.cookie('csrf-token', req.csrfToken(), {maxAge: (7 * 24 * 3600 * 1000)});
    }
    next();
  });
  app.enableCors({
    origin: !IS_PRODUCTION ? function(origin, callback) { 
      callback(null, true); 
    } :  [APP_DOMAIN, `www.${APP_DOMAIN}`],
    credentials: true
  });
  app.getHttpAdapter().getInstance().set('etag', false);
  await app.listen(4000);
}
bootstrap();
