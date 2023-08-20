import { TimeOutError } from "./UtilsTS"

const IntervalCheckTime = 500;
const ThresholdFetchTime = 2000;

// https://downloads.intercomcdn.com/i/o/118519/ddfeac07590ae764956095e7/4e16b83b84b7649bece46ae25a166d47.png

// https://cdn.sanity.io/images/fuvbjjlp/production/36cbc8ae92c7711afb9ab1ec9f7174863f4d7c19-22x24.svg

// https://avatars.githubusercontent.com/u/42239399?s=48&v=4

// https://licensebuttons.net/l/by-sa/4.0/88x31.png

const FetchURL = 'https://s1cdn.vnecdn.net/vnexpress/restruct/i/v800/v2_2019/pc/graphics/logo.svg'

export class NetLord {
    private static startTick: number = 0;
    private static listSubscribers: (() => void)[] = [];
    private static isInited: boolean = false;
    private static isAvailableLastestCheck: boolean = false;

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
        const changed = this.isAvailableLastestCheck !== yes;
        this.isAvailableLastestCheck = yes;

        if (changed)
            this.OnChangedStatus();
    }

    static IsAvailableLastestCheck = () => {
        if (!this.isInited)
            throw 'NetLord not inited yet.'

        return this.isAvailableLastestCheck;
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

export async function IsInternetAvailableAsync(): Promise<boolean> {
    // const start = Date.now();

    const res = await Promise.any([
        fetch(FetchURL, { headers: myHeaders }),
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