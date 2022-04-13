export interface User {
    _id?: string,
    name: string,
    surname: string,
    email: string,
    password?: string,
    isAdmin?: boolean,
    photo?: string,
    patronymic?: string,
    sex: '1' | '2',
    emo: string,
    created?: Date,
    info?: string
}

export interface Tag {
    name: string,
    description?: string,
    created?: Date,
    spetial?: boolean
}

export interface PriceList {
    name?: string,
    description?: string,
    price: number,
}

export interface Period {
    start: Date,
    end?: Date,
    week: {
        monday: number[],
        tuesday: number[],
        wednesday: number[],
        thursday: number[],
        friday: number[],
        saturday: number[],
        sunday: number[]
    }
}

export interface Project {
    _id?: string,
    title: string
    path: string,
    description: string,
    created?: Date,
    likes?: User[],
    period: {
        start: Date,
        end?: Date
    },
    visible: boolean,
    image: string,
    gallery: string[]
}

export interface Service {
    _id?: string,
    title: string
    path: string,
    author?: string,
    description: string,
    address: string,
    priceList: PriceList[],
    created?: Date,
    likes?: User[],
    date: {
        single: Date[],
        period: Period[]
    },
    visible: boolean,
    image: string,
    tags?: Tag[],
    gallery: string[]
}

export interface Post {
    _id?: string,
    title: string
    path: string,
    author?: string,
    text: string,
    created?: Date,
    likes?: User[],
    date?: Date,
    visible: boolean,
    image: string,
    gallery: string[],
    tags?: Tag[],
    services?: Service[],
    projects?: Project[]
}

