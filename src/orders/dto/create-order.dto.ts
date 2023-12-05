import { IsArray, IsEnum, IsNumber, IsObject, IsOptional, IsUUID } from "class-validator";

export enum OrderType {
    DELIVERY= "delivery",
    RETIRO= "retiro",
}

export class CreateOrderDto {

    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El total no es correcto' })
    total: number;

    @IsUUID( 'all' , { message: "Debe agregar un vendedor" })
    @IsOptional()
    userId?: string;

    @IsUUID( 'all' , { message: "Debe agregar un cliente" })
    clientId: string;

    // @IsObject({message: "Debe agregar productos"})
    @IsArray({message: "Debe agregar productos"})
    items: { productId: string, quantity: number }[];

    @IsEnum(OrderType, { message: 'Typo invalido' })
    type: string;
}