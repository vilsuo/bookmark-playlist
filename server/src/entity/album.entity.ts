import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'albums' })
export class Album {
  @PrimaryColumn()
  videoId: string; // video id from the link

  @Column()
  artist: string;

  @Column()
  title: string;

  @Column()
  published: number;

  @Column()
  category: string;
}
