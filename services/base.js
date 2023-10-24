import { empty } from "../utils/helpers.js"

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
        if(!empty(data)){
            returnData.data = data
        }
        return returnData
    }
}

export default BaseService