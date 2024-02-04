// https://apilayer.com/marketplace/ip_to_location-api

import { GetIPAsync, ToCanPrint } from "../handle/UtilsTS"
import { IPToLocationAPI } from "../../keys"

const key = IPToLocationAPI

export type IPLocation = {
    "city": string,
    "continent_name": string,
    "country_code": string,
    "country_name": string,
    "region_name": string,
}

/**
 * @returns IPLocation if success
 * @returns undefined if IP or response not ok
 * @returns string (ToCanPrint) if other error
 */
export const GetIPLocationAsync = async (): Promise<IPLocation | undefined | string> => {
    const ip = await GetIPAsync()

    if (typeof ip !== 'string')
        return undefined

    try {
        var myHeaders = new Headers();
        myHeaders.append("apikey", key)

        const requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };

        const res = await fetch("https://api.apilayer.com/ip_to_location/" + ip, requestOptions)

        if (!res.ok)
            return undefined

        const json = await res.json() as IPLocation

        return json
    }
    catch (e) {
        return ToCanPrint(e).toString()
    }
}