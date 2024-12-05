export interface Guild {
  id: number;
}

export interface Channel {
  id: number;
  guild: Guild;
}
