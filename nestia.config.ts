import { INestiaConfig } from '@nestia/sdk';

export const NESTIA_CONFIG: INestiaConfig = {
  input: 'src/**/*.controller.ts',
  output: 'src/client',
};

export default NESTIA_CONFIG;
