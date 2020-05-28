import axios from 'axios'
import qs from 'qs'

const apiClient = axios.create({
  baseURL: `http://127.0.0.1:8000/api`,
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  getGraphs() {
    return apiClient.get('/graphs');
  },
  getGraph(id) {
    return apiClient.get('/graphs/'+id);
  },
  addGraph(graph) {
    return apiClient.post('/graphs', graph);
  },
  updateGraph(graph) {
    let obj = {'name': graph.name, 'description': graph.description, 'id': this.id}
    let strngObj = qs.stringify(obj)
    return apiClient.put('/graphs/'+graph.id, strngObj, 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
  },
  deleteGraph(id) {
    return apiClient.delete('/graphs/'+id);
  },

  addNode(node) {
    return apiClient.post('/nodes', node);
  },
  
}
