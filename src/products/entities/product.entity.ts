import { Category } from "src/categories/entities/category.entity";
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { unique: true })
    name: string;
    
    @Column('varchar', { unique: true })
    slug: string;
    
    @Column('varchar', { default: '/' })
    image: string;
    
    @Column('text')
    description: string;
    
    @Column('numeric', { default: 0 })
    stock: number
    
    @Column('float', { default: 0 })
    price: number;
        
    @Column('boolean', { default: false })
    deleted: boolean;

    @ManyToOne(
        () => Category,
        ( category ) => category.products
    )
    category: Category
    


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
