/**
 * SETUP
 * https://react-native-iap.dooboolab.com/docs/get-started
 */


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
} from 'react-native-iap';

var purchaseUpdateSubscription = null;
var purchaseErrorSubscription = null;

export const InitIAP = () => {
    initConnection().then(() => {
        // we make sure that "ghost" pending payment are removed
        // (ghost = failed pending payment that are still marked as pending in Google's native Vending module cache)
        flushFailedPurchasesCachedAsPendingAndroid()
            .catch((reason) => {
                // exception can happen here if:
                // - there are pending purchases that are still pending (we can't consume a pending purchase)
                // in any case, you might not want to do anything special with the error
                console.error('IAP flushFailedPurchasesCachedAsPendingAndroid error: ' + reason);
            })
            .then(() => {
                purchaseUpdateSubscription = purchaseUpdatedListener(
                    (purchase: SubscriptionPurchase | ProductPurchase) => {
                        const receipt = purchase.transactionReceipt;

                        console.log('purchaseUpdatedListener', purchase);
                        console.log('receipt', receipt);

                        if (!receipt)
                            return

                        // Tell the store that you have delivered what has been paid for.
                        // Failure to do this will result in the purchase being refunded on Android and
                        // the purchase event will reappear on every relaunch of the app until you succeed
                        // in doing the below. It will also be impossible for the user to purchase consumables
                        // again until you do this.

                        // If consumable (can be purchased again)
                        finishTransaction({ purchase, isConsumable: true });

                        // // If not consumable
                        // await finishTransaction({ purchase, isConsumable: false });
                    },
                );

                purchaseErrorSubscription = purchaseErrorListener(
                    (error: PurchaseError) => {
                        console.warn('purchaseErrorListener', error);
                    },
                );
            });
    })
}

export const GetProductsAsync = async (skus: string[]) => {
    return await getProducts({ skus})
}

export const PurchaseAsync = async (sku: string) => {
    try {
        return await requestPurchase({
            sku,
            skus: [sku],
            andDangerouslyFinishTransactionAutomaticallyIOS: false,
        });
    } catch (err) {
        // @ts-ignore
        //   console.log('hihihi', err.code, err.message);
        return err
    }
};

// componentWillUnmount() {
//     if (this.purchaseUpdateSubscription) {
//         this.purchaseUpdateSubscription.remove();
//         this.purchaseUpdateSubscription = null;
//     }

//     if (this.purchaseErrorSubscription) {
//         this.purchaseErrorSubscription.remove();
//         this.purchaseErrorSubscription = null;
//     }
// }