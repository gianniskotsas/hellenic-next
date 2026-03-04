import * as migration_20251121_124509 from './20251121_124509';
import * as migration_20260304_165859 from './20260304_165859';

export const migrations = [
  {
    up: migration_20251121_124509.up,
    down: migration_20251121_124509.down,
    name: '20251121_124509',
  },
  {
    up: migration_20260304_165859.up,
    down: migration_20260304_165859.down,
    name: '20260304_165859'
  },
];
