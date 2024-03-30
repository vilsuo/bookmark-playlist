import { Column, Entity, PrimaryColumn, Repository } from 'typeorm';

@Entity({ name: 'albums' })
export class Album {
  @PrimaryColumn()
  id!: number;

  @Column()
  videoId!: string; // video id from the link

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

export type AlbumRepository = Repository<Album>;
