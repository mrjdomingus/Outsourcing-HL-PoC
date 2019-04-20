// Based on https://stackoverflow.com/questions/51526505/how-to-listen-to-events-on-composer

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
this.bizNetworkConnection = new BusinessNetworkConnection();
this.cardName = 'admin@outsourcing-network';
this.businessNetworkIdentifier = 'outsourcing-network';

this.bizNetworkConnection.connect(this.cardName)
    .then((result) => {
        //You can do ANYTHING HERE eg.

        console.log("BusinessNetworkConnection: ", result);
    })
    .catch((error) => {
        throw error;
    });

// then the event stuff
this.bizNetworkConnection.on('event', (evt) => {
    console.log('The notification sent from sendEvent was: ' + evt.theMessage);
});