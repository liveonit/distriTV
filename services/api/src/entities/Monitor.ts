import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
  OneToOne
} from 'typeorm';
import { Television } from './Television';


@Entity()
export class Monitor extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;
 
  @Column() 
  allProcessesAreRunning?: boolean;
  
  @Column() 
  appIsVisible?: boolean;

  @Column() 
  availableMem?: number;

  @Column() 
  availableStorage?: number;

  @Column() 
  availableStorageUnit?: String;

  @Column() 
  currentDate?: Date;

  @Column() 
  currentVersionApp?: number;
  @Column() 
  currentlyPlayingContentId?: number;
  @Column() 
  externalStoragePermissionGranted?: boolean;
  @Column() 
  isAnyAlertPlaying?: boolean;
  @Column() 
  isAnyContentPlaying?: boolean;
  @Column() 
  isExternalStorageConnected?: boolean;
  @Column() 
  memUnit?: string;
  @Column() 
  sdkVersion?: number;
  @Column() 
  totalMem?: number;
  @Column() 
  totalStorage?: number;
  @Column() 
  totalStorageUnit?: String;
  @Column() 
  tvCode?: String;
  @Column() 
  useExternalStorage?: boolean;

  @OneToOne(() => Television, (tv) => tv.alert)
  television?: Television
}

