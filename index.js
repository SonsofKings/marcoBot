const debug = (process.argv[3] == 'debug');
const async = require('async');

let bundle;

exports.neuron = {
	interneuron: {
		type: 'node',
		name: 'marcoBot',
		ivKey: '4sc0re&7',
		connectTo: {host: '127.0.0.1', port: 6443},
		onContext: 'gotCtx'
	},
	skills: [
		{
			name: 'interval',
			emits: ['sendMarco'],
			skillex: {
				timers: [
					{ms:300000, emit: 'sendMarco'}
				]
			}
		},
		{
			name: 'eval',
			hears: ['gotCtx','sendMarco'],
			skillex: {
				gotCtx: function(self, message, allDone) {
					self.nverse.getRouteStack(function(err, res) {
							bundle = res[1].context;
						allDone();
					});
				},
				sendMarco: function(self, message, allDone) {
					let response = false;
					
					async.series({
						one: function(back) {
							self.nverse.ask(bundle, 'marco', {}, function(err, res) {
								if (!err) response = true;
							});
							setTimeout(function() {
								back();
							}, 1000);
						}	
					}, function() {
						if (response == true) {
							console.log(`OK @ ${new Date()}`);
						} else {
							console.error(`Unable to talk to Bundle at ${new Date()}`);
						}
						allDone();
					});
				}
			}
		}
	]
};