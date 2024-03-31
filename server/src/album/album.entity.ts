import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'albums' })
export class Album {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  videoId!: string;

  @Column()
  artist!: string;

  @Column()
  title!: string;

  @Column()
  published!: number;

  @Column()
  category!: string;

  @Column()
  addDate!: Date;
}
