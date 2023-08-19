import { TimeOutError } from "./UtilsTS"

const IntervalCheckTime = 500;
const ThresholdFetchTime = 500;

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
        console.log('changed', this.isAvailableLastestCheck);

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
            console.log('unsub success');
        }
    }

    static Subscribe = (callbackOnChanged: () => void) => {
        this.listSubscribers.push(callbackOnChanged);
        console.log('sub');

        return () => {
            this.Unsubscribe(callbackOnChanged);
        }
    }
}

export async function IsInternetAvailableAsync(): Promise<boolean> {
    const res = await Promise.any([
        fetch('https://www.timeanddate.com/'),
        new Promise(resolve => setTimeout(resolve, ThresholdFetchTime, TimeOutError))
    ]);

    if (res === TimeOutError) {
        return false;
    }
    else {
        const respone = res as Response;
        return respone && respone.status >= 200 && respone.status < 300;
    }
}