import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    productName: string

    @Column()
    productDescription: string

    @Column('decimal')
    productPrice: number

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    productCreatedAt: Date

    @UpdateDateColumn({type:'timestamp', default:() => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    productUpdatedAt: Date;
}
