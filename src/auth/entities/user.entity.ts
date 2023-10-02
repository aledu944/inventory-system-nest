import { Role } from 'src/roles/entities/role.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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
    
    @Column('text', { nullable: true })
    avatar: string;
    
    @ManyToOne(
        () => Role,
        ( role ) => role.users,
        { onDelete: 'CASCADE' } 
    )
    role: Role
    
    @Column('enum', {enum: ['male', 'female']})
    gender: string;
    
    @Column('text')
    password: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;



}
