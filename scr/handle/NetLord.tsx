/**
 * USAGE
    -------------------------------------------

    const isInternetAvailable = await IsInternetAvailableAsync()

    if (isInternetAvailable) {
        // do your internet thing
    }

    NOTE: this function could take time (up to time-out value 2000ms) if it can not fetch the url (offline)

    -------------------------------------------

    Or you can subcribe / unsubcribe event when internet changed:

    1. Put this into your Init app code:
        await NetLord.InitAsync()

    2. To subscribe: NetLord.Subscribe(yourCallback)

    3. To unsubscribe: NetLord.Unsubscribe(yourSubscribedCallback)

    4. Call Netlord.IsAvailableLatestCheck() to check if the internet is available on the latest check. This is not async func so it will fast to check the internet.
        NOTE: But in some cases this function return wrong value. Particularly calling this func right after your app re-active after backing from 'background' app state.
        Due to the throttle check internet is 500ms. So if we checked 500ms before. 400ms after that, maybe this func return correct value, but 200ms after that, NetLord will not sure the real internet available or not. 
        So please consider call this function only for some features that not important in your app, such as display UI internet status,... Do Not use for your core app logic. Use it at your own risk.

    -------------------------------------------
 */

import { RegexUrl, TimeOutError } from "./UtilsTS"

const IntervalCheckTime = 500; // in ms, throttle check time.
const ThresholdFetchTime = 2000; //  in ms,  time-out when fetching

// https://downloads.intercomcdn.com/i/o/118519/ddfeac07590ae764956095e7/4e16b83b84b7649bece46ae25a166d47.png

// https://cdn.sanity.io/images/fuvbjjlp/production/36cbc8ae92c7711afb9ab1ec9f7174863f4d7c19-22x24.svg

// https://avatars.githubusercontent.com/u/42239399?s=48&v=4

// https://licensebuttons.net/l/by-sa/4.0/88x31.png

// https://s1cdn.vnecdn.net/vnexpress/restruct/i/v800/v2_2019/pc/graphics/logo.svg

// https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_dark_1x_r5.png

const FetchURL = 'https://developer.apple.com/contact/images/icons/svg/icon-cas-phone.svg'

export class NetLord {
    private static startTick: number = 0;
    private static listSubscribers: (() => void)[] = [];
    private static isInited: boolean = false;
    private static isAvailableLatestCheck: boolean = false;

    private static LoopAsync = async () => {
        this.startTick = Date.now();
        this.SetStatus(await IsInternetAvailableAsync());

        const remainMS = IntervalCheckTime - (Date.now() - this.startTick);
        // console.log('check time:', (Date.now() - this.startTick), 'available:', this.isAvailableLastestCheck);

        if (remainMS <= 0)
            this.LoopAsync();
        else
            setTimeout(this.LoopAsync, remainMS);
    }

    private static OnChangedStatus() {
        // console.log('changed', this.isAvailableLastestCheck);

        this.listSubscribers.forEach(callback => callback());
    }

    private static SetStatus(yes: boolean) {
        const changed = this.isAvailableLatestCheck !== yes;
        this.isAvailableLatestCheck = yes;

        if (changed)
            this.OnChangedStatus();
    }

    static IsAvailableLatestCheck = (valueReturnIfNotInitedyet: boolean = true) => {
        if (!this.isInited)
            return valueReturnIfNotInitedyet
        else
            return this.isAvailableLatestCheck;
    }

    static InitAsync = async () => {
        if (this.isInited)
            return;

        this.isInited = true;
        await this.LoopAsync();
    }

    static Unsubscribe = (callbackOnChanged: () => void) => {
        const idx = this.listSubscribers.indexOf(callbackOnChanged);

        if (idx >= 0) {
            this.listSubscribers.splice(idx, 1);
            // console.log('unsub success');
        }
    }

    static Subscribe = (callbackOnChanged: () => void) => {
        this.listSubscribers.push(callbackOnChanged);
        // console.log('sub');

        return () => {
            this.Unsubscribe(callbackOnChanged);
        }
    }
}

// var totalTime = 0;
// var count = 0;
// var max = 0;
// var min = 1000;

const myHeaders = new Headers();
myHeaders.append('pragma', 'no-cache');
myHeaders.append('cache-control', 'no-cache');

var alterFetchUrl: string | undefined = undefined

export function SetNetLordFetchUrl(url: string) {
    if (!RegexUrl(url))
        return

    alterFetchUrl = url
}

export async function IsInternetAvailableAsync(): Promise<boolean> {
    // const start = Date.now();

    const url = alterFetchUrl ? alterFetchUrl : FetchURL

    const res = await Promise.any([
        fetch(url, { headers: myHeaders }),
        new Promise(resolve => setTimeout(resolve, ThresholdFetchTime, TimeOutError))
    ]);

    if (res === TimeOutError) {
        return false;
    }
    else {
        // var passedTime = Date.now() - start;
        // max = Math.max(passedTime, max);
        // min = Math.min(passedTime, min)
        // totalTime += passedTime;
        // count++;

        // console.log('time', passedTime, 'avg', totalTime / count, 'max', max, 'min', min, 'count', count);
        // console.log(res);

        const respone = res as Response;
        return respone && respone.status >= 200 && respone.status < 300;
    }
}