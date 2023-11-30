import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderDetails } from "./order-details.entity";


@Entity()
export class Order {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('float', { nullable: false })
    total: number;

    @Column({ type: 'enum', enum: ['delivery', 'retiro'] })
    type: string;


    @ManyToOne(
        () => User,
        ( user ) => user.sales,
        { onDelete: 'CASCADE' } 
    )
    user: User;

    @ManyToOne(
        () => User,
        ( user ) => user.shopping,
        { onDelete: 'CASCADE' } 
    )
    client: User;

    @OneToMany(
        () => OrderDetails,
        orderDetails => orderDetails.order,
        { cascade: true }
    )
    orderDetails: OrderDetails[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;
}
