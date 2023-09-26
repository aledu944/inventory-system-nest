import { IsString, IsOptional } from 'class-validator';
export class CreateBrandDto {
    @IsString({ message: "El nombre es obligatorio" })
    name: string;

    @IsString()
    @IsOptional()
    slug?: string;
}
