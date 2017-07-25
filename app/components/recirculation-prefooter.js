import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import Thumbnailer from '../modules/thumbnailer';
import {normalizeThumbWidth} from '../utils/thumbnail';
import {track, trackActions} from '../utils/track';

const {Component, computed, on, run, inject, $} = Ember,
	recircItemsCount = 10,
	config = {
		// we load twice as many items as we want to display because we need to filter out those without thumbnail
		max: recircItemsCount * 2,
		widget: 'wikia-impactfooter',
		source: 'fandom',
		opts: {
			resultType: 'cross-domain',
			domainType: 'fandom.wikia.com'
		}
	};

function fetchPlista() {
	return [{
		brand: 'Life Insurance Comparison',
		img: 'http://static.plista.com/image/resized/244310/a9q1eFGqTxGvhcD_356x200_8365.jpg'
			 + ' (32kB) ',
		status: 34,
		text: 'New Life Insurance Comparison Site Helps Aussies Save Big Money Quickly!',
		title: 'Over 40 with Life Insurance? You need to read this',
		type: 'pet',
		url: 'http://click.plista.com/pets/?friendid=0&frienddomainid=243030&widgetid=45044&itemid=371828933&campaignid=257204&bucketid=0&rh=59770fddc9cc34.78975602&lh=59770fde620b32.28763435&bv=_0_bVMLruQgDLvOqxShOB9C5mx7-DW0o5ldPVq1BdvBIamIoBPgQ7DUsWxJeLqZWCLgLXp5RCbE5moVDohzQJAL0A6BTnWTaN06ElK1K3W2MIxNXSRDVLyj0BPkWLg6w6GcUhEdyPCJ_qMjls3wMZRXnifG-Lkw0K1YnPBztI5uvpUYLhsggprjLOWY-mDX6y0sxkZ7qT8s908IhjedvPMXjNGXV7Y9WHxhL7sN25dzbAp0J6X5EP16-U2I7ePj1u1_alwvymtVQjd3Ganr3hvnehyzYtl1A5EfxA6CeA7jS-PDzAr2zuSDyKntCmuWRjA1e9WUSI0gErtX1CacE67RFKvIiV2WbJ-jhi_Tkl1Xq8w5qXPz5qwslHIPk516IPZmXlECPyGouUN1kcblncFcchtr1nAvdobV2hZuuxrMRwwKD3YYlDFto7Y3DlNf7KoKbTmK87JVOnd77s777ldqqhryDLAhNHTtr52R7sxm5FLDP31uitLiP9N00HdY3nqOoqtJ9LN6kanFRv8L&tend=1501003870&crc=b64bbdc21f80c3b8860cd862d9980088'
	}];
}

export default Component.extend(
	InViewportMixin,
	{
		classNames: ['recirculation-prefooter'],
		isVisible: false,
		liftigniter: inject.service(),
		i18n: inject.service(),
		hasNoLiftigniterSponsoredItem: true,
		isInRightCountry: false,
		shouldShowPlista: computed.and('hasNoLiftigniterSponsoredItem', 'isInRightCountry'),

		didEnterViewport() {
			const liftigniter = this.get('liftigniter');

			liftigniter
				.getData(config)
				.then((data) => {
					this.setProperties({
						isVisible: true,
						items: data.items
							.filter((item) => {
								return item.hasOwnProperty('thumbnail') && item.thumbnail;
							})
							.slice(0, recircItemsCount)
							.map((item) => {

								if (item.presented_by) {
									this.set('hasNoLiftigniterSponsoredItem', false);
								}

								// if ((M.geo.country === 'AU') || (M.geo.country === 'DE')) {
								//
								// 	fetchPlista().map(item => {
								// 		this.set('plistaItem.presented_by', item.brand);
								// 		this.set('plistaItem.thumbnail', item.img);
								// 		this.set('plistaItem.titl', item.title);
								// 		this.set('plistaItem.url', item.url);
								// 	});
								// 	// this.set('items.1', plista);
								// 	console.log(this.get('plistaItem'));
								// }

								item.thumbnail = Thumbnailer.getThumbURL(item.thumbnail, {
									mode: Thumbnailer.mode.scaleToWidth,
									width: normalizeThumbWidth(window.innerWidth)
								});

								return item;
							})
					});

					run.scheduleOnce('afterRender', () => {
						liftigniter.setupTracking(
							this.$().find('.recirculation-prefooter__item'),
							config.widget,
							'LI'
						);
					});
					//
					this.set('isInRightCountry', (M.geo.country === 'AU') || (M.geo.country === 'DE'));
					if (this.get('shouldShowPlista')) {

						// fetch
						let plistaItem = fetchPlista();

						let plistaSponsoredContent = plistaItem.map(item => {
							return {
								meta: 'wikia-impactfooter',
								source: 'plista',
								thumbnail: item.img,
								title: item.title,
								url: item.url,
								presented_by: 'Plista'
							};
						});
						console.log(plistaSponsoredContent[0]);
						this.set('items.1', plistaSponsoredContent[0]);
					}

				});

			track({
				action: trackActions.impression,
				category: 'recirculation',
				label: 'footer'
			});
		},

		viewportOptionsOverride: on('willRender', function () {
			const viewportTolerance = 1000;

			this.set('viewportTolerance', {
				top: viewportTolerance,
				bottom: viewportTolerance
			});
		}),

		actions: {
			postClick(post, index) {
				const labelParts = ['footer', `slot-${index + 1}`, post.source, post.isVideo ? 'video' : 'not-video'];

				track({
					action: trackActions.click,
					category: 'recirculation',
					label: labelParts.join('=')
				});

				run.later(() => {
					window.location.assign(post.url);
				}, 200);
			}
		}
	}
);
