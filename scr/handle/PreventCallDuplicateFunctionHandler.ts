import { DelayAsync } from "./Utils"

export class PreventCallDuplicateFunctionHandler<T> {
    private funcAsync: () => Promise<T>
    private isHandling: boolean = false
    private checkIntervalMs: number
    
    // @ts-ignore
    private result: T

    constructor(funcAsync: () => Promise<T>, checkIntervalMs: number = 1000) {
        this.funcAsync = funcAsync
        this.checkIntervalMs = checkIntervalMs
    }

    async ExcecuteAsync(): Promise<T> {
        if (this.isHandling) {
            for (; ;) {
                // console.log('is handling, wait...');

                await DelayAsync(this.checkIntervalMs)

                if (this.isHandling)
                    continue

                // console.log('wait done', this.result)

                return this.result
            }
        }

        // console.log('executeeeeee');

        this.isHandling = true

        this.result = await this.funcAsync()

        this.isHandling = false

        return this.result
    }
}