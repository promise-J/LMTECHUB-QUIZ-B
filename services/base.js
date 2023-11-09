import { empty, isArray } from "../utils/helpers.js"

class BaseService {
    constructor(){
        this.server_error = 'Server error. Please try again later'
    }

    static sendFailedResponse(message){
        let returnData = {success: false}
        if(!empty(message)){
            returnData.error = message
        }
        return returnData
    }
    static sendSuccessResponse(data){
        let returnData = {success: true}
        if(!empty(data) || isArray(data)){
            returnData.data = data
        }
        return returnData
    }
}

export default BaseService