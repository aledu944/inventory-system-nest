import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateProviderDto {
    @IsString({ message: 'El nombre es obligatorio' })
    name: string;

    @IsString({ message: 'la direccion es obligatoria'})
    direction: string;

    @IsEmail({},{ message: 'El correo no es valido'})
    @IsOptional()
    email?: string;

    @IsString()
    @MinLength(8, { message:'El telefono es muy corto'})
    @MaxLength(20, { message:'El telefono es muy largo'})
    @IsOptional()
    phone?: string;

    @IsBoolean({ message: 'Ingrese un estado valido' })
    @IsOptional()
    status?: boolean;
    
}
