import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { BackgroundForTextCurrent, DiversityItemType, Inbox, SubscribedData } from "../constants/Types";
import { ScreenName } from "../constants/AppConstants";
import { AddOrRemoveItemInArray, ArrayAddWithCheckDuplicate, ArrayRemove, IsValuableArrayOrString } from "../handle/UtilsTS";

export type UserDataState = {
    minimalDrawer: undefined | boolean,

    inboxes: Inbox[] | undefined,

    backgroundIdForText: undefined | BackgroundForTextCurrent[],

    disableScreens: ScreenName[],

    pinnedFunSoundNames: string[],

    subscribedData: SubscribedData | undefined,

    savedItems: DiversityItemType[] | undefined,

    uploadedItems: DiversityItemType[] | undefined,

    checkedInScreens: ScreenName[],

    funSoundFavoriteIDs: (number | string)[],

    shortFilmsFavoritedIDs: (number | string)[],

    awardPictureFavoritedIDs: (number | string)[],

    funWebsiteFavoritesIDs: (number | string)[],

    topMovieFavoritesIDs: (number | string)[],

    awesomeSeenIDs: (number | string)[],
    awesomeFavoritedIDs: (number | string)[],

    awesomeNatureSeenIDs: (number | string)[],
    awesomeNatureFavoritedIDs: (number | string)[],

    tuneSeenIDs: (number | string)[],
    tuneFavoritedIDs: (number | string)[],

    infoSeenIDs: (number | string)[],
    infoFavoritedIDs: (number | string)[],

    vocabularySeenIDs: (number | string)[],
    vocabularyFavoritedIDs: (number | string)[],

    typoSeenIDs: (number | string)[],
    typoFavoritedIDs: (number | string)[],

    sunsetSeenIDs: (number | string)[],
    sunsetFavoritedIDs: (number | string)[],

    drawSeenIDs: (number | string)[],
    drawFavoritedIDs: (number | string)[],

    memeSeenIDs: (number | string)[],
    memeFavoritedIDs: (number | string)[],

    quoteSeenIDs: (number | string)[],
    quoteFavoritedIDs: (number | string)[],

    loveSeenIDs: (number | string)[],
    loveFavoritedIDs: (number | string)[],

    satisfyingSeenIDs: (number | string)[],
    satisfyingFavoritedIDs: (number | string)[],

    catdogSeenIDs: (number | string)[],
    catdogFavoritedIDs: (number | string)[],

    nsfwSeenIDs: (number | string)[],
    nsfwFavoritedIDs: (number | string)[],

    cuteSeenIDs: (number | string)[],
    cuteFavoritedIDs: (number | string)[],

    sarcasmSeenIDs: (number | string)[],
    sarcasmFavoritedIDs: (number | string)[],

    artSeenIDs: (number | string)[],
    artFavoritedIDs: (number | string)[],

    niceClipSeenIDs: (number | string)[],
    niceClipFavoritedIDs: (number | string)[],
}

const initialState: UserDataState = {
    minimalDrawer: false,

    inboxes: [],

    backgroundIdForText: undefined,

    disableScreens: [],

    pinnedFunSoundNames: [],
    funSoundFavoriteIDs: [],

    subscribedData: undefined,

    checkedInScreens: [],

    savedItems: [],

    uploadedItems: [],

    shortFilmsFavoritedIDs: [],

    awardPictureFavoritedIDs: [],

    funWebsiteFavoritesIDs: [],

    topMovieFavoritesIDs: [],

    drawSeenIDs: [],
    drawFavoritedIDs: [],

    niceClipSeenIDs: [],
    niceClipFavoritedIDs: [],

    memeSeenIDs: [],
    memeFavoritedIDs: [],

    vocabularySeenIDs: [],
    vocabularyFavoritedIDs: [],

    tuneSeenIDs: [],
    tuneFavoritedIDs: [],

    sunsetSeenIDs: [],
    sunsetFavoritedIDs: [],

    infoSeenIDs: [],
    infoFavoritedIDs: [],

    typoSeenIDs: [],
    typoFavoritedIDs: [],

    awesomeSeenIDs: [],
    awesomeFavoritedIDs: [],

    awesomeNatureSeenIDs: [],
    awesomeNatureFavoritedIDs: [],

    quoteSeenIDs: [],
    quoteFavoritedIDs: [],

    loveSeenIDs: [],
    loveFavoritedIDs: [],

    satisfyingSeenIDs: [],
    satisfyingFavoritedIDs: [],

    catdogSeenIDs: [],
    catdogFavoritedIDs: [],

    nsfwSeenIDs: [],
    nsfwFavoritedIDs: [],

    artSeenIDs: [],
    artFavoritedIDs: [],

    cuteSeenIDs: [],
    cuteFavoritedIDs: [],

    sarcasmSeenIDs: [],
    sarcasmFavoritedIDs: [],
}

