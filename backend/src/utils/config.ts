import projectDir from './projectDir';
import { merge } from 'lodash';

export default function(configName: string, divider: string = ' '): any {
  const splitedConfigName: string[] = configName.split(divider);
  let envPrefix: string = 'dev';

  switch (process.env.NODE_ENV) {
    case global.PRODUCTION_ENV: envPrefix = 'prod'; break;
    case global.DEVELOPMENT_ENV: envPrefix = 'dev'; break;
    case global.STAGING_ENV: envPrefix = 'stage'; break;
  }

  if (splitedConfigName.length > 0) {
    const config = {};

    splitedConfigName.forEach((configName: string) => {
      try {
        merge(config, require(`${projectDir}/config/${configName}`));
      } catch (exception) {
        try {
          merge(config, require(`${projectDir}/config/${envPrefix}/${configName}`));
        } catch (exception) {}
      }
    });

    return config;
  } else {
    try {
      return require(`${projectDir}/config/${configName}`);
    } catch (exception) {
      try {
        return require(`${projectDir}/config/${envPrefix}/${configName}`);
      } catch (exception) {
        return null;
      }
    }
  }
}