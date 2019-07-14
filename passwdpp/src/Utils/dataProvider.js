import { stringify } from 'query-string';
import {
    GET_LIST,
    GET_ONE,
    CREATE,
    UPDATE,
    UPDATE_MANY,
    DELETE,
    DELETE_MANY,
    GET_MANY,
    GET_MANY_REFERENCE,
} from 'react-admin';
import axios from 'axios'

const apiUrl = 'http://localhost:8080'
    // const apiUrl = 'http://jsonplaceholder.typicode.com'

/**
 * Maps react-admin queries to API
 *
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request type
 * @returns {Promise} the Promise for a data response
 */

function parseResponse(res, type) {
    if (res.statusText !== "OK") {
        console.log("REQUEST ERROR");
    }

    if (res.status === 400 || res.status === 404 || res.status === 500) {
        console.log("ERROR");
        console.log(res);
    } else {

        var data = res.data

        switch (type) {
            case GET_LIST:
                return { data: data, total: data.length }
            case CREATE:
                return { data: { data, id: data.id } }
            default:
                return { data: data }
        }
    }
}

export function dataProvider(type, resource, params) {
    let url = ''
    let myHeaders = new Headers()

    myHeaders.append("Access-Control-Allow-Origin", "*")
    myHeaders.append("Access-Control-Allow-Headers", "*")
    myHeaders.append("Access-Control-Allow-Methods", "*")
    myHeaders.append("Content-Type", "*")
    myHeaders.append("Accept", "application/json")

    var options = {
        headers: myHeaders
    }

    var query = null
    console.log('X X X X X X X X X X');
    console.log(params);
    console.log('X X X X X X X X X X');

    // if (params.data) {
    //     params.data.user_id = 'teste'
    // }

    switch (type) {
        case GET_LIST:
            url = `${apiUrl}/${resource}`
            return axios.get(url, options).then(res => {
                return parseResponse(res, type)
            })
        case GET_ONE:
            url = `${apiUrl}/${resource}/${params.id}`
            return axios.get(url, options).then(res => {
                return parseResponse(res, type)
            })
        case CREATE:
            url = `${apiUrl}/${resource}`
            return axios.post(url, params.data, options).then(res => {
                return parseResponse(res, type)
            })
        case UPDATE:
            url = `${apiUrl}/${resource}/${params.id}`
            params.data.user_id_target = params.data.id
            return axios.put(url, params.data, options).then(res => {
                return parseResponse(res, type)
            })
        case DELETE:
            url = `${apiUrl}/${resource}/${params.id}`
            return axios.delete(url, options).then(res => {
                return parseResponse(res, type)
            })
        case DELETE_MANY:
            query = {
                filter: JSON.stringify({ id: params.ids }),
            };
            url = `${apiUrl}/${resource}?${stringify(query)}`
            return axios.delete(url, options).then(res => {
                return parseResponse(res, type)
            })
        default:
            throw new Error(`Unsupported Data Provider request type ${type}`)
    }

    return axios({
            method: options.method,
            url: url,
            data: options.body
        })
        .then(res => {

        })
}


export default dataProvider