const slice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        clearAllUserData: () => initialState,

        resetDev: (state) => {
            state.backgroundIdForText = undefined
        },

        // minimal drawer

        toggleMinialDrawer: (state) => {
            state.minimalDrawer = state.minimalDrawer === undefined ? true : !state.minimalDrawer
        },

        // background id for text

        setBackgroundIdForText: (state, action: PayloadAction<BackgroundForTextCurrent>) => {
            let arr = state.backgroundIdForText ? [...state.backgroundIdForText] : []

            for (let i = 0; i < arr.length; i++) {
                if (arr[i].cat !== action.payload.cat)
                    continue

                arr[i] = action.payload
                state.backgroundIdForText = arr

                return
            }

            arr.push(action.payload)
            state.backgroundIdForText = arr
        },

        // inbox

        setDidReadInbox: (state, action: PayloadAction<number>) => {
            if (!state.inboxes)
                return

            const inb = state.inboxes.find(i => i.tickAsId === action.payload)

            if (!inb)
                return

            inb.didRead = true
        },

        addInboxes: (state, action: PayloadAction<Inbox[]>) => {
            if (!state.inboxes)
                state.inboxes = []

            ArrayAddWithCheckDuplicate(state.inboxes, action.payload, 'tickAsId', false)
        },

        clearInbox: (state, action: PayloadAction<number>) => {
            if (!state.inboxes)
                return

            const inb = state.inboxes.find(i => i.tickAsId === action.payload)

            if (!inb)
                return

            ArrayRemove(state.inboxes, inb)

            if (!IsValuableArrayOrString(state.inboxes))
                state.inboxes = undefined
        },

        toggleMarkAsReadInbox: (state, action: PayloadAction<number>) => {
            if (!state.inboxes)
                return

            const inb = state.inboxes.find(i => i.tickAsId === action.payload)

            if (!inb)
                return

            inb.didRead = !inb.didRead
        },

        toggleLovedInbox: (state, action: PayloadAction<number>) => {
            if (!state.inboxes)
                return

            const inb = state.inboxes.find(i => i.tickAsId === action.payload)

            if (!inb)
                return

            inb.isLoved = !inb.isLoved
        },

        clearAllInboxes: (state) => {
            state.inboxes = undefined
        },

        // subscribed

        setSubscribe: (state, action: PayloadAction<string>) => {
            state.subscribedData = {
                id: action.payload,
                tick: Date.now(),
            } as SubscribedData
        },

        resetSubscribe: (state) => {
            state.subscribedData = undefined
        },

        // enable screens

        enableAllScreen(state) {
            state.disableScreens = []
        },

        toggleDisableScreen(state, action: PayloadAction<ScreenName>) {
            if (!state.disableScreens)
                state.disableScreens = []

            if (state.disableScreens.includes(action.payload))
                state.disableScreens = state.disableScreens.filter(screen => screen !== action.payload)
            else
                state.disableScreens.push(action.payload)
        },

        // saved

        toggleSavedItem(state, action: PayloadAction<DiversityItemType>) {
            if (!state.savedItems)
                state.savedItems = []

            const idx = state.savedItems.findIndex(i => JSON.stringify(i) === JSON.stringify(action.payload))

            if (idx >= 0)
                ArrayRemove(state.savedItems, state.savedItems[idx])
            else
                state.savedItems.push(action.payload)
        },

        // upload

        addUploadedItem(state, action: PayloadAction<DiversityItemType>) {
            if (!state.uploadedItems)
                state.uploadedItems = []

            const idx = state.uploadedItems.findIndex(i => JSON.stringify(i) === JSON.stringify(action.payload))

            if (idx < 0)
                state.uploadedItems.unshift(action.payload)
        },

        // check in

        checkInScreen(state, action: PayloadAction<ScreenName>) {
            if (!state.checkedInScreens)
                state.checkedInScreens = []

            if (!state.checkedInScreens.includes(action.payload)) {
                state.checkedInScreens.push(action.payload)
            }
        },

        // fun sound

        addFunSoundFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.funSoundFavoriteIDs)
                state.funSoundFavoriteIDs = []

            if (!state.funSoundFavoriteIDs.includes(action.payload))
                state.funSoundFavoriteIDs.push(action.payload);
        },

        removeFunSoundFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.funSoundFavoriteIDs)
                state.funSoundFavoriteIDs = []

            state.funSoundFavoriteIDs = state.funSoundFavoriteIDs.filter(i => i !== action.payload)
        },

        togglePinFunSound(state, action: PayloadAction<string>) {
            if (!state.pinnedFunSoundNames)
                state.pinnedFunSoundNames = []

            if (state.pinnedFunSoundNames.includes(action.payload))
                state.pinnedFunSoundNames = state.pinnedFunSoundNames.filter(item => item !== action.payload)
            else
                state.pinnedFunSoundNames.push(action.payload)
        },

        // award picture

        addAwardPictureFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.awardPictureFavoritedIDs)
                state.awardPictureFavoritedIDs = []

            if (!state.awardPictureFavoritedIDs.includes(action.payload))
                state.awardPictureFavoritedIDs.push(action.payload);
        },

        removeAwardPictureFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.awardPictureFavoritedIDs)
                state.awardPictureFavoritedIDs = []

            state.awardPictureFavoritedIDs = state.awardPictureFavoritedIDs.filter(i => i !== action.payload)
        },

        // top movies

        addTopMovieFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.topMovieFavoritesIDs)
                state.topMovieFavoritesIDs = []

            if (!state.topMovieFavoritesIDs.includes(action.payload))
                state.topMovieFavoritesIDs.push(action.payload);
        },

        removeTopMovieFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.topMovieFavoritesIDs)
                state.topMovieFavoritesIDs = []

            state.topMovieFavoritesIDs = state.topMovieFavoritesIDs.filter(i => i !== action.payload)
        },

        // short films

        addShortFilmsFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.shortFilmsFavoritedIDs)
                state.shortFilmsFavoritedIDs = []

            if (!state.shortFilmsFavoritedIDs.includes(action.payload))
                state.shortFilmsFavoritedIDs.push(action.payload);
        },

        removeShortFilmsFavoritedID(state, action: PayloadAction<number | string>) {
            state.shortFilmsFavoritedIDs = state.shortFilmsFavoritedIDs.filter(i => i !== action.payload)
        },

        // award picture

        addFunWebsiteFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.funWebsiteFavoritesIDs)
                state.funWebsiteFavoritesIDs = []

            if (!state.funWebsiteFavoritesIDs.includes(action.payload))
                state.funWebsiteFavoritesIDs.push(action.payload);
        },

        removeFunWebsiteFavoritedID(state, action: PayloadAction<number | string>) {
            state.funWebsiteFavoritesIDs = state.funWebsiteFavoritesIDs.filter(i => i !== action.payload)
        },

        // draw (warm)

        addDrawSeenID(state, action: PayloadAction<number | string>) {
            if (!state.drawSeenIDs)
                state.drawSeenIDs = []

            if (!state.drawSeenIDs.includes(action.payload))
                state.drawSeenIDs.push(action.payload);
        },

        addDrawFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.drawFavoritedIDs)
                state.drawFavoritedIDs = []

            if (!state.drawFavoritedIDs.includes(action.payload))
                state.drawFavoritedIDs.push(action.payload);
        },

        removeDrawFavoritedID(state, action: PayloadAction<number | string>) {
            state.drawFavoritedIDs = state.drawFavoritedIDs.filter(i => i !== action.payload)
        },

        // awesomeNature

        addAwesomeNatureSeenID(state, action: PayloadAction<number | string>) {
            if (!state.awesomeNatureSeenIDs)
                state.awesomeNatureSeenIDs = []

            if (!state.awesomeNatureSeenIDs.includes(action.payload))
                state.awesomeNatureSeenIDs.push(action.payload);
        },

        addAwesomeNatureFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.awesomeNatureFavoritedIDs)
                state.awesomeNatureFavoritedIDs = []

            if (!state.awesomeNatureFavoritedIDs.includes(action.payload))
                state.awesomeNatureFavoritedIDs.push(action.payload);
        },

        removeAwesomeNatureFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.awesomeNatureFavoritedIDs)
                return

            state.awesomeNatureFavoritedIDs = state.awesomeNatureFavoritedIDs.filter(i => i !== action.payload)
        },

        // vocabulary

        addVocabularySeenID(state, action: PayloadAction<number | string>) {
            if (!state.vocabularySeenIDs)
                state.vocabularySeenIDs = []

            if (!state.vocabularySeenIDs.includes(action.payload))
                state.vocabularySeenIDs.push(action.payload);
        },

        addVocabularyFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.vocabularyFavoritedIDs)
                state.vocabularyFavoritedIDs = []

            if (!state.vocabularyFavoritedIDs.includes(action.payload))
                state.vocabularyFavoritedIDs.push(action.payload);
        },

        removeVocabularyFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.vocabularyFavoritedIDs)
                state.vocabularyFavoritedIDs = []

            state.vocabularyFavoritedIDs = state.vocabularyFavoritedIDs.filter(i => i !== action.payload)
        },

        // meme

        addMemeSeenID(state, action: PayloadAction<number | string>) {
            if (!state.memeSeenIDs)
                state.memeSeenIDs = []

            if (!state.memeSeenIDs.includes(action.payload))
                state.memeSeenIDs.push(action.payload);
        },

        addMemeFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.memeFavoritedIDs)
                state.memeFavoritedIDs = []

            if (!state.memeFavoritedIDs.includes(action.payload))
                state.memeFavoritedIDs.push(action.payload);
        },

        removeMemeFavoritedID(state, action: PayloadAction<number | string>) {
            state.memeFavoritedIDs = state.memeFavoritedIDs.filter(i => i !== action.payload)
        },

        // info

        addInfoSeenID(state, action: PayloadAction<number | string>) {
            if (!state.infoSeenIDs)
                state.infoSeenIDs = []

            if (!state.infoSeenIDs.includes(action.payload))
                state.infoSeenIDs.push(action.payload);
        },

        addInfoFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.infoFavoritedIDs)
                state.infoFavoritedIDs = []

            if (!state.infoFavoritedIDs.includes(action.payload))
                state.infoFavoritedIDs.push(action.payload);
        },

        removeInfoFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.infoFavoritedIDs)
                state.infoFavoritedIDs = []

            state.infoFavoritedIDs = state.infoFavoritedIDs.filter(i => i !== action.payload)
        },

        // tune

        addTuneSeenID(state, action: PayloadAction<number | string>) {
            if (!state.tuneSeenIDs)
                state.tuneSeenIDs = []

            if (!state.tuneSeenIDs.includes(action.payload))
                state.tuneSeenIDs.push(action.payload);
        },

        addTuneFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.tuneFavoritedIDs)
                state.tuneFavoritedIDs = []

            if (!state.tuneFavoritedIDs.includes(action.payload))
                state.tuneFavoritedIDs.push(action.payload);
        },

        removeTuneFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.tuneFavoritedIDs)
                state.tuneFavoritedIDs = []

            state.tuneFavoritedIDs = state.tuneFavoritedIDs.filter(i => i !== action.payload)
        },

        // typo

        addTypoSeenID(state, action: PayloadAction<number | string>) {
            if (!state.typoSeenIDs)
                state.typoSeenIDs = []

            if (!state.typoSeenIDs.includes(action.payload))
                state.typoSeenIDs.push(action.payload);
        },

        addTypoFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.typoFavoritedIDs)
                state.typoFavoritedIDs = []

            if (!state.typoFavoritedIDs.includes(action.payload))
                state.typoFavoritedIDs.push(action.payload);
        },

        removeTypoFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.typoFavoritedIDs)
                state.typoFavoritedIDs = []

            state.typoFavoritedIDs = state.typoFavoritedIDs.filter(i => i !== action.payload)
        },

        // awesome

        addAwesomeSeenID(state, action: PayloadAction<number | string>) {
            if (!state.awesomeSeenIDs)
                state.awesomeSeenIDs = []

            if (!state.awesomeSeenIDs.includes(action.payload))
                state.awesomeSeenIDs.push(action.payload);
        },

        addAwesomeFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.awesomeFavoritedIDs)
                state.awesomeFavoritedIDs = []

            if (!state.awesomeFavoritedIDs.includes(action.payload))
                state.awesomeFavoritedIDs.push(action.payload);
        },

        removeAwesomeFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.awesomeFavoritedIDs)
                state.awesomeFavoritedIDs = []

            state.awesomeFavoritedIDs = state.awesomeFavoritedIDs.filter(i => i !== action.payload)
        },

        // sunset

        addSunsetSeenID(state, action: PayloadAction<number | string>) {
            if (!state.sunsetSeenIDs)
                state.sunsetSeenIDs = []

            if (!state.sunsetSeenIDs.includes(action.payload))
                state.sunsetSeenIDs.push(action.payload);
        },

        addSunsetFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.sunsetFavoritedIDs)
                state.sunsetFavoritedIDs = []

            if (!state.sunsetFavoritedIDs.includes(action.payload))
                state.sunsetFavoritedIDs.push(action.payload);
        },

        removeSunsetFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.sunsetFavoritedIDs)
                state.sunsetFavoritedIDs = []

            state.sunsetFavoritedIDs = state.sunsetFavoritedIDs.filter(i => i !== action.payload)
        },

        // quote

        addQuoteSeenID(state, action: PayloadAction<number | string>) {
            if (!state.quoteSeenIDs)
                state.quoteSeenIDs = []

            if (!state.quoteSeenIDs.includes(action.payload))
                state.quoteSeenIDs.push(action.payload);
        },

        addQuoteFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.quoteFavoritedIDs)
                state.quoteFavoritedIDs = []

            if (!state.quoteFavoritedIDs.includes(action.payload))
                state.quoteFavoritedIDs.push(action.payload);
        },

        removeQuoteFavoritedID(state, action: PayloadAction<number | string>) {
            state.quoteFavoritedIDs = state.quoteFavoritedIDs.filter(i => i !== action.payload)
        },

        // love

        addLoveSeenID(state, action: PayloadAction<number | string>) {
            if (!state.loveSeenIDs)
                state.loveSeenIDs = []

            if (!state.loveSeenIDs.includes(action.payload))
                state.loveSeenIDs.push(action.payload);
        },

        addLoveFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.loveFavoritedIDs)
                state.loveFavoritedIDs = []

            if (!state.loveFavoritedIDs.includes(action.payload))
                state.loveFavoritedIDs.push(action.payload);
        },

        removeLoveFavoritedID(state, action: PayloadAction<number | string>) {
            state.loveFavoritedIDs = state.loveFavoritedIDs.filter(i => i !== action.payload)
        },

        // nsfw

        addNSFWSeenID(state, action: PayloadAction<number | string>) {
            if (!state.nsfwSeenIDs)
                state.nsfwSeenIDs = []

            if (!state.nsfwSeenIDs.includes(action.payload))
                state.nsfwSeenIDs.push(action.payload);
        },

        addNSFWFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.nsfwFavoritedIDs)
                state.nsfwFavoritedIDs = []

            if (!state.nsfwFavoritedIDs.includes(action.payload))
                state.nsfwFavoritedIDs.push(action.payload);
        },

        removeNSFWFavoritedID(state, action: PayloadAction<number | string>) {
            state.nsfwFavoritedIDs = state.nsfwFavoritedIDs.filter(i => i !== action.payload)
        },

        // catdog

        addCatDogSeenID(state, action: PayloadAction<number | string>) {
            if (!state.catdogSeenIDs)
                state.catdogSeenIDs = []

            if (!state.catdogSeenIDs.includes(action.payload))
                state.catdogSeenIDs.push(action.payload);
        },

        addCatDogFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.catdogFavoritedIDs)
                state.catdogFavoritedIDs = []

            if (!state.catdogFavoritedIDs.includes(action.payload))
                state.catdogFavoritedIDs.push(action.payload);
        },

        removeCatDogFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.catdogFavoritedIDs)
                state.catdogFavoritedIDs = []

            state.catdogFavoritedIDs = state.catdogFavoritedIDs.filter(i => i !== action.payload)
        },

        // art

        addArtSeenID(state, action: PayloadAction<number | string>) {
            if (!state.artSeenIDs)
                state.artSeenIDs = []

            if (!state.artSeenIDs.includes(action.payload))
                state.artSeenIDs.push(action.payload);
        },

        addArtFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.artFavoritedIDs)
                state.artFavoritedIDs = []

            if (!state.artFavoritedIDs.includes(action.payload))
                state.artFavoritedIDs.push(action.payload);
        },

        removeArtFavoritedID(state, action: PayloadAction<number | string>) {
            state.artFavoritedIDs = state.artFavoritedIDs.filter(i => i !== action.payload)
        },

        // niceClip

        addNiceClipSeenID(state, action: PayloadAction<number | string>) {
            if (!state.niceClipSeenIDs)
                state.niceClipSeenIDs = []

            if (!state.niceClipSeenIDs.includes(action.payload))
                state.niceClipSeenIDs.push(action.payload);
        },

        addNiceClipFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.niceClipFavoritedIDs)
                state.niceClipFavoritedIDs = []

            if (!state.niceClipFavoritedIDs.includes(action.payload))
                state.niceClipFavoritedIDs.push(action.payload);
        },

        removeNiceClipFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.niceClipFavoritedIDs)
                return

            state.niceClipFavoritedIDs = state.niceClipFavoritedIDs.filter(i => i !== action.payload)
        },

        // cute

        addCuteSeenID(state, action: PayloadAction<number | string>) {
            if (!state.cuteSeenIDs)
                state.cuteSeenIDs = []

            if (!state.cuteSeenIDs.includes(action.payload))
                state.cuteSeenIDs.push(action.payload);
        },

        addCuteFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.cuteFavoritedIDs)
                state.cuteFavoritedIDs = []

            if (!state.cuteFavoritedIDs.includes(action.payload))
                state.cuteFavoritedIDs.push(action.payload);
        },

        removeCuteFavoritedID(state, action: PayloadAction<number | string>) {
            state.cuteFavoritedIDs = state.cuteFavoritedIDs.filter(i => i !== action.payload)
        },

        // sarcasm

        addSarcasmSeenID(state, action: PayloadAction<number | string>) {
            if (!state.sarcasmSeenIDs)
                state.sarcasmSeenIDs = []

            if (!state.sarcasmSeenIDs.includes(action.payload))
                state.sarcasmSeenIDs.push(action.payload);
        },

        addSarcasmFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.sarcasmFavoritedIDs)
                state.sarcasmFavoritedIDs = []

            if (!state.sarcasmFavoritedIDs.includes(action.payload))
                state.sarcasmFavoritedIDs.push(action.payload);
        },

        removeSarcasmFavoritedID(state, action: PayloadAction<number | string>) {
            state.sarcasmFavoritedIDs = state.sarcasmFavoritedIDs.filter(i => i !== action.payload)
        },

        // satisfying

        addSatisfyingSeenID(state, action: PayloadAction<number | string>) {
            if (!state.satisfyingSeenIDs)
                state.satisfyingSeenIDs = []

            if (!state.satisfyingSeenIDs.includes(action.payload))
                state.satisfyingSeenIDs.push(action.payload);
        },

        addSatisfyingFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.satisfyingFavoritedIDs)
                state.satisfyingFavoritedIDs = []

            if (!state.satisfyingFavoritedIDs.includes(action.payload))
                state.satisfyingFavoritedIDs.push(action.payload);
        },

        removeSatisfyingFavoritedID(state, action: PayloadAction<number | string>) {
            state.satisfyingFavoritedIDs = state.satisfyingFavoritedIDs.filter(i => i !== action.payload)
        },
    }
});

