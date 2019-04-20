/**
 * New script file
 */

 // DEMO SETUP FUNCTIONS
/**
 * Create the participants to use in the demo
 * @param {org.pulse.outsourcing_network.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
async function setupDemo() { // eslint-disable-line no-unused-vars
    console.log('setupDemo');

    const factory = getFactory();
    const namespace = 'org.pulse.outsourcing_network';

    let outsourcers = [{'id': 'R01', 'name': 'Acme'}, {'id': 'R02', 'name': 'WeSaySo'} ];
    let outsourcees = [{'id': 'E01', 'name': 'Optican'}, {'id': 'E02', 'name': 'inGen'} ];
    let transporters = [{'id': 'T01', 'name': 'Tricell'}, {'id': 'T02', 'name': 'Hanso'} ];
    let items = [{'id': 'I01', 'name': 'Widget'}, {'id': 'I02', 'name': 'Watzit'}, {'id': 'I03', 'name': 'Thingy'}, {'id': 'I04', 'name': 'Gadget'} ];

    console.log('create outsourcers');
    // create array of Outsourcer particpant resources
    outsourcers = outsourcers.map(function (outsourcer) {
        const outsourcerResource = factory.newResource(namespace, 'Outsourcer', outsourcer.id);
        outsourcerResource.name = outsourcer.name;
        return outsourcerResource;
    });

    // add the outsourcers
    const outsourcerRegistry = await getParticipantRegistry(namespace + '.Outsourcer');
    await outsourcerRegistry.addAll(outsourcers);

    console.log('create outsourcees');
    // create array of Outsourcee particpant resources
    outsourcees = outsourcees.map(function (outsourcee) {
        const outsourceeResource = factory.newResource(namespace, 'Outsourcee', outsourcee.id);
        outsourceeResource.name = outsourcee.name;
        return outsourceeResource;
    });

    // add the outsourcees
    const outsourceeRegistry = await getParticipantRegistry(namespace + '.Outsourcee');
    await outsourceeRegistry.addAll(outsourcees);

    console.log('create transporters');
    // create array of Transporter particpant resources
    transporters = transporters.map(function (transporter) {
        const transporterResource = factory.newResource(namespace, 'Transporter', transporter.id);
        transporterResource.name = transporter.name;
        return transporterResource;
    });

    // add the transporters
    const transporterRegistry = await getParticipantRegistry(namespace + '.Transporter');
    await transporterRegistry.addAll(transporters);

    console.log('create items');
    // create array of Item asset resources
    items = items.map(function (item) {
        const itemResource = factory.newResource(namespace, 'Item', item.id);
        itemResource.itemName = item.name;
        return itemResource;
    });

    // add the items
    const itemsRegistry = await getAssetRegistry(namespace + '.Item');
    await itemsRegistry.addAll(items);
}

/**
 * Place an order for a vehicle
 * @param {org.pulse.outsourcing_network.PlaceOrder} orderRequest - the PlaceOrder transaction
 * @transaction
 */
async function placeOrder(orderRequest) { // eslint-disable-line no-unused-vars
    console.log('placeOrder');

    const factory = getFactory();
    const namespace = 'org.pulse.outsourcing_network';

    const order = factory.newResource(namespace, 'Order', orderRequest.orderId);
    order.operation = orderRequest.operation;
    order.orderStatus = 'CREATED';
    order.quantity = orderRequest.quantity;
    order.outsourcer = factory.newRelationship(namespace, 'Outsourcer', orderRequest.outsourcer.getIdentifier());
    order.outsourcee = factory.newRelationship(namespace, 'Outsourcee', orderRequest.outsourcee.getIdentifier());
    order.item = factory.newRelationship(namespace, 'Item', orderRequest.item.getIdentifier());
    

    // save the order
    const assetRegistry = await getAssetRegistry(order.getFullyQualifiedType());
    await assetRegistry.add(order);

    // emit the event
    const placeOrderEvent = factory.newEvent(namespace, 'PlaceOrderEvent');
    placeOrderEvent.orderId = order.orderId;
    placeOrderEvent.operation = order.operation;
    placeOrderEvent.orderStatus = order.orderStatus;
    placeOrderEvent.quantity = order.quantity;
    placeOrderEvent.outsourcer = order.outsourcer;
    placeOrderEvent.outsourcee = order.outsourcee;
    placeOrderEvent.transporter = order.transporter;
    placeOrderEvent.item = order.item;
    emit(placeOrderEvent);
}

/**
 * Update the status of an order
 * @param {org.pulse.outsourcing_network.UpdateOrderStatus} updateOrderRequest - the UpdateOrderStatus transaction
 * @transaction
 */
async function updateOrderStatus(updateOrderRequest) { // eslint-disable-line no-unused-vars
    console.log('updateOrderStatus');

    let currentParticipant = getCurrentParticipant();
    if (currentParticipant.getFullyQualifiedType() === 'org.pulse.outsourcing_network.Outsourcee' &&
            updateOrderRequest.orderStatus === 'CREATED') {
        throw new Error('Outsourcee is not allowed to change OrderStatus to CREATED');
    }

    const factory = getFactory();
    const namespace = 'org.pulse.outsourcing_network';

    // update the order
    const order = updateOrderRequest.order;
    order.orderStatus = updateOrderRequest.orderStatus;
    const orderRegistry = await getAssetRegistry(namespace + '.Order');
    await orderRegistry.update(order);

    // emit the event
    const updateOrderStatusEvent = factory.newEvent(namespace, 'UpdateOrderStatusEvent');
    updateOrderStatusEvent.orderStatus = updateOrderRequest.order.orderStatus;
    updateOrderStatusEvent.order = updateOrderRequest.order;
    emit(updateOrderStatusEvent);
}

/**
*
* @param {org.pulse.outsourcing_network.TestEventTransaction} TestEventTransaction
* @transaction
*/

function TestEventTransaction(TestEventTransaction) {
    var factory = getFactory();
    const namespace = 'org.pulse.outsourcing_network';

    var testEvent = factory.newEvent(namespace, 'TestEvent');
    testEvent.theMessage = "Testing 1, 2, 3, 4";
    console.log(testEvent.theMessage);
    emit(testEvent);
}
