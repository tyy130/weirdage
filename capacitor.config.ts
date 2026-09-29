import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.slughouse.weirdage',
  appName: 'WeirdAge',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  backgroundColor: '#000000',
};

export default config;
