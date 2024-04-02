import { IsDate, IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsVideoId } from './album.decorators';

@Entity({ name: 'albums' })
export class Album {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsVideoId()
  videoId!: string;

  @Column()
  // value is not empty (!== '', !== null, !== undefined)
  @IsNotEmpty({ message: 'artist is missing' })
  artist!: string;

  @Column()
  @IsNotEmpty({ message: 'title is missing' })
  title!: string;

  @Column()
  @IsInt()
  @Min(1000, { message: 'number is too small' })
  @Max(9999, { message: 'number is too large' })
  published!: number;

  @Column()
  @IsNotEmpty({ message: 'category is missing' })
  category!: string;

  @Column()
  @IsDate()
  addDate!: Date;
}
