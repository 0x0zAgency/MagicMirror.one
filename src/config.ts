import OnBoard from 'bnc-onboard';
import WebEvents from './webEvents';

const config = {
	onboard: OnBoard({
		dappId: 'a67bbab8-49d6-4fb3-88d3-2446be6c37d7',
		networkId: 1,
		subscriptions: {
			wallet: async (wallet) => {
				WebEvents.emit('reload');
			},
		},
	}),
	providerUrl:
		'https://mainnet.infura.io/v3/669e602e2d6f4709a305b9e619d6020c',
	ipfsProviderURL: 'https://ipfs.io/api/v0/',
	ipfsWebProvider: 'https://ipfs.io/ipfs/',
	chatGPTApiKey: '',
	chatGPTModel: '',
	chatGPTMaxTokens: 100,
	chatGPTTemperature: 0.7,
	chatGPTTopP: 1,
	fileSizeLimit: 10, //10mb
	useLocalApi: true,
	localApiEndpoint: 'http://localhost:9090/',
	apiEndpoint: 'https://reflect.magicmirror.one/',
	destinations: [
		//EADS.eth can control sponsored destinations
		'infinitymint.eth',
		'0x0z.agency',
		'0x0z.xyz',
		'0x0z.me',
		'0x0z.eth',
		'0x0z🏡.eth',
		'0x0z.nft',
		'0x0z.dao',
		'0x0z🟨🧙🏼‍♂👠🐶😱🦁🤖🧙🏻‍♀.eth',
		'0x🟨Road.eth',
		'0xWizardof0x.eth',
		'0x0z🟨🧙🏼‍♂👠😱🦁🥫🧙🏻‍♀.eth',
		'0xScarecrow.eth',
		'0xTinman.eth',
		'0xLionheart.eth',
		'0xWitch.eth',
		'0xToto.eth',
		'NFTofME.eth',
		'NFTofME.nft',
		'NFTofME.dao',
		'NFTofME.wallet',
		'HomoLudens.x',
		'HomoLudens.nft',
		'HomoLudens.wallet',
		'HomoLudens.dao',
		'MagicMirror.nft',
		'Magic🪞.eth',
		'📻Station.eth',
		'🕹Club.eth',
		'🧚‍♀️Forest.eth',
		'🖼Farm.eth',
		'🍳Book.eth',
		'⚖️Center.eth',
		'🍄Kingdom.eth',
		'♾Archive.eth',
		'Class🍎Room.eth',
		'👾Bestiary.eth',
		'🍬land.eth',
		'⭐️Atlas.eth',
		'🌷Graveyard.eth',
		'carpe☀diem.eth',
		'EADS.eth',
		'☢rads.eth',
		'EGPS.eth',
		'📍egps.eth',
		'b0b🔧w3b.eth',
		'charlottes🕸.eth',
		'GMArena.eth',
		'GMArena🏟.eth',
		'Free📧.eth',
		'🎫Mint.eth',
		'🥠Factory.eth',
		'TicketMint.eth',
		'NewTube.eth',
		'🏴‍☠🌊.eth',
		'🏴‍☠️Sea.eth',
		'PirateSea.eth',
		'UnderThe🌊.eth',
		'UnderTheSea.eth',
		'achieveMINT.eth',
		'StayOnTarget.eth',
		'StayOn🎯.eth',
		'MonoNFTism.eth',
		'PortRoyal🏝.eth',
		'🎒Attack.eth',
		'Dream🎨.eth',
		'👑Label.eth',
		'👟Mint.eth',
		'👟Club.eth',
		'Imapact🎛.eth',
		'Tech🏜.eth',
		'🌎Sport.eth',
		'🧱Jungle.eth',
		'🧢Mint.eth',
		'🧢Shop.eth',
		'🎮Shop.eth',
		'Travel🌎.eth',
		'💾Depot.eth',
		'🚗City.eth',
		'🚀Launcher.eth',
		'⛽️Nation.eth',
		'🚮Town.eth',
		'🦙Kicker.eth',
		'🎄Village.eth',
		'Liquid😻.eth',
		'Botanical🎋.eth',
		'🎞Fest.eth',
		'🥳Time.eth',
		'Legal🦅.eth',
		'⚖️Center.eth',
		'🥚Hunt.eth',
		'🌪Watch.eth',
		'🦕Land.eth',
		'Lucky🎰.eth',
		'Collab🏖.eth',
		'🧼Club.eth',
		'🗺Mint.eth',
		'💎Cold.eth',
		'🧧Day.eth',
		'Charity🔮.eth',
		'🏞Trail.eth',
		'🏞Mint.eth',
		'vitalik.eth',
		'ytcracker.eth',
		'rms.eth',
		'elon.eth',
		'bill-gates.eth',
		'jeff-bezos.eth',
		'jack-dorsey.eth',
		'jack-ma.eth',
		'paul-graham.eth',
		'paul-omar.eth',
		'satoshi.eth',
		'jimmy-wales.eth',
		'jimmy-song.eth',
		'jimmy-dorsey.eth',
		'jimmy-ma.eth',
		'jimmy-graham.eth',
		'jimmy-omar.eth',
		'eleanor-omar.eth',
		'tim-berners-lee.eth',
		'linus-torvalds.eth',
		'linus-omar.eth',
		'linus-graham.eth',
		'linus-song.eth',
		'linus-dorsey.eth',
		'linus-ma.eth',
		'iain-maclaren.eth',
		'james-montgomery.eth',
		'lord-randolph.eth',
		'martha-washington.eth',
		'george-washington.eth',
		'john-adams.eth',
		'thomas-jefferson.eth',
		'james-madison.eth',
		'james-monroe.eth',
		'fish.eth',
		'cat.eth',
		'dog.eth',
		'bird.eth',
		'fish.eth',
		'snake.eth',
		'frog.eth',
		'cow.eth',
		'pig.eth',
		'chicken.eth',
		'goat.eth',
		'0xDorothy.eth',
		'0xToto.eth',
		'0xScarecrow.eth',
		'0xTinMan.eth',
		'0xLionheart.eth',
		'0xWitch.eth',
		'0xWizardOfOz.eth',
		'0xMunchkin.eth',
		'track1.sow3.🎧club.eth',
		'track2.sow3.🎧club.eth',
		'track3.sow3.🎧club.eth',
		'track4.sow3.🎧club.eth',
		'track5.sow3.🎧club.eth',
		'track6.sow3.🎧club.eth',
		'track7.sow3.🎧club.eth',
		'track8.sow3.🎧club.eth',
		'track9.sow3.🎧club.eth',
		'track10.sow3.🎧club.eth',
		'🎧club.eth',
		'sow3.eth',
		'sow3.🎧club.eth',
		'deer.eth',
		'rabbit.eth',
		'fox.eth',
		'bear.eth',
		'wolf.eth',
		'lion.eth',
		'tiger.eth',
		'elephant.eth',
		'giraffe.eth',
		'rhino.eth',
		'hippo.eth',
		'zebra.eth',
		'gorilla.eth',
		'monkey.eth',
		'panda.eth',
		'koala.eth',
		'penguin.eth',
		'dolphin.eth',
		'whale.eth',
		'shark.eth',
		'seal.eth',
		'octopus.eth',
		'squid.eth',
		'crab.eth',
		'lobster.eth',
		'shrimp.eth',
		'salmon.eth',
		'trout.eth',
		'eel.eth',
		'frog.eth',
		'simon.eth',
		'theodore.eth',
		'alvin.eth',
		'dave.eth',
		'brittany.eth',
		'jeanette.eth',
		'eleanor.eth',
		'alvin-and-the-chipmunks.eth',
		'alvin-and-the-chipmunks-2.eth',
		'alvin-and-the-chipmunks-3.eth',
		'alvin-and-the-chipmunks-4.eth',
		'shrek.eth',
		'shrek-2.eth',
		'shrek-3.eth',
		'shrek-4.eth',
		'apple.eth',
		'banana.eth',
		'orange.eth',
		'grape.eth',
		'strawberry.eth',
		'the-fruit.eth',
		'the-fruit-2.eth',
		'the-sun.eth',
		'the-moon.eth',
		'the-stars.eth',
		'the-galaxy.eth',
		'the-universe.eth',
		'the-multiverse.eth',
		'the-omniverse.eth',
		'the-omniverse-2.eth',
		'toad.eth',
		'lizard.eth',
		'snake.eth',
		'turtle.eth',
		'chameleon.eth',
		'iguana.eth',
		'alligator.eth',
	],
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
		profile: 'profile',
		theme: 'theme',
		avatar: 'avatar',
		user: 'user',
		ens: 'ens',
	},
	defaultAvatar: '/img/0x0zLogo.jpg',
	defaultTheme: 'Ox0z_light',
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
