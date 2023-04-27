const config = {
  providerUrl: 'https://mainnet.infura.io/v3/669e602e2d6f4709a305b9e619d6020c',
  ipfsProviderURL: 'https://dweb.link/api/v0',
  ipfsWebProvider: 'https://dweb.link/ipfs/',
  chatGPTApiKey: '',
  chatGPTModel: '',
  chatGPTMaxTokens: 100,
  chatGPTTemperature: 0.7,
  chatGPTTopP: 1,
  fileSizeLimit: 10, //10mb
  useLocalApi: true,
  localApiEndpoint: 'http://localhost:9090/',
  apiEndpoint: 'https://reflect.magicmirror.one/',
  /**
   * routes for the api system, don't change these
   */
  routes: {
    gpt3: 'gpt3',
    search: 'search',
    nft: 'nft',
    ipfs: 'ipfs',
    ipns: 'ipns',
    wallet: 'wallet',
  },
  defaultAvatar: '/img/0x0zLogo.jpg',
  defaultTheme: 'forest',
  themes: [
    'Ox0z_light',
    'Ox0z_dark',
    'emerald_city_light',
    'emerald_city_dark',
    'OxWizardof0z_light',
    'OxWizardof0z_dark',
    'OxDorothy_light',
    'OxDorothy_dark',
    'OxToto_light',
    'OxToto_dark',
    'OxScarecrow_light',
    'OxScarecrow_dark',
    'OxTinMan_light',
    'OxTinMan_dark',
    'OxLionheart_light',
    'OxLionheart_dark',
    'OxGoodWitch_light',
    'OxGoodWitch_dark',
    'OxBadWitch_light',
    'OxBadWitch_dark',
    'OxMunchkin_light',
    'OxMunchkin_dark',
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter',
  ],
  resolvers: [
    ['.vision', 'ens.vision'],
    ['.im', ''],
    ['.infinitymint', '.eth'],
    ['.ethereum', '.eth'],
  ],
};

export default config;
