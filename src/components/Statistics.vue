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

        </b-container>
        
    </div>
</template>

<script>
    import Client from '@/services/client.js'
    export default {
        name: "Statistics",
        data() {
            return {
                item : [
                    
                ]
            }
        },
        created() {
            Client.getGraph(this.$route.params.id)
            .then(result =>  {
                this.item = result.data.data
            })
            .catch(error => console.log(error));
        }
    }
</script>


<style scoped>

</style>