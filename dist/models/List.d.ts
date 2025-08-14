export interface IList {
    id: string;
    name: string;
    code: string;
    userId: any;
    description: string;
    price: number;
    images: string[];
    numBedroom: number;
    numBathroom: number;
    garage?: number;
    area?: string;
    yearBuilt?: number;
    category: string;
    propertyType: string;
    propertyStatus: string;
    inventoryStatus: string;
    rating: number;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        mapUrl: string;
    };
    contact: {
        name: string;
        email: string;
        phone: string;
        others: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
declare const List: any;
export default List;
//# sourceMappingURL=List.d.ts.map