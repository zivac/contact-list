export class Contact {

    id: number
    firstName: string = ""
    lastName: string = ""
    profilePhoto: string
    email: string = ""
    favourite: boolean = false
    notes?: string = ""

    phones: Array<{
        name: string
        label: string
        number: string
    }> = []

    constructor(init?: any) {
        if(init) Object.assign(this, init);
    }

    getPhone(): string {
        return this.phones.length ? this.phones[0].number : "";
    }
}
