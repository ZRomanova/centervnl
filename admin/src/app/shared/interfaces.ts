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
    info?: string,
    team?: string
    dateStr?: string
}

export interface Tag {
    _id?: string,
    name: string,
    description?: string,
    created?: Date,
    spetial?: boolean
}

export interface Partner {
    _id?: string
    name: string
    url?: string
    image?: string
    visible?: boolean
}

export interface Doc {
    _id?: string
    name: string
    description?: string
    file?: string
    visible?: boolean
}

export interface Staff {
    _id?: string
    name: string
    surname: string
    description?: string
    image?: string
    visible: boolean
    position?: string
    dateStr?: string
    degree: string
    education: string
    path: string
}

export interface PriceList {
    _id?: string
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
    is_grant: boolean
    description: string,
    created?: Date,
    author?: any,
    // likes?: User[],
    period: {
        start?: Date,
        end?: Date
    },
    visible: boolean,
    image: string,
    gallery: string[],
    dateStr: string,
    programs: [{
        program: string
        description: string
        form: boolean
    }]
    // tags?: string[],
    // partners?: string[],
}

export interface Phrase {
    image: string
    description: string
    name: string
}

export interface Program {
    _id?: string,
    name: string
    subtitle: string
    path: string,
    text_1: string,
    text_2: string,
    text_3: string,
    text_4: string[],
    text_5: string,
    text_6: string,
    text_button: string,
    url_button: string,
    video: string
    description: string
    visible: boolean
    image: string
    icon: string
    gallery: string[]
    phrases: Phrase[]
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
    _id?: string
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

export interface Payment {
    price: number,
    delivery?: number,
    total?: number,
    discount?: {
        type: string,
        value: string
    },
    status: 'оплачен' | 'не оплачен' | 'оплачен частично'
    method: 'на месте' | 'онлайн'
    description?: string
    paid?: number
}

export interface Bin {
    name: string,
    price: number,
    count: number,
    description?: string
}

export interface Order {
    user: User,
    status: 'в корзине' | 'в работе' | 'выполнен' | 'доставлен' | 'отменен'
    statusColor:  'primary' | 'danger' | 'warning'| 'success' | 'secondary' | string
    comment: string //комментарий клиента
    address: string //адрес доставки
    products: Bin[]
    payment: Payment
    created: Date
    send?: Date
    number?: number
    description?: string
    dateStr?: string
    image?: string
    name?: string
}

export interface Checkout {
    user: User | any,
    status: 'заявка' | 'отмена' | 'участник' | 'неявка' | 'ведущий'
    statusColor: 'warning' | 'secondary' | 'success' | 'danger' | 'primary' | string
    info: string //комментарий клиента
    payment: Payment
    service: Service | any
    created: Date
    date?: Date
    description?: string
    dateStr?: string
    image?: string
    name?: string
}

export interface Report {
    year: number
    annual: string
    justice: string
    finance: string
    visible: boolean
    description?: string
    created?: Date
    _id?: string
}


export interface LibItem {
    _id?: string
    name: string
    path: string
    author?: any
    description: string
    created?: Date
    date?: Date
    visible: boolean
    image: string
    dateStr: string
    content: [{
        type: 'ТЕКСТ' | 'ПРЕЗЕНИТАЦИЯ' | 'ВИДЕО'
        url: string
        text: string
    }]
}