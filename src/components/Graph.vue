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

            <div v-show="!loading" class="row">
                <d3-network :net-nodes="graph.nodes" :net-links="edges" :options="options" />
            </div>
        </b-container>
    </div>
</template>

<script>
    import Client from '@/services/client.js'
    import D3Network from 'vue-d3-network'
    
    export default {
        name: "Graph",
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
                nodeSize:35,
                canvas:true
            }
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
                    size:{ w:600, h:600},
                    nodeSize: this.nodeSize,
                    nodeLabels: true,
                    linkLabels:true,
                    canvas: this.canvas
                }
            }
        },

        created() {
            this.loading = true
            Client.getGraph(this.$route.params.id)
            .then(result =>  {
                this.graph = result.data.data
                this.loading = false
            })
            .catch(error => console.log(error));
        }
    }
</script>
<style src="vue-d3-network/dist/vue-d3-network.css"></style>

<style scoped>

</style>