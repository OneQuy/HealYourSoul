import { Category } from "../../constants/AppConstants";
import { GetAnimeQuoteTextAsync } from "../../handle/services/AnimeQuote";
import TheRandomShortText from "../template/TheRandomShortText";

export const AnimeQuoteScreen = () => {
    return <TheRandomShortText
        category={Category.AnimeQuote}
        getTextAsync={GetAnimeQuoteTextAsync}
    />;
}
