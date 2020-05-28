<template>
    <div>    
        <b-container class="bv-example-row mt-5">
            <b-card v-show="!loading" :title="graph.name">
                <b-card-text>
                    {{graph.description}}
                </b-card-text>
            </b-card>
            <div v-show="loading" class="col-12 text-center">
                <b-spinner class="ml-2"  variant="primary" label="Spinning"></b-spinner>
            </div>

            <div v-show="!loading" class="mt-5 row">
                <div class="col-9">
                    <h3>Nodes List</h3>
                </div>
                <div class="col-3" style="text-align:right">
                    <b-button @click="addModal" class="mb-3" v-b-modal.modal-1 >+ New Node</b-button>
                </div>
                <table class="table table-striped">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tooltip</th>
                        <th scope="col">Neighbor nodes</th>
                        <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="node in graph.nodes" :key="node.id">
                            <th scope="row">{{node.id}}</th>
                            <td>{{node.tooltip}}</td>
                            <td>
                                <span v-for="edge in node.edges" :key="edge.id">
                                    {{ edge.out_node_id }},
                                </span>
                            </td>
                            <td>
                                <b-link href="#" @click="editModal(node)" size="sm" class="btn mr-1 btn-sm btn-warning">
                                    <b-icon-pencil-square></b-icon-pencil-square> 
                                </b-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <b-modal id="modal-1" centered :title="editMode ? 'Edit Node' : 'New Node'" ref="modal" 
                    @show="resetForm"
                    @hidden="resetForm"
                    @ok="handleOk">
                    <form @submit.stop.prevent="editMode ? editNode() : addNode()">
                        <div class="form-group">
                            <label for="tooltip">Tooltip</label>
                            <input type="text" class="form-control" id="tooltip" v-model="node.tooltip" placeholder="Enter node tooltip">
                        </div>
                        <div class="form-group">
                            <h6 id="neighbor">Neighbor nodes</h6>
                            <div v-for="neighbor in graph.nodes" :key="neighbor.id" class="form-check form-check-inline">
                                <div v-if="neighbor.id != node.id">
                                    <input class="form-check-input" type="checkbox" :id="neighbor.id" v-model="node.edges" :value="neighbor.id">
                                    <label class="form-check-label" :for="neighbor.id">{{neighbor.tooltip}} ({{neighbor.id}})</label>
                                </div>

                                
                            </div>
                        </div>
                    </form>
                </b-modal>
            </div>
        </b-container>
    </div>
</template>

<script>
    import Client from '@/services/client.js'
    export default {
        name: "Edit",
        data() {
            return {
                loading: false,
                editMode: false,
                graph : {
                    id: '',
                    name: '',
                    description: '',
                    nodes: []
                },
                node: {
                    id: '',
                    tooltip: '',
                    edges: [],
                    graph_id: ''
                }
            }
        },
        methods: {
            resetForm() {
                this.node.id='',
                this.node.tooltip='',
                this.node.edges=[]
            },
            handleOk(bvModalEvt) {
                // Prevent modal from closing
                bvModalEvt.preventDefault()
                // Trigger submit handler
                if(this.editMode)
                    this.editNode()
                else 
                    this.addNode()
            },
            addModal() {
                this.editMode = false;
                this.resetForm()
            },
            editModal(item) {
                this.editMode = true;
                this.$bvModal.show('modal-1')
                this.node.id= item.id,
                this.node.tooltip = item.tooltip
                this.graph.edges = item.edges
            },
            addNode() {
                Client.addNode(this.node)
                .then(() => {
                    this.loading = true;
                    //reset the form : 
                    this.resetForm()
                    // Hide the modal manually
                    this.$nextTick(() => {
                        this.$bvModal.hide('modal-1')
                    })                
                    //refresh the graph & nodes list
                    this.getGraph();
                })
                .catch(error => console.log(error))
            },
            editGraph() {
                this.loading = true;
                Client.updateNode(this.node)
                .then(() => {
                    //reset the form : 
                    this.resetForm()
                    // Hide the modal manually
                    this.$nextTick(() => {
                        this.$bvModal.hide('modal-1')
                    })                
                    //refresh the graph & nodes list
                    this.getGraph();
                })
                .catch(error => console.log(error))
            },
            deleteGraph(id) {
                this.$bvModal.msgBoxConfirm('Please confirm that you want to delete this node.', {
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
                        Client.deleteNode(id)
                        .then(() => {
                                this.getGraph();
                            })
                        .catch(error => console.log(error))
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            },
            getGraph() {
                this.loading = true
                Client.getGraph(this.$route.params.id)
                .then(result =>  {
                    this.loading = false
                    this.graph = result.data.data
                    this.node.graph_id = this.graph.id
                })
                .catch(error => console.log(error));
            },
        },
        created() {
            this.getGraph();
        }
    }
</script>

<style scoped>

</style>