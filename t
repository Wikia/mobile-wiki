[1mdiff --git a/front/main/app/components/discussion-header.js b/front/main/app/components/discussion-header.js[m
[1mindex f88a9ce..a567d57 100644[m
[1m--- a/front/main/app/components/discussion-header.js[m
[1m+++ b/front/main/app/components/discussion-header.js[m
[36m@@ -14,7 +14,7 @@[m [mexport default Ember.Component.extend([m
 			}[m
 		},[m
 [m
[31m-		backToDiscussionsLinkTitle: Ember.computed(() => i18n.t('main.back-to-discussions-link', {ns: 'discussion'})),[m
[32m+[m		[32mbackToDiscussionsLinkTitle: i18n.t('main.back-to-discussions-link', {ns: 'discussion'}),[m
 [m
 		canDeleteAll: false,[m
 [m
[1mdiff --git a/front/main/app/components/discussion-hero-unit.js b/front/main/app/components/discussion-hero-unit.js[m
[1mindex 2638a0c..4362aa4 100644[m
[1m--- a/front/main/app/components/discussion-hero-unit.js[m
[1m+++ b/front/main/app/components/discussion-hero-unit.js[m
[36m@@ -6,7 +6,7 @@[m [mexport default Ember.Component.extend(ViewportMixin, {[m
 	contentClassNames: 'background-theme-color',[m
 	attributeBindings: ['style'],[m
 [m
[31m-	headerTitle: Ember.computed(() => i18n.t('main.discussions-header-title', {ns: 'discussion'})),[m
[32m+[m	[32mheaderTitle: i18n.t('main.discussions-header-title', {ns: 'discussion'}),[m
 [m
 	overlay: false,[m
 	style: null,[m
