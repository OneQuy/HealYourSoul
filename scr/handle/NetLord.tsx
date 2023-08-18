import { IsInternetAvailableAsync } from "./UtilsTS"

const ThresholdCheckTime = 500;

export class NetLord {
    private static lastCheckTick: number = 0;
    private static lastIsAvailable: boolean | undefined = undefined;
    private static listSubscribers: (() => void)[] = [];
    static IsAvailable: boolean = false;

    static CheckAndInitAsync = async () => {
        this.lastCheckTick = Date.now();
        this.SetStatus(await IsInternetAvailableAsync());

        const remainMS = ThresholdCheckTime - Date.now() + this.lastCheckTick;
        // console.log(remainMS, this.IsAvailable, Date.now() - this.lastCheckTick);

        if (remainMS <= 0)
            this.CheckAndInitAsync();
        else
            setTimeout(this.CheckAndInitAsync, remainMS);
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
        // console.log('sub');
        
        return () => {
            this.Unsubscribe(callbackOnChanged);
        }
    }

    private static OnChangedStatus() {
        // console.log('changed', this.IsAvailable);

        this.listSubscribers.forEach(element => {
            element();
        });
    }

    private static SetStatus(yes: boolean) {
        this.IsAvailable = yes;

        if (this.lastIsAvailable !== yes) {
            this.OnChangedStatus();
            this.lastIsAvailable = yes;
        }
    }
}