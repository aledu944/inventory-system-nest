import { IsEnum, IsNumber, IsUUID } from "class-validator";

export enum OrderType {
    DELIVERY= "delivery",
    RETIRO= "retiro",
}

export class CreateOrderDto {

    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El total no es correcto' })
    total: number;

    @IsUUID( 'all' , { message: "Debe agregar un vendedor" })
    userId: string;

    @IsUUID( 'all' , { message: "Debe agregar un cliente" })
    clientId: string;

    @IsEnum(OrderType, { message: 'Typo invalido' })
    type: string;
}