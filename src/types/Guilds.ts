export interface Guild {
  id: number;
  name: string;
  icon: string;
}

export interface Channel {
  id: number;
  name: string;
  guild: Guild;
}
