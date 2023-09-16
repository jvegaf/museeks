import type { AxiosResponse } from 'axios';

import logger from '../../../shared/lib/logger';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleResponse = (response: AxiosResponse<any, any>) => {
  return response;
};

export const handleError = (error: Error) => {
  // eslint-disable-next-line no-console
  logger.error(error);
  throw error;
};
