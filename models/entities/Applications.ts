import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export default class Applications {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 25
    })
    name: number;

    @Column({
        type: 'int'
    })
    userId: number;

    @Column({
        type: 'varchar',
        length: 255
    })
    redirect: string;

    @Column({
        type: 'varchar',
        length: 255
    })
    postReceive: string;

    @CreateDateColumn({
        type: 'datetime',
        default: () => "CURRENT_TIMESTAMP"
    })
    createdAt: Date;
}