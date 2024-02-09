/**
 * SETUP
 * 1. Like this: https://github.com/OneQuy/HealYourSoul/commit/614b9d3a2ae4e6c2928569d94ab32633ce3c7d14
 * 2. Add IAP in XCode
 * DOC
 * https://react-native-iap.dooboolab.com/docs/get-started
 */


import { Platform } from 'react-native';
import {
    initConnection,
    purchaseUpdatedListener,
    type ProductPurchase,
    type PurchaseError,
    flushFailedPurchasesCachedAsPendingAndroid,
    SubscriptionPurchase,
    finishTransaction,
    requestPurchase,
    getProducts,
    Product,
    ErrorCode,
    getAvailablePurchases,
} from 'react-native-iap';

export type IAPProduct = {
    sku: string,
    isConsumable: boolean,
}

export type SuccessCallback = (sku: string) => void
export type ErrorCallback = (error: PurchaseError) => void

var isInited = false
var initedProducts: IAPProduct[]

export var fetchedProducts: Product[] = []

/**
 * @returns unsubscribe method () => void if success, otherwise undefined (can not init)
 */
export const InitIAPAsync = async (products: IAPProduct[]): Promise<(() => void) | undefined> => {
    if (isInited) {
        console.warn('IAP already inited')
        return undefined
    }

    const canIAP = await initConnection()

    if (!canIAP) {
        return undefined
    }

    isInited = true
    initedProducts = products

    // (only android) we make sure that "ghost" pending payment are removed
    // (ghost = failed pending payment that are still marked as pending in Google's native Vending module cache)

    if (Platform.OS === 'android') {
        try {
            await flushFailedPurchasesCachedAsPendingAndroid()
        } catch (error) {
            // exception can happen here if:
            // - there are pending purchases that are still pending (we can't consume a pending purchase)
            // in any case, you might not want to do anything special with the error
            console.error('IAP flushFailedPurchasesCachedAsPendingAndroid error: ' + error);
        }
    }

    purchaseUpdatedListener((purchase: SubscriptionPurchase | ProductPurchase) => {
        const receipt = purchase.transactionReceipt

        // console.log('receipt', receipt);

        if (!receipt) {
            return
        }

        // Tell the store that you have delivered what has been paid for.
        // Failure to do this will result in the purchase being refunded on Android and
        // the purchase event will reappear on every relaunch of the app until you succeed
        // in doing the below. It will also be impossible for the user to purchase consumables
        // again until you do this.

        const product = products.find(i => i.sku === purchase.productId)

        if (!product)
            throw new Error('IAP not found product: ' + purchase.productId)

        finishTransaction({ purchase, isConsumable: product.isConsumable })
    })

    return () => { }
}

export const GetIAPProduct = async (sku: string): Promise<Product | undefined> => {
    if (!isInited)
        throw new Error('IAP not inited yet')

    const products = await getProducts({ skus: [sku] })

    if (!products || products.length < 1)
        return undefined

    return products[0]
}

export const GetIAPLocalPriceAsync = async (sku: string): Promise<string | undefined> => {
    const product = await GetIAPProduct(sku)

    if (product)
        return product.localizedPrice
    else
        return undefined
}

export const FetchListroductsAsync = async (skus: string[]) => {
    if (fetchedProducts.length > 0) // already fetched
        return fetchedProducts

    if (!isInited)
        throw new Error('IAP not inited yet')

    fetchedProducts = await getProducts({ skus })

    return fetchedProducts
}

/**
 * @returns undefined if success
 * @returns null if user cancelled
 * @returns otherwise Error
 */
export const PurchaseAsync = async (sku: string) => {
    try {
        if (!isInited)
            throw new Error('IAP not inited yet')

        if (Platform.OS === 'android' && fetchedProducts.length <= 0) { // need to fetch on android
            await FetchListroductsAsync(initedProducts.map(i => i.sku))
        }

        await requestPurchase({
            sku,
            skus: [sku],
            andDangerouslyFinishTransactionAutomaticallyIOS: false,
        })

        return undefined
    } catch (err) {
        const errIAP = err as PurchaseError

        if (errIAP && errIAP.code === ErrorCode.E_USER_CANCELLED)
            return null
        else
            return err
    }
}

// export const RegisterOnSuccessPurchase = (calback: SuccessCallback) => {
//     onSuccessListeners.push(calback)
// }

// export const UnregisterOnSuccessPurchase = (calback: SuccessCallback) => {
//     ArrayRemove(onSuccessListeners, calback)
// }

// export const RegisterOnErrorPurchase = (calback: ErrorCallback) => {
//     onErrorListeners.push(calback)
// }

// export const UnregisterOnErrorPurchase = (calback: ErrorCallback) => {
//     ArrayRemove(onErrorListeners, calback)
// }

/**
 * @returns array if success (can be empty []), or error
 */
export const RestorePurchaseAsync = async () => {
    try {
        if (!isInited)
            throw new Error('IAP not inited yet')

        const purchases = await getAvailablePurchases();

        for (let i = 0; i < purchases.length; i++) {
            const purchase = purchases[i]
            const product = initedProducts.find(i => i.sku === purchase.productId)

            if (!product)
                continue

            if (!product.isConsumable)
                continue

            await finishTransaction({ purchase });
        }

        return purchases
    } catch (error) {
        return error
    }
};