import { IsString, IsNumber, IsBoolean, IsOptional, IsPositive, IsInt, IsUUID,  } from "class-validator";

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
    
    @IsUUID( 'all' , { message: "Debe agregar una categoria" })
    categoryId: string;
    
    @IsBoolean()
    @IsOptional()
    status?: boolean;

    @IsUUID( 'all' , { message: "Debe agregar una marca" })
    brandId: string;
    
    @IsUUID( 'all' , { message: "Debe agregar un proveedor" })
    providerId: string;
    

}
