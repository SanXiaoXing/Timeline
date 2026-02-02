export * from './types';

import type { Project } from './types';
import { project as timeline } from './timeline';
import { project as pixelQuest } from './pixel-quest';

export const projects: Project[] = [timeline, pixelQuest];

export const getProjectBySlug = (slug: string) => projects.find(p => p.slug === slug) ?? null;

