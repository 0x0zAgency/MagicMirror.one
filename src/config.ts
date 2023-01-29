const config = {
  providerUrl: 'https://mainnet.infura.io/v3/669e602e2d6f4709a305b9e619d6020c',
  chatGPTApiKey: '',
  chatGPTModel: '',
  chatGPTMaxTokens: 100,
  chatGPTTemperature: 0.7,
  chatGPTTopP: 1,
  useLocalApi: true,
  localApiEndpoint: 'http://localhost:9090/',
  apiEndpoint: 'https://api.web.app/',
  chatGPTendpoint: 'gpt/',
  searchEndpoint: 'search/',
  nftEndpoint: 'nft/',
  ipfsEndpoint: 'ipfs/',
  defaultAvatar:
    'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png',
  defaultWeb3Storage:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGZjZWYwNjFCYTkxNGZhYTdFNjU3NEI2N0E0NjU4YjIyNzgwMTYxQmQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTA0MTM0MTMzMjgsIm5hbWUiOiJpbmZpbml0eS1taW50In0.se1kP3g-ssSs0G8DjIrd2pbUeq1b_OzuCqFoxzepZVA',
  themes: [
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
    'winter'
  ],
  resolvers: [
    ['.vision', ''],
    ['.im', ''],
    ['.infinitymint', '.eth'],
    ['.ethereum', '.eth']
  ]
}

export default config
