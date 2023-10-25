import { Brand } from "src/brands/entities/brand.entity";
import { Category } from "src/categories/entities/category.entity";
import { Provider } from "src/providers/entities/provider.entity";
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne, UpdateDateColumn, CreateDateColumn } from "typeorm";

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
    status: boolean;

    @ManyToOne(
        () => Category,
        ( category ) => category.products,
        { onDelete: 'CASCADE' } 
    )
    category: Category

    @ManyToOne(
        () => Brand,
        ( brand ) => brand.products,
        { onDelete: 'CASCADE' } 
    )
    brand: Brand

    @ManyToOne(
        () => Provider,
        ( provider ) => provider.products,
        { onDelete: 'CASCADE' } 
    )
    provider: Provider
    
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;

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
