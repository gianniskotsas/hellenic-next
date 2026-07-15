import * as migration_20251121_124509 from './20251121_124509';
import * as migration_20260304_165859 from './20260304_165859';
import * as migration_20260715_000000_blog_posts_relatedposts_rel from './20260715_000000_blog_posts_relatedposts_rel';

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
  {
    up: migration_20260715_000000_blog_posts_relatedposts_rel.up,
    down: migration_20260715_000000_blog_posts_relatedposts_rel.down,
    name: '20260715_000000_blog_posts_relatedposts_rel'
  },
];
