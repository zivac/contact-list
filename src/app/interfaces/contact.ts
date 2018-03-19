export interface Contact {

    id: number,
    firstName: string
    lastName: string
    profilePhoto: string
    email: string
    favourite: boolean

    phones: Array<{
        name: string
        label: string
        number: string
    }>

}
