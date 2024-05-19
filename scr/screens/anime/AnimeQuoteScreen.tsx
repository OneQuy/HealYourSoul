import { Category, StorageKey_AnimeQuote_CurrentIdx } from "../../constants/AppConstants";
import { GetStaticFileUrl } from "../../handle/AppConfigHandler";
import { TheRandomShortText_FileConfig } from "../template/TheRandomShortText_FileConfig";

// import { GetAnimeQuoteTextAsync } from "../../handle/services/AnimeQuote";

export const AnimeQuoteScreen = () => {
    const file = GetStaticFileUrl('animeQuotes', 'https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Fanime_quotes.json?alt=media&token=7c67f578-c8dd-4ae4-9cc0-85e5d93e2f60')
    // console.log('aaaa', file);

    return (
        <TheRandomShortText_FileConfig
            category={Category.AnimeQuote}
            fileURL={file}
            configFileName="anime_quotes"
            currentItemStorageKey={StorageKey_AnimeQuote_CurrentIdx}
            shuffleIfJsonIsArray={true}
        />
    )

    // return <TheRandomShortText
    //     category={Category.AnimeQuote}
    //     getTextAsync={GetAnimeQuoteTextAsync}
    // />;
}
