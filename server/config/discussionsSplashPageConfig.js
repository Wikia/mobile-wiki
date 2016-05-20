/* eslint dot-notation:0 quote-props:0 */

/**
 * @typedef {WikiaDiscussionsConfig[]} DiscussionsSplashPageConfig
 */

/**
 * @typedef {Object} WikiaDiscussionsConfig
 * @property {string} [androidAppLink]
 * @property {string} [androidStoreLogo]
 * @property {string} [iosAppLink]
 * @property {string} [iosStoreLogo]
 * @property {string} domain
 * @property {string} [icon]
 * @property {string} [appScreens]
 * @property {string} [appName]
 * @property {string} language
 * @property {number} wikiId
 * @property {string} dbName
 */

/**
 * @typeof WikiaDiscussionsConfig
 */
export default {
	'walkingdead': {
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.thewalkingdead',
		androidStoreLogo: 'https://developer.android.com/images/brand/en_generic_rgb_wo_45.png',
		iosAppLink: 'https://itunes.apple.com/us/app/wikiafanapp/id920825975',
		iosStoreLogo: 'http://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.svg',
		domain: 'walkingdead.wikia.com',
		icon: '/front/images/Walking-Dead-Icon.png',
		appName: 'Walking Dead',
		appScreens: '/front/images/Phone-Walking-Dead.png',
		language: 'en',
		wikiId: 13346,
		dbName: 'walkingdead'
	},

	'fallout': {
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.fallout',
		androidStoreLogo: 'https://developer.android.com/images/brand/en_generic_rgb_wo_45.png',
		iosAppLink: 'https://itunes.apple.com/us/app/wikiafanapp/id1002376814',
		iosStoreLogo: 'http://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.svg',
		domain: 'fallout.wikia.com',
		icon: '/front/images/Fallout-Icon.png',
		appName: 'Fallout',
		appScreens: '/front/images/Phone-Fallout.png',
		language: 'en',
		wikiId: 3035,
		dbName: 'fallout'
	},

	'starwars': {
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.starwars',
		androidStoreLogo: 'https://developer.android.com/images/brand/en_generic_rgb_wo_45.png',
		iosAppLink: 'https://itunes.apple.com/us/app/wikiafanapp/id920826902',
		iosStoreLogo: 'http://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.svg',
		domain: 'starwars.wikia.com',
		icon: '/front/images/Star-Wars-Icon.png',
		appName: 'Star Wars',
		appScreens: '/front/images/Phone-Star-Wars.png',
		language: 'en',
		wikiId: 147,
		dbName: 'starwars'
	},

	'ja.starwars': {
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.starwars',
		androidStoreLogo: 'https://developer.android.com/images/brand/ja_generic_rgb_wo_45.png',
		iosAppLink: 'https://itunes.apple.com/us/app/wikiafanapp/id920826902',
		iosStoreLogo: 'http://linkmaker.itunes.apple.com/images/badges/ja-jp/badge_appstore-lrg.svg',
		domain: 'ja.starwars.wikia.com',
		icon: '/front/images/Star-Wars-Icon.png',
		appName: 'Star Wars',
		appScreens: '/front/images/Phone-Star-Wars.png',
		language: 'ja',
		wikiId: 5931,
		dbName: 'jastarwars'
	},

	'jedipedia': {
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.starwars',
		androidStoreLogo: 'https://developer.android.com/images/brand/en_generic_rgb_wo_45.png',
		iosAppLink: 'https://itunes.apple.com/us/app/wikiafanapp/id920826902',
		iosStoreLogo: 'http://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.svg',
		domain: 'de.starwars.wikia.com',
		icon: '/front/images/Star-Wars-Icon.png',
		appName: 'Star Wars',
		appScreens: '/front/images/Phone-Star-Wars.png',
		language: 'de',
		wikiId: 280741,
		dbName: 'dejedipedia'
	},

	'fr.starwars': {
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.starwars',
		androidStoreLogo: 'https://developer.android.com/images/brand/en_generic_rgb_wo_45.png',
		iosAppLink: 'https://itunes.apple.com/us/app/wikiafanapp/id920826902',
		iosStoreLogo: 'http://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.svg',
		domain: 'fr.starwars.wikia.com',
		icon: '/front/images/Star-Wars-Icon.png',
		appName: 'Star Wars',
		appScreens: '/front/images/Phone-Star-Wars.png',
		language: 'fr',
		wikiId: 750,
		dbName: 'frstarwars'
	},

	'es.starwars': {
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.starwars',
		androidStoreLogo: 'https://developer.android.com/images/brand/en_generic_rgb_wo_45.png',
		iosAppLink: 'https://itunes.apple.com/us/app/wikiafanapp/id920826902',
		iosStoreLogo: 'http://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.svg',
		domain: 'es.starwars.wikia.com',
		icon: '/front/images/Star-Wars-Icon.png',
		appName: 'Star Wars',
		appScreens: '/front/images/Phone-Star-Wars.png',
		language: 'es',
		wikiId: 916,
		dbName: 'esstarwars'
	},

	'pt.starwars': {
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.starwars',
		androidStoreLogo: 'https://developer.android.com/images/brand/en_generic_rgb_wo_45.png',
		iosAppLink: 'https://itunes.apple.com/us/app/wikiafanapp/id920826902',
		iosStoreLogo: 'http://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.svg',
		domain: 'pt.starwars.wikia.com',
		icon: '/front/images/Star-Wars-Icon.png',
		appName: 'Star Wars',
		appScreens: '/front/images/Phone-Star-Wars.png',
		language: 'pt',
		wikiId: 1473,
		dbName: 'ptstarwars'
	},

	'ru.starwars': {
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.starwars',
		androidStoreLogo: 'https://developer.android.com/images/brand/en_generic_rgb_wo_45.png',
		iosAppLink: 'https://itunes.apple.com/us/app/wikiafanapp/id920826902',
		iosStoreLogo: 'http://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.svg',
		domain: 'ru.starwars.wikia.com',
		icon: '/front/images/Star-Wars-Icon.png',
		appName: 'Star Wars',
		appScreens: '/front/images/Phone-Star-Wars.png',
		language: 'ru',
		wikiId: 1530,
		dbName: 'rustarwars'
	},

	'pl.starwars': {
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.starwars',
		androidStoreLogo: 'https://developer.android.com/images/brand/en_generic_rgb_wo_45.png',
		iosAppLink: 'https://itunes.apple.com/us/app/wikiafanapp/id920826902',
		iosStoreLogo: 'http://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.svg',
		domain: 'pl.starwars.wikia.com',
		icon: '/front/images/Star-Wars-Icon.png',
		appName: 'Star Wars',
		appScreens: '/front/images/Phone-Star-Wars.png',
		language: 'pt',
		wikiId: 1707,
		dbName: 'plstarwars'
	},

	'it.starwars': {
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.starwars',
		androidStoreLogo: 'https://developer.android.com/images/brand/en_generic_rgb_wo_45.png',
		iosAppLink: 'https://itunes.apple.com/us/app/wikiafanapp/id920826902',
		iosStoreLogo: 'http://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.svg',
		domain: 'it.starwars.wikia.com',
		icon: '/front/images/Star-Wars-Icon.png',
		appName: 'Star Wars',
		appScreens: '/front/images/Phone-Star-Wars.png',
		language: 'it',
		wikiId: 3786,
		dbName: 'ptstarwars'
	},

	'cocktails': {
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.cocktails',
		androidStoreLogo: 'https://developer.android.com/images/brand/en_generic_rgb_wo_45.png',
		iosAppLink: 'https://itunes.apple.com/us/app/wikiafanapp/id912770593',
		iosStoreLogo: 'http://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.svg',
		domain: 'cocktails.wikia.com',
		icon: '/front/images/Cocktails-App-Icon.png',
		appName: 'Cocktails',
		appScreens: '/front/images/Phone-Cocktails.png',
		language: 'en',
		wikiId: 8390,
		dbName: 'cocktails'
	},

	'adventuretime': {
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.adventuretime',
		androidStoreLogo: 'https://developer.android.com/images/brand/en_generic_rgb_wo_45.png',
		iosAppLink: 'https://itunes.apple.com/us/app/wikiafanapp/id951098842',
		iosStoreLogo: 'http://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.svg',
		domain: 'adventuretime.wikia.com',
		icon: '/front/images/Adventure-Time-Icon.png',
		appName: 'Adventure Time',
		appScreens: '/front/images/Phone-Adventure-Time.png',
		language: 'en',
		wikiId: 24357,
		dbName: 'adventuretimewithfinnandjake'
	},

	'hawaiifiveo': {
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.hawaiifiveo',
		androidStoreLogo: 'https://developer.android.com/images/brand/en_generic_rgb_wo_45.png',
		iosAppLink: 'https://itunes.apple.com/us/app/wikiafanapp/id998461510',
		iosStoreLogo: 'http://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.svg',
		domain: 'hawaiifiveo.wikia.com',
		icon: '/front/images/Hawaii-Five-O-App-Icon.png',
		appName: 'Hawaii Five O',
		appScreens: '/front/images/Phone-Hawaii-Five-O.png',
		language: 'en',
		wikiId: 119235,
		dbName: 'hawaiifiveo'
	},

	'thehungergames': {
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.hungergames',
		androidStoreLogo: 'https://developer.android.com/images/brand/en_generic_rgb_wo_45.png',
		iosAppLink: 'https://itunes.apple.com/us/app/wikiafanapp/id920825903',
		iosStoreLogo: 'http://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.svg',
		domain: 'thehungergames.wikia.com',
		icon: '/front/images/Hunger-Games-App-Icon.png',
		appName: 'Hunger Games',
		appScreens: '/front/images/Phone-Hunger-Games.png',
		language: 'en',
		wikiId: 35171,
		dbName: 'thehungergames'
	},

	'onedirection': {
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.onedirection',
		androidStoreLogo: 'https://developer.android.com/images/brand/en_generic_rgb_wo_45.png',
		iosAppLink: 'https://itunes.apple.com/us/app/wikiafanapp/id963580330',
		iosStoreLogo: 'http://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.svg',
		domain: 'onedirection.wikia.com',
		icon: '/front/images/One-Direction-App-Icon.png',
		appName: 'One Direction',
		appScreens: '/front/images/Phone-One-Direction.png',
		language: 'en',
		wikiId: 203914,
		dbName: 'onedirection'
	},

	'mediawiki119': {
		domain: 'mediawiki119.wikia.com',
		language: 'en',
		wikiId: 203236,
		dbName: 'mediawiki119cleanup4'
	},

	'clashofclans': {
		wikiId: 558247,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-fan-app-for-clash-clans/id951114733',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.clashofclans',
		domain: 'clashofclans',
		language: 'en',
		dbName: 'clashofclans'
	},

	'supersmashbros': {
		wikiId: 2714,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-super-smash-bros.-fan/id951119423',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.supersmashbros',
		domain: 'supersmashbros',
		language: 'en',
		dbName: 'ssb'
	},

	'ben10': {
		wikiId: 3124,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-fan-app-for-ben-10/id978373859',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.ben',
		domain: 'ben10',
		language: 'en',
		dbName: 'Ben10'
	},

	'gta': {
		wikiId: 4541,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-fan-app-for-gta/id739249895',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.gta',
		domain: 'gta',
		language: 'en',
		dbName: 'gtawiki'
	},

	'elderscrolls': {
		wikiId: 1706,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-fan-app-for-elder-scrolls/id739245485',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.elderscrolls',
		domain: 'elderscrolls',
		language: 'en',
		dbName: 'elderscrolls'
	},

	'pokemon': {
		wikiId: 74,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-fan-app-for-pokemon/id954163271',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.pokemon',
		domain: 'pokemon',
		language: 'en',
		dbName: 'pokemon'
	},

	'warframe': {
		wikiId: 544934,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-fan-app-for-warframe/id739263891',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.warframe',
		domain: 'warframe',
		language: 'en',
		dbName: 'warframe'
	},

	'bravefrontierglobal': {
		wikiId: 841905,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-fan-app-for-brave-frontier/id956796965',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.bravefrontier',
		domain: 'bravefrontierglobal',
		language: 'en',
		dbName: 'bravefrontierglobal'
	},

	'onepiece': {
		wikiId: 1081,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-fan-app-for-one-piece/id951123028',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.onepiece',
		domain: 'onepiece',
		language: 'en',
		dbName: 'onepiece'
	},

	'yugioh': {
		wikiId: 410,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-fan-app-for-yu-gi-oh!/id963580559',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.yugioh',
		domain: 'yugioh',
		language: 'en',
		dbName: 'yugioh'
	},

	'mortalkombat': {
		wikiId: 949,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-fan-app-for-mortal-kombat/id978374861',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.mortalkombat',
		domain: 'mortalkombat',
		language: 'en',
		dbName: 'mk'
	},

	'terraria': {
		wikiId: 255885,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-fan-app-for-terraria/id1002382913',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.terraria',
		domain: 'terraria',
		language: 'en',
		dbName: 'terraria'
	},

	'harrypotter': {
		wikiId: 509,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-fan-app-for-harry-potter/id951357364',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.harrypotter',
		domain: 'harrypotter',
		language: 'en',
		dbName: 'harrypotter'
	},

	'battlefront': {
		wikiId: 2188,
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.battlefront',
		domain: 'battlefront',
		language: 'en',
		dbName: 'battlefront'
	},

	'americanhorrorstory': {
		wikiId: 321995,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-fan-app-for-american/id963580005',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.americanhorror',
		domain: 'americanhorrorstory',
		language: 'en',
		dbName: 'americanhorrorstory'
	},

	'marvel': {
		wikiId: 2233,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-fan-app-for-marvel/id920019083',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.marvel',
		domain: 'marvel',
		language: 'en',
		dbName: 'enmarveldatabase'
	},

	'dc': {
		wikiId: 2237,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-fan-app-for-dc/id911451911',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.dc',
		domain: 'dc',
		language: 'en',
		dbName: 'endcdatabase'
	},

	'destiny': {
		wikiId: 604797,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-fan-app-for-destiny/id739164244',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.destiny',
		domain: 'destiny',
		language: 'en',
		dbName: 'destinypedia'
	},

	'weihnachten': {
		wikiId: 1074920,
		domain: 'weihnachten',
		language: 'de',
		dbName: 'deweihnachts'
	},

	'ja.halo': {
		wikiId: 3676,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-fan-app-for-halo/id951112978',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.halo',
		domain: 'ja.halo',
		language: 'ja',
		dbName: 'jahalo'
	},

	'ja.ajin': {
		wikiId: 1147260,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-fan-app-for-ajin/id1002374995',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.ajin',
		domain: 'ja.ajin',
		language: 'ja',
		dbName: 'jaajin'
	},

	'ja.knightsofsidonia': {
		wikiId: 1144697,
		iosAppLink: 'https://itunes.apple.com/us/app/wikia-fan-app-for-knights/id986388299',
		androidAppLink: 'https://play.google.com/store/apps/details?id=com.wikia.singlewikia.knightsofsidonia',
		domain: 'ja.knightsofsidonia',
		language: 'ja',
		dbName: 'jaessandboxsidonia'
	},

        'ja.overwatch': {
                wikiId: 1363059,
                domain: 'ja.overwatch',
                language: 'ja',
                dbName: 'jaoverwatch'
        },
};
