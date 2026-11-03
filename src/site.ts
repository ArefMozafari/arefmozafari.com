/// Facts about the owner that the whole site reads from one place.
export const SITE = {
  name: 'Aref Mozafari',
  nameFa: 'عارف مظفری',
  title: 'Senior Mobile Engineer',
  stack: 'Flutter, iOS & Android',
  domain: 'https://arefmozafari.com',
  email: 'me@arefmozafari.com',
  linkedin: 'https://www.linkedin.com/in/aref-mozafari',
  github: 'https://github.com/ArefMozafari',
  repo: 'https://github.com/ArefMozafari/arefmozafari.com',
  /// Other pages that are verifiably the same person, for the Person entity's sameAs.
  profiles: [
    'https://pub.dev/publishers/arefmozafari.com/packages',
    'https://pub.dev/packages/flutter_pw_validator',
    'https://pub.dev/packages/password_rules',
  ],
  knowsAbout: ['Flutter', 'Dart', 'iOS', 'Android', 'Rust', 'Go'],
  careerStart: new Date('2018-12-01'),
  /// The résumé is served and saved under a name that says whose it is.
  resumeFileName: 'Aref-Mozafari-Senior-Mobile-Engineer.pdf',
  resumePath: '/Aref-Mozafari-Senior-Mobile-Engineer.pdf',
  /// Browser chrome colours per scheme; they mirror `--color-canvas` in tokens.css, which
  /// a <meta> tag cannot read.
  themeColor: { light: '#efe9dc', dark: '#15120c' },
  description:
    'Senior Mobile Engineer. Flutter, iOS and Android. Wallets, call SDKs and marketplaces, shipped to the stores. Open to remote roles.',
} as const;
