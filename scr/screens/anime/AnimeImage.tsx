import { Category } from "../../constants/AppConstants";
import TheRandomImage from "../template/TheRandomImage";

export const AnimeImageScreen = () => {
    return <TheRandomImage
        category={Category.AnimeImage}
        getImageAsync={undefined}
    />;
}