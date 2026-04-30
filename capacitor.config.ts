import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.kievokio.app',
  appName: 'KIEVOKIO',
  webDir: 'out',
  server: {
    // For Vercel deployment, replace with your Vercel URL
    url: 'https://kievokio-app.vercel.app',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#080808',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#080808',
    },
  },
  android: {
    buildOptions: {
      keystorePath: 'kievokio.keystore',
      keystoreAlias: 'kievokio',
    },
  },
  ios: {
    contentInset: 'automatic',
  },
};

export default config;
