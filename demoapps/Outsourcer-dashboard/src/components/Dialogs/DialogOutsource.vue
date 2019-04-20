<template>
  <div>
    <md-dialog :md-active.sync="showDialog" id="mydialog">
      <md-dialog-title>Outsource Order</md-dialog-title>
      <md-dialog-content>
        <md-field>
        <label>Item</label>
        <md-input v-model="fullItemName" disabled></md-input>
        </md-field>
        <md-field>
        <label>Quantity</label>
        <md-input v-model="quantity" disabled></md-input>
        </md-field>
        <md-field>
          <label for="selectedOperation">Operation</label>
          <md-select v-model="selectedOperation" name="selectedOperation" id="selectedOperation">
            <md-option v-for="operation in operations" :key="operation" :value="operation">{{operation}}</md-option>
          </md-select>
        </md-field>
        <md-field>
          <label for="selectedOutsourcee">Outsourcee</label>
          <md-select v-model="selectedOutsourcee" name="selectedOutsourcee" id="selectedOutsourcee">
            <md-option v-for="item in outsourcees" :key="item" :value="item">{{item}}</md-option>
          </md-select>
        </md-field>
        <md-field>
          <label for="selectedOutsourcer">Outsourcer</label>
          <md-select v-model="selectedOutsourcer" name="selectedOutsourcer" id="selectedOutsourcer">
            <md-option v-for="item in outsourcers" :key="item" :value="item">{{item}}</md-option>
          </md-select>
        </md-field>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Cancel</md-button>
        <md-button class="md-primary" @click="closeOk">Ok</md-button>
      </md-dialog-actions>
            </md-dialog-content>
    </md-dialog>
    <md-button class="md-primary md-raised" @click="showDialog = true">Outsource</md-button>
     <Circle9 v-show="isLoading"></Circle9>
  </div>
</template>

<script>
import Circle9 from 'vue-loading-spinner/src/components/Circle9.vue'
export default {
  props: {
    itemId: {
      type: String,
      default: null
    },
    itemName: {
      type: String,
      default: null
    },
    quantity: {
      type: Number,
      default: null
    }
  },
  components: {
    Circle9
  },
  name: 'DialogOutsource',
  computed: {
    fullItemName: function () {
      return (this.itemId + '-' + this.itemName)
    }
  },
  data: () => ({
    isLoading: false,
    showDialog: false,
    selectedOutsourcee: null,
    selectedOutsourcer: 'R01',
    selectedOperation: null,
    outsourcees: ['E01', 'E02'], // TODO: Retrieve this from Composer Registry
    outsourcers: ['R01', 'R02'], // TODO: This should not be necessary, but should be derived from getCurrentParticipant()
    operations: ['Paint', 'Polish', 'Cut', 'Drill'] // TODO: Retrieve this from Composer MetaData
  }),
  watch: {
    showDialog: function (val) {
      if (val) {
        this.selectedOutsourcee = null
        this.selectedOperation = null
      }
    }
  },
  methods: {
    getRandomOrderNumber (max) {
      return Math.floor(Math.random() * Math.floor(max))
    },
    async closeOk () {
      this.showDialog = false
      await this.placeOrder()
    },
    async placeOrder () {
      this.isLoading = true
      let orderId = `O${this.getRandomOrderNumber(1000)}`
      let body = JSON.parse(`{
"$class": "org.pulse.outsourcing_network.PlaceOrder",
"orderId": "${orderId}",
"operation": "${this.selectedOperation}",
"quantity": ${this.quantity},
"outsourcer": "resource:org.pulse.outsourcing_network.Outsourcer#${
  this.selectedOutsourcer
}",
"outsourcee": "resource:org.pulse.outsourcing_network.Outsourcee#${
  this.selectedOutsourcee
}",
"item": "resource:org.pulse.outsourcing_network.Item#${this.itemId}"
}`)
      // Make axios call
      let accessToken = 'mumWkmRZKgb7wApebi6AzNSFXEOZBiJqD9kwvGRTDKnYGGlKk85JWSXHNueAGJ0B'
      let url = 'http://localhost:3000/api/org.pulse.outsourcing_network.PlaceOrder'
      let api = `${url}?access_token=${accessToken}`
      this.$log.debug(`api first: ${api}`)
      let axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
      this.$log.debug(`api: ${api}`)
      this.$log.debug(`body: ${JSON.stringify(body)}`)
      this.$log.debug(`axiosConfig: ${JSON.stringify(axiosConfig)}`)
      await this.axios.post(api, body, axiosConfig).then(response => {
        this.$log.debug('axios - then')
        this.$log.debug(JSON.stringify(response))
        this.$emit('order-created', orderId)
      }).catch(error => {
        this.$log.debug('axios - catch')
        alert(JSON.stringify(error))
      })
      this.isLoading = false
    }
  }
}
</script>

<style lang='scss' scoped>
.md-dialog {
  max-width: 768px;
  z-index: 8; // Kludge to prevent covering selection list of Outsourcees
}
</style>
