module.exports = {
  expo: {
    name: 'Dresscode AI',
    slug: 'dresscode',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'dresscode',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.seagulltechnologies.dresscode',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      "entitlements": {
        "com.apple.developer.in-app-payments": ["merchant.com.dresscode"],
        'aps-environment': 'production',
        'com.apple.developer.applesignin': ['Default'],
      }
    },
    android: {
      package: 'com.seagulltechnologies.dresscode',
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      }
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png'
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff'
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "555c44d3-648a-41cd-b752-fe2407cee206"
      }
    }
  }
};