export const {
    clearAllUserData,
    toggleMinialDrawer,
    resetDev,

    enableAllScreen,
    toggleDisableScreen,

    checkInScreen,

    toggleSavedItem,

    addUploadedItem,

    togglePinFunSound,
    addFunSoundFavoritedID,
    removeFunSoundFavoritedID,

    setSubscribe,
    resetSubscribe,

    addDrawSeenID,
    addDrawFavoritedID,
    removeDrawFavoritedID,

    addMemeSeenID,
    addMemeFavoritedID,
    removeMemeFavoritedID,

    addQuoteSeenID,
    addQuoteFavoritedID,
    removeQuoteFavoritedID,

    addCatDogSeenID,
    addCatDogFavoritedID,
    removeCatDogFavoritedID,

    addLoveSeenID,
    addLoveFavoritedID,
    removeLoveFavoritedID,

    addNSFWSeenID,
    addNSFWFavoritedID,
    removeNSFWFavoritedID,

    addSatisfyingSeenID,
    addSatisfyingFavoritedID,
    removeSatisfyingFavoritedID,

    addCuteSeenID,
    addCuteFavoritedID,
    removeCuteFavoritedID,

    addInfoSeenID,
    addInfoFavoritedID,
    removeInfoFavoritedID,

    addTypoSeenID,
    addTypoFavoritedID,
    removeTypoFavoritedID,

    addSunsetSeenID,
    addSunsetFavoritedID,
    removeSunsetFavoritedID,

    addAwesomeSeenID,
    addAwesomeFavoritedID,
    removeAwesomeFavoritedID,

    addArtSeenID,
    addArtFavoritedID,
    removeArtFavoritedID,

    addSarcasmSeenID,
    addSarcasmFavoritedID,
    removeSarcasmFavoritedID,

    addAwardPictureFavoritedID,
    removeAwardPictureFavoritedID,

    addFunWebsiteFavoritedID,
    removeFunWebsiteFavoritedID,

    addTopMovieFavoritedID,
    removeTopMovieFavoritedID,

    addShortFilmsFavoritedID,
    removeShortFilmsFavoritedID,

    addTuneSeenID,
    addTuneFavoritedID,
    removeTuneFavoritedID,

    addVocabularySeenID,
    addVocabularyFavoritedID,
    removeVocabularyFavoritedID,

    addAwesomeNatureFavoritedID,
    addAwesomeNatureSeenID,
    removeAwesomeNatureFavoritedID,

    addNiceClipFavoritedID,
    addNiceClipSeenID,
    removeNiceClipFavoritedID,

    clearAllInboxes,
    clearInbox,
    setDidReadInbox,
    addInboxes,
    toggleLovedInbox,
    toggleMarkAsReadInbox,

    setBackgroundIdForText,
} = slice.actions;

export default slice.reducer