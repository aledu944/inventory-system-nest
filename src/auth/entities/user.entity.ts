import { Order } from 'src/orders/entities/order.entity';
import { Role } from 'src/roles/entities/role.entity';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { nullable: false })
    name: string;
    
    @Column('varchar', { nullable: false })
    lastname: string;
    
    @Column('varchar', { nullable: false, unique: true })
    email: string;
    
    @Column('text', { nullable: true, default: null })
    avatar: string;
    
    @ManyToOne(
        () => Role,
        ( role ) => role.users,
        { onDelete: 'CASCADE' },
    )
    role: Role
    
    @Column('enum', {enum: ['male', 'female'], default: 'male'})
    gender: string;
    
    @Column('text')
    password: string;

    @OneToMany(
        () => Order,
        order => order.user,
        { cascade: true }
    )
    sales: Order[];

    @OneToMany(
        () => Order,
        order => order.client,
        { cascade: true }
    )
    shopping: Order[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;


    @BeforeInsert()
    checkFieldsInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsUpdate(){
        this.checkFieldsInsert()
    }
}
