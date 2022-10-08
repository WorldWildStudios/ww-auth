import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export default class Connections {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'int'
    })
    userId: number;

    @Column({
        type: 'int'
    })
    applicationId: number;

    @Column({
        type: 'int'
    })
    scope: number;

    @Column({
        type: 'varchar',
        length: 45
    })
    ip: string;

    @CreateDateColumn({
        type: 'datetime',
        default: () => "CURRENT_TIMESTAMP"
    })
    createdAt: Date;

    @CreateDateColumn({
        type: 'datetime'
    })
    expiresAt: Date;
}