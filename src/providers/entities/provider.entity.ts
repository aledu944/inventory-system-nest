import { Product } from "src/products/entities/product.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Provider {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { unique: true, nullable: false })
    name: string;

    @Column('varchar', { nullable: true })
    direction: string;

    @Column('varchar', { unique: true, nullable: true })
    email: string;

    @Column('varchar', { unique: true, nullable: true })
    phone: string;

    @OneToMany(
        () => Product,
        product => product.provider,
        { cascade: true }
    )
    products: Product[];

    @Column('boolean', { default: true })
    status: boolean;
    
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;

}
