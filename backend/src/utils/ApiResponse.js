class ApiResponse{
    constructor(statusCode , message = "Success" , data ){
        this.statusCode = statusCode
        this.message = message,
        this.data = data
        this.success = statusCode >= 200 && statusCode < 400 ? true : false
    }
}
export {ApiResponse}