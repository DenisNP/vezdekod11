let state = null;

export const getState = (forceClear) => {
    const s = state;
    if (!s || forceClear) {
        const newState = {
            image: '',
            name: '',
            desc: '',
            podcastFile: '',
            isExplicit: false,
            isExcludedFromExport: false,
            isTrailer: false,
            availableTo: 0,
        };

        state = newState;
        return newState;
    } else {
        return s;
    }
};

export const setState = (obj) => {
    const s = getState();
    const newState = {...s, ...obj};
    state = newState;
    return newState;
};

export const targets = [
    "Всем пользователям",
    "Друзьям и подписчикам",
    "Только друзьям"
];
