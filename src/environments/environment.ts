// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	appVersion: '1.0.0',
	USERDATA_KEY: 'authf649fc9a5f55',
	isMockEnabled: false,
	apiUrl: 'https://sunoil-management.firecloud.live/management',
	apiUrlRoot: 'https://sunoil-management.firecloud.live',
	// apiUrl: 'https://api-management.sunoil.com.vn/management',
	// apiUrlRoot: 'https://api-management.sunoil.com.vn',
	firebase: {
		apiKey: 'AIzaSyBGDWDvuG1Wq6Wbu9fBhaU86WdD2B7Q6Mo',
		authDomain: 'sun-oil-e747c.firebaseapp.com',
		projectId: 'sun-oil-e747c',
		storageBucket: 'sun-oil-e747c.appspot.com',
		messagingSenderId: '621967318770',
		appId: '1:621967318770:web:f0b639097f7ae10b9a7a6b',
		measurementId: 'G-DB7RBLVY70'
	},
	mqtt: {
		hostname: 'sunoil-management.firecloud.live',
		port: 9001,
		path: '/mqtt',
		username: 'namthanh',
		password: '123456789',
		protocol: 'wss'
	}
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
