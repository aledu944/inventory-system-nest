import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


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

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;
}
