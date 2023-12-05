import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "src/products/entities/product.entity";

@Entity()
export class OrderDetails {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => Order,
        ( order ) => order.orderDetails,
        { onDelete: 'CASCADE' } 
    )
    order: Order;

    @ManyToOne(
        () => Product,
        ( product ) => product.orderDetails,
        { onDelete: 'CASCADE' } 
    )
    product: Product; 

    @Column('int')
    quantity: number;   
    
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;
}