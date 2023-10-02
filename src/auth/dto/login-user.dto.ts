import { IsEmail, IsInt, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Role } from "src/roles/entities/role.entity";

export class LoginUserDto {
    
    @IsString({ message: 'El correo debe ser texto' })
    @IsEmail({}, { message: 'El correo no es valido' })
    email: string;
    
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe contender mayusculas, minusculas y un numero'
    })
    password: string;
}