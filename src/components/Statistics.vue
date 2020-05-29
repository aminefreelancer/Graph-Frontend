<template>
    <div>
        <b-container class="bv-example-row mt-5">
            <b-card v-show="!loading" :title="graph.name">
                <b-card-text>
                    {{graph.description}}
                </b-card-text>
                <hr>
                #Nodes: <b>{{graph.nodes.length}}</b> / #Relations: <b>{{edges.length/2}}</b>
                <hr>
                @Created : <b>{{getDate(graph.created_at)}}</b> - @Updated : <b>{{getDate(graph.updated_at)}}</b>
            </b-card>
            <div v-show="loading" class="col-12 text-center">
                <b-spinner class="ml-2"  variant="primary" label="Spinning"></b-spinner>
            </div>
            <div v-show="!loading" class="row mt-4">
                <div class="col-md-6">
                    <d3-network :net-nodes="graph.nodes" :net-links="edges" :options="options" />
                </div>
                <div class="col-md-6">
                    <h3>Nodes List</h3>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tooltip</th>
                            <th scope="col">Neighbor nodes</th>
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
                            </tr>
                        </tbody>
                    </table>
                </div>
                    
            </div>
        </b-container>
    </div>
</template>

<script>
    import Client from '@/services/client.js'
    import D3Network from 'vue-d3-network'
    import moment from 'moment'
    export default {
        name: "Statistics",
        components: {
            D3Network
        },
        data() {
            return {
                loading: false,
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
                    graph_id: '',
                },
                nodeSize:35,
                canvas:false
            }
        },
        methods: {
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
            getDate(dateValue) {
                return moment(dateValue).format('DD-MM-YYYY hh:mm:ss');
            },
        },
        computed:{
            
            edges() {
                let links = []
                this.graph.nodes.forEach(node => {
                    node.edges.forEach(edge => {
                        let link = {
                            sid: edge.in_node_id,
                            tid: edge.out_node_id,
                        }
                        links.push(link)
                    });
                    
                });
                return links;
            },
            options(){
                return{
                    force: 3000,
                    size:{ w:600, h:400},
                    nodeSize: this.nodeSize,
                    nodeLabels: true,
                    linkLabels:true,
                    canvas: this.canvas
                }
            }
        },
        created() {
            this.getGraph();
        }
    }
</script>

<style src="vue-d3-network/dist/vue-d3-network.css"></style>
<style scoped>

</style>