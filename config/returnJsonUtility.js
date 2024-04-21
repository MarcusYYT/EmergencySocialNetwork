export function returnData(res){
    let returnJson = {
        exist: null, 
        data: []
    }

    if(res != null){
        returnJson.exist = true;
        returnJson.data.push(res) 
      } else {
        returnJson.exist = false;
      }

    return returnJson;
}