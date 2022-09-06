import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export default class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 25
    })
    username: string;

    @Column({
        type: 'varchar',
        length: 25
    })
    firstName: string;

    @Column({
        type: 'varchar',
        length: 25
    })
    lastName: string;

    @Column({
        type: 'varchar',
        length: 64
    })
    password: string;

    @Column({
        type: 'varchar',
        length: 255
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 255
    })
    phone: string;
    
    @Column({
        type: 'varchar',
        length: 36
    })
    avatarUUID: string;

    @CreateDateColumn({
        type: 'datetime',
        default: () => "CURRENT_TIMESTAMP"
    })
    createdAt: Date;
}