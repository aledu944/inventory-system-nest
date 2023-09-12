import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('varchar', { unique: true })
    name: string;
    
    @Column('varchar', { unique: true })
    slug: string;
    
    @Column('text')
    description: string;
    
    @Column('text', { unique: true })
    image: string;

    @OneToMany(
        () => Product,
        product => product.category,
        { cascade: true }
    )
    products: Product;

}
