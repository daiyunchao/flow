class RequestHelper {
    async post({
        url = "",
        apiName = "",
        header = {
            "Content-type": "application/json"
        },
        postData = {}
    }) {
        // console.log(response.data);
        // console.log(response.status);
        // console.log(response.statusText);
        // console.log(response.headers);
        // console.log(response.config);
        if (!url) {
            url = `http://192.168.1.68:8850/flow-process/api/API/${apiName}`
        }
        let response = await axios.post(url, postData, {
            headers: header
        });
        console.log(`${apiName} response==>`, response);
        return response;
    }
}
export default new RequestHelper();