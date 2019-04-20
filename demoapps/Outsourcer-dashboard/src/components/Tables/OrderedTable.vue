<template>
  <div>
    <md-table v-model="users" :table-header-color="tableHeaderColor">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="ID">{{ item.id }}</md-table-cell>
        <md-table-cell md-label="Item">{{ item.itemid + '-' + item.itemname }}</md-table-cell>
        <md-table-cell md-label="Quantity">{{ item.quantity }}</md-table-cell>
        <md-table-cell md-label="Customer">{{ item.customer }}</md-table-cell>
        <md-table-cell md-label="Outsource #">{{ item.sourcingno }}</md-table-cell>
        <md-table-cell md-label="Status Outsource Order">{{ item.statusSourcing }}</md-table-cell>
        <DialogOutsource
        v-show="item.sourcingno === ''"
        v-on:order-created="handleOrderCreated(item, $event)"
        :itemId="item.itemid"
        :itemName="item.itemname"
        :quantity="item.quantity">Outsource</DialogOutsource>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import DialogOutsource from '@/components/Dialogs/DialogOutsource.vue'
export default {
  name: 'ordered-table',
  components: {
    DialogOutsource
  },
  methods: {
    handleOrderCreated (item, event) {
      item.sourcingno = event
      item.statusSourcing = 'CREATED'
    }
  },
  props: {
    tableHeaderColor: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      selected: [],
      users: [
        {
          id: 1,
          itemid: 'I01',
          itemname: 'Widget',
          quantity: 12,
          customer: 'ACME Inc',
          sourcingno: '',
          statusSourcing: ''
        },
        {
          id: 2,
          itemid: 'I02',
          itemname: 'Watzit',
          quantity: 7,
          customer: 'Binford',
          sourcingno: '',
          statusSourcing: ''
        },
        {
          id: 3,
          itemid: 'I04',
          itemname: 'Gadget',
          quantity: 17,
          customer: 'FrobozzCo',
          sourcingno: '',
          statusSourcing: ''
        },
        {
          id: 4,
          itemid: 'I03',
          itemname: 'Thingy',
          quantity: 23,
          customer: 'Nakatomi Corp',
          sourcingno: '',
          statusSourcing: ''
        }
      ],
      updatedOutsourceNo: null
    }
  },
  mounted: function () {
    this.$log.debug('Entering mounted of OrderedTable')
    if (typeof this.$options.sockets.onmessage === 'undefined') {
      this.$log.debug(`Assign onmessage handler, should see this only ONCE!`)
      this.$options.sockets.onmessage = function (event) {
        this.$log.debug('Entering onmessage function...')
        const data = JSON.parse(event.data)
        this.$log.debug(`eventdata: ${JSON.stringify(data)}`)

        if (data['$class'] === 'org.pulse.outsourcing_network.UpdateOrderStatusEvent') {
          const sourcingNo = data['order']['orderId']
          const orderStatus = data['order']['orderStatus']
          this.$log.debug(`SourcingNo in event: ${sourcingNo}`)
          this.updatedOutsourceNo = sourcingNo
          const index = this.users.findIndex(function (element) {
            return element['sourcingno'] === sourcingNo
          })
          this.$log.debug(`index found: ${index}`)
          if (index >= 0) {
            let entry = this.users[index]
            entry['statusSourcing'] = orderStatus
            this.$set(this.users, index, entry)
          }
        }

        this.$log.debug('Exiting onmessage function...')
      }
    }
    this.$log.debug('Exiting mounted of OrderedTable')
  }
}
</script>
