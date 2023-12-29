const url = 'https://meme-api.com/gimme'

export const GetRedditMemeAsync = async (): Promise<string | undefined> => {
    try {
        const data = await fetch(url)

        // console.log(data);

        if (data.status !== 200)
            return undefined

        const json = await data.json()

        return json.url
    } catch (error) {
        return undefined
    }
}