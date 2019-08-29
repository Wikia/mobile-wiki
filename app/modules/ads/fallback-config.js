export const fallbackInstantConfig = {
  "wgAdDriverGAMLazyLoadingFetchMarginPercent": 600,
  "icConfiant": [{"apps": ["mobile-wiki"], "regions": ["DE", "GB", "UK", "US"], "value": true}],
  "wgAdDriverGAMLazyLoadingCountries": null,
  "wgAdDriverFloorAdhesionTimeoutCountries": ["PL"],
  "wgAdDriverFloorAdhesionTimeout": 1400,
  "wgAdDriverFloorAdhesionDelay": 180000,
  "wgAdDriverGAMLazyLoadingRenderMarginPercent": 300,
  "icFloorAdhesionClickPositionTracking": [{
    "apps": ["mobile-wiki"],
    "regions": ["PL"],
    "sampling": 100.0,
    "value": true
  }],
  "icFloorAdhesionForceSafeFrame": [{
    "apps": ["mobile-wiki"],
    "regions": ["US"],
    "value": false
  }, {"apps": ["mobile-wiki"], "regions": ["XX"], "value": true}],
  "icFloorAdhesionDelay": [{
    "apps": ["mobile-wiki"],
    "regions": ["AU", "CA", "ES", "GB", "UK", "US"],
    "value": 180000
  }, {"apps": ["mobile-wiki"], "regions": ["XX"], "value": 3000}],
  "icTopBoxadOutOfPage": [{"apps": ["mobile-wiki"], "regions": ["SG"], "sampling": 50.0, "value": true}],
  "icBabDetection": [{"apps": ["f2", "gamepedia", "mobile-wiki", "oasis"], "regions": ["XX"], "value": true}],
  "wgAdDriverBillTheLizardConfig": {
    "timeout": 2000,
    "projects": {
      "vcr": [{
        "name": "vcr",
        "countries": ["PL/100", "CZ/100", "HK/100", "UK/100", "GB/100"],
        "dfp_targeting": true
      }],
      "cheshirecat": [{
        "name": "cheshirecat",
        "on_1": ["catlapseIncontentBoxad"],
        "countries": ["PL/100", "UK/100", "GB/100", "DK/100", "FR/100", "IT/100", "NI/100"],
        "dfp_targeting": true
      }],
      "queen_of_hearts": [{
        "name": "ctp_desktop:2.0.0",
        "on_0": ["disableAutoPlay"],
        "on_1": ["disableAutoPlay"],
        "countries": ["XX/0.05-cached"]
      }]
    }
  },
  "icFloorAdhesionViewportsToStart": [{"apps": ["mobile-wiki"], "regions": ["XX"], "value": 1}],
  "wgAdDriverFloorAdhesionDelayCountries": ["CA", "ES", "US-AL", "US-VA"],
  "icPorvataDirect": [{"apps": ["f2", "gamepedia", "mobile-wiki", "oasis"], "value": false}]
};
