<template>
    <div>
        Edit Graph {{item.id}}
    </div>
</template>

<script>
    import Client from '@/services/client.js'
    export default {
        name: "Graph",
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