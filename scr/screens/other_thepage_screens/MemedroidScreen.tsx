import { Category, LocalText, StorageKey_Memedroid_CurrentIdx } from '../../constants/AppConstants';
import { TheRandomImage_PopupSelect } from '../template/TheRandomImage_PopupSelect';
import { GetMemedroidAsync } from '../../handle/services/MemedroidApi';

const MemedroidSources = [
    LocalText.memedroid_all,
    LocalText.memedroid_trending,
    LocalText.memedroid_day,
    LocalText.memedroid_week,
    LocalText.memedroid_month,
    LocalText.memedroid_ever,
]

export const MemedroidScreen = () => {
    return (
        <TheRandomImage_PopupSelect
            fileURL=''
            configFileName=''
            category={Category.Memedroid}
            currentItemIdxStorageKey={StorageKey_Memedroid_CurrentIdx}
            getImageWithParamAsync={GetMemedroidAsync}
            popupSelectTitle={LocalText.select_source}

            fixedArrayData={MemedroidSources}
        />
    )
}