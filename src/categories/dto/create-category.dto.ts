import { IsString, IsOptional } from "class-validator";

export class CreateCategoryDto {
    
    @IsString({ message: "El nombre es obligatorio" })
    name: string;

    @IsString()
    @IsOptional()
    slug?: string;
    
    @IsString({ message: "La descripcion el obligatoria" })
    description: string;
    
    @IsString({ message: "Debe agregar una imagen"})
    image: string;

}
