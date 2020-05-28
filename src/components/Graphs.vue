<template>
    <b-container class="bv-example-row mt-5">
        <b-row>
            <div class="col-9">
                <h3>Graphs List</h3>
            </div>
            <div class="col-3" style="text-align:right">
                <b-button @click="addModal" class="mb-3" v-b-modal.modal-1 >+ New Graph</b-button>
            </div>
            <div v-show="loading" class="col-12 text-center">
                <b-spinner class="ml-2"  variant="primary" label="Spinning"></b-spinner>
            </div>
            <b-modal id="modal-1" centered :title="editMode ? 'Edit Graph' : 'New Graph'" ref="modal" 
                @show="resetForm"
                @hidden="resetForm"
                @ok="handleOk">
                <form @submit.stop.prevent="editMode ? editGraph() : addGraph()">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" class="form-control" id="name" v-model="graph.name" placeholder="Enter graph name">
                    </div>
                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea id="description" class="form-control" v-model="graph.description" placeholder="Graph description" rows="7"></textarea>
                    </div>
                </form>
            </b-modal>
            <table v-show="!loading" class="table table-striped">
                <thead class="thead-dark">
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items" :key="item.id">
                        <th scope="row">{{item.id}}</th>
                        <td>{{item.name}}</td>
                        <td>{{item.description}}</td>
                        <td>
                            <b-link :to="{ name: 'Graph', params: { id: item.id }}" class="btn mr-1 btn-sm btn-info">
                                <b-icon-eye></b-icon-eye> 
                            </b-link>
                            <b-link :to="{ name: 'Statistics', params: { id: item.id }}" class="btn mr-1 btn-sm btn-success">
                                <b-icon-bar-chart></b-icon-bar-chart> 
                            </b-link>
                            <b-link href="#" @click="editModal(item)" size="sm" class="btn mr-1 btn-sm btn-warning">
                                <b-icon-pencil-square></b-icon-pencil-square> 
                            </b-link>
                            <b-link :to="{ name: 'Edit', params: { id: item.id }}"  size="sm" class="btn mr-1 btn-sm btn-primary">
                                <b-icon-arrow-left-right></b-icon-arrow-left-right> 
                            </b-link>
                            <b-link  @click="deleteGraph(item.id)" size="sm" class="btn mr-1 btn-sm btn-danger">
                                <b-icon-trash></b-icon-trash> 
                            </b-link>

                        </td>
                    </tr>
                </tbody>
            </table>
            
            
        </b-row>
    </b-container>
</template>

<script>
    import Client from '@/services/client.js'
    export default {
        name: 'Graphs',
        data() {
            return {
                loading: true,
                editMode : false,
                items:[],
                graph: {
                    id: '',
                    name: '',
                    description: '',
                }
            }
        },
        methods: {
            resetForm() {
                this.graph.id='',
                this.graph.name='',
                this.graph.description=''
            },
            handleOk(bvModalEvt) {
                // Prevent modal from closing
                bvModalEvt.preventDefault()
                // Trigger submit handler
                if(this.editMode)
                    this.editGraph()
                else 
                    this.addGraph()
            },
            addModal() {
                this.editMode = false;
                this.resetForm()
            },
            editModal(item) {
                this.editMode = true;
                this.$bvModal.show('modal-1')
                this.graph.id= item.id,
                this.graph.name = item.name
                this.graph.description = item.description
            },
            addGraph() {
                Client.addGraph(this.graph)
                .then(() => {
                    this.loading = true;
                    //reset the form : 
                    this.resetForm()
                    // Hide the modal manually
                    this.$nextTick(() => {
                        this.$bvModal.hide('modal-1')
                    })                
                    //refresh the graphs list
                    this.getGraphs();
                })
                .catch(error => console.log(error))
            },
            editGraph() {
                this.loading = true;
                Client.updateGraph(this.graph)
                .then(() => {
                    //reset the form : 
                    this.resetForm()
                    // Hide the modal manually
                    this.$nextTick(() => {
                        this.$bvModal.hide('modal-1')
                    })                
                    //refresh the graphs list
                    this.getGraphs();
                })
                .catch(error => console.log(error))
            },
            deleteGraph(id) {
                this.$bvModal.msgBoxConfirm('Please confirm that you want to delete this graph.', {
                    title: 'Confirmation box',
                    size: 'sm',
                    buttonSize: 'sm',
                    okVariant: 'danger',
                    okTitle: 'YES',
                    cancelTitle: 'NO',
                    footerClass: 'p-2',
                    hideHeaderClose: false,
                    centered: true
                })
                .then((confirm) => {
                    if(confirm){
                        this.loading = true;
                        Client.deleteGraph(id)
                        .then(() => {
                                this.getGraphs();
                            })
                        .catch(error => console.log(error))
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            },
            getGraphs() {
                this.editMode=false;
                Client.getGraphs()
                .then(result =>  {
                    this.items = result.data.data
                    this.loading = false;
                })
                .catch(error => console.log(error));
            },
        },
        created() {
            this.getGraphs();
        }
    }
</script>

<style scoped>

</style>