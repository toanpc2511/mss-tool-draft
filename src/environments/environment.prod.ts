export const environment = {
	production: true,
	appVersion: '1.0.0',
	apiUrl: 'https://api-management.sunoil.com.vn/management',
	apiUrlRoot: 'https://api-management.sunoil.com.vn',
	// apiUrl: 'http://192.168.1.65:5050/management',
	// apiUrlRoot: 'http://192.168.1.65:5050',
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
		hostname: 'mqtt.sunoil.com.vn',
		port: 9092,
		path: '/mqtt',
		username: 'namthanh',
		password: '123456789',
		protocol: 'wss'
	}
};
