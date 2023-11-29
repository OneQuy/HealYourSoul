/**
 * SETUP
 * https://react-native-iap.dooboolab.com/docs/get-started
 */


import { Platform } from 'react-native';
import {
    initConnection,
    purchaseErrorListener,
    purchaseUpdatedListener,
    type ProductPurchase,
    type PurchaseError,
    flushFailedPurchasesCachedAsPendingAndroid,
    SubscriptionPurchase,
    finishTransaction,
    requestPurchase,
    getProducts,
    Product,
} from 'react-native-iap';
import { ArrayRemove } from './UtilsTS';

export type IAPProduct = {
    sku: string,
    isConsumable: boolean,
}

export type SuccessCallback = (sku: string) => void
export type ErrorCallback = (error: PurchaseError) => void

const onSuccessListeners: SuccessCallback[] = []

const onErrorListeners: ErrorCallback[] = []

var isInited = false
var initedProducts: IAPProduct[]

export var fetchedProducts: Product[] = []

/**
 * @returns unsubscribe method () => void if success, otherwise undefined (can not init)
 */
export const InitIAPAsync = async (
    products: IAPProduct[],
    onSucess?: SuccessCallback,
    onError?: ErrorCallback): Promise<(() => void) | undefined> => {
    if (isInited)
        throw new Error('IAP already inited')

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

    if (onSucess)
        RegisterOnSuccessPurchase(onSucess)

    if (onError)
        RegisterOnErrorPurchase(onError)

    const updateListener = purchaseUpdatedListener(
        (purchase: SubscriptionPurchase | ProductPurchase) => {
            const receipt = purchase.transactionReceipt

            // console.log('receipt', receipt);

            if (!receipt) {
                for (let i = 0; i < onErrorListeners.length; i++) {
                    onErrorListeners[i]({
                        productId: purchase.productId,
                        name: 'UnknownIAPError',
                        message: 'NO receipt.'
                    } as PurchaseError)
                }

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

            for (let i = 0; i < onSuccessListeners.length; i++) {
                onSuccessListeners[i](purchase.productId)
            }
        })

    const errorListener = purchaseErrorListener((error: PurchaseError) => {
        for (let i = 0; i < onErrorListeners.length; i++) {
            onErrorListeners[i](error)
        }
    })

    return () => {
        updateListener.remove()
        errorListener.remove()

        if (onSucess)
            UnregisterOnSuccessPurchase(onSucess)

        if (onError)
            UnregisterOnErrorPurchase(onError)
    }
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
 * @returns undefined if success, otherwise Error
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
        return err
    }
}

export const RegisterOnSuccessPurchase = (calback: SuccessCallback) => {
    onSuccessListeners.push(calback)
}

export const UnregisterOnSuccessPurchase = (calback: SuccessCallback) => {
    ArrayRemove(onSuccessListeners, calback)
}

export const RegisterOnErrorPurchase = (calback: ErrorCallback) => {
    onErrorListeners.push(calback)
}

export const UnregisterOnErrorPurchase = (calback: ErrorCallback) => {
    ArrayRemove(onErrorListeners, calback)
}