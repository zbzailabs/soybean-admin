import { sampleDataScreenScene } from '@sa/visualization';
import { createServerFn } from '@tanstack/react-start';

export const getDataScreenSceneServer = createServerFn({ method: 'GET' }).handler(() => sampleDataScreenScene);
