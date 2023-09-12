import { Product } from "src/products/entities/product.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
    
    @Column('text')
    image: string;

    @OneToMany(
        () => Product,
        product => product.category,
        { cascade: true }
    )
    products: Product[];

    
    @BeforeInsert()
    checkSlugInsert(){
        if( !this.slug ){
            this.slug = this.name;
        } 
        
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '-')
            .replaceAll("'", '')  
      
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '-')
            .replaceAll("'", '')  
    }
}
