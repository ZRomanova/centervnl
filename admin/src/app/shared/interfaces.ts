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
    _id?: string,
    name: string,
    description?: string,
    created?: Date,
    spetial?: boolean
}

export interface Partner {
    _id?: string,
    name: string,
    url?: string,
    image?: string,
    visible?: boolean
}

export interface Staff {
    _id?: string,
    name: string,
    description?: string,
    photo?: string
}

export interface PriceList {
    name?: string,
    description?: string,
    price: number,
}

export interface Period {
    start: Date,
    end?: Date,
    visible: boolean,
    day?: 'ПН' | 'ВТ' | 'СР' | 'ЧТ' | 'ПТ' | 'СБ' | 'ВС' | '',
    time?: number
}

export interface Project {
    _id?: string,
    name: string
    path: string,
    description: string,
    created?: Date,
    author?: any,
    likes?: User[],
    period: {
        start: Date,
        end?: Date
    },
    visible: boolean,
    image: string,
    gallery: string[],
    dateStr: string,
    tags?: string[],
    partners?: string[],
}

export interface Service {
    _id?: string,
    name: string,
    peopleLimit: number,
    path: string,
    author?: any,
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
    tags?: string[],
    dateStr: string,
    gallery: string[],
    projects?: string[],
    partners?: string[],
}

export interface Post {
    _id?: string,
    name: string
    path: string,
    author?: any,
    description: string,
    created?: Date,
    likes?: any[],
    date?: Date,
    visible: boolean,
    image: string,
    gallery: string[],
    dateStr: string,
    tags?: string[],
    services?: string[],
    projects?: string[],
    partners?: string[],
}

export interface ProductVariant {
    name: string,
    variants: PriceList[]
}

export interface Shop {
    _id?: string
    name: string
    path?: string
}

export interface Product {
    _id?: string,
    name: string,
    path: string,
    author?: any,
    gallery: string[],
    description?: string,
    price: number,
    options: ProductVariant[],
    group: string,
    created?: Date,
    likes?: User[],
    visible: boolean,
    image: string,
    shop: Shop | string

    dateStr: string,

}

