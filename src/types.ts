interface IPerson {
    id: number;
    name: string;
    phone: string;
    children?: IPerson[];
}

export type {
    IPerson
}