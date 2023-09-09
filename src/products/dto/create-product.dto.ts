import { IsString, IsNumber, IsBoolean, IsOptional, IsPositive, IsInt } from "class-validator";

export class CreateProductDto {
    @IsString({ message: "El nombre es obligatorio" })
    name: string;
    
    @IsString()
    @IsOptional()
    slug?: string;
    
    @IsString({ message: "La descripcion es obligatoria"})
    description: string;

    @IsString({ message: "Debe agregar una imagen"})
    image: string;
    
    @IsInt({ message: "Inserte un Stock valido" })
    @IsOptional()
    @IsPositive({ message: "El Stock debe ser 0 o mayor" })
    stock?: number
    
    @IsNumber({}, { message: "Precio no valido" })
    @IsPositive({ message: "Precio no valido" })
    price: number;
    
    // category_id: number;
    
    @IsBoolean()
    @IsOptional()
    deleted?: boolean;

}
