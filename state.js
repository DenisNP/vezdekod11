let state = null;

export const getState = (forceClear) => {
    const s = state;
    if (!s || forceClear) {
        const newState = {
            isRegular: false,
            image: '',
            name: '',
            amount: NaN,
            target: '',
            desc: '',
            receiver: 0,
            author: 0,
            endAmount: false,
            endDate: false,
            date: "2021-01-01",
            donated: 0,
            wallText: "",
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

export const authors = [
    "Василий Иванов",
    "Иван Петров",
    "Пётр Васечкин"
];

export const receivers = [
    "Счёт VK Pay • 1234",
    "Наличкой по почте",
    "Борзыми щенками"
];
