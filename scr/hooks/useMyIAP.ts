import { useCallback, useEffect, useMemo, useState } from "react"
import { FetchListProductsAsync, IAPProduct, InitIAPAsync } from "../handle/IAP"
import { Product } from "react-native-iap"

/**
 * 
 * USAGE:
 * 
 * 1.
 * 
const { isInited, fetchedProducts } = useMyIAP(
    allProducts,
    async (s: string) => AsyncStorage.setItem(StorageKey_CachedIAP, s),
    async () => AsyncStorage.getItem(StorageKey_CachedIAP))

 * 2. check isInited for show loading
 * 3. when isInited is true, check initErrorObj (undefined means success inited)
 * 4. use:
 *      + fetchedProducts
 *      + fetchedTargetProduct for get local price of targetProductSku
 */
export const useMyIAP = (
    allProducts: IAPProduct[],
    cachedProductsListSetterAsync?: (text: string) => Promise<void>,
    cachedProductsListGetterAsync?: () => Promise<string | null>,
    targetProductSku?: IAPProduct | string,
) => {
    const [fetchedProducts, setFetchedProducts] = useState<Product[]>([])
    const [isInited, setInited] = useState(false)
    const [initErrorObj, setInitErroObj] = useState<Error | undefined>(undefined)

    const allIds = useMemo(() => {
        return allProducts.map(i => i.sku)
    }, [allProducts])

    const fetchedTargetProduct = useMemo(() => {
        if (targetProductSku === undefined)
            return undefined

        if (fetchedProducts.length === 0)
            return

        if (typeof targetProductSku === 'string')
            return fetchedProducts.find(i => i.productId === targetProductSku)
        else
            return fetchedProducts.find(i => i.productId === targetProductSku.sku)
    }, [fetchedProducts, targetProductSku])

    const fetchLocalPriceAsync = useCallback(async () => {
        const items = await FetchListProductsAsync(allIds)

        if (items.length > 0)
            setFetchedProducts(items)
        else {
            setTimeout(fetchLocalPriceAsync, 2000)
        }
    }, [allIds])

    useEffect(() => {
        (async () => {
            // init IAP

            const errorObj = await InitIAPAsync(
                allProducts,
                cachedProductsListSetterAsync,
                cachedProductsListGetterAsync)

            setInited(true)

            if (errorObj !== undefined) {
                setInitErroObj(errorObj)
                return
            }

            // fetch local price

            fetchLocalPriceAsync()
        })()
    }, [])

    return {
        fetchedProducts,
        fetchedTargetProduct,
        isInited,
        initErrorObj,
    } as const
}