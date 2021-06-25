import got from "got/dist/source";

interface Response {
    response: string;
} 

export class Tesla {

    vehicleID: string;
    apiKey: string;

    constructor() {
        this.vehicleID = process.env.TESLA_VEHICLE_ID
        this.apiKey = process.env.TESLA_API_KEY
    }

    async horn() {
        return new Promise((resolve, reject) => {
            got.post(`https://owner-api.teslamotors.com/api/1/vehicles/${this.vehicleID}/command/honk_horn`, {
                responseType: 'json',
                resolveBodyOnly: true,
                headers: {
                    'Authorization': 'Bearer ' + this.apiKey
                }
            })
            .then(body => <Response>body)
            .then(body => body.response)
            .then((): void => {
                resolve({
                    success: true
                })
            })
            .catch((): void => {
                reject({
                    success: false,
                    msg: 'Unable to execute command'
                })
            })
        })
    }
}